import Bb from 'backbone'
import { View } from 'backbone.marionette'

import template from './template.hbs'

export const MenuView = View.extend({
  template: template,

  ui: {
    close: '#close',
  },

  events: {
    'click @ui.close': 'onClose',
  },

  onClose() {
    this.triggerMethod('close:menu', this)
  },
})
