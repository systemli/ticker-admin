import React, { FC, FormEvent, useCallback, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  InputOnChangeData,
  Message,
} from 'semantic-ui-react'
import useAuth from '../components/useAuth'

interface FormValues {
  email: string
  password: string
}

const LoginView: FC = () => {
  const { register, handleSubmit, setValue } = useForm<FormValues>()
  const { login, error, user } = useAuth()
  const navigate = useNavigate()

  const onChange = useCallback(
    (e: FormEvent, { name, value }: InputOnChangeData) => {
      setValue(name, value)
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    login(data.email, data.password)
  }

  useEffect(() => {
    if (user) navigate('/')

    register('email')
    register('password')
  })

  return (
    <Container>
      <Container className="app">
        <Grid centered>
          <Grid.Column computer={6} mobile={16}>
            <Grid.Row>
              <Header icon size="huge" textAlign="center">
                <Icon name="browser" size="small" />
                <Header.Content>Login</Header.Content>
              </Header>
            </Grid.Row>
            <Grid.Row>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {error ? (
                  <Message content={error.message} negative size="small" />
                ) : null}
                <Form.Input
                  icon="user"
                  iconPosition="left"
                  name="email"
                  onChange={onChange}
                  placeholder="Email"
                  required
                  type="text"
                />
                <Form.Input
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  onChange={onChange}
                  placeholder="Password"
                  required
                  type="password"
                />
                <Button color="teal" fluid type="submit">
                  Login
                </Button>
              </Form>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    </Container>
  )
}

export default LoginView
