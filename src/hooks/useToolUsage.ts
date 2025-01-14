import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useToolUsage = (toolName: string) => {
  const [usageCount, setUsageCount] = useState(0);
  const [freeLimit, setFreeLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canUse, setCanUse] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsageAndLimits = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const [{ data: usage }, { data: limits }] = await Promise.all([
          supabase
            .from("tool_usage")
            .select("*")
            .eq("tool_name", toolName)
            .eq("user_id", session.user.id),
          supabase
            .from("tool_limits")
            .select("*")
            .eq("tool_name", toolName)
            .single()
        ]);

        const usageCount = usage?.length || 0;
        const freeLimit = limits?.free_tier_limit || 0;
        
        setUsageCount(usageCount);
        setFreeLimit(freeLimit);
        setCanUse(usageCount < freeLimit);
      } catch (error) {
        console.error("Error fetching usage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageAndLimits();
  }, [toolName]);

  const trackUsage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      if (usageCount >= freeLimit) {
        toast({
          title: "Usage Limit Reached",
          description: "Please upgrade to continue using this tool",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from("tool_usage")
        .insert({
          tool_name: toolName,
          user_id: session.user.id
        });

      if (error) throw error;

      setUsageCount(prev => prev + 1);
      setCanUse(usageCount + 1 < freeLimit);
      return true;
    } catch (error) {
      console.error("Error tracking usage:", error);
      return false;
    }
  };

  return {
    usageCount,
    freeLimit,
    isLoading,
    canUse,
    trackUsage
  };
};