import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/main.css'
import { Application } from 'backbone.marionette'
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
  },
})
