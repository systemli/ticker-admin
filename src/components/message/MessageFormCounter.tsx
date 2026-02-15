import { FC, useMemo } from 'react'
import { ChipPropsColorOverrides, Chip } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'

interface Props {
  maxLength: number
  letterCount: number
}

const MessageFormCounter: FC<Props> = ({ letterCount, maxLength }) => {
  const color: OverridableStringUnion<'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', ChipPropsColorOverrides> = useMemo(() => {
    if (letterCount > maxLength) {
      return 'error'
    } else if (letterCount >= maxLength * 0.9) {
      return 'warning'
    } else if (letterCount === 0) {
      return 'default'
    } else {
      return 'success'
    }
  }, [letterCount, maxLength])

  return <Chip color={color} label={`${letterCount}/${maxLength}`} size="small" variant="outlined" />
}

export default MessageFormCounter
