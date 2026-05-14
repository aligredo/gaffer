export type Position = 'GK' | 'DEF' | 'ATT' | 'JOKER'

export interface Player {
  id: string
  name: string
  bestPosition: Position
  pace: number
  shoot: number
  pass: number
  skill: number
  physical: number
  tribeId: string
  overall?: number
  createdAt?: string
}

export interface CreatePlayerRequest {
  name: string
  bestPosition: Position
  pace: number
  shoot: number
  pass: number
  skill: number
  physical: number
}

export interface Tribe {
  id: string
  name: string
  description?: string
  schedule?: string
  ownerId: string
  playerCount?: number
  lastMatchDate?: string
  createdAt?: string
}

export interface Match {
  id: string
  tribeId: string
  date: string
  status: 'draft' | 'confirmed'
  notes?: string
  teamA: Player[]
  teamB: Player[]
  subA?: Player | null
  subB?: Player | null
  balanceDelta?: number
  warnings?: string[]
  createdAt?: string
}

export interface AuthUser {
  id: string
  username: string
  name: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}
