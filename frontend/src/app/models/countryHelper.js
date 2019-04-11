import Bb from 'backbone';

export default Bb.Model.extend({
  urlRoot: 'http://' + location.hostname + ':8000/api/countries/',
})
