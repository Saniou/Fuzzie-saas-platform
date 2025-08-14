'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SparklesCore } from './sparkles'

export function LampComponent() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
        className="mt-20 bg-gradient-to-br from-neutral-300 to-neutral-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Plans That
        <br /> Fit You Best
      </motion.h1>
    </LampContainer>
  )
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'relative flex min-h-[800px] flex-col items-center justify-center overflow-hidden w-screen z-0 bg-transparent',
        className
      )}
    >
      <div className="relative flex w-full flex-1 items-center justify-center isolate z-0">

        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            WebkitMaskImage:
              'radial-gradient(120% 100% at 50% 0%, #000 35%, rgba(0,0,0,0) 75%)',
            maskImage:
              'radial-gradient(120% 100% at 50% 0%, #000 35%, rgba(0,0,0,0) 75%)',
            pointerEvents: 'none',
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] bg-gradient-conic from-neutral-500 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
        />

        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            WebkitMaskImage:
              'radial-gradient(120% 100% at 50% 0%, #000 35%, rgba(0,0,0,0) 75%)',
            maskImage:
              'radial-gradient(120% 100% at 50% 0%, #000 35%, rgba(0,0,0,0) 75%)',
            pointerEvents: 'none',
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-neutral-500 [--conic-position:from_290deg_at_center_top]"
        />

        <div
          className="absolute -translate-y-2 pointer-events-none"
          style={{
            top: '50%',
            width: '42rem',
            height: '11rem',
            borderRadius: '9999px',
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(90px)',
            WebkitMaskImage:
              'radial-gradient(120% 85% at 50% 55%, #000 45%, rgba(0,0,0,0) 80%)',
            maskImage:
              'radial-gradient(120% 85% at 50% 55%, #000 45%, rgba(0,0,0,0) 80%)',
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            transform: 'translateY(2.5rem) scaleX(1.4)',
            width: '100%',
            height: '18rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.08)',
            filter: 'blur(120px)',
            WebkitMaskImage:
              'radial-gradient(85% 70% at 50% 50%, #000 35%, rgba(0,0,0,0) 80%)',
            maskImage:
              'radial-gradient(85% 70% at 50% 50%, #000 35%, rgba(0,0,0,0) 80%)',
          }}
        />

        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 -translate-y-[6rem] pointer-events-none"
          style={{
            height: '9rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.35)',
            filter: 'blur(70px)',
          }}
        />

        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 -translate-y-[7rem] pointer-events-none"
          style={{
            height: '2px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.6)',
            filter: 'blur(3px)',
          }}
        />

        <div className="w-[40rem] h-40 relative pointer-events-none">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  )
}
