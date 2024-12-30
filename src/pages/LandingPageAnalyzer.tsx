import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const LandingPageAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [analysisDepth, setAnalysisDepth] = useState("quick");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const focusAreas = [
    { id: "technical", label: "Technical Performance" },
    { id: "content", label: "Content Quality" },
    { id: "conversion", label: "Conversion Optimization" },
  ];

  const [selectedAreas, setSelectedAreas] = useState(focusAreas.map(area => area.id));

  const analyzePage = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey && analysisDepth !== "quick") {
      toast({
        title: "Error",
        description: "Please enter an API key for comprehensive or expert analysis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const corsProxy = "https://cors-anywhere.herokuapp.com/";
      const pageResponse = await fetch(corsProxy + url, {
        headers: {
          Origin: window.location.origin,
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch the landing page (Status: ${pageResponse.status})`);
      }

      const pageContent = await pageResponse.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(pageContent, "text/html");
      const textContent = doc.body.innerText || doc.body.textContent || "";

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert landing page analyzer. Analyze this content: ${textContent}`,
              }],
            }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze the page");
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Analysis Complete",
        description: "Your landing page analysis is ready",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze the page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Advanced Landing Page Analyzer</h1>
        <p className="text-gray-300">Comprehensive AI-powered analysis and recommendations for your landing page</p>
      </div>

      <Card className="p-6 space-y-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20">
        <Input
          type="text"
          placeholder="Enter your Google API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="bg-white/5"
        />

        <Input
          type="url"
          placeholder="Enter your landing page URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-white/5"
        />

        <Select value={analysisDepth} onValueChange={setAnalysisDepth}>
          <SelectTrigger>
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
                />
                <label htmlFor={area.id} className="text-sm text-gray-300">
                  {area.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={analyzePage}
          disabled={loading}
          className="w-full bg-toolz-blue hover:bg-toolz-blue/80"
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
      </Card>

      {results && (
        <Card className="mt-8 p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default LandingPageAnalyzer;