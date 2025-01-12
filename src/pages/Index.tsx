import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Hero from "@/components/Hero";
import ToolShowcase from "@/components/ToolShowcase";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

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
    <>
      <Helmet>
        <title>TOOLZ.digital - AI-Powered Tools for Modern Workflows</title>
        <meta name="description" content="Discover our suite of powerful LLM-powered tools designed to revolutionize your workflow. Featuring Landing Page Analyzer, Autonomous Research, and Social Experiment Lab." />
        <meta name="keywords" content="AI tools, landing page analysis, autonomous research, LLM experiments, workflow optimization" />
        <meta property="og:title" content="TOOLZ.digital - AI-Powered Tools" />
        <meta property="og:description" content="Suite of powerful LLM-powered tools designed to revolutionize your workflow" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://toolz.digital" />
      </Helmet>
      
      <div className="min-h-screen bg-toolz-dark text-white opacity-100">
        <Hero />
        <ToolShowcase />
        
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Button
              size="lg"
              className="bg-toolz-blue hover:bg-toolz-blue/80 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
            >
              Start Creating Now
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;