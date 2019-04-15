import { Model } from "backbone";

export class CountryModel extends Model {
  initialize() {
    this.urlRoot = "http://" + location.hostname + ":8000/api/country/";
  }
}
