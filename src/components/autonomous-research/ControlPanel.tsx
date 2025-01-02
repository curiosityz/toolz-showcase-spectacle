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
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
      <h3 className="text-xl font-bold mb-4 text-white">AI Research System Control Panel</h3>
      <div className="flex gap-4 flex-wrap">
        <Input
          type="text"
          placeholder="Enter Google AI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 min-w-[300px] bg-white/5 border-toolz-blue/20 text-white"
        />
        <Button
          onClick={startResearch}
          className="bg-toolz-blue hover:bg-toolz-blue/80 transition-colors"
        >
          Start Research
        </Button>
        <Button
          onClick={startReflection}
          className="bg-toolz-blue hover:bg-toolz-blue/80 transition-colors"
        >
          Start Reflection
        </Button>
        <Button
          onClick={toggleAutonomousLoop}
          className="bg-toolz-blue hover:bg-toolz-blue/80 transition-colors"
        >
          {isAutonomousLoopRunning ? "Stop" : "Start"} Autonomous Loop
        </Button>
      </div>
    </div>
  );
};