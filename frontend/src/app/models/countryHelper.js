import { Model } from "backbone";

export class CountryHelperModel extends Model {
  initialize() {
    this.urlRoot = "/api/countries/";
  }
}
