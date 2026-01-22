export interface User {
  id: string
  username: string
  email: string
  level: number
  rating: number
  metal: number
  gas: number
  crystal: number
  allianceId?: string
  createdAt: string
  updatedAt: string
}

export interface Planet {
  id: string
  name: string
  ownerId?: string
  owner?: User
  x: number
  y: number
  system: number
  position: number
  level: number
  metal: number
  gas: number
  crystal: number
  metalMine: number
  gasMine: number
  crystalMine: number
  shipyard: number
  researchLab: number
  defenseStation: number
  createdAt: string
  updatedAt: string
}

export interface Fleet {
  id: string
  ownerId: string
  owner?: User
  name: string
  units: {
    fighter?: number
    bomber?: number
    cruiser?: number
    destroyer?: number
    battleship?: number
  }
  status: 'idle' | 'moving' | 'attacking' | 'returning'
  originPlanetId?: string
  destinationPlanetId?: string
  departureTime?: string
  arrivalTime?: string
  returnTime?: string
  createdAt: string
  updatedAt: string
}

export interface Alliance {
  id: string
  name: string
  description?: string
  tag?: string
  score: number
  memberCount: number
  members?: User[]
  createdAt: string
  updatedAt: string
}

export interface Battle {
  id: string
  attackers: Array<{
    userId: string
    username: string
    fleetId: string
    units: Record<string, number>
  }>
  defenders: Array<{
    userId: string
    username: string
    fleetId?: string
    planetId?: string
    units: Record<string, number>
  }>
  winnerId?: string
  result: {
    attackerLosses: Record<string, number>
    defenderLosses: Record<string, number>
    resourcesStolen?: {
      metal: number
      gas: number
      crystal: number
    }
  }
  planetId: string
  battleTime: string
  createdAt: string
}
