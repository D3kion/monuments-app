/* eslint-disable no-undef */
import "Styles/login.scss";
import "bootstrap/js/dist/modal";
import _ from "underscore";
import $ from "jquery";
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
        "click #register": "onRegister",
        "click #recover": "onRecover",
        "click #submit": "onSubmit",
      }
    });
    super(options);
  }

  onRegister(e) {
    e.preventDefault();

    const modal = $("#registerModal");
    const form = modal.find("form");
    const submit = modal.find("#registerSubmit");

    modal.modal("show");

    form.submit((e) => {
      e.preventDefault();
      let data = {};
      $(e.target).serializeArray().map(x => data[x.name] = x.value);

      fetch("POST", "api/register/", JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }), false, new Headers({"Content-Type": "application/json"}))
      .then(res => {
        if (res.ok) {
          const toast = new ToastView("Успешно", "Вы зарегистрированы!");
          this.showChildView("toast", toast);
          toast.show();
          modal.modal("hide");
        } else {
          res.json().then(data => {
            let toast;
            if (data.username)
              toast = new ToastView("Ошибка", "Имя пользователя не заполнено или такой пользователь уже существует.");
            else if (data.email)
              toast = new ToastView("Ошибка", "Электронная почта не заполнена или уже существует.");
            else if (data.password)
              toast = new ToastView("Ошибка", "Пароль должен быть не меньше 8 символов.");

            this.showChildView("toast", toast);
            toast.show();
          });
        }
      });
    });

    submit.click(() => form.submit());
  }

  onRecover(e) {
    e.preventDefault();
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
