import { useEffect, useRef } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export function CursorGlow() {
  const pos = useMousePosition();
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const isInteractive = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      if (el === document.body) return false;
      const tag = el.tagName;
      if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return true;
      if (el.closest('a') || el.closest('button') || el.closest('[data-cursor-hover]')) return true;
      if (el.getAttribute('role') === 'button') return true;
      return false;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current = isInteractive(target);
      if (cursorRef.current) {
        cursorRef.current.classList.toggle('hovering', isHovering.current);
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;
    const x = (pos.x / 100) * window.innerWidth;
    const y = (pos.y / 100) * window.innerHeight;
    cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [pos]);

  // Hide cursor on touch devices
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch && cursorRef.current) {
      cursorRef.current.style.display = 'none';
    }
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <div className="custom-cursor-dot" />
      <div className="custom-cursor-ring" />
    </div>
  );
}
