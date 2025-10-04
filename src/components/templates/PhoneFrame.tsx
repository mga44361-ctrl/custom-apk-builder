import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="w-full max-w-[200px] mx-auto">
      <div className="aspect-[9/19] rounded-3xl border border-border bg-card overflow-hidden shadow">
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;
