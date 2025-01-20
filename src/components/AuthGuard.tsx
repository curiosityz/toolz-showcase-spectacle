import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this tool",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, isLoading, navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : null;
};