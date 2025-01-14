import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UpgradeDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'pro' })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Upgrade Successful!",
        description: "You now have unlimited access to all tools.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-toolz-blue hover:bg-toolz-blue/80">
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Pro Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Unlimited access to all tools</li>
              <li>Priority support</li>
              <li>Advanced features</li>
            </ul>
          </div>
          <Button 
            onClick={handleUpgrade} 
            disabled={isLoading}
            className="w-full bg-toolz-blue hover:bg-toolz-blue/80"
          >
            {isLoading ? "Processing..." : "Upgrade Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};