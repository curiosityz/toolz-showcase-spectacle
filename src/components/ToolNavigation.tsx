import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const tools = [
  {
    path: "/landing-page-analyzer",
    name: "Landing Page Analyzer",
  },
  {
    path: "/autonomous-research",
    name: "Autonomous Research",
  },
  {
    path: "/experiment-lab",
    name: "Experiment Lab",
  },
];

export const ToolNavigation = () => {
  const location = useLocation();
  const currentIndex = tools.findIndex((tool) => tool.path === location.pathname);
  const prevTool = tools[currentIndex - 1];
  const nextTool = tools[currentIndex + 1];

  return (
    <Card className="fixed top-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-xl border-toolz-blue/20 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:text-toolz-blue hover:bg-white/10">
            ← Back to Tools
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          {prevTool && (
            <Link to={prevTool.path}>
              <Button variant="ghost" className="text-white hover:text-toolz-blue hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {prevTool.name}
              </Button>
            </Link>
          )}
          
          {nextTool && (
            <Link to={nextTool.path}>
              <Button variant="ghost" className="text-white hover:text-toolz-blue hover:bg-white/10">
                {nextTool.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};