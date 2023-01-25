import React, { FC } from 'react'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Chip } from '@mui/material'

interface Props {
  active: boolean
  label: string
}

const SocialConnectionChip: FC<Props> = ({ active, label }) => {
  return (
    <>
      <Chip
        avatar={<FontAwesomeIcon icon={active ? faCheck : faXmark} />}
        label={label}
        size="small"
        sx={{ mr: 1 }}
        variant="outlined"
      />
    </>
  )
}

export default SocialConnectionChip
