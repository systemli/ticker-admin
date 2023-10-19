import { Box } from '@mui/material'
import React, { FC } from 'react'

interface Props {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: FC<Props> = ({ children, index, value }) => {
  return (
    <div aria-labelledby={`simple-tab-${index}`} hidden={value !== index} id={`simple-tabpanel-${index}`} role="tabpanel">
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  )
}

export default TabPanel
