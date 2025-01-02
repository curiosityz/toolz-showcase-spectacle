import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface AnalysisFormProps {
  url: string;
  setUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  analysisDepth: string;
  setAnalysisDepth: (depth: string) => void;
  selectedAreas: string[];
  setSelectedAreas: (areas: string[]) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const focusAreas = [
  { id: "technical", label: "Technical Performance" },
  { id: "content", label: "Content Quality" },
  { id: "conversion", label: "Conversion Optimization" },
];

export const AnalysisForm = ({
  url,
  setUrl,
  apiKey,
  setApiKey,
  analysisDepth,
  setAnalysisDepth,
  selectedAreas,
  setSelectedAreas,
  onAnalyze,
  loading,
}: AnalysisFormProps) => {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your Google API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="bg-white/5 border-toolz-blue/20 text-white placeholder:text-gray-400"
      />

      <Input
        type="url"
        placeholder="Enter your landing page URL (e.g., https://example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="bg-white/5 border-toolz-blue/20 text-white placeholder:text-gray-400"
      />

      <Select value={analysisDepth} onValueChange={setAnalysisDepth}>
        <SelectTrigger className="bg-white/5 border-toolz-blue/20 text-white">
          <SelectValue placeholder="Select analysis depth" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="quick">Quick Analysis (Free)</SelectItem>
          <SelectItem value="comprehensive" disabled={!apiKey}>
            Comprehensive Analysis
          </SelectItem>
          <SelectItem value="expert" disabled={!apiKey}>
            Expert-Level Analysis
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-4">
        <h4 className="font-medium text-white">Focus Areas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {focusAreas.map((area) => (
            <div key={area.id} className="flex items-center space-x-2">
              <Checkbox
                id={area.id}
                checked={selectedAreas.includes(area.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAreas([...selectedAreas, area.id]);
                  } else {
                    setSelectedAreas(selectedAreas.filter((id) => id !== area.id));
                  }
                }}
                className="border-toolz-blue/40 data-[state=checked]:bg-toolz-blue"
              />
              <label htmlFor={area.id} className="text-sm text-gray-300 cursor-pointer">
                {area.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onAnalyze}
        disabled={loading}
        className="w-full bg-gradient-to-r from-toolz-blue to-toolz-red hover:opacity-90 transition-opacity"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Landing Page"
        )}
      </Button>
    </div>
  );
};