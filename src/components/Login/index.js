import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })

    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showError: true,
      errorMsg,
    })
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const token = Cookies.get('jwt_token')

    if (token !== undefined) {
      return <Redirect to="/" />
    }

    const {username, password, showError, errorMsg} = this.state

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />

          <label htmlFor="username">USERNAME</label>

          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={this.onChangeUsername}
          />
          <label htmlFor="password">PASSWORD</label>

          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={this.onChangePassword}
          />

          <button type="submit">Login</button>

          {showError && <p className="error_msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
