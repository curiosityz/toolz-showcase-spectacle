import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Hero from "@/components/Hero";
import ToolShowcase from "@/components/ToolShowcase";
import { Button } from "@/components/ui/button";

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
  );
};

export default Index;