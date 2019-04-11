import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/main.css'
import { Application } from 'backbone.marionette'
import _ from 'underscore'
import fetch from './utils'
import LoginView from './login/view'
import MainView from './main/view'

export default Application.extend({
  region: '#root',

  onStart() {
    if (typeof localStorage.token !== 'undefined')
      fetch('GET', 'api/token-info/')
      .then(res => {
        if (res.status == 401)
          this.showView(new LoginView())
        else
          this.showView(new MainView())
      })
    else
      this.showView(new LoginView())

    let _sync = Backbone.sync
    Backbone.sync = function(method, model, options) {
      options.beforeSend = xhr => xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token)

      if (model && (method === 'create' || method === 'update' || method === 'patch')) {
        options.contentType = 'application/json';
        options.data = JSON.stringify(options.attrs || model.toJSON());
      }
  
      return _sync.call(this, method, model, options);
    }
  },
})
