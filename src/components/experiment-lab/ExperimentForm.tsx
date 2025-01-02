import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4">Research Purpose</h3>
        <Textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Describe the purpose of your experiment..."
          className="min-h-[150px] mb-6 bg-white/5 border-toolz-blue/20 text-white"
        />
        
        <h3 className="text-xl font-semibold mb-4">Methodology</h3>
        <Textarea
          value={methodology}
          onChange={(e) => setMethodology(e.target.value)}
          placeholder="Describe your research methodology..."
          className="min-h-[150px] bg-white/5 border-toolz-blue/20 text-white"
        />
      </div>

      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4">Experiment Configuration</h3>
        
        <div className="space-y-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Configuration File
            </label>
            <Input
              type="file"
              accept=".json"
              className="bg-white/5 border-toolz-blue/20 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};