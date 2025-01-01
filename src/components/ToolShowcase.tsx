import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Brain, Globe, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

const tools = [
  {
    title: "Landing Page Analyzer",
    description: "Get instant AI-powered feedback on your landing page",
    icon: Globe,
    path: "/landing-page-analyzer",
    longDescription: "Our Landing Page Analyzer uses advanced AI to evaluate and provide actionable insights for your landing pages. Get detailed feedback on design, content, conversion optimization, and SEO elements. Perfect for marketers and designers looking to optimize their landing pages for better performance and conversion rates.",
  },
  {
    title: "Autonomous Research",
    description: "AI-powered autonomous research system",
    icon: Search,
    path: "/autonomous-research",
    longDescription: "Experience the future of research with our Autonomous Research System. Powered by Google's Gemini AI, this tool conducts comprehensive research, generates insights, and autonomously explores related topics. Perfect for researchers, analysts, and anyone seeking deep understanding of complex subjects.",
  },
  {
    title: "LLM Social Experiment Lab",
    description: "Run controlled studies with LLM participants",
    icon: Brain,
    path: "/experiment-lab",
    longDescription: "Design and conduct sophisticated social experiments using LLM participants. Configure experiment parameters, analyze results, and gain insights into human behavior and decision-making patterns. Perfect for researchers, social scientists, and anyone interested in understanding social dynamics through AI-powered experimentation.",
  },
];

const ToolShowcase = () => {
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tool-frame", {
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
      });

      gsap.from(".tool-description", {
        scrollTrigger: {
          trigger: ".tool-description",
          start: "top bottom",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={showcaseRef} className="py-20 bg-toolz-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
          Experience Our Tools
        </h2>

        <div className="space-y-20 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <div key={tool.title} className="space-y-8">
              <Link to={tool.path}>
                <Card className="tool-frame p-6 rounded-2xl bg-gradient-to-br from-toolz-blue/20 to-toolz-red/20 backdrop-blur-xl border border-toolz-blue/30 hover:border-toolz-blue/60 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <tool.icon className="w-8 h-8 text-toolz-blue" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">{tool.title}</h3>
                      <p className="text-gray-300">{tool.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-toolz-blue/30 bg-toolz-dark/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-toolz-blue font-medium">Click to try {tool.title}</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <div className="tool-description max-w-3xl mx-auto px-6 py-8 rounded-xl bg-gradient-to-br from-toolz-blue/10 to-toolz-red/10 border border-toolz-blue/20">
                <p className="text-lg leading-relaxed text-gray-200">
                  {tool.longDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolShowcase;