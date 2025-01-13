import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial visibility
      if (titleRef.current) titleRef.current.style.visibility = 'visible';
      if (subtitleRef.current) subtitleRef.current.style.visibility = 'visible';

      // Animate title
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play none none reverse",
        }
      });

      // Animate subtitle
      gsap.from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play none none reverse",
        }
      });

      // Parallax effect on scroll
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: (i, target) => -target.offsetHeight * 0.2,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-toolz-dark"
      style={{
        backgroundImage: "url('/lovable-uploads/ff3fb685-3a6e-47b0-9b28-66dc82e1ed7d.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-toolz-dark/90" />
      
      {/* Floating hexagons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div
              className="w-32 h-32 border-2 border-toolz-blue/30 rotate-45 animate-glow"
              style={{
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <img
          src="/lovable-uploads/6094eacd-d288-4c7b-b2d7-88247cfcfd15.png"
          alt="TOOLZ.digital"
          className="w-64 mx-auto mb-8 animate-float"
        />
        <h1
          ref={titleRef}
          className="text-6xl md:text-7xl font-bold text-white mb-6"
          style={{ visibility: 'hidden' }}
        >
          The Future of AI Tools
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          style={{ visibility: 'hidden' }}
        >
          Discover our suite of powerful LLM-powered tools designed to revolutionize your workflow
        </p>
      </div>
    </div>
  );
};

export default Hero;