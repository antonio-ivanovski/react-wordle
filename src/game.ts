import firebaseConfig from './firebaseConfig'
import { initializeApp } from 'firebase/app'
import { child, getDatabase, onValue, ref, set } from 'firebase/database'
import { v4 as uuid } from 'uuid'

type PlayerState = {
  id: string
  currentGuess: string
  guesses: string[]
  status: 'playing' | 'won' | 'lost'
}

export type GameState = {
  gameId: string
  p1State: PlayerState
  p2State?: PlayerState
}

type GameStateChangeCallback = (newState: GameState) => void
export type Game = {
  enterGuess: (guess: string) => void
  submitGuess: (guess: string) => void
  submitStatus: (newStatus: PlayerState['status']) => void
  onStateChange: (callback: GameStateChangeCallback) => void
}

initializeApp(firebaseConfig)

const initGame: (gameId?: string) => Game = (gameId = uuid()) => {
  let gameState: GameState
  let gameStateChangeCallback: GameStateChangeCallback
  const db = getDatabase()
  const gameRef = ref(db, `games/${gameId}`)
  onValue(gameRef, (snapshot) => {
    if (!snapshot.exists()) {
      // Create new game
      const initState: GameState = {
        gameId,
        p1State: {
          id: playerId(),
          currentGuess: '',
          guesses: [],
          status: 'playing',
        },
      }
      set(gameRef, initState)
    } else {
      gameState = snapshot.val()
      if (gameState.p1State.id !== playerId() && gameState.p2State == null) {
        // joining as Player 2
        set(child(gameRef, 'p2State'), {
          id: playerId(),
          currentGuess: '',
          guesses: [],
          status: 'playing',
        })
      } else {
        // Game initialized for current player, we can show something
        gameStateChangeCallback?.(gameState)
      }
    }
  })
  return {
    onStateChange: (callback) => {
      gameStateChangeCallback = callback
    },
    enterGuess: (guess) => {
      const playerStateField =
        playerId() === gameState.p1State.id ? 'p1State' : 'p2State'
      set(child(gameRef, `${playerStateField}/currentGuess`), guess)
    },
    submitGuess: (guess) => {
      const playerStateField =
        playerId() === gameState.p1State.id ? 'p1State' : 'p2State'
      set(child(gameRef, `${playerStateField}`), {
        ...gameState[playerStateField],

        currentGuess: '',
        guesses: [...(gameState[playerStateField]?.guesses ?? []), guess],
      })
    },
    submitStatus: (newStatus) => {
      const playerStateField =
        playerId() === gameState.p1State.id ? 'p1State' : 'p2State'
      set(child(gameRef, `${playerStateField}/status`), newStatus)
    },
  }
}

export function computeMyPlayerState(gameState: GameState): PlayerState {
  if (gameState.p1State.id === playerId()) return gameState.p1State
  return gameState.p2State!
}

export function computeOpponentPlayerState(gameState: GameState): PlayerState {
  if (gameState.p1State.id === playerId()) return gameState.p2State!
  return gameState.p1State
}

function playerId(): string {
  const playerId = localStorage.getItem('playerId')
  if (playerId) {
    return playerId
  }
  const newPlayerId = uuid()
  localStorage.setItem('playerId', newPlayerId)
  return newPlayerId
}

export default initGame
