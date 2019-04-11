import { View } from 'backbone.marionette'
import template from './create.hbs'
import CountryView from './create/country'
import CityView from './create/city'
import CapitalView from './create/capital'

export default View.extend({
  template: template,
  
  regions: {
    content: '#create-content'
  },

  events: {
    'click .choose': 'onChoose',
  },

  childViewEvents: {
    'refresh:map': 'refreshMap',
    'close:menu': 'closeMenu',
  },

  initialize(drawPoint) {
    this.drawPoint = drawPoint
  },

  onChoose(e) {
    let childView
    switch (e.target.dataset.choose) {
      case 'country':
        childView = new CountryView()
        break;
      case 'city':
        childView = new CityView(this.drawPoint)
        break;
      case 'capital':
        childView = new CapitalView()
        break;
    }
    this.showChildView('content', childView)
  },

  refreshMap() {
    this.triggerMethod('refresh:map', this)
  },

  closeMenu() {
    this.triggerMethod('close:menu', this)
  },
})
