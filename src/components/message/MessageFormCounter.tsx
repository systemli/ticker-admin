import { ChipPropsColorOverrides, Chip } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import React, { FC, useEffect, useState } from 'react'
import { MESSAGE_LIMIT } from './MessageForm'

interface Props {
  letterCount: number
}

const MessageFormCounter: FC<Props> = ({ letterCount }) => {
  const [color, setColor] =
    useState<OverridableStringUnion<'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', ChipPropsColorOverrides>>('default')

  useEffect(() => {
    if (letterCount > MESSAGE_LIMIT) {
      setColor('error')
    } else if (letterCount >= 240) {
      setColor('warning')
    } else if (letterCount === 0) {
      setColor('default')
    } else {
      setColor('success')
    }
  }, [letterCount])

  return <Chip color={color} label={`${letterCount}/${MESSAGE_LIMIT}`} size="small" variant="outlined" />
}

export default MessageFormCounter
