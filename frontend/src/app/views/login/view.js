/* eslint-disable no-undef */
import "../../../styles/login.scss";
import _ from "underscore";
import { View } from "backbone.marionette";
import fetch from "../../utils";
import template from "./template.hbs";
import { ToastView } from "Views/toast/view";

export class LoginView extends View {
  constructor(options={}) {
    _.defaults(options, {
      template,
      regions: {
        toast: {
          el: "#toast-placeholder",
          replaceElement: true,
        },
      },
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
      if (typeof data.token === "undefined") {
        const toast = new ToastView("Ошибка", "Неверные учетные данные.");
        this.showChildView("toast", toast);
        toast.show();
      } else {
        localStorage.setItem("token", data.token);
        location.reload();
      }
    });
  }
}
