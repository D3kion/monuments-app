import Bb from 'backbone'
import { View } from 'backbone.marionette'
import fetch from '../../../utils'
import template from './search.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model(),

  events: {
    'click .clickable': 'openFeature'
  },

  initialize(q) {
    this.model.on('change', this.render, this)
    this.search(q)
  },

  search(q) {
    let res = []
    fetch('GET', 'api/search/country/?search=' + q)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0)
        res.push({countries: data})
    })
    .then(() => 
      fetch('GET', 'api/search/city/?search=' + q)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0)
          res.push({cities: data})
        this.model.set({list: res})
      }))
  },

  openFeature(e) {
    this.triggerMethod('open:feature:id', this, e.target.dataset)
  },
})
