import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
      // Simulate experiment running
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
    <div className="min-h-screen bg-toolz-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">LLM Social Experiment Lab</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20">
            <h3 className="text-xl font-semibold mb-4">Research Purpose</h3>
            <Textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe the purpose of your experiment..."
              className="min-h-[150px] mb-6 bg-white/5"
            />
            
            <h3 className="text-xl font-semibold mb-4">Methodology</h3>
            <Textarea
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              placeholder="Describe your research methodology..."
              className="min-h-[150px] bg-white/5"
            />
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20">
            <h3 className="text-xl font-semibold mb-4">Experiment Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Participants
                </label>
                <Input
                  type="number"
                  value={participantCount}
                  onChange={(e) => setParticipantCount(Number(e.target.value))}
                  min={3}
                  max={10}
                  className="bg-white/5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Configuration File
                </label>
                <Input
                  type="file"
                  accept=".json"
                  className="bg-white/5"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload
                      toast({
                        title: "File Selected",
                        description: "Configuration file loaded successfully.",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

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
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20">
            <h3 className="text-xl font-semibold mb-4">Results</h3>
            <p className="text-gray-300">
              Run the experiment to see participant responses and analysis here.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExperimentLab;