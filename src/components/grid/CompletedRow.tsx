import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'
import { useEffect, useState } from 'react'
import { MAX_WORD_LENGTH, REVEAL_TIME_MS } from '../../constants/settings'

type Props = {
  guess: string
  reveal?: boolean
}

export const CompletedRow = ({ guess, reveal }: Props) => {
  const [isRevealing, setIsRevealing] = useState(reveal)
  const statuses = getGuessStatuses(guess)
  const splitGuess = unicodeSplit(guess)

  useEffect(() => {
    if (reveal === true) {
      setTimeout(() => {
        setIsRevealing(false)
      }, REVEAL_TIME_MS * MAX_WORD_LENGTH)
    }
  }, [])

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}
