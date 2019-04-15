/* eslint-disable no-undef */
import "../../../styles/login.css";
import _ from "underscore";
import { View } from "backbone.marionette";
import fetch from "../../utils";
import template from "./template.hbs";

export class LoginView extends View {
  constructor(options={}) {
    _.defaults(options, {
      template,
      events: {
        "click #submit": "onSubmit",
      }
    });
    super(options);
  }

  onSubmit(e) {
    e.preventDefault();

    const $form = this.$el.find("form");
    let data = {};
    $form.serializeArray().map(x => data[x.name] = x.value);

    fetch("POST", "api/token-auth/", JSON.stringify({
      username: data.username,
      password: data.password,
    }), false, new Headers({"Content-Type": "application/json"}))
    .then(res => res.json())
    .then(data => {
      if (typeof data.token === "undefined")
        alert("Ошибка: " + data.detail);
      else {
        localStorage.setItem("token", data.token);
        location.reload();
      }
    });
  }
}
