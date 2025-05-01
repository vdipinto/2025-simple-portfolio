"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiUser } from "react-icons/fi";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-full aspect-square flex items-center justify-center bg-transparent transition-colors hover:bg-accent"
          aria-label="User Menu"
        >
          <FiUser className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40">
        {loading ? (
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            Loading...
          </DropdownMenuItem>
        ) : session ? (
          <>
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {session.user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => window.location.href = "/login"}>
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
