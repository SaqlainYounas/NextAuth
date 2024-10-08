"use client";

import {UserButton} from "@/components/auth/UserButton";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {usePathname} from "next/navigation";

export const Navbar: React.FunctionComponent = () => {
  const pathName = usePathname();
  return (
    <div className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        <Button
          variant={pathName === "/server" ? "default" : "outline"}
          asChild
        >
          <Link href={"/server"}>Server</Link>
        </Button>
        <Button
          variant={pathName === "/client" ? "default" : "outline"}
          asChild
        >
          <Link href={"/client"}>Client</Link>
        </Button>
        <Button variant={pathName === "/admin" ? "default" : "outline"} asChild>
          <Link href={"/admin"}>Admin</Link>
        </Button>
        <Button
          variant={pathName === "/settings" ? "default" : "outline"}
          asChild
        >
          <Link href={"/settings"}>Settings</Link>
        </Button>
      </div>
      <UserButton />
    </div>
  );
};
