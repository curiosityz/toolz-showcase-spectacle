import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ToolLayout } from "@/components/ToolLayout";
import { ExperimentForm } from "@/components/experiment-lab/ExperimentForm";

const ExperimentLab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [methodology, setMethodology] = useState("");
  const [participantCount, setParticipantCount] = useState(5);

  const handleStartExperiment = async () => {
    if (!purpose || !methodology) {
      toast({
        title: "Missing Information",
        description: "Please fill in both purpose and methodology fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Experiment Complete",
        description: "Your experiment results are ready for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run experiment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="LLM Social Experiment Lab"
      description="Design and conduct sophisticated social experiments using LLM participants"
    >
      <div className="animate-fade-in">
        <ExperimentForm
          purpose={purpose}
          setPurpose={setPurpose}
          methodology={methodology}
          setMethodology={setMethodology}
          participantCount={participantCount}
          setParticipantCount={setParticipantCount}
        />

        <div className="flex justify-center">
          <Button
            onClick={handleStartExperiment}
            disabled={loading}
            className="bg-toolz-blue hover:bg-toolz-blue/80 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
          >
            {loading ? "Running Experiment..." : "Begin Experiment"}
          </Button>
        </div>

        <div className="mt-8">
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-white">Results</h3>
            <p className="text-gray-300">
              Run the experiment to see participant responses and analysis here.
            </p>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ExperimentLab;