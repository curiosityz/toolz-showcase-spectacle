interface OutputLogProps {
  logs: string[];
}

export const OutputLog = ({ logs }: OutputLogProps) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl p-6 rounded-lg border border-white/40 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-white">System Output</h3>
      <pre className="h-[300px] overflow-y-auto bg-black/50 p-4 rounded-lg text-white font-mono text-sm border border-white/20">
        {logs.join("\n")}
      </pre>
    </div>
  );
};