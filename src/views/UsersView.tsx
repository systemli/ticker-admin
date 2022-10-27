import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, Grid, Stack, Typography } from '@mui/material'
import React, { FC, useState } from 'react'
import UserList from '../components/user/UserList'
import UserModalForm from '../components/user/UserModalForm'
import Layout from './Layout'

const UsersView: FC = () => {
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            mb={2}
          >
            <Typography component="h2" gutterBottom variant="h3">
              Users
            </Typography>
            <Button
              onClick={() => {
                setFormModalOpen(true)
              }}
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              variant="contained"
            >
              New User
            </Button>
            <UserModalForm
              onClose={() => {
                setFormModalOpen(false)
              }}
              open={formModalOpen}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <UserList />
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default UsersView
