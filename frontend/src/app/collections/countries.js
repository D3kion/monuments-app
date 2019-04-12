import Bb from 'backbone'
import CountryModel from 'Models/country'

export default Bb.Collection.extend({
  url: 'http://' + location.hostname + ':8000/api/country/',
  model: CountryModel,
})
