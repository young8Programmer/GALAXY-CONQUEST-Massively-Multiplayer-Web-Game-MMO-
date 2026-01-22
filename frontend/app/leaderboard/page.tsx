'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

export default function LeaderboardPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [rating, setRating] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [alliances, setAlliances] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'rating' | 'resources' | 'alliances'>('rating')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchLeaderboards()
  }, [isAuthenticated, router])

  const fetchLeaderboards = async () => {
    try {
      const [ratingData, resourcesData, alliancesData] = await Promise.all([
        api.get('/leaderboard/rating'),
        api.get('/leaderboard/resources'),
        api.get('/leaderboard/alliances'),
      ])

      setRating(ratingData.data)
      setResources(resourcesData.data)
      setAlliances(alliancesData.data)
    } catch (error) {
      console.error('Failed to fetch leaderboards:', error)
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

  const renderTable = (data: any[], columns: string[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-space-light/30">
              {columns.map((col) => (
                <th key={col} className="text-left p-4 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.userId || item.allianceId || index}
                className="border-b border-space-light/10 hover:bg-space-light/10 transition"
              >
                <td className="p-4">
                  <span className="font-bold text-blue-400">#{item.rank}</span>
                </td>
                <td className="p-4 font-semibold">
                  {item.username || item.name}
                </td>
                {columns.slice(2).map((col) => (
                  <td key={col} className="p-4">
                    {item[col.toLowerCase()]?.toLocaleString() || item[col.toLowerCase()]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🏆 Leaderboards</h1>
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition"
          >
            Back to Dashboard
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('rating')}
            className={`px-6 py-2 rounded transition ${
              activeTab === 'rating'
                ? 'bg-blue-600 text-white'
                : 'bg-space-dark/80 text-gray-400 hover:text-white'
            }`}
          >
            Rating
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-2 rounded transition ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white'
                : 'bg-space-dark/80 text-gray-400 hover:text-white'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('alliances')}
            className={`px-6 py-2 rounded transition ${
              activeTab === 'alliances'
                ? 'bg-blue-600 text-white'
                : 'bg-space-dark/80 text-gray-400 hover:text-white'
            }`}
          >
            Alliances
          </button>
        </div>

        {/* Content */}
        <div className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-6 border border-space-light/30">
          {activeTab === 'rating' &&
            renderTable(rating, ['Rank', 'Username', 'Rating', 'Level'])}
          {activeTab === 'resources' &&
            renderTable(resources, ['Rank', 'Username', 'Total Resources', 'Metal', 'Gas', 'Crystal'])}
          {activeTab === 'alliances' &&
            renderTable(alliances, ['Rank', 'Name', 'Score', 'Members'])}
        </div>
      </div>
    </div>
  )
}
