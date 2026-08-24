"use client"

import { Button } from '@/vibes/soul/primitives/button';
import { ArrowRight, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  ax: number
  ay: number
  mass: number
  radius: number
  color: string
  trail: { x: number; y: number; opacity: number }[]
  bounceCount: number
}


    export function ScientificHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [particles, setParticles] = useState<Particle[]>([])

  // Physics constants
  const GRAVITY = 0.3
  const FRICTION = 0.99
  const BOUNCE_DAMPING = 0.7
  const TRAIL_LENGTH = 15

  // Initialize particles
  const createParticles = (): Particle[] => {
    const colors = [
      "#3B82F6", // blue
      "#8B5CF6", // purple
      "#06B6D4", // cyan
      "#10B981", // green
      "#F59E0B", // orange
      "#EC4899", // pink
      "#6366F1", // indigo
      "#14B8A6", // teal
      "#EF4444", // red
      "#F59E0B", // yellow
    ]

    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * (dimensions.width - 100) + 50,
      y: Math.random() * (dimensions.height - 200) + 50,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      ax: 0,
      ay: GRAVITY,
      mass: Math.random() * 3 + 1,
      radius: Math.random() * 15 + 8,
      color: colors[i % colors.length],
      trail: [],
      bounceCount: 0,
    }))
  }

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Initialize particles when dimensions are available
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setParticles(createParticles())
    }
  }, [dimensions])

  // Physics simulation
  useEffect(() => {
    if (!particles.length || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setParticles((prevParticles) => {
        return prevParticles.map((particle) => {
          const newParticle = { ...particle }

          // Apply gravity
          newParticle.ay = GRAVITY / newParticle.mass

          // Update velocity with acceleration
          newParticle.vx += newParticle.ax
          newParticle.vy += newParticle.ay

          // Apply friction
          newParticle.vx *= FRICTION
          newParticle.vy *= FRICTION

          // Update position with velocity
          newParticle.x += newParticle.vx
          newParticle.y += newParticle.vy

          // Boundary collisions with momentum conservation
          if (newParticle.x - newParticle.radius <= 0) {
            newParticle.x = newParticle.radius
            newParticle.vx = -newParticle.vx * BOUNCE_DAMPING
            newParticle.bounceCount++
          }
          if (newParticle.x + newParticle.radius >= canvas.width) {
            newParticle.x = canvas.width - newParticle.radius
            newParticle.vx = -newParticle.vx * BOUNCE_DAMPING
            newParticle.bounceCount++
          }
          if (newParticle.y - newParticle.radius <= 0) {
            newParticle.y = newParticle.radius
            newParticle.vy = -newParticle.vy * BOUNCE_DAMPING
            newParticle.bounceCount++
          }
          if (newParticle.y + newParticle.radius >= canvas.height - 100) {
            newParticle.y = canvas.height - 100 - newParticle.radius
            newParticle.vy = -newParticle.vy * BOUNCE_DAMPING
            newParticle.bounceCount++

            // Add some randomness on ground bounce
            if (Math.random() < 0.1) {
              newParticle.vx += (Math.random() - 0.5) * 2
            }
          }

          // Update trail
          newParticle.trail.unshift({
            x: newParticle.x,
            y: newParticle.y,
            opacity: 1,
          })

          // Limit trail length and fade
          newParticle.trail = newParticle.trail.slice(0, TRAIL_LENGTH).map((point, index) => ({
            ...point,
            opacity: 1 - index / TRAIL_LENGTH,
          }))

          // Reset particle if it's been bouncing too much (add some chaos)
          if (newParticle.bounceCount > 20 && Math.random() < 0.02) {
            newParticle.x = Math.random() * (canvas.width - 100) + 50
            newParticle.y = 50
            newParticle.vx = (Math.random() - 0.5) * 6
            newParticle.vy = Math.random() * 2
            newParticle.bounceCount = 0
            newParticle.trail = []
          }

          return newParticle
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particles.length, dimensions])

  // Render particles on canvas
  useEffect(() => {
    if (!canvasRef.current || !particles.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      // Draw trail
      particle.trail.forEach((point, index) => {
        if (index === 0) return // Skip current position

        const radius = particle.radius * (1 - index / TRAIL_LENGTH) * 0.8
        const opacity = point.opacity * 0.6

        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)

        // Convert hex color to rgba
        const hex = particle.color.replace("#", "")
        const r = Number.parseInt(hex.substr(0, 2), 16)
        const g = Number.parseInt(hex.substr(2, 2), 16)
        const b = Number.parseInt(hex.substr(4, 2), 16)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        ctx.filter = "blur(2px)"
        ctx.fill()
        ctx.filter = "none"
      })

      // Draw main particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.fill()

      // Add glow effect
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius + 2, 0, Math.PI * 2)
      const hex = particle.color.replace("#", "")
      const r = Number.parseInt(hex.substr(0, 2), 16)
      const g = Number.parseInt(hex.substr(2, 2), 16)
      const b = Number.parseInt(hex.substr(4, 2), 16)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`
      ctx.filter = "blur(4px)"
      ctx.fill()
      ctx.filter = "none"

      // Draw velocity indicator (optional - shows direction)
      if (Math.abs(particle.vx) > 0.5 || Math.abs(particle.vy) > 0.5) {
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(particle.x + particle.vx * 10, particle.y + particle.vy * 10)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }, [particles])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Physics-based Particle Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ width: dimensions.width, height: dimensions.height }}
      />

      {/* Scientific Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 800">
          <line
            x1="160"
            y1="160"
            x2="320"
            y2="256"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1"
            className="animate-pulse"
          />
          <line
            x1="320"
            y1="256"
            x2="480"
            y2="320"
            stroke="rgba(168, 85, 247, 0.2)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <line
            x1="800"
            y1="200"
            x2="600"
            y2="400"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <line
            x1="200"
            y1="600"
            x2="400"
            y2="500"
            stroke="rgba(6, 182, 212, 0.2)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <line
            x1="900"
            y1="400"
            x2="700"
            y2="600"
            stroke="rgba(251, 146, 60, 0.2)"
            strokeWidth="1"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-100/50"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Scientific Innovation Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Advancing Science Through
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Data & Discovery
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Harness the power of advanced analytics, machine learning, and collaborative research tools to accelerate
            scientific breakthroughs and drive innovation forward.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              Start Research
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 group bg-white"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-500">Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-500">Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">50M+</div>
              <div className="text-gray-500">Data Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  )
}
