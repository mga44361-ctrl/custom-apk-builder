import React from 'react';
import PhoneFrame from './PhoneFrame';

const WebViewTemplate: React.FC = () => {
  return (
    <PhoneFrame>
      <header className="h-10 bg-primary/10 border-b border-border flex items-center px-3">
        <div className="h-3 w-14 rounded bg-primary/40" />
      </header>
      <main className="h-[calc(100%-72px)] bg-muted/30">
        <div className="h-full w-full flex items-center justify-center">
          <div className="h-24 w-24 rounded-xl bg-primary/20 border border-primary/20" />
        </div>
      </main>
      <footer className="h-8 bg-card border-t border-border flex items-center justify-center text-xs text-muted-foreground">
        WebView
      </footer>
    </PhoneFrame>
  );
};

export default WebViewTemplate;
