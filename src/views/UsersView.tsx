import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Grid, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import UserList from '../components/user/UserList'
import UserModalForm from '../components/user/UserModalForm'
import Layout from './Layout'

const UsersView: FC = () => {
  const { t } = useTranslation()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" mb={2}>
            <Typography component="h2" gutterBottom variant="h3">
              {t('title.users')}
            </Typography>
            <Button
              onClick={() => {
                setFormModalOpen(true)
              }}
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              variant="contained"
            >
              {t('user.new')}
            </Button>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <UserList />
          </Card>
        </Grid>
      </Grid>
      <UserModalForm
        onClose={() => {
          setFormModalOpen(false)
        }}
        open={formModalOpen}
      />
    </Layout>
  )
}

export default UsersView
