import { useEffect } from "react";

export function useScrollProgress(trailRef, onProgress) {
  useEffect(() => {
    const onScroll = () => {
      if (!trailRef.current) return;
      const rect = trailRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const traveled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      onProgress(total ? traveled / total : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [trailRef, onProgress]);
}