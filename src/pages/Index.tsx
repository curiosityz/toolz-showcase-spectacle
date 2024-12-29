import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Hero from "@/components/Hero";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Code, Wand2 } from "lucide-react";

const tools = [
  {
    title: "AI Text Generator",
    description: "Create compelling content with our advanced language model",
    icon: <Brain className="w-8 h-8" />,
  },
  {
    title: "Smart Chat Assistant",
    description: "Get instant answers and assistance for any task",
    icon: <MessageSquare className="w-8 h-8" />,
  },
  {
    title: "Code Generator",
    description: "Transform natural language into production-ready code",
    icon: <Code className="w-8 h-8" />,
  },
  {
    title: "Creative Suite",
    description: "Generate images, music, and more with AI",
    icon: <Wand2 className="w-8 h-8" />,
  },
];

const Index = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-toolz-dark text-white">
      <Hero />
      
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Powerful AI Tools at Your Fingertips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.title}
                {...tool}
                delay={index * 0.2}
              />
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-toolz-blue hover:bg-toolz-blue/80 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
            >
              Start Creating Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;