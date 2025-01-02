import { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "@/components/ui/use-toast";
import { ToolLayout } from "@/components/ToolLayout";
import { ControlPanel } from "@/components/autonomous-research/ControlPanel";
import { AgentStatus } from "@/components/autonomous-research/AgentStatus";
import { OutputLog } from "@/components/autonomous-research/OutputLog";

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
    <ToolLayout
      title="Autonomous Research System"
      description="AI-powered autonomous research system using Google's Gemini AI"
    >
      <div className="space-y-6 animate-fade-in">
        <ControlPanel
          apiKey={apiKey}
          setApiKey={setApiKey}
          startResearch={startResearch}
          startReflection={startReflection}
          isAutonomousLoopRunning={isAutonomousLoopRunning}
          toggleAutonomousLoop={toggleAutonomousLoop}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(agents).map(([id, agent]) => (
            <AgentStatus
              key={id}
              id={id}
              status={agent.status}
              goals={agent.goals}
            />
          ))}
        </div>

        <OutputLog logs={outputLog} />
      </div>
    </ToolLayout>
  );
};

export default AutonomousResearch;
