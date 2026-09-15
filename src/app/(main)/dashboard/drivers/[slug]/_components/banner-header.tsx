import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Dot, Pencil, User } from "lucide-react";

export default function BannerHeader({ driverDetails }) {
  return (
    <Card className="h-full w-full col-start-1">
      <CardHeader className="flex gap-2 justify-between">
        <div className="flex gap-5 items-center">
          <Avatar className="w-28 h-28 ">
            <AvatarImage src={driverDetails.profile_picture} />
            <AvatarFallback className="text-5xl">
              {driverDetails.first_name[0]}
              {driverDetails.last_name[0]}
            </AvatarFallback>
            <Button
              size={"icon-sm"}
              className="rounded-full aspect-square absolute right-0 bottom-0 z-999 hove:bg-none"
            >
              <Camera />
            </Button>
          </Avatar>
          <div className="flex flex-col gap-3">
            <CardTitle className="text-xl tracking-wider flex items-center gap-5">
              {driverDetails.full_name}
              <Badge className="bg-green-300/30 text-green-500">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center justify-between gap-5">
              <div className="flex items-center w-fit gap-2">
                <User />
                Driver
              </div>
              <Separator orientation="vertical" />
              ID: {driverDetails.id.substring(0, 13)}
            </CardDescription>
          </div>
        </div>
        <Button
          variant={"outline"}
          className={
            false
              ? "bg-accent data-active:bg-accent hover:bg-accent justify-self-end"
              : ""
          }
        >
          <Pencil />
          Edit
        </Button>
      </CardHeader>
    </Card>
  );
}
