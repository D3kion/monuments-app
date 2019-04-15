import Bb from "backbone";
import CountryHelperModel from "Models/countryHelper";

export default Bb.Collection.extend({
  url: "http://" + location.hostname + ":8000/api/countries/",
  model: CountryHelperModel,
});
