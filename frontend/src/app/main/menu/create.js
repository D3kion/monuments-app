import Bb from 'backbone'
import { View } from 'backbone.marionette'
import template from './create.hbs'

export default View.extend({
  template: template,

  model: new Bb.Model({
    isCountry: true
  }),

  ui: {
    choose: '.choose',
  },

  events: {
    'click @ui.choose': 'onChoose'
  },

  initialize() {
    this.model.on('change', this.render, this)
  },

  onChoose(e) {
    if (e.target.dataset.choose == 'country')
      this.model.set('isCountry', true)
    else
      this.model.set('isCountry', false)
  }

//   loadFeatureInfo(type, id) {
//     const url = 'http://' + location.hostname + ':8000/api/geo/info/'
//     fetch(url + type + '/' + id, {
//       method: 'GET',
//       headers: {
//         'Authorization': 'Token ' + localStorage.token
//       }
//     }).then(res => res.json())
//       .then(data => {
//         this.model.set('isCountry', type === 'country')
//         this.model.set('name', data.name)

//         if (type === 'country') {
//           this.model.set('capital', data.capital)
//           this.model.set('city_set', data.city_set)
//         } else { // city
//           this.model.set('country', data.country)
//           this.model.set('description', data.description)
//           this.model.set('images', data.images)
//         }
//       })
//   },
})
