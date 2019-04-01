import Bb from 'backbone'
import { Application } from 'backbone.marionette'

import { LoginView } from './login.js'
import { MapView } from './map.js'

const App = Application.extend({
  region: '#root',

  onStart(app, options) {
    if (localStorage.token === undefined)
      this.showView(new LoginView())
    else {
      this.showView(new MapView())
    }
    Bb.history.start()
  }
})

const app = new App()

app.start()
