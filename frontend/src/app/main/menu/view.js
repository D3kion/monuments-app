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

  initialize(obj) {
    this.contentView = obj.contentView

    this.contentView.on('open:feature:id', this.openFeatureById, this)
  },

  openFeatureById(view, feature) {
    this.triggerMethod('open:feature:id', this, feature)
  },

  onRender() {
    this.addRegions({ content: '#content' })
    this.showChildView('content', this.contentView)
  },

  onClose() {
    this.triggerMethod('close:menu', this)
  },
})
