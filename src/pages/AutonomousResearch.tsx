import { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AutonomousResearch = () => {
  const [apiKey, setApiKey] = useState("");
  const [isAutonomousLoopRunning, setIsAutonomousLoopRunning] = useState(false);
  const [agents, setAgents] = useState({
    aiResearcher: { status: "Idle", goals: [] as string[] },
    chatAgent: { status: "Idle", goals: [] as string[] },
    memoryAgent: { status: "Idle", goals: [] as string[] },
  });
  const [outputLog, setOutputLog] = useState<string[]>(["AI Research System Control Panel initialized."]);
  const currentResearchTopicRef = useRef<string | null>(null);
  const genAIRef = useRef<any>(null);
  const { toast } = useToast();

  const updateAgentStatus = (agentId: keyof typeof agents, status: string) => {
    setAgents((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], status },
    }));
  };

  const updateAgentGoals = (agentId: keyof typeof agents, goals: string[]) => {
    setAgents((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], goals },
    }));
  };

  const log = (message: string) => {
    setOutputLog((prev) => [...prev, message]);
  };

  const startResearch = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google AI API Key",
        variant: "destructive",
      });
      return;
    }

    const topic = window.prompt("Enter a research topic:");
    if (!topic) return;

    try {
      if (!genAIRef.current) {
        genAIRef.current = new GoogleGenerativeAI(apiKey);
      }
      const model = genAIRef.current.getGenerativeModel({ model: "gemini-pro" });

      log(`Starting research on: ${topic}`);
      updateAgentStatus("aiResearcher", "Researching");
      updateAgentGoals("aiResearcher", [`Research on ${topic}`]);
      currentResearchTopicRef.current = topic;

      const prompt = `Research the following topic and provide a comprehensive summary: ${topic}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      log(text);
      updateAgentStatus("aiResearcher", "Idle");
    } catch (error: any) {
      log(`Error during research: ${error.message}`);
      updateAgentStatus("aiResearcher", "Error");
      toast({
        title: "Research Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startReflection = async () => {
    if (!currentResearchTopicRef.current) {
      toast({
        title: "No Research Topic",
        description: "Please start a research task first",
        variant: "destructive",
      });
      return;
    }

    try {
      const model = genAIRef.current.getGenerativeModel({ model: "gemini-pro" });
      log("Starting reflection process");
      updateAgentStatus("chatAgent", "Reflecting");
      updateAgentGoals("chatAgent", ["Analyze recent actions", "Generate insights"]);

      const prompt = `Analyze the recent research on "${currentResearchTopicRef.current}" and generate insights based on the findings.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      log(text);
      updateAgentStatus("chatAgent", "Idle");
    } catch (error: any) {
      log(`Error during reflection: ${error.message}`);
      updateAgentStatus("chatAgent", "Error");
      toast({
        title: "Reflection Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAutonomousLoop = () => {
    if (isAutonomousLoopRunning) {
      setIsAutonomousLoopRunning(false);
    } else {
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please enter your Google AI API Key",
          variant: "destructive",
        });
        return;
      }
      setIsAutonomousLoopRunning(true);
      startAutonomousLoop();
    }
  };

  const startAutonomousLoop = async () => {
    updateAgentStatus("memoryAgent", "Processing");
    updateAgentGoals("memoryAgent", ["Consolidate memories", "Update knowledge base"]);

    try {
      const model = genAIRef.current.getGenerativeModel({ model: "gemini-pro" });
      const prompt = currentResearchTopicRef.current
        ? `Analyze recent research findings and reflections on "${currentResearchTopicRef.current}". Consolidate this information and suggest further research directions.`
        : "Suggest a research topic.";

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      log(`Autonomous action: ${text}`);
      updateAgentStatus("memoryAgent", "Idle");

      if (isAutonomousLoopRunning) {
        setTimeout(startAutonomousLoop, 5000);
      }
    } catch (error: any) {
      log(`Error in autonomous loop: ${error.message}`);
      updateAgentStatus("memoryAgent", "Error");
      setIsAutonomousLoopRunning(false);
      toast({
        title: "Autonomous Loop Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-toolz-dark to-toolz-dark/80 min-h-screen">
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20">
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
              className="bg-toolz-blue hover:bg-toolz-blue/80"
            >
              Start Research
            </Button>
            <Button
              onClick={startReflection}
              className="bg-toolz-blue hover:bg-toolz-blue/80"
            >
              Start Reflection
            </Button>
            <Button
              onClick={toggleAutonomousLoop}
              className="bg-toolz-blue hover:bg-toolz-blue/80"
            >
              {isAutonomousLoopRunning ? "Stop" : "Start"} Autonomous Loop
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(agents).map(([id, agent]) => (
            <div
              key={id}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20"
            >
              <h4 className="text-lg font-semibold mb-2 text-white">
                {id.replace(/([A-Z])/g, " $1").trim()}
              </h4>
              <div className="text-gray-300 italic mb-2">
                Status: {agent.status}
              </div>
              <div className="space-y-1">
                {agent.goals.map((goal, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    {goal}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20">
          <h3 className="text-xl font-bold mb-4 text-white">System Output</h3>
          <pre className="h-[300px] overflow-y-auto bg-black/30 p-4 rounded-lg text-gray-300 font-mono text-sm">
            {outputLog.join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AutonomousResearch;