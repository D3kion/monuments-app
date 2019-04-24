import { Collection } from "backbone";
import { CountryModel } from "Models/country";

export class CountriesCollection extends Collection {
  initialize() {
    this.url = "/api/country/";
    this.model = CountryModel;
  }
}
