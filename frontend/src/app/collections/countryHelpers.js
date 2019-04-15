import { Collection } from "backbone";
import { CountryHelperModel } from "Models/countryHelper";

export class CountryHelpersCollection extends Collection {
  initialize() {
    this.url = "http://" + location.hostname + ":8000/api/countries/";
    this.model = CountryHelperModel;
  }
}
