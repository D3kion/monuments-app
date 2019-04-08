import '../../styles/login.css'
import { View } from 'backbone.marionette'
import template from './template.hbs'

export default View.extend({
  template: template,

  ui: {
    username: '#username',
    password: '#password',
    submit: '#submit',
  },
  
  events: {
    'click @ui.submit': 'onSubmit',
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
        if (typeof data.token === "undefined")
          alert('Error: ' + data.detail)
        else
          localStorage.setItem('token', data.token)
          location.reload()
      })
  },
})