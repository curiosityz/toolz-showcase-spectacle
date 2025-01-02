import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface ExperimentFormProps {
  purpose: string;
  setPurpose: (value: string) => void;
  methodology: string;
  setMethodology: (value: string) => void;
  participantCount: number;
  setParticipantCount: (value: number) => void;
}

export const ExperimentForm = ({
  purpose,
  setPurpose,
  methodology,
  setMethodology,
  participantCount,
  setParticipantCount,
}: ExperimentFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-white">Research Purpose</h3>
        <Textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Describe the purpose of your experiment..."
          className="min-h-[150px] mb-6 bg-white/5 border-toolz-blue/20 text-white placeholder:text-gray-400"
        />
        
        <h3 className="text-xl font-semibold mb-4 text-white">Methodology</h3>
        <Textarea
          value={methodology}
          onChange={(e) => setMethodology(e.target.value)}
          placeholder="Describe your research methodology..."
          className="min-h-[150px] bg-white/5 border-toolz-blue/20 text-white placeholder:text-gray-400"
        />
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-white">Experiment Configuration</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Number of Participants
            </label>
            <Input
              type="number"
              value={participantCount}
              onChange={(e) => setParticipantCount(Number(e.target.value))}
              min={3}
              max={10}
              className="bg-white/5 border-toolz-blue/20 text-white"
            />
            <p className="mt-2 text-sm text-gray-400">
              Choose between 3-10 participants for your experiment
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Configuration File (Optional)
            </label>
            <Input
              type="file"
              accept=".json"
              className="bg-white/5 border-toolz-blue/20 text-white file:bg-toolz-blue/20 file:text-white file:border-0 file:rounded-md"
            />
            <p className="mt-2 text-sm text-gray-400">
              Upload a JSON file to configure advanced experiment parameters
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};