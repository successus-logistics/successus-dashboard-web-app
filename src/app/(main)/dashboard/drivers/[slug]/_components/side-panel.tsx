import { Attachment, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Clock1Icon, FileTextIcon, PencilIcon, User } from "lucide-react";

export default function SidePanel({ driverDetails }) {
  return (
    <div className="flex flex-col gap-10">
      <Card className="ring-0 shadow-2xl">
        <CardHeader className="flex items-center justify-between gap-2 border-b">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 items-center">
              < FileTextIcon />
              <CardTitle>Documents</CardTitle>
            </div>
            <Button variant={"outline"}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex justify-between items-center gap-2 max-w-lg">
          <AttachmentGroup>
            <Attachment>
              <AttachmentMedia variant="image">
                <img src={"https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"} alt="photot" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>Licence</AttachmentTitle>
                <AttachmentDescription>820kb</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment >
              <AttachmentMedia variant="image">
                <img src={"https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"} alt="photot" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>Licence</AttachmentTitle>
                <AttachmentDescription>820kb</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment >
              <AttachmentMedia variant="image">
                <img src={"https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"} alt="photot" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>Licence</AttachmentTitle>
                <AttachmentDescription>820kb</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment >
              <AttachmentMedia variant="image">
                <img src={"https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"} alt="photot" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>Licence</AttachmentTitle>
                <AttachmentDescription>820kb</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </AttachmentGroup>
          <Button variant={"outline"} className="h-full aspect-square"><ChevronRight /> </Button>
        </CardContent>
      </Card>
      <Card className="ring-0 shadow-2xl">
        <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-2 border-b">
          <Clock1Icon />
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
          <Timeline />
        </CardContent>
      </Card>
    </div>
  )
}


function Timeline({ events }: { events: string[] }) {
  const example = [
    {
      title: "basic item",
      description: "A simple item with title and description"
    },
    {
      title: "basic item",
      description: "A simple item with title and description"
    },
    {
      title: "basic item",
      description: "A simple item with title and description"
    },
  ]
  return (
    <div className="grid grid-cols-[24px_1fr] w-full h-52">
      {example.map((event, index) => <TimelinePoint key={index} index={index + 1} event={event} leaf={example.length === index + 1} />)}
    </div>
  )
}

function TimelinePoint({ index, event, leaf = false }: { index: number; event: unknown, leaf?: boolean }) {
  return (
    <>
      <div style={{ gridRowStart: index }} className="h-full col-start-1 relative last:hidden translate-y-5">
        <div className={`w-0.5 bg-gray-500 absolute  left-1/2 -translate-x-1/2 top-0 h-full ${leaf && "hidden"}`} />
        <div className="h-2.5 w-2.5 rounded-full bg-red-500 absolute left-1/2 -translate-1/2 " />
      </div>
      <div style={{ gridRowStart: index }} className="col-start-2">
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Basic Item</ItemTitle>
            <ItemDescription>
              A simple item with title and description.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
      </div>
    </>

  )

}
