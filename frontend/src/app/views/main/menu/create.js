import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './create.hbs'
import CountryView from './create/country'
import CityView from './create/city'
import CapitalView from './create/capital'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  regions: {
    content: '#create-content'
  },

  ui: {
    choose: '.choose',
  },

  events: {
    'click @ui.choose': 'onChoose',
  },

  childViewEvents: {
    'refresh:map': 'refreshMap',
    'close:menu': 'closeMenu',
  },

  initialize(drawPoint) {
    this.drawPoint = drawPoint

    this.model.on('change', this.render, this)
  },

  onChoose(e) {
    this.model.set('target', e.target.dataset.choose)
    
    let childView
    switch (this.model.get('target')) {
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
