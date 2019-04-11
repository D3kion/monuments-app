import '../../../styles/login.css'
import { View } from 'backbone.marionette'
import fetch from '../../utils'
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
    fetch('POST', 'api/token-auth/', JSON.stringify({
      username: this.getUI('username').val(),
      password: this.getUI('password').val(),
    }), false)
    .then(res => res.json())
    .then(data => {
      if (typeof data.token === "undefined")
        alert('Ошибка: ' + data.detail)
      else {
        localStorage.setItem('token', data.token)
        location.reload()
      }
    })
  },
})