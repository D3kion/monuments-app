import { Model } from "backbone";

export class CapitalModel extends Model {
  initialize() {
    this.urlRoot = "/api/capital/";
  }
}
