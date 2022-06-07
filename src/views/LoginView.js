import React from 'react'
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Message,
} from 'semantic-ui-react'
import AuthSingleton from '../components/AuthService'
import PropTypes from 'prop-types'

const Auth = AuthSingleton.getInstance()

export default class LoginView extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)

    this.state = {
      showError: false,
    }
  }

  componentDidMount() {
    if (Auth.loggedIn()) this.props.history.replace('/')
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleFormSubmit(e) {
    e.preventDefault()

    Auth.login(this.state.email, this.state.password)
      .then(() => {
        this.props.history.replace('/')
      })
      .catch(() => {
        this.setState({ showError: true })
      })
  }

  renderError() {
    if (this.state.showError) {
      return (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>Wrong credentials</p>
        </Message>
      )
    }
  }

  render() {
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
                <Form onSubmit={this.handleFormSubmit}>
                  {this.renderError()}
                  <Form.Input>
                    <Input
                      icon="user"
                      iconPosition="left"
                      name="email"
                      onChange={this.handleChange}
                      placeholder="Email"
                      required
                      type="text"
                    ></Input>
                  </Form.Input>
                  <Form.Input>
                    <Input
                      icon="lock"
                      iconPosition="left"
                      name="password"
                      onChange={this.handleChange}
                      placeholder="Password"
                      required
                      type="password"
                    ></Input>
                  </Form.Input>
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
}

LoginView.propTypes = {
  history: PropTypes.any.isRequired,
}
