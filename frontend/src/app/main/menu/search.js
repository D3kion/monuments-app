import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../utils'
import template from './search.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),
  
  ui: {
    feature: '.clickable',
  },

  events: {
    'click @ui.feature': 'openFeature'
  },

  initialize(q) {
    this.model.on('change', this.render, this)
    
    this.search(q)
  },

  search(q) {
    let res = []
    
    const url = 'api/search/country/?search=' + q
    fetch('GET', url)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0)
        res.push({countries: data})
    }).then(() => {
      const url = 'api/search/city/?search=' + q
      fetch('GET', url)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0)
          res.push({cities: data})
        this.model.set('list', res)
      })
    })
  },

  openFeature(e) {
    this.triggerMethod('open:feature:id', this, e.target.dataset)
  },
})
