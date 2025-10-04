import React from 'react';
import PhoneFrame from './PhoneFrame';

const DrawerTemplate: React.FC = () => {
  return (
    <PhoneFrame>
      <header className="h-10 bg-card border-b border-border flex items-center px-3 gap-2">
        <div className="h-3 w-3 rounded-sm bg-foreground/40" />
        <div className="h-3 w-24 rounded bg-foreground/20" />
      </header>
      <div className="relative h-[calc(100%-40px)]">
        <aside className="absolute inset-y-0 left-0 w-20 bg-muted/40 border-r border-border" />
        <main className="h-full bg-background ml-20 p-3">
          <div className="h-full rounded-lg border border-border" />
        </main>
      </div>
    </PhoneFrame>
  );
};

export default DrawerTemplate;
