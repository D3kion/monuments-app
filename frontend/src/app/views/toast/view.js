/* eslint-disable no-undef */
import "bootstrap/js/dist/util";
import "bootstrap/js/dist/toast";
import _ from "underscore";
import $ from "jquery";
import { View } from "backbone.marionette";
import template from "./template.hbs";

export class ToastView extends View {
  constructor(type, text, options={}) {
    _.defaults(options, {
      template,
    });
    super(options);
  
    this.type = type;
    this.text = text;
  }

  serializeData() {
    return {
      type: this.type,
      text: this.text,
    };
  }

  show() {
    console.log($(".toast"));
    $(".toast").toast({autohide: false});
    $(".toast").toast("show");
  }
}
