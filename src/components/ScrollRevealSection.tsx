'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollRevealSection({
  children,
  className = '',
}: ScrollRevealSectionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always keep visible so content is never hidden
    setIsVisible(true);
  }, []);

  return (
    <div
      ref={domRef}
      className={`w-full opacity-100 ${className}`}
    >
      {children}
    </div>
  );
}
