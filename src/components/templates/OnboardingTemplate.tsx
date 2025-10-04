import React from 'react';
import PhoneFrame from './PhoneFrame';

const OnboardingTemplate: React.FC = () => {
  return (
    <PhoneFrame>
      <main className="h-full bg-gradient-to-b from-primary/20 to-secondary/20 flex flex-col items-center justify-center gap-3">
        <div className="h-16 w-16 rounded-2xl bg-primary/30 border border-primary/20 shadow" />
        <div className="h-3 w-24 rounded bg-foreground/20" />
        <div className="h-3 w-36 rounded bg-foreground/10" />
        <div className="flex gap-1 mt-2">
          <span className="h-1.5 w-4 rounded-full bg-primary" />
          <span className="h-1.5 w-2 rounded-full bg-foreground/20" />
          <span className="h-1.5 w-2 rounded-full bg-foreground/20" />
        </div>
      </main>
    </PhoneFrame>
  );
};

export default OnboardingTemplate;
