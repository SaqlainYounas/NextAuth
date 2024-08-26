"use client";
import {LogoutButton} from "./LogoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {FaUser} from "react-icons/fa";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {useState} from "react";
import {ExitIcon} from "@radix-ui/react-icons";

export const UserButton: React.FunctionComponent = () => {
  const [currentUser, setCurrentUser] = useState<any>();
  useCurrentUser().then((data) => {
    setCurrentUser(data);
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={currentUser?.image} />
          <AvatarFallback className="bg-sky-500 ">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
