interface AgentStatusProps {
  id: string;
  status: string;
  goals: string[];
}

export const AgentStatus = ({ id, status, goals }: AgentStatusProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
      <h4 className="text-lg font-semibold mb-2 text-white">
        {id.replace(/([A-Z])/g, " $1").trim()}
      </h4>
      <div className="text-gray-300 italic mb-2">Status: {status}</div>
      <div className="space-y-1">
        {goals.map((goal, index) => (
          <div key={index} className="text-sm text-gray-400">
            {goal}
          </div>
        ))}
      </div>
    </div>
  );
};