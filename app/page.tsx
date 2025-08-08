'use client'

import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text3D, Environment } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Heart, Baby, Sparkles } from 'lucide-react'
import * as THREE from 'three'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function FloatingShape({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const particlesRef = React.useRef<THREE.Points>(null)
  
  const particles = React.useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ] as [number, number, number]
      })
    }
    return temp
  }, [])

  React.useEffect(() => {
    if (particlesRef.current) {
      const positions = new Float32Array(particles.length * 3)
      particles.forEach((particle, i) => {
        positions[i * 3] = particle.position[0]
        positions[i * 3 + 1] = particle.position[1]
        positions[i * 3 + 2] = particle.position[2]
      })
      particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    }
  }, [particles])

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial color="#ffd700" size={0.05} sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

function Scene3D() {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffd700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff69b4" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ParticleField />
      
      <FloatingShape position={[-4, 2, -2]} color="#ff69b4" scale={0.8} />
      <FloatingShape position={[4, -2, -3]} color="#87ceeb" scale={1.2} />
      <FloatingShape position={[2, 3, -1]} color="#ffd700" scale={0.6} />
      <FloatingShape position={[-3, -1, -4]} color="#98fb98" scale={1} />
      <FloatingShape position={[0, -3, -2]} color="#dda0dd" scale={0.9} />
      
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={0.6}
          height={0.15}
          position={[0, 1, 0]}
          rotation={[0, 0, 0]}
        >
          {'Welcome Baby'}
          <meshStandardMaterial color="#ff69b4" />
        </Text3D>
      </Float>
    </>
  )
}

export default function BabyCountdown() {
  const [dueDate, setDueDate] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isSet, setIsSet] = useState(false)
  const [babyName, setBabyName] = useState<string>('')

  useEffect(() => {
    if (!isSet || !dueDate) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      // Set target to beginning of the due date
      const target = new Date(dueDate + 'T00:00:00').getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [dueDate, isSet])

  const handleSetCountdown = () => {
    if (dueDate) {
      setIsSet(true)
    }
  }

  const resetCountdown = () => {
    setIsSet(false)
    setDueDate('')
    setBabyName('')
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene3D />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {!isSet ? (
            <Card className="backdrop-blur-md bg-white/20 border-white/30 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2 font-['Inter',_'system-ui',_sans-serif] tracking-tight">
                  <Baby className="text-pink-500" size={40} />
                  Baby Countdown
                  <Heart className="text-red-500" size={40} />
                </CardTitle>
                <p className="text-lg text-gray-700 mt-2">
                  Set up your magical countdown to meet your little miracle
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="babyName" className="text-lg font-semibold text-gray-700">
                    Baby's Name (Optional)
                  </Label>
                  <Input
                    id="babyName"
                    type="text"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    placeholder="Enter baby's name or leave blank"
                    className="text-lg p-3 backdrop-blur-sm bg-white/50 border-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-lg font-semibold text-gray-700">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="text-lg p-3 backdrop-blur-sm bg-white/50 border-white/50"
                  />
                </div>
                <Button 
                  onClick={handleSetCountdown}
                  disabled={!dueDate}
                  className="w-full text-lg py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg"
                >
                  <Sparkles className="mr-2" size={20} />
                  Start the Magic Countdown
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center space-y-8">
              <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 shadow-2xl border-white/30">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 font-['Inter',_'system-ui',_sans-serif] tracking-tight">
                  {babyName ? `${babyName} is Coming!` : 'Baby is Coming!'}
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                  The most beautiful countdown has begun ✨
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 border-white/40">
                    <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2 font-['JetBrains_Mono',_'Consolas',_monospace] tracking-wider">
                      {timeLeft.days}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">Days</div>
                  </div>
                  <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 border-white/40">
                    <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2 font-['JetBrains_Mono',_'Consolas',_monospace] tracking-wider">
                      {timeLeft.hours}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">Hours</div>
                  </div>
                  <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 border-white/40">
                    <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 font-['JetBrains_Mono',_'Consolas',_monospace] tracking-wider">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">Minutes</div>
                  </div>
                  <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 border-white/40">
                    <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2 font-['JetBrains_Mono',_'Consolas',_monospace] tracking-wider">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-lg font-semibold text-gray-700">Seconds</div>
                  </div>
                </div>

                {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
                  <div className="text-6xl animate-pulse">
                    🎉 Welcome to the world, little one! 🎉
                  </div>
                )}
              </div>

              <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl border-white/30">
                <p className="text-lg text-gray-700 mb-4">
                  Every moment brings you closer to holding your precious miracle. 
                  This journey of love and anticipation is just the beginning of the most 
                  beautiful adventure of your life. 💕
                </p>
                <Button 
                  onClick={resetCountdown}
                  variant="outline"
                  className="backdrop-blur-sm bg-white/30 border-white/50 hover:bg-white/40"
                >
                  Reset Countdown
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
