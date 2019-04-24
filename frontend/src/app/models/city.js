import { Model } from "backbone";

export class CityModel extends Model {
  initialize() {
    this.urlRoot = "/api/city/";
  }
}
