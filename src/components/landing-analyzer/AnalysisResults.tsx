import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AnalysisResultsProps {
  results: any;
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  if (!results?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return null;
  }

  const analysisText = results.candidates[0].content.parts[0].text;
  const sections = analysisText.split('\n\n').filter(Boolean);

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border border-toolz-blue/20">
      <Card className="p-6 bg-white/20 backdrop-blur-xl">
        <div className="space-y-6">
          {sections.map((section: string, index: number) => {
            const isHeader = section.startsWith('**') || section.startsWith('#');
            if (isHeader) {
              return (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    {section.replace(/\*\*/g, '')}
                  </h3>
                  <Separator className="bg-toolz-blue/20" />
                </div>
              );
            }

            return (
              <div key={index} className="text-gray-200 space-y-2">
                {section.split('\n').map((line: string, lineIndex: number) => (
                  <p key={lineIndex} className="leading-relaxed">
                    {line.replace(/\*/g, '')}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </ScrollArea>
  );
};