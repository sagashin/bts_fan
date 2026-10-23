'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Sparkles, Star } from 'lucide-react';

export interface ParticleBurst {
  id: number;
  label?: string;
}

interface BorahaeParticlesProps {
  burst: ParticleBurst | null;
}

const PARTICLE_VECTORS = [
  { x: -110, y: -150, scale: 1.15, rotate: -25, type: 'heart', color: 'text-purple-600 fill-purple-500' },
  { x: -65, y: -195, scale: 0.9, rotate: 15, type: 'star', color: 'text-amber-400 fill-amber-300' },
  { x: -20, y: -175, scale: 1.3, rotate: -10, type: 'heart', color: 'text-violet-600 fill-violet-500' },
  { x: 30, y: -200, scale: 1.1, rotate: 20, type: 'sparkle', color: 'text-fuchsia-500' },
  { x: 80, y: -165, scale: 1.25, rotate: 30, type: 'heart', color: 'text-purple-500 fill-purple-400' },
  { x: 120, y: -135, scale: 0.95, rotate: -20, type: 'star', color: 'text-amber-400 fill-amber-300' },
  { x: -95, y: -95, scale: 0.85, rotate: -35, type: 'sparkle', color: 'text-violet-400' },
  { x: 95, y: -85, scale: 1.05, rotate: 25, type: 'heart', color: 'text-pink-500 fill-pink-400' },
  { x: -45, y: -125, scale: 1.0, rotate: 12, type: 'heart', color: 'text-fuchsia-600 fill-fuchsia-500' },
  { x: 50, y: -130, scale: 0.9, rotate: -18, type: 'star', color: 'text-amber-300 fill-amber-200' },
];

export function BorahaeParticles({ burst }: BorahaeParticlesProps) {
  return (
    <AnimatePresence>
      {burst && (
        <div
          key={burst.id}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          {PARTICLE_VECTORS.map((vec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 0, y: 40, scale: 0.3, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: vec.x,
                y: vec.y,
                scale: [0.4, vec.scale, vec.scale * 0.9],
                rotate: vec.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.35,
                delay: idx * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`absolute ${vec.color}`}
            >
              {vec.type === 'heart' && <Heart className="h-6 w-6" />}
              {vec.type === 'star' && <Star className="h-5 w-5" />}
              {vec.type === 'sparkle' && <Sparkles className="h-6 w-6" />}
            </motion.div>
          ))}

          {burst.label && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: [0, 1, 1, 0], y: -40, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-purple-200/80 bg-white/95 px-5 py-2.5 text-sm font-semibold text-purple-900 shadow-xl backdrop-blur-md"
            >
              {burst.label}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
