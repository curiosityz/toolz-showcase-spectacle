interface OutputLogProps {
  logs: string[];
}

export const OutputLog = ({ logs }: OutputLogProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300">
      <h3 className="text-xl font-bold mb-4 text-white">System Output</h3>
      <pre className="h-[300px] overflow-y-auto bg-black/30 p-4 rounded-lg text-gray-300 font-mono text-sm">
        {logs.join("\n")}
      </pre>
    </div>
  );
};