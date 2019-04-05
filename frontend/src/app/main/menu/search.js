import Bb from 'backbone'
import { View } from 'backbone.marionette'
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
    const url = 'http://' + location.hostname + ':8000/api/geo/search/'
    let res = []

    fetch(url + 'country/?search=' + q, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
      }
    }).then(res => res.json())
      .then(data => {
        if (data.length > 0)
          res.push({countries: data})
      }).then(() => {
        fetch(url + 'city/?search=' + q, {
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + localStorage.token
          }
        }).then(res => res.json())
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
