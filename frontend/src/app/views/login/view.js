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
        "click #reset": "onReset",
        "click #submit": "onSubmit",
        "submit .form-signin": "onSubmit",
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

    form.one("submit", (e) => {
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
              toast = new ToastView("Ошибка", "Имя пользователя некорректно или такой пользователь уже существует.");
            else if (data.email)
              toast = new ToastView("Ошибка", "Электронная почта некорректна или уже используется.");
            else if (data.password)
              toast = new ToastView("Ошибка", "Пароль должен быть не меньше 8 символов.");

            this.showChildView("toast", toast);
            toast.show();
          });
        }
      });
    });

    submit.one("click", () => form.submit());
  }

  onReset(e) {
    e.preventDefault();

    const modal = $("#resetModal");
    const form = modal.find("form");
    const submit = modal.find("#resetSubmit");

    modal.modal("show");

    form.one("submit", (e) => {
      e.preventDefault();
      let data = {};
      $(e.target).serializeArray().map(x => data[x.name] = x.value);

      fetch("POST", "api/password_reset/", JSON.stringify({
        email: data.email,
      }), false, new Headers({"Content-Type": "application/json"}))
      .then(res => {
        if (res.ok) {
          const toast = new ToastView("Успешно", "Токен отправлен на указанный email!");
          this.showChildView("toast", toast);
          toast.show();
          modal.modal("hide");

          this.onResetSuccess();
        } else {
          res.json().then(data => {
            let toast;
            if (data.email)
              toast = new ToastView("Ошибка", data.email);

            this.showChildView("toast", toast);
            toast.show();
          });
        }
      });
    });

    submit.one("click", () => form.submit());
  }

  onResetSuccess() {
    const modal = $("#resetSuccessModal");
    const form = modal.find("form");
    const submit = modal.find("#resetSuccessSubmit");

    modal.modal("show");

    form.one("submit", (e) => {
      e.preventDefault();
      let data = {};
      $(e.target).serializeArray().map(x => data[x.name] = x.value);

      fetch("POST", "api/password_reset/confirm/", JSON.stringify({
        password: data.password,
        token: data.token,
      }), false, new Headers({"Content-Type": "application/json"}))
      .then(res => {
        if (res.ok) {
          const toast = new ToastView("Успешно", "Пароль успешно изменен!");
          this.showChildView("toast", toast);
          toast.show();
          modal.modal("hide");
        } else {
          res.json().then(data => {
            let toast;
            if (data.password)
              toast = new ToastView("Ошибка", "Пароль должен быть не меньше 8 символов.");
            if (data.token)
              toast = new ToastView("Ошибка", "Неверный токен");

            this.showChildView("toast", toast);
            toast.show();
          });
        }
      });
    });

    submit.one("click", () => form.submit());
  }

  onSubmit(e) {
    e.preventDefault();

    const $form = this.$el.find(".form-signin");
    // eslint-disable-next-line no-unused-vars
    let temp = $form.serializeArray();
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
