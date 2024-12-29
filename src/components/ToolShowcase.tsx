import { useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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

        <div className="relative">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {tools.map((tool, index) => (
                <CarouselItem key={tool.title}>
                  <div className="tool-frame p-6 rounded-2xl bg-gradient-to-br from-toolz-blue/20 to-toolz-red/20 backdrop-blur-xl border border-toolz-blue/30">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-8">
              <CarouselPrevious className="relative inset-0 translate-y-0 bg-toolz-blue hover:bg-toolz-blue/80 border-none text-white" />
              <div className="flex gap-2">
                {tools.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-toolz-blue/30"
                  />
                ))}
              </div>
              <CarouselNext className="relative inset-0 translate-y-0 bg-toolz-blue hover:bg-toolz-blue/80 border-none text-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ToolShowcase;