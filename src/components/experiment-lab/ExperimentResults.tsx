import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExperimentResultsProps {
  results: string[];
}

export const ExperimentResults = ({ results }: ExperimentResultsProps) => {
  if (results.length === 0) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 text-white">Results</h3>
        <p className="text-gray-300">
          Run the experiment to see participant responses and analysis here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 text-white">Experiment Results</h3>
      <ScrollArea className="h-[400px] rounded-md border border-toolz-blue/20 p-4">
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-white/5 border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300"
            >
              <h4 className="text-lg font-medium text-toolz-blue mb-2">
                Participant {index + 1}
              </h4>
              <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                {result}
              </pre>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};