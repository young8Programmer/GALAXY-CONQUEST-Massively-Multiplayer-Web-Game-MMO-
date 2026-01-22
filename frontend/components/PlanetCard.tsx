'use client'

import { Planet } from '@/types'

interface PlanetCardProps {
  planet: Planet
  onSelect?: (planet: Planet) => void
}

export default function PlanetCard({ planet, onSelect }: PlanetCardProps) {
  return (
    <div
      className="bg-space-dark/80 backdrop-blur-sm rounded-lg p-4 border border-space-light/30 cursor-pointer hover:border-blue-500 transition"
      onClick={() => onSelect?.(planet)}
    >
      <h3 className="text-xl font-bold mb-2">{planet.name}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">System:</span>
          <span className="font-semibold">{planet.system}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Position:</span>
          <span className="font-semibold">{planet.position}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Level:</span>
          <span className="font-semibold">{planet.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Owner:</span>
          <span className="font-semibold">
            {planet.owner ? planet.owner.username : 'Unclaimed'}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-space-light/20">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-gray-400">Metal</p>
            <p className="font-semibold">{planet.metal?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-gray-400">Gas</p>
            <p className="font-semibold">{planet.gas?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-gray-400">Crystal</p>
            <p className="font-semibold">{planet.crystal?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
