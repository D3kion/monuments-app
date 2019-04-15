import { Model } from "backbone";

export class CityModel extends Model {
  initialize() {
    this.urlRoot = "http://" + location.hostname + ":8000/api/city/";
  }
}
