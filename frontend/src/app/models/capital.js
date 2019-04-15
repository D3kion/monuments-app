import { Model } from "backbone";

export class CapitalModel extends Model {
  initialize() {
    this.urlRoot = "http://" + location.hostname + ":8000/api/capital/";
  }
}
