import Bb from 'backbone'
import { View } from 'backbone.marionette'

import template from './template.hbs'

export const MenuView = View.extend({
  template: template,

  ui: {
    close: '#close',
  },

  trigers: {
    'click @ui.close': 'close',
  },
})
