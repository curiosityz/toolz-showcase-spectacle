import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-toolz-dark via-toolz-dark/95 to-toolz-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border-toolz-blue/20">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Welcome to TOOLZ</h1>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3b82f6',
                  brandAccent: '#2563eb',
                }
              }
            }
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Auth;