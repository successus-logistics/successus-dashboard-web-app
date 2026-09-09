"use client";

import * as React from "react";
import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  StickyNote,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Visibility = "private" | "shared" | "public";
type Task = {
  id: string;
  title: string;
  content: string;
  owner: number | string;
  visibility: Visibility;
  shared_with?: Array<number | string>;
  status: string;
  priority: string;
  due_date: string | null;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
};
type Comment = {
  id: string;
  author: number | string;
  content: string;
  parent_comment: string | null;
  created_at: string;
};
type Filter = "all" | "mine" | "shared" | "public";
type FlattenedComment = { item: Comment; depth: number; parentAuthor?: number | string; rootId: string };
const testUsers = [
  { id: "1", name: "Joe" },
  { id: "2", name: "Jack" },
  { id: "3", name: "John" },
];

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "To do",
  in_progress: "In progress",
  completed: "Completed",
  canceled: "Canceled",
};

function formatDateTime(value: string) {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function isoToDateInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}
function dateInputToIso(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T23:59:59`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
function userName(id: number | string) {
  return testUsers.find((user) => user.id === String(id))?.name ?? `User ${id}`;
}
function ddlLabel(task: Task, now: number) {
  if (!task.due_date) return "No deadline";
  const remaining = new Date(task.due_date).getTime() - now;
  if (remaining <= 0) return "Overdue";
  const days = Math.ceil(remaining / 86_400_000);
  return `${days} day${days === 1 ? "" : "s"}`;
}

export default function TodoNotesPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [selected, setSelected] = React.useState<Task | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [comment, setComment] = React.useState("");
  const [replyTo, setReplyTo] = React.useState<Comment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newContent, setNewContent] = React.useState("");
  const [newVisibility, setNewVisibility] = React.useState<Visibility>("private");
  const [newStatus, setNewStatus] = React.useState("backlog");
  const [newPriority, setNewPriority] = React.useState("medium");
  const [newDueDate, setNewDueDate] = React.useState("");
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState("");
  const [editContent, setEditContent] = React.useState("");
  const [editVisibility, setEditVisibility] = React.useState<Visibility>("private");
  const [editStatus, setEditStatus] = React.useState("backlog");
  const [editPriority, setEditPriority] = React.useState("medium");
  const [editDueDate, setEditDueDate] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [userSearch, setUserSearch] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [collapsedThreads, setCollapsedThreads] = React.useState<Set<string>>(new Set());
  const [selectedTaskIds, setSelectedTaskIds] = React.useState<Set<string>>(new Set());
  const [now, setNow] = React.useState(() => Date.now());

  const loadTasks = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/todo-notes/tasks", { cache: "no-store" });
      if (!response.ok)
        throw new Error(response.status === 401 ? "Sign in to view your To-Do items." : "Could not load To-Do items.");
      const body = (await response.json()) as Task[] | { results: Task[] };
      setTasks(Array.isArray(body) ? body : body.results);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load To-Do items.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadComments = React.useCallback(async (taskId: string, signal?: AbortSignal) => {
    const response = await fetch(`/api/todo-notes/tasks/${taskId}/comments`, { signal, cache: "no-store" });
    if (!response.ok) return;
    return (await response.json()) as Comment[];
  }, []);

  React.useEffect(() => {
    void loadTasks();
  }, [loadTasks]);
  React.useEffect(() => {
    void fetch("/api/auth/session")
      .then((response) => response.json())
      .then((body: { userId: string | null }) => setCurrentUserId(body.userId));
  }, []);
  React.useEffect(() => {
    setComments([]);
    setReplyTo(null);
    setCollapsedThreads(new Set());
    if (!selected) return;
    const controller = new AbortController();
    void loadComments(selected.id, controller.signal)
      .then((items) => items && setComments(items))
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
      });
    return () => controller.abort();
  }, [loadComments, selected]);

  const visibleTasks = tasks.filter(
    (task) =>
      (filter === "all" ||
        (filter === "mine" && String(task.owner) === currentUserId) ||
        (filter === "shared" && String(task.owner) !== currentUserId && task.visibility === "shared") ||
        (filter === "public" && task.visibility === "public")) &&
      `${task.title} ${task.content}`.toLowerCase().includes(query.toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(visibleTasks.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const paginatedTasks = visibleTasks.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  React.useEffect(() => {
    setPageIndex(0);
    setSelectedTaskIds(new Set());
  }, [query, filter, pageSize]);
  const overdue = tasks.filter((task) => task.is_overdue).length;
  const upcoming = tasks.filter((task) => task.due_date && !task.is_overdue && task.status !== "completed").length;

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const response = await fetch("/api/todo-notes/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        content: newContent.trim(),
        visibility: newVisibility,
        shared_with: newVisibility === "shared" ? selectedUsers : [],
        status: newStatus,
        priority: newPriority,
        due_date: dateInputToIso(newDueDate),
      }),
    });
    if (response.ok) {
      setNewTitle("");
      setNewContent("");
      setCreating(false);
      await loadTasks();
    }
  }
  async function addComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !comment.trim()) return;
    const response = await fetch(`/api/todo-notes/tasks/${selected.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment.trim(), ...(replyTo ? { parent_comment: replyTo.id } : {}) }),
    });
    if (response.ok) {
      const created = (await response.json()) as Comment;
      setComments((current) => [...current, created]);
      setComment("");
      setReplyTo(null);
    }
  }

  function beginEdit(task = selected) {
    if (!task) return;
    setSelected(task);
    setEditTitle(task.title);
    setEditContent(task.content);
    setEditVisibility(task.visibility);
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditDueDate(isoToDateInput(task.due_date));
    setSelectedUsers((task.shared_with ?? []).map(String));
    setEditing(true);
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    const response = await fetch(`/api/todo-notes/tasks/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle.trim(),
        content: editContent.trim(),
        visibility: editVisibility,
        shared_with: editVisibility === "shared" ? selectedUsers : [],
        status: editStatus,
        priority: editPriority,
        due_date: dateInputToIso(editDueDate),
      }),
    });
    if (response.ok) {
      const updated = (await response.json()) as Task;
      setTasks((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setSelected(updated);
      setEditing(false);
    }
    setSaving(false);
  }

  async function deleteSelected() {
    if (!selected || !window.confirm(`Delete "${selected.title}"? This also removes its comments.`)) return;
    const response = await fetch(`/api/todo-notes/tasks/${selected.id}`, { method: "DELETE" });
    if (response.ok) {
      setTasks((items) => items.filter((item) => item.id !== selected.id));
      setSelected(null);
      setEditing(false);
    }
  }

  async function deleteSelectedTasks() {
    const ids = [...selectedTaskIds];
    if (filter !== "mine" || ids.length === 0) return;
    if (!window.confirm(`Delete ${ids.length} selected task${ids.length === 1 ? "" : "s"}? This also removes their comments.`)) {
      return;
    }
    const results = await Promise.all(ids.map((id) => fetch(`/api/todo-notes/tasks/${id}`, { method: "DELETE" })));
    const deletedIds = new Set(ids.filter((_, index) => results[index].ok));
    if (deletedIds.size) {
      setTasks((items) => items.filter((item) => !deletedIds.has(item.id)));
      setSelectedTaskIds((current) => new Set([...current].filter((id) => !deletedIds.has(id))));
    }
  }

  async function deleteComment(commentToDelete: Comment) {
    if (!selected || !window.confirm("Delete this comment and all of its replies?")) return;
    const response = await fetch(`/api/todo-notes/tasks/${selected.id}/comments/${commentToDelete.id}`, {
      method: "DELETE",
    });
    if (!response.ok) return;
    const deletedIds = new Set<string>([commentToDelete.id]);
    let foundChild = true;
    while (foundChild) {
      foundChild = false;
      for (const item of comments) {
        if (item.parent_comment && deletedIds.has(item.parent_comment) && !deletedIds.has(item.id)) {
          deletedIds.add(item.id);
          foundChild = true;
        }
      }
    }
    setComments((items) => items.filter((item) => !deletedIds.has(item.id)));
    if (replyTo && deletedIds.has(replyTo.id)) setReplyTo(null);
  }

  function flattenCommentThread(
    items: Comment[],
    parentId: string | null = null,
    depth = 0,
    parentAuthor?: number | string,
    rootId?: string,
  ): FlattenedComment[] {
    return items
      .filter((item) => item.parent_comment === parentId)
      .sort((first, second) => new Date(first.created_at).getTime() - new Date(second.created_at).getTime())
      .flatMap((item) => {
        const currentRootId = rootId ?? item.id;
        return [
          { item, depth, parentAuthor, rootId: currentRootId },
          ...flattenCommentThread(items, item.id, depth + 1, item.author, currentRootId),
        ];
      });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">File Manager / Workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight">To-Do & Notes</h1>
          <p className="text-muted-foreground">Keep work visible, focused, and easy to follow up.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Refresh To-Do items"
            title="Refresh To-Do items"
            onClick={() => {
              setNow(Date.now());
              void loadTasks();
              if (selected) void loadComments(selected.id).then((items) => items && setComments(items));
            }}
          >
            <RefreshCw />
          </Button>
          <Button
            onClick={() => {
              setSelected(null);
              setEditing(false);
              setNewTitle("");
              setNewContent("");
              setNewVisibility("private");
              setNewStatus("backlog");
              setNewPriority("medium");
              setNewDueDate("");
              setSelectedUsers([]);
              setUserSearch("");
              setCreating(true);
            }}
          >
            <Plus data-icon="inline-start" />
            New task
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <StickyNote className="text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Visible items</p>
              <p className="text-2xl font-semibold">{tasks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CalendarClock className="text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Upcoming deadlines</p>
              <p className="text-2xl font-semibold">{upcoming}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CircleAlert className={overdue ? "text-destructive" : "text-muted-foreground"} />
            <div>
              <p className="text-muted-foreground text-xs">Needs attention</p>
              <p className="text-2xl font-semibold">{overdue}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-md md:flex-1">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks and notes"
                aria-label="Search tasks and notes"
              />
            </div>
            <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
              <SelectTrigger className="w-full md:w-52">
                <SelectValue placeholder="Filter by visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All visible items</SelectItem>
                  <SelectItem value="mine">My items</SelectItem>
                  <SelectItem value="shared">Shared with me</SelectItem>
                  <SelectItem value="public">Public items</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {filter === "mine" ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="md:ml-auto"
                disabled={selectedTaskIds.size === 0}
                onClick={() => void deleteSelectedTasks()}
              >
                <Trash2 data-icon="inline-start" />
                Delete selected{selectedTaskIds.size ? ` (${selectedTaskIds.size})` : ""}
              </Button>
            ) : null}
          </div>
          {error ? (
            <div className="flex items-center justify-between gap-4 p-8 text-sm">
              <span className="text-destructive">{error}</span>
              <Button variant="outline" size="sm" onClick={() => void loadTasks()}>
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading your workspace…</div>
          ) : (
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    {filter === "mine" ? (
                      <Checkbox
                        checked={paginatedTasks.length > 0 && paginatedTasks.every((task) => selectedTaskIds.has(task.id))}
                        onCheckedChange={(checked) =>
                          setSelectedTaskIds((current) => {
                            const next = new Set(current);
                            for (const task of paginatedTasks) {
                              if (checked) next.add(task.id);
                              else next.delete(task.id);
                            }
                            return next;
                          })
                        }
                        aria-label="Select all tasks on this page"
                      />
                    ) : null}
                  </TableHead>
                  <TableHead className="w-[24%]">Task / Content</TableHead>
                  <TableHead className="w-[14%]">Created by</TableHead>
                  <TableHead className="w-[17%]">Created at</TableHead>
                  <TableHead className="w-[12%]">Status</TableHead>
                  <TableHead className="w-[10%]">Priority</TableHead>
                  <TableHead className="w-[10%]">DDL</TableHead>
                  <TableHead className="w-[13%]" style={{ paddingRight: "88px" }}>
                    <span className="sr-only">Comments</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleTasks.length ? (
                  paginatedTasks.map((task) => (
                    <TableRow key={task.id} className="cursor-pointer" onClick={() => setSelected(task)}>
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        {filter === "mine" ? (
                          <Checkbox
                            checked={selectedTaskIds.has(task.id)}
                            onCheckedChange={(checked) =>
                              setSelectedTaskIds((current) => {
                                const next = new Set(current);
                                if (checked) next.add(task.id);
                                else next.delete(task.id);
                                return next;
                              })
                            }
                            aria-label={`Select ${task.title}`}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="truncate font-medium">{task.title}</span>
                          <span className="max-w-md truncate text-muted-foreground text-xs">
                            {task.content || "No additional details"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback>{userName(task.owner).slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground text-sm">{userName(task.owner)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="whitespace-nowrap text-muted-foreground text-sm">
                          {formatDateTime(task.created_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.status === "completed" ? "secondary" : "outline"}>
                          {statusLabels[task.status] ?? task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{task.priority}</TableCell>
                      <TableCell>
                        <span className={task.is_overdue ? "font-medium text-destructive" : "text-sm"}>
                          {ddlLabel(task, now)}
                        </span>
                      </TableCell>
                      <TableCell style={{ paddingRight: "88px" }}>
                        <div className="flex items-center justify-end gap-3">
                          {currentUserId && String(task.owner) === currentUserId ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Edit ${task.title}`}
                              title="Edit task"
                              onClick={(event) => {
                                event.stopPropagation();
                                beginEdit(task);
                              }}
                            >
                              <Pencil className="size-5" />
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`View comments for ${task.title}`}
                            title="View comments"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelected(task);
                            }}
                          >
                            <MessageSquare className="size-5 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center text-muted-foreground">
                      No items match this view.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {!error && !loading ? (
            <div className="flex flex-col gap-3 border-t p-4 text-sm md:flex-row md:items-center md:justify-between">
              <span className="text-muted-foreground">
                Showing {visibleTasks.length === 0 ? 0 : currentPage * pageSize + 1}-
                {Math.min((currentPage + 1) * pageSize, visibleTasks.length)} of {visibleTasks.length}
              </span>
              <div className="flex items-center gap-3">
                <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="h-8 w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="5">5 / page</SelectItem>
                      <SelectItem value="10">10 / page</SelectItem>
                      <SelectItem value="20">20 / page</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        text="Prev"
                        aria-disabled={currentPage === 0}
                        className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                        onClick={(event) => {
                          event.preventDefault();
                          setPageIndex((value) => Math.max(0, value - 1));
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-2 text-muted-foreground">
                        Page {currentPage + 1} of {pageCount}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        text="Next"
                        aria-disabled={currentPage >= pageCount - 1}
                        className={currentPage >= pageCount - 1 ? "pointer-events-none opacity-50" : ""}
                        onClick={(event) => {
                          event.preventDefault();
                          setPageIndex((value) => Math.min(pageCount - 1, value + 1));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Sheet
        open={Boolean(selected) || creating}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setEditing(false);
            setCreating(false);
          }
        }}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full data-[side=right]:sm:w-1/2 data-[side=right]:sm:max-w-[50vw]"
        >
          <SheetHeader>
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <SheetTitle>{creating ? "New task" : selected?.title}</SheetTitle>
                <SheetDescription>
                  {creating
                    ? "Create a private task"
                    : selected
                    ? `${statusLabels[selected.status] ?? selected.status} · ${selected.priority} priority`
                    : ""}
                </SheetDescription>
              </div>
              {selected && String(selected.owner) === currentUserId && !editing ? (
                <Button variant="outline" size="sm" onClick={() => beginEdit()}>
                  <Pencil data-icon="inline-start" />
                  Edit
                </Button>
              ) : null}
            </div>
          </SheetHeader>
          <Separator />
          {creating ? (
            <form className="flex flex-col gap-4 p-4" onSubmit={createTask}>
              <Input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Task title"
                aria-label="Task title"
                autoFocus
              />
              <Textarea
                value={newContent}
                onChange={(event) => setNewContent(event.target.value)}
                placeholder="Task content"
                aria-label="Task content"
                rows={6}
              />
              <Input
                type="text"
                value={newDueDate}
                onChange={(event) => setNewDueDate(event.target.value)}
                placeholder="DD/MM/YYYY"
                aria-label="Task deadline"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger aria-label="Task status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger aria-label="Task priority">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">Low priority</SelectItem>
                      <SelectItem value="medium">Medium priority</SelectItem>
                      <SelectItem value="high">High priority</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select value={newVisibility} onValueChange={(value) => setNewVisibility(value as Visibility)}>
                  <SelectTrigger aria-label="Task visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="private">Only me</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="shared">Specific users</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {newVisibility === "shared" ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Search users"
                    aria-label="Search users"
                  />
                  {testUsers
                    .filter((user) => user.name.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((user) => (
                      <label key={user.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            setSelectedUsers((items) =>
                              checked ? [...new Set([...items, user.id])] : items.filter((id) => id !== user.id),
                            )
                          }
                        />
                        {user.name}
                      </label>
                    ))}
                </div>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newTitle.trim()}>
                  Create task
                </Button>
              </div>
            </form>
          ) : editing ? (
            <form className="flex flex-col gap-4 border-b p-4" onSubmit={saveEdit}>
              <Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} aria-label="Task title" />
              <Textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                aria-label="Task content"
                placeholder="Task content"
                rows={6}
              />
              <Input
                type="text"
                value={editDueDate}
                onChange={(event) => setEditDueDate(event.target.value)}
                placeholder="DD/MM/YYYY"
                aria-label="Task deadline"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger aria-label="Task status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger aria-label="Task priority">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">Low priority</SelectItem>
                      <SelectItem value="medium">Medium priority</SelectItem>
                      <SelectItem value="high">High priority</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select value={editVisibility} onValueChange={(value) => setEditVisibility(value as Visibility)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="private">Only me</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="shared">Specific users</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {editVisibility === "shared" ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Search users"
                    aria-label="Search users"
                  />
                  {testUsers
                    .filter((user) => user.name.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((user) => (
                      <label key={user.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            setSelectedUsers((items) =>
                              checked ? [...new Set([...items, user.id])] : items.filter((id) => id !== user.id),
                            )
                          }
                        />
                        {user.name}
                      </label>
                    ))}
                </div>
              ) : null}
              <div className="flex gap-2">
                <Button type="submit" disabled={!editTitle.trim() || saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="sm:ml-auto"
                  onClick={() => void deleteSelected()}
                >
                  Delete task
                </Button>
              </div>
            </form>
          ) : null}
          {!editing && !creating ? <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
            <div className="rounded-md bg-muted/40 p-4">
              <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wide">Task</p>
              <p className="font-medium">{selected?.title}</p>
              {selected?.content ? <p className="mt-2 whitespace-pre-wrap text-sm">{selected.content}</p> : null}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MessageSquare />
              Comments on this task <span>({comments.length})</span>
            </div>
            {comments.length ? (
              flattenCommentThread(comments)
                .filter(({ depth, rootId }) => depth === 0 || !collapsedThreads.has(rootId))
                .map(({ item, depth, parentAuthor, rootId }) => (
                <div key={item.id} className="flex flex-col gap-1" style={{ marginLeft: depth === 0 ? 0 : "1.5rem" }}>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                    {depth === 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="-ml-2 h-7 w-7 shrink-0"
                        aria-label={collapsedThreads.has(rootId) ? "Expand comments" : "Collapse comments"}
                        title={collapsedThreads.has(rootId) ? "Expand comments" : "Collapse comments"}
                        onClick={() =>
                          setCollapsedThreads((current) => {
                            const next = new Set(current);
                            if (next.has(rootId)) next.delete(rootId);
                            else next.add(rootId);
                            return next;
                          })
                        }
                      >
                        {collapsedThreads.has(rootId) ? <ChevronRight /> : <ChevronDown />}
                      </Button>
                    ) : null}
                    <span className="font-medium">
                      {userName(item.author)}
                      {parentAuthor ? ` reply ${userName(parentAuthor)}` : ""}:
                    </span>
                    <span className="whitespace-pre-wrap">{item.content}</span>
                    <span className="whitespace-nowrap text-muted-foreground text-xs">{formatDateTime(item.created_at)}</span>
                    {selected &&
                    (String(selected.owner) === currentUserId || String(item.author) === currentUserId) ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 shrink-0 self-end text-destructive hover:text-destructive"
                        aria-label="Delete comment"
                        title="Delete comment"
                        onClick={() => void deleteComment(item)}
                      >
                        <Trash2 />
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 whitespace-nowrap px-2 text-xs"
                      onClick={() => setReplyTo(item)}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
                ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                <CheckCircle2 />
                <p className="text-sm">No comments yet.</p>
              </div>
            )}
          </div> : null}
          {!editing && !creating ? <form className="flex flex-col gap-3 border-t p-4" onSubmit={addComment}>
            {replyTo ? (
              <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-xs">
                <span>Replying to {userName(replyTo.author)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Cancel reply"
                  onClick={() => setReplyTo(null)}
                >
                  ×
                </Button>
              </div>
            ) : null}
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add a comment or reply…"
              rows={3}
            />
            <Button type="submit" disabled={!comment.trim()}>
              Add comment
            </Button>
          </form> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
