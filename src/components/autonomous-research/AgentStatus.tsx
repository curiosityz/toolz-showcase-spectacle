interface AgentStatusProps {
  id: string;
  status: string;
  goals: string[];
}

export const AgentStatus = ({ id, status, goals }: AgentStatusProps) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl p-6 rounded-lg border border-white/40 shadow-lg">
      <h4 className="text-lg font-semibold mb-2 text-white">
        {id.replace(/([A-Z])/g, " $1").trim()}
      </h4>
      <div className="text-white/90 italic mb-2">Status: {status}</div>
      <div className="space-y-1">
        {goals.map((goal, index) => (
          <div key={index} className="text-white/80 bg-white/10 p-2 rounded">
            {goal}
          </div>
        ))}
      </div>
    </div>
  );
};