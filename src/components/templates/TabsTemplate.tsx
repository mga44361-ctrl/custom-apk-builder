import React from 'react';
import PhoneFrame from './PhoneFrame';

const TabsTemplate: React.FC = () => {
  return (
    <PhoneFrame>
      <header className="h-10 bg-card border-b border-border flex items-center px-3">
        <div className="h-3 w-20 rounded bg-foreground/20" />
      </header>
      <main className="h-[calc(100%-72px)] bg-muted/30 p-3 space-y-2">
        <div className="h-16 rounded-lg bg-background border border-border" />
        <div className="h-16 rounded-lg bg-background border border-border" />
        <div className="h-16 rounded-lg bg-background border border-border" />
      </main>
      <nav className="h-8 bg-card border-t border-border grid grid-cols-3">
        <div className="flex items-center justify-center text-xs text-primary">•</div>
        <div className="flex items-center justify-center text-xs text-muted-foreground">•</div>
        <div className="flex items-center justify-center text-xs text-muted-foreground">•</div>
      </nav>
    </PhoneFrame>
  );
};

export default TabsTemplate;
