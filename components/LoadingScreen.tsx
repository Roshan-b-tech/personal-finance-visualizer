"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set initial states
    gsap.set([logoRef.current, textRef.current], { opacity: 0, y: 20 });
    gsap.set(cardsRef.current, { opacity: 0, scale: 0.8 });

    // Create timeline
    const tl = gsap.timeline();

    // Animate logo
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      // Animate text
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")
      // Animate cards with stagger
      .to(cardsRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
      }, "-=0.2");

    // Add continuous pulse animation to cards
    gsap.to(cardsRef.current, {
      scale: 1.02,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: {
        amount: 0.5,
        from: "random",
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-blue-50/80 to-white dark:from-blue-950 dark:via-blue-950/80 dark:to-background"
    >
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div
                ref={logoRef}
                className="h-10 w-64 bg-blue-100 dark:bg-blue-900/50 rounded-lg"
              />
              <div
                ref={textRef}
                className="h-6 w-96 bg-blue-50 dark:bg-blue-900/30 rounded-lg mt-2"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-24 w-48 bg-blue-100 dark:bg-blue-900/50 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el as HTMLDivElement)}
              className="p-4 md:p-6 bg-gradient-to-br from-blue-500/5 to-transparent border-blue-100 dark:border-blue-900 shadow-md rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-blue-100 dark:bg-blue-900/50 rounded" />
                  <div className="h-8 w-32 bg-blue-200 dark:bg-blue-800/50 rounded" />
                </div>
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i + 3] = el as HTMLDivElement)}
              className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm rounded-lg"
            >
              <div className="h-8 w-48 bg-blue-100 dark:bg-blue-900/50 rounded-lg mb-6" />
              <div className="h-[300px] bg-blue-50 dark:bg-blue-900/30 rounded" />
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div
            ref={(el) => (cardsRef.current[5] = el as HTMLDivElement)}
            className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm rounded-lg"
          >
            <div className="h-8 w-48 bg-blue-100 dark:bg-blue-900/50 rounded-lg mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-blue-50 dark:bg-blue-900/30 rounded"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div
          ref={(el) => (cardsRef.current[6] = el as HTMLDivElement)}
          className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm rounded-lg overflow-x-auto"
        >
          <div className="h-8 w-48 bg-blue-100 dark:bg-blue-900/50 rounded-lg mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-blue-50 dark:bg-blue-900/30 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 