import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Brain, MessageSquare, Code, Wand2, Globe } from "lucide-react";

const tools = [
  {
    title: "Landing Page Analyzer",
    description: "Get instant AI-powered feedback on your landing page",
    icon: Globe,
    demoUrl: "https://demo.toolz.digital/landing-page-analyzer",
    longDescription: "Our Landing Page Analyzer uses advanced AI to evaluate and provide actionable insights for your landing pages. Get detailed feedback on design, content, conversion optimization, and SEO elements. Perfect for marketers and designers looking to optimize their landing pages for better performance and conversion rates.",
  },
  {
    title: "AI Text Generator",
    description: "Create compelling content with our advanced language model",
    icon: Brain,
    demoUrl: "https://demo.toolz.digital/text-generator",
    longDescription: "Our AI Text Generator represents the cutting edge of natural language processing. Built on advanced transformer architecture, it helps content creators, marketers, and writers generate high-quality content in seconds. Whether you need blog posts, product descriptions, or creative stories, this tool adapts to your style and tone while maintaining coherence and engagement.",
  },
  {
    title: "Smart Chat Assistant",
    description: "Get instant answers and assistance for any task",
    icon: MessageSquare,
    demoUrl: "https://demo.toolz.digital/chat",
    longDescription: "The Smart Chat Assistant is your 24/7 digital companion, powered by state-of-the-art language understanding capabilities. It's designed to handle everything from customer support to complex problem-solving, learning from each interaction to provide increasingly personalized assistance. With multi-language support and context awareness, it's like having an expert team at your fingertips.",
  },
  {
    title: "Code Generator",
    description: "Transform natural language into production-ready code",
    icon: Code,
    demoUrl: "https://demo.toolz.digital/code",
    longDescription: "Transform your ideas into working code with our revolutionary Code Generator. Using advanced AI models trained on millions of code repositories, it understands your requirements and generates clean, efficient, and maintainable code across multiple programming languages. Perfect for prototyping, learning, or accelerating development workflows.",
  },
  {
    title: "Creative Suite",
    description: "Generate images, music, and more with AI",
    icon: Wand2,
    demoUrl: "https://demo.toolz.digital/creative",
    longDescription: "The Creative Suite is your gateway to AI-powered digital creation. Combining multiple generative AI models, it enables you to create unique images, compose original music, and generate various forms of digital art. Whether you're a professional creator or just starting, our suite provides the tools to bring your creative vision to life.",
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