import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Brain, MessageSquare, Code, Wand2 } from "lucide-react";

const tools = [
  {
    title: "AI Text Generator",
    description: "Create compelling content with our advanced language model",
    icon: Brain,
    demoUrl: "https://demo.toolz.digital/text-generator",
  },
  {
    title: "Smart Chat Assistant",
    description: "Get instant answers and assistance for any task",
    icon: MessageSquare,
    demoUrl: "https://demo.toolz.digital/chat",
  },
  {
    title: "Code Generator",
    description: "Transform natural language into production-ready code",
    icon: Code,
    demoUrl: "https://demo.toolz.digital/code",
  },
  {
    title: "Creative Suite",
    description: "Generate images, music, and more with AI",
    icon: Wand2,
    demoUrl: "https://demo.toolz.digital/creative",
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={showcaseRef} className="py-20 bg-toolz-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
          Experience Our Tools
        </h2>

        <div className="space-y-8 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="tool-frame p-6 rounded-2xl bg-gradient-to-br from-toolz-blue/20 to-toolz-red/20 backdrop-blur-xl border border-toolz-blue/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <tool.icon className="w-8 h-8 text-toolz-blue" />
                <div>
                  <h3 className="text-2xl font-bold text-white">{tool.title}</h3>
                  <p className="text-gray-300">{tool.description}</p>
                </div>
              </div>
              
              <div className="relative aspect-video rounded-lg overflow-hidden border border-toolz-blue/30 bg-toolz-dark">
                <iframe
                  src={tool.demoUrl}
                  className="absolute inset-0 w-full h-full bg-toolz-dark"
                  title={`${tool.title} Demo`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolShowcase;