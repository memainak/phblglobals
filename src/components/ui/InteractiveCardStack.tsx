'use client';

/**
 * InteractiveCardStack Component
 * A premium, smooth, and interactive card stack with drag-to-back physics.
 * Supports random rotation, autoplay, and mobile interactions.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from 'framer-motion';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [25, -25]);
  const rotateY = useTransform(x, [-100, 100], [-25, 25]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
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
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none touch-pan-y"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export interface InteractiveCardStackProps {
  /** Array of card contents */
  cards?: React.ReactNode[];
  /** Enable random rotation for each card */
  randomRotation?: boolean;
  /** Sensitivity for the drag-to-back action (pixels) */
  sensitivity?: number;
  /** Whether clicking a card sends it to the back */
  sendToBackOnClick?: boolean;
  /** Spring animation configuration */
  animationConfig?: { stiffness: number; damping: number };
  /** Enable automatic cycling of cards */
  autoplay?: boolean;
  /** Delay between cycles in milliseconds */
  autoplayDelay?: number;
  /** Pause autoplay when hovering */
  pauseOnHover?: boolean;
  /** Disable drag on mobile devices and only allow clicks */
  mobileClickOnly?: boolean;
  /** Viewport width breakpoint for mobile detection */
  mobileBreakpoint?: number;
  /** Custom class for the container */
  className?: string;
  /** Callback on active card change */
  onCycle?: (index: number) => void;
}

export function InteractiveCardStack({
  cards = [],
  randomRotation = false,
  sensitivity = 160,
  sendToBackOnClick = true,
  animationConfig = { stiffness: 260, damping: 22 },
  autoplay = false,
  autoplayDelay = 3500,
  pauseOnHover = true,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  className = '',
  onCycle,
}: InteractiveCardStackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize stack with IDs to track items correctly
  const [stack, setStack] = useState<
    { id: string; content: React.ReactNode; originalIndex: number; randomRot: number }[]
  >([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  useEffect(() => {
    if (cards.length > 0) {
      setStack(
        cards.map((content, index) => ({
          id: `card-${index}-${Date.now()}`,
          content,
          originalIndex: index,
          randomRot: randomRotation ? Math.random() * 8 - 4 : 0,
        }))
      );
    }
  }, [cards, randomRotation]);

  const sendToBack = useCallback(
    (id: string) => {
      setStack((prev) => {
        const index = prev.findIndex((card) => card.id === id);
        if (index === -1) return prev;

        const newStack = [...prev];
        const [card] = newStack.splice(index, 1);

        const updatedCard = {
          ...card,
          randomRot: randomRotation ? Math.random() * 8 - 4 : 0,
        };

        newStack.unshift(updatedCard);

        if (onCycle && newStack.length > 0) {
          const topCard = newStack[newStack.length - 1];
          onCycle(topCard.originalIndex);
        }

        return newStack;
      });
    },
    [randomRotation, onCycle]
  );

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused, sendToBack]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

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

          return (
            <CardRotate
              key={card.id}
              onSendToBack={() => sendToBack(card.id)}
              sensitivity={sensitivity}
              disableDrag={!isTop || shouldDisableDrag}
            >
              <motion.div
                className="rounded-3xl overflow-hidden w-full h-full bg-white border border-[rgba(18,21,15,0.12)] shadow-[0_25px_60px_rgba(0,0,0,0.14)] select-none"
                onClick={() => isTop && shouldEnableClick && sendToBack(card.id)}
                style={{
                  zIndex: index,
                }}
                animate={{
                  rotateZ: depth * -2.5 + card.randomRot,
                  scale: Math.max(0.85, 1 - depth * 0.045),
                  y: depth * -12,
                  opacity: Math.max(0.4, 1 - depth * 0.16),
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
    </div>
  );
}

export default InteractiveCardStack;
