"use client";

import { useSession, signIn, signOut } from "next-auth/react";
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
          className="p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="User Menu"
        >
          <FiUser className="text-xl" />
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
