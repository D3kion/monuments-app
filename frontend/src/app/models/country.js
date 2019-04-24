import { Model } from "backbone";

export class CountryModel extends Model {
  initialize() {
    this.urlRoot = "/api/country/";
  }
}
