'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { connectWebSocket } from '@/lib/websocket'
import api from '@/lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, accessToken } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (accessToken) {
      connectWebSocket(accessToken)
    }

    fetchStats()
  }, [isAuthenticated, router, accessToken])

  const fetchStats = async () => {
    try {
      const [userData, planets, fleets] = await Promise.all([
        api.get('/users/me'),
        api.get('/planets/my'),
        api.get('/fleets/my'),
      ])

      setStats({
        user: userData.data,
        planets: planets.data,
        fleets: fleets.data,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🌌 Galaxy Conquest</h1>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🌌 Galaxy Conquest</h1>
            <p className="text-gray-400">Welcome back, {user?.username}!</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/map"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
            >
              View Map
            </Link>
            <button
              onClick={() => {
                logout()
                router.push('/auth/login')
              }}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
            <h3 className="text-lg font-semibold mb-2">Level</h3>
            <p className="text-3xl font-bold text-blue-400">{stats?.user?.level || 1}</p>
          </div>

          <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
            <h3 className="text-lg font-semibold mb-2">Rating</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats?.user?.rating || 1000}</p>
          </div>

          <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
            <h3 className="text-lg font-semibold mb-2">Planets</h3>
            <p className="text-3xl font-bold text-green-400">{stats?.planets?.length || 0}</p>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30 mb-8">
          <h2 className="text-2xl font-bold mb-4">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 mb-1">Metal</p>
              <p className="text-2xl font-bold">{stats?.user?.metal?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Gas</p>
              <p className="text-2xl font-bold">{stats?.user?.gas?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Crystal</p>
              <p className="text-2xl font-bold">{stats?.user?.crystal?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* Planets & Fleets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
            <h2 className="text-2xl font-bold mb-4">My Planets</h2>
            {stats?.planets?.length > 0 ? (
              <div className="space-y-2">
                {stats.planets.map((planet: any) => (
                  <div
                    key={planet.id}
                    className="bg-space-darker p-4 rounded border border-space-light/20"
                  >
                    <p className="font-semibold">{planet.name}</p>
                    <p className="text-sm text-gray-400">
                      System {planet.system}, Position {planet.position}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No planets yet</p>
            )}
          </div>

          <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
            <h2 className="text-2xl font-bold mb-4">My Fleets</h2>
            {stats?.fleets?.length > 0 ? (
              <div className="space-y-2">
                {stats.fleets.map((fleet: any) => (
                  <div
                    key={fleet.id}
                    className="bg-space-darker p-4 rounded border border-space-light/20"
                  >
                    <p className="font-semibold">{fleet.name}</p>
                    <p className="text-sm text-gray-400">Status: {fleet.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No fleets yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
