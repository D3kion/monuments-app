import { Collection } from "backbone";
import { CountryHelperModel } from "Models/countryHelper";

export class CountryHelpersCollection extends Collection {
  initialize() {
    this.url = "/api/countries/";
    this.model = CountryHelperModel;
  }
}
