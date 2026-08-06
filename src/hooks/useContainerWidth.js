import { useState, useRef, useLayoutEffect } from "react";

export function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(1050);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const measure = () => setWidth(ref.current.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}