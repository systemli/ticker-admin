import { ChipPropsColorOverrides, Chip } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import React, { FC, useEffect, useState } from 'react'

interface Props {
  maxLength: number
  letterCount: number
}

const MessageFormCounter: FC<Props> = ({ letterCount, maxLength }) => {
  const [color, setColor] =
    useState<OverridableStringUnion<'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', ChipPropsColorOverrides>>('default')

  useEffect(() => {
    if (letterCount > maxLength) {
      setColor('error')
    } else if (letterCount >= maxLength * 0.9) {
      setColor('warning')
    } else if (letterCount === 0) {
      setColor('default')
    } else {
      setColor('success')
    }
  }, [letterCount, maxLength])

  return <Chip color={color} label={`${letterCount}/${maxLength}`} size="small" variant="outlined" />
}

export default MessageFormCounter
