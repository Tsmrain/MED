import { useEffect, useRef } from 'react';

interface SwipeGestureProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  threshold?: number;
}

export function useSwipeGesture({ 
  onSwipeRight, 
  onSwipeLeft, 
  threshold = 50 
}: SwipeGestureProps) {
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchEnd.current = null;
      touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;

      const distance = touchEnd.current - touchStart.current;
      const isSwipe = Math.abs(distance) > threshold;

      if (isSwipe) {
        if (distance > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (distance < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      touchStart.current = null;
      touchEnd.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeRight, onSwipeLeft, threshold]);
}