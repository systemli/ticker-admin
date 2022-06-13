import React, { FC, FormEvent, useCallback, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
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
import { login } from '../api/Auth'
import AuthSingleton from '../components/AuthService'

const Auth = AuthSingleton.getInstance()

interface FormValues {
  email: string
  password: string
}

const LoginView: FC = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    setError,
  } = useForm<FormValues>()
  const history = useHistory()

  const onChange = useCallback(
    (e: FormEvent, { name, value }: InputOnChangeData) => {
      setValue(name, value)
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    login(data.email, data.password)
      .then(response => {
        Auth.login(response.token)
        history.push('/')
      })
      .catch((error: Error) =>
        setError('email', { type: 'custom', message: error.message })
      )
  }

  useEffect(() => {
    if (Auth.loggedIn()) history.replace('/')

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
                {errors.email ? (
                  <Message
                    content={errors.email.message}
                    negative
                    size="small"
                  />
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
