import React, { useEffect, useRef } from 'react';

// Make adsbygoogle available on the window object for TypeScript
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

interface AdsenseAdProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
}

export const AdsenseAd: React.FC<AdsenseAdProps> = ({ slot, style = { display: 'block' }, className = '' }) => {
  const adPushed = useRef(false);

  useEffect(() => {
    // Prevent pushing the ad twice in React 18 Strict Mode (dev)
    if (adPushed.current) {
      return;
    }

    try {
      // Check if adsbygoogle is loaded and push the ad
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushed.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [slot]);

  return (
    // The wrapper gives the ad a predictable space on the page.
    // min-h-[90px] ensures it has a height even before the ad loads, preventing the availableWidth=0 error.
    <div className={`my-8 w-full max-w-4xl flex justify-center min-h-[90px] ${className}`}>
      <ins
        className="adsbygoogle w-full"
        style={style}
        data-ad-client="ca-pub-5173549373434570"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};
