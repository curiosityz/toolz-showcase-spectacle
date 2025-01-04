import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ControlPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  startResearch: () => void;
  startReflection: () => void;
  isAutonomousLoopRunning: boolean;
  toggleAutonomousLoop: () => void;
}

export const ControlPanel = ({
  apiKey,
  setApiKey,
  startResearch,
  startReflection,
  isAutonomousLoopRunning,
  toggleAutonomousLoop,
}: ControlPanelProps) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl p-6 rounded-lg border border-white/40 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-white">AI Research System Control Panel</h3>
      <div className="flex gap-4 flex-wrap">
        <Input
          type="text"
          placeholder="Enter Google AI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 min-w-[300px] bg-white/20 border-white/40 text-white placeholder:text-white/60"
        />
        <Button
          onClick={startResearch}
          className="bg-toolz-blue hover:bg-toolz-blue/80 text-white font-semibold shadow-md"
        >
          Start Research
        </Button>
        <Button
          onClick={startReflection}
          className="bg-toolz-blue hover:bg-toolz-blue/80 text-white font-semibold shadow-md"
        >
          Start Reflection
        </Button>
        <Button
          onClick={toggleAutonomousLoop}
          className="bg-toolz-blue hover:bg-toolz-blue/80 text-white font-semibold shadow-md"
        >
          {isAutonomousLoopRunning ? "Stop" : "Start"} Autonomous Loop
        </Button>
      </div>
    </div>
  );
};