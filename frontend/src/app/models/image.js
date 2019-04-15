import { Model } from "backbone";

export class ImageModel extends Model {
  initialize() {
    this.urlRoot = "http://" + location.hostname + ":8000/api/image/";
  }
}
