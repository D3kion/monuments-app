import { View } from 'backbone.marionette'
import template from './template.hbs'

export default View.extend({
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
