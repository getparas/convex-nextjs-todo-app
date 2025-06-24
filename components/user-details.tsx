import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { SignOut } from "./sign-out";
import { User, Settings } from "lucide-react";

export default async function UserDetails() {
  const user = await fetchQuery(
    api.users.currentUser,
    {},
    { token: await convexAuthNextjsToken() }
  );

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none group">
        <div className="flex items-center gap-3 p-3 bg-white border-2 border-white hover:border-secondary transition-all duration-200 brutalist-shadow hover:brutalist-shadow-hover">
          <Avatar className="h-10 w-10 border-2 border-black">
            <AvatarImage src={user.image || "/placeholder.svg"} />
            <AvatarFallback className="bg-black text-white font-black text-lg">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-black text-black uppercase tracking-wide">
              {user.name}
            </p>
            <p className="text-xs font-medium text-muted uppercase">
              {user.email}
            </p>
          </div>
          <User className="w-5 h-5 text-black group-hover:text-gray-700 transition-colors duration-200" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] border-4 border-black brutalist-shadow-lg bg-white"
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 p-3">
            <Settings className="w-5 h-5 text-black" />
            <div className="flex flex-col space-y-1">
              <p className="text-base font-black text-black uppercase tracking-wide">
                {user.name}
              </p>
              <p className="text-sm font-medium text-muted uppercase">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-black h-0.5" />
        <DropdownMenuItem asChild className="p-0">
          <div className="p-3">
            <SignOut />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
