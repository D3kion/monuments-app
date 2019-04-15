import { Model } from "backbone";

export class CountryHelperModel extends Model {
  initialize() {
    this.urlRoot = "http://" + location.hostname + ":8000/api/countries/";
  }
}
