'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

export default function MapPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [planets, setPlanets] = useState<any[]>([])
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchPlanets()
  }, [isAuthenticated, router])

  const fetchPlanets = async () => {
    try {
      const response = await api.get('/planets')
      setPlanets(response.data)
      drawMap(response.data)
    } catch (error) {
      console.error('Failed to fetch planets:', error)
    }
  }

  const drawMap = (planetsData: any[]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 1200
    canvas.height = 800

    // Clear canvas
    ctx.fillStyle = '#0a0e27'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw stars background
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw planets
    planetsData.forEach((planet) => {
      const x = (planet.x / 100) * canvas.width
      const y = (planet.y / 100) * canvas.height

      // Planet circle
      ctx.fillStyle = planet.ownerId ? '#4ade80' : '#64748b'
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Planet name
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px sans-serif'
      ctx.fillText(planet.name, x + 12, y + 4)
    })

    // Add click handler
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      planetsData.forEach((planet) => {
        const planetX = (planet.x / 100) * canvas.width
        const planetY = (planet.y / 100) * canvas.height
        const distance = Math.sqrt(
          Math.pow(x - planetX, 2) + Math.pow(y - planetY, 2)
        )

        if (distance < 20) {
          setSelectedPlanet(planet)
        }
      })
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Galaxy Map</h1>
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
          >
            Back to Dashboard
          </a>
        </div>

        <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
          <canvas
            ref={canvasRef}
            className="w-full border border-space-light/20 rounded"
            style={{ background: '#0a0e27' }}
          />
        </div>

        {selectedPlanet && (
          <div className="mt-6 bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
            <h2 className="text-2xl font-bold mb-4">{selectedPlanet.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">System</p>
                <p className="text-xl font-semibold">{selectedPlanet.system}</p>
              </div>
              <div>
                <p className="text-gray-400">Position</p>
                <p className="text-xl font-semibold">{selectedPlanet.position}</p>
              </div>
              <div>
                <p className="text-gray-400">Owner</p>
                <p className="text-xl font-semibold">
                  {selectedPlanet.owner ? selectedPlanet.owner.username : 'Unclaimed'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Level</p>
                <p className="text-xl font-semibold">{selectedPlanet.level}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
