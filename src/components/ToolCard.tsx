import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

const ToolCard = ({ title, description, icon: Icon, delay = 0 }: ToolCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("ToolCard component useEffect triggered"); // Debugging log

    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none reverse",
      },
      y: 100,
      opacity: 0,
      duration: 1,
      delay,
      ease: "power4.out",
    });

    ScrollTrigger.refresh();
  }, [delay]);

  return (
    <Card
      ref={cardRef}
      className="relative overflow-hidden p-6 backdrop-blur-xl bg-white/10 border-toolz-blue/20 hover:border-toolz-blue/40 transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-toolz-blue/10 to-toolz-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <Icon className="w-8 h-8 mb-4 text-toolz-blue" />
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </Card>
  );
};

export default ToolCard;
