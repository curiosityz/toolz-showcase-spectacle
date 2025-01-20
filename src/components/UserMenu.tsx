import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

export const UserMenu = () => {
  const { user, signOut, profile } = useAuth();

  if (!user) {
    return (
      <Button
        variant="outline"
        className="text-white border-toolz-blue hover:bg-toolz-blue/20"
        onClick={() => window.location.href = '/auth'}
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-white border-toolz-blue hover:bg-toolz-blue/20">
          <User className="w-4 h-4 mr-2" />
          {user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};