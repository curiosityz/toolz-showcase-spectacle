import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ToolLayout } from "@/components/ToolLayout";
import { ExperimentForm } from "@/components/experiment-lab/ExperimentForm";
import { ExperimentResults } from "@/components/experiment-lab/ExperimentResults";

const ExperimentLab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [methodology, setMethodology] = useState("");
  const [participantCount, setParticipantCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);

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
      // Simulate participant responses
      const simulatedResults = Array.from({ length: participantCount }, (_, i) => {
        const responses = [
          `Participant ${i + 1} observed that ${purpose.slice(0, 30)}...`,
          `Their behavior aligned with ${methodology.slice(0, 30)}...`,
          `Key findings suggest ${Math.random() > 0.5 ? "positive" : "negative"} outcomes.`
        ];
        return responses.join("\n");
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      setResults(simulatedResults);
      
      toast({
        title: "Experiment Complete",
        description: `Generated responses from ${participantCount} participants.`,
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
      <div className="animate-fade-in space-y-8">
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

        <ExperimentResults results={results} />
      </div>
    </ToolLayout>
  );
};

export default ExperimentLab;