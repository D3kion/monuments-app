import { Collection } from "backbone";
import { CountryModel } from "Models/country";

export class CountriesCollection extends Collection {
  initialize() {
    this.url = "http://" + location.hostname + ":8000/api/country/";
    this.model = CountryModel;
  }
}
