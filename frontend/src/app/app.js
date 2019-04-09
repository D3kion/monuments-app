import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/main.css'
import { Application } from 'backbone.marionette'
import LoginView from './login/view'
import MainView from './main/view'

export default Application.extend({
  region: '#root',

  onStart() {
    if (typeof localStorage.token !== 'undefined') {
      const url = 'http://' + location.hostname + ':8000/api/token-info/'
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + localStorage.token
        }
      }).then(res => {
        if (res.status == 401)
          this.showView(new LoginView())
        else
          this.showView(new MainView())
      })
    } else {
      this.showView(new LoginView())
    }
  },
})
