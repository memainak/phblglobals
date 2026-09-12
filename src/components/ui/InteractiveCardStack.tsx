'use client';

/**
 * InteractiveCardStack Component
 * A premium, smooth, and interactive card stack with drag-to-back and slide physics.
 * Features fluid Framer Motion animations, autoplay, responsive touch, and navigation controls.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: (direction?: number) => void;
  sensitivity: number;
  disableDrag?: boolean;
  isTop: boolean;
  isExiting: boolean;
  exitDirection: number;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
  isTop,
  isExiting,
  exitDirection,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);
  const isDragging = useRef(false);

  function handleDragStart() {
    isDragging.current = true;
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const isSwipeX = Math.abs(info.offset.x) > sensitivity || Math.abs(info.velocity.x) > 500;
    const isSwipeY = Math.abs(info.offset.y) > sensitivity || Math.abs(info.velocity.y) > 500;

    if (isSwipeX || isSwipeY) {
      const dir = info.offset.x < 0 ? -1 : 1;
      // Animate off-screen in swipe direction, then move to back
      onSendToBack(dir);
    } else {
      // Return to center smoothly
      x.set(0);
      y.set(0);
    }

    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  }

  // If exiting, animate card sliding out smoothly
  if (isExiting) {
    return (
      <motion.div
        className="absolute inset-0 select-none pointer-events-none"
        initial={{ x: 0, opacity: 1, rotateZ: 0 }}
        animate={{
          x: exitDirection * 380,
          y: 20,
          opacity: 0,
          rotateZ: exitDirection * 18,
          scale: 0.92,
        }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  if (disableDrag) {
    return (
      <motion.div className="absolute inset-0 select-none" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
      style={{ x, y, rotateX, rotateY }}
      drag={isTop ? true : false}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export interface InteractiveCardStackProps {
  /** Array of card contents */
  cards?: React.ReactNode[];
  /** Enable slight rotation variations for cards */
  randomRotation?: boolean;
  /** Distance in pixels a card must be dragged to trigger send-to-back */
  sensitivity?: number;
  /** Whether clicking anywhere on a card sends it to the back */
  sendToBackOnClick?: boolean;
  /** Framer Motion spring configuration */
  animationConfig?: { stiffness: number; damping: number };
  /** Enable automatic cycling of cards */
  autoplay?: boolean;
  /** Delay between cycles in milliseconds */
  autoplayDelay?: number;
  /** Pause autoplay when hovering */
  pauseOnHover?: boolean;
  /** Disable drag on mobile devices and only allow clicks/buttons */
  mobileClickOnly?: boolean;
  /** Viewport width breakpoint for mobile detection */
  mobileBreakpoint?: number;
  /** Show subtle navigation arrows on card edges */
  showArrows?: boolean;
  /** Custom class for the container */
  className?: string;
  /** Callback on active card change */
  onCycle?: (index: number) => void;
}

export function InteractiveCardStack({
  cards = [],
  randomRotation = true,
  sensitivity = 120,
  sendToBackOnClick = false,
  animationConfig = { stiffness: 280, damping: 24 },
  autoplay = true,
  autoplayDelay = 4000,
  pauseOnHover = true,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  showArrows = true,
  className = '',
  onCycle,
}: InteractiveCardStackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [exitDirection, setExitDirection] = useState(1);

  // Stack state holding items with their original index
  const [stack, setStack] = useState<
    { id: string; content: React.ReactNode; originalIndex: number; rot: number }[]
  >([]);

  // Track mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  // Sync cards into stack without resetting user's current progress if length matches
  useEffect(() => {
    if (cards.length > 0) {
      setStack((prev) => {
        if (prev.length === cards.length) {
          // Update contents in place without wiping current cycle order
          return prev.map((item) => ({
            ...item,
            content: cards[item.originalIndex] ?? item.content,
          }));
        }

        // Initialize fresh stack
        return cards.map((content, index) => {
          // Stable organic rotation between -3.5 and 3.5 deg
          const rot = randomRotation ? ((index % 3) - 1) * 2.5 : 0;
          return {
            id: `card-${index}`,
            content,
            originalIndex: index,
            rot,
          };
        });
      });
    }
  }, [cards, randomRotation]);

  // Send top card to the back with smooth exit slide
  const sendToBack = useCallback(
    (direction = 1) => {
      if (isTransitioning || stack.length <= 1) return;

      setIsTransitioning(true);
      setExitDirection(direction);

      // Allow 240ms for the slide animation to execute before rearranging the stack
      setTimeout(() => {
        setStack((prev) => {
          if (prev.length <= 1) return prev;

          const newStack = [...prev];
          const topCard = newStack.pop();

          if (topCard) {
            newStack.unshift(topCard);
          }

          if (onCycle && newStack.length > 0) {
            const nextTop = newStack[newStack.length - 1];
            onCycle(nextTop.originalIndex);
          }

          return newStack;
        });

        setIsTransitioning(false);
      }, 240);
    },
    [isTransitioning, stack.length, onCycle]
  );

  // Cycle backwards (brings back the previous card from the bottom of stack to the top)
  const cyclePrev = useCallback(() => {
    if (isTransitioning || stack.length <= 1) return;

    setIsTransitioning(true);
    setExitDirection(-1);

    setTimeout(() => {
      setStack((prev) => {
        if (prev.length <= 1) return prev;

        const newStack = [...prev];
        const bottomCard = newStack.shift();

        if (bottomCard) {
          newStack.push(bottomCard);
        }

        if (onCycle && newStack.length > 0) {
          const nextTop = newStack[newStack.length - 1];
          onCycle(nextTop.originalIndex);
        }

        return newStack;
      });

      setIsTransitioning(false);
    }, 200);
  }, [isTransitioning, stack.length, onCycle]);

  // Autoplay timer
  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused && !isTransitioning) {
      const timer = setTimeout(() => {
        sendToBack(1);
      }, autoplayDelay);
      return () => clearTimeout(timer);
    }
  }, [autoplay, autoplayDelay, stack.length, isPaused, isTransitioning, sendToBack]);

  const shouldDisableDrag = mobileClickOnly && isMobile;

  if (stack.length === 0) return null;

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{ perspective: 1200 }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <AnimatePresence>
        {stack.map((card, index) => {
          const isTop = index === stack.length - 1;
          const depth = stack.length - 1 - index;
          const isExiting = isTop && isTransitioning;

          return (
            <CardRotate
              key={card.id}
              onSendToBack={(dir) => sendToBack(dir ?? 1)}
              sensitivity={sensitivity}
              disableDrag={!isTop || shouldDisableDrag || isTransitioning}
              isTop={isTop}
              isExiting={isExiting}
              exitDirection={exitDirection}
            >
              <motion.div
                className="rounded-3xl overflow-hidden w-full h-full bg-white border border-[rgba(18,21,15,0.12)] shadow-[0_20px_50px_rgba(0,0,0,0.12)] select-none"
                onClick={(e) => {
                  // Only send to back if click wasn't on a link or button
                  const target = e.target as HTMLElement;
                  if (target.closest('a') || target.closest('button')) return;
                  if (isTop && sendToBackOnClick && !isTransitioning) {
                    sendToBack(1);
                  }
                }}
                style={{
                  zIndex: index,
                }}
                animate={{
                  rotateZ: depth * -2.2 + card.rot,
                  scale: Math.max(0.86, 1 - depth * 0.04),
                  y: depth * -10,
                  opacity: Math.max(0.45, 1 - depth * 0.15),
                  transformOrigin: 'center center',
                }}
                transition={{
                  type: 'spring',
                  stiffness: animationConfig.stiffness,
                  damping: animationConfig.damping,
                }}
              >
                {card.content}
              </motion.div>
            </CardRotate>
          );
        })}
      </AnimatePresence>

      {/* Edge Navigation Chevrons for Easy Sliding */}
      {showArrows && stack.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cyclePrev();
            }}
            disabled={isTransitioning}
            className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#12150F] hover:text-[#1F4D3A] shadow-md border border-[rgba(18,21,15,0.12)] backdrop-blur-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
            aria-label="Previous Slide"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sendToBack(1);
            }}
            disabled={isTransitioning}
            className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#12150F] hover:text-[#1F4D3A] shadow-md border border-[rgba(18,21,15,0.12)] backdrop-blur-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
            aria-label="Next Slide"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

export default InteractiveCardStack;
