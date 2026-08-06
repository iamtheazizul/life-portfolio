import { useState, useEffect, useRef } from "react";

export function useAnimatedPoints(target) {
  const [current, setCurrent] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(null);
  const frameRef = useRef();
  const key = target.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join("|");

  useEffect(() => {
    fromRef.current = current;
    startRef.current = null;
    const DURATION = 420;

    const step = (now) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);

      setCurrent(
        target.map((p, i) => {
          const f = fromRef.current[i] || p;
          return {
            x: f.x + (p.x - f.x) * eased,
            y: f.y + (p.y - f.y) * eased,
          };
        })
      );

      if (t < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // `current` state only catches up to `target` once the animation effect's
  // rAF callback fires — which happens *after* render. If `target` grows
  // (e.g. milestones arrive from Contentful after mount, going from 0 to N
  // items), there's a render in between where `current` is still the old,
  // shorter array. Returning `current` directly there gives callers
  // `positions[i] === undefined` for the new indices.
  //
  // Patch the returned array at render time so it's always the same length
  // as `target`, immediately — any index missing an animated value just
  // starts at its target position (appears without animating in), which is
  // the same "new point" behavior the animation loop itself falls back to.
  if (current.length !== target.length) {
    return target.map((p, i) => current[i] || p);
  }

  return current;
}