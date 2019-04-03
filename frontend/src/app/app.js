import '../styles/main.css'
import { Application } from 'backbone.marionette'
import LoginView from './login/view'
import MainView from './main/view'

export default Application.extend({
  region: '#root',

  onStart() {
    if (localStorage.token === undefined)
      this.showView(new LoginView())
    else
      this.showView(new MainView())
  },
})
