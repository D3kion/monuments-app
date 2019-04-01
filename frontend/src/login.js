import _ from 'underscore'
import { View } from 'backbone.marionette'

export const LoginView = View.extend({
  template: _.template(`
    <form>
      <label for="username">Username</label>
      <input type="text" id="username" placeholder="Username">

      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Password">

      <button type="submit" id="submit">Submit</button>
    </form>
  `),

  ui: {
    username: '#username',
    password: '#password',
    submit: '#submit',
  },
  
  events: {
    'click @ui.submit': 'onSubmit'
  },

  onSubmit(e) {
    e.preventDefault()

    fetch('http://' + location.hostname + ':8000/api/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        username: this.getUI('username').val(),
        password: this.getUI('password').val(),
      })
    }).then(res => res.json())
      .then(data => {
        if (data.token === undefined)
          console.log('Error', data)
        else
          localStorage.setItem('token', data.token)
          location.reload()
      })
  },
})