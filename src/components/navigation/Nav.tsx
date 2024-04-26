import { FC } from 'react'
import { colors, Container } from '@mui/material'

interface Props {
  children: React.ReactNode
}

const Nav: FC<Props> = ({ children }) => {
  return (
    <Container
      fixed
      sx={{
        my: 2,
        pb: 1,
        display: 'flex',
        borderBottom: 1,
        borderColor: colors.grey[200],
      }}
    >
      {children}
    </Container>
  )
}

export default Nav
