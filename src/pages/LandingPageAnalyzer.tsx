import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ToolNavigation } from "@/components/ToolNavigation";
import { AnalysisForm } from "@/components/landing-analyzer/AnalysisForm";
import { fetchPageContent, analyzePage } from "@/utils/pageAnalysis";

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

  const handleAnalysis = async () => {
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
      const pageContent = await fetchPageContent(url);
      const analysisResults = await analyzePage(pageContent, apiKey);
      setResults(analysisResults);
      
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
    <div className="min-h-screen bg-gradient-to-br from-toolz-dark via-toolz-dark/95 to-toolz-dark pt-20">
      <ToolNavigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-toolz-blue to-toolz-red animate-glow">
            Advanced Landing Page Analyzer
          </h1>
          <p className="text-gray-300 text-lg">
            Comprehensive AI-powered analysis and recommendations for your landing page
          </p>
        </div>

        <Card className="p-8 space-y-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
          <AnalysisForm
            url={url}
            setUrl={setUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
            analysisDepth={analysisDepth}
            setAnalysisDepth={setAnalysisDepth}
            selectedAreas={selectedAreas}
            setSelectedAreas={setSelectedAreas}
            onAnalyze={handleAnalysis}
            loading={loading}
          />
        </Card>

        {results && (
          <Card className="mt-8 p-6 bg-white/10 backdrop-blur-xl border-toolz-blue/20 animate-fade-in">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LandingPageAnalyzer;