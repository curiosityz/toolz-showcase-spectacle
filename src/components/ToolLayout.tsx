import { ReactNode } from "react";
import { ToolNavigation } from "./ToolNavigation";

interface ToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const ToolLayout = ({ children, title, description }: ToolLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-toolz-dark via-toolz-dark/95 to-toolz-dark pt-20">
      <ToolNavigation />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-toolz-blue to-toolz-red animate-glow">
            {title}
          </h1>
          <p className="text-white/90 text-lg">
            {description}
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/40 p-8 shadow-xl space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};