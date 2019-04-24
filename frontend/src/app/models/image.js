import { Model } from "backbone";

export class ImageModel extends Model {
  initialize() {
    this.urlRoot = "/api/image/";
  }
}
