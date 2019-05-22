/* eslint-disable no-undef */
import "Styles/login.scss";
import "bootstrap/js/dist/modal";
import _ from "underscore";
import { View } from "backbone.marionette";
import { fetch } from "App/utils";
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
      },
      ui: {
        signinForm: ".form-signin",
        registerModal: "#registerModal",
        registerForm: "#registerModal form",
        registerSubmit: "#registerSubmit",
        resetModal: "#resetModal",
        resetForm: "#resetModal form",
        resetSubmit: "#resetSubmit",
        resetSuccessModal: "#resetSuccessModal",
        resetSuccessForm: "#resetSuccessModal form",
        resetSuccessSubmit: "#resetSuccessSubmit",
      }
    });
    super(options);
  }

  onRegister(e) {
    e.preventDefault();

    const modal = this.getUI("registerModal");
    const form = this.getUI("registerForm");
    const submit = this.getUI("registerSubmit");

    modal.modal("show");

    form.off("submit");
    form.on("submit", e => {
      e.preventDefault();
      let data = {};
      modal.find(e.target).serializeArray().map(x => data[x.name] = x.value);

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
              toast = new ToastView("Ошибка: Имя пользователя", data.username);
            else if (data.email)
              toast = new ToastView("Ошибка: Электронная почта", data.email);
            else if (data.password)
              toast = new ToastView("Ошибка: Пароль", data.password);

            this.showChildView("toast", toast);
            toast.show();
          });
        }
      });
    });

    submit.off("click");
    submit.on("click", () => form.submit());
  }

  onReset(e) {
    e.preventDefault();

    const modal = this.getUI("resetModal");
    const form = this.getUI("resetForm");
    const submit = this.getUI("resetSubmit");

    modal.modal("show");

    form.off("submit");
    form.on("submit", e => {
      e.preventDefault();
      let data = {};
      modal.find(e.target).serializeArray().map(x => data[x.name] = x.value);

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
              toast = new ToastView("Ошибка: Электронная почта", data.email);

            this.showChildView("toast", toast);
            toast.show();
          });
        }
      });
    });

    form.off("click");
    submit.on("click", () => form.submit());
  }

  onResetSuccess() {
    const modal = this.getUI("resetSuccessModal");
    const form = this.getUI("resetSuccessForm");
    const submit = this.getUI("resetSuccessSubmit");

    modal.modal("show");

    form.off("submit");
    form.on("submit", e => {
      e.preventDefault();
      let data = {};
      modal.find(e.target).serializeArray().map(x => data[x.name] = x.value);

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
              toast = new ToastView("Ошибка: Пароль", data.password);
            else if (data.token)
              toast = new ToastView("Ошибка: Токен", data.token);
            else
              toast = new ToastView("Ошибка: Токен", "Неверный токен");

            this.showChildView("toast", toast);
            toast.show();
          });
        }
      });
    });

    form.off("click");
    submit.on("click", () => form.submit());
  }

  onSubmit(e) {
    e.preventDefault();

    const form = this.getUI("signinForm");
    let data = {};
    form.serializeArray().map(x => data[x.name] = x.value);

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
