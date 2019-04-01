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

app.Router = Backbone.Router.extend({
  routes: {
    ''     : 'index',
    'read' : 'read' 
  },

  index: function() {
    console.log('Всем привет от индексного роута!');   
  },

  read: function() {
    console.log('это роут Read');   
  }
});

app.start()
