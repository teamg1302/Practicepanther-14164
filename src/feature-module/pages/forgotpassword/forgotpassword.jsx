import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Mail } from "react-feather";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { all_routes } from "../../../Router/all_routes";
import { forgotPassword } from "../../../core/services/authService";
import { setLoginEmail } from "@/core/redux/action";

const Forgotpassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const route = all_routes;
  
  const forgotPasswordSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email(t("forgotPassword.validation.emailInvalid"))
      .required(t("forgotPassword.validation.emailRequired")),
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await forgotPassword({ email: formData.email });

      // Store login email in Redux
      dispatch(setLoginEmail(formData.email));

      Swal.fire({
        icon: "success",
        title: t("forgotPassword.messages.emailSent"),
        text: t("forgotPassword.messages.emailSentMessage"),
        showConfirmButton: true,
        timer: 3000,
      });

      // Navigate to verify token screen with type parameter
      navigate(route.verifyTokenTwo.replace(":type", "forgot-password"));
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        t("forgotPassword.messages.requestFailedMessage");
      Swal.fire({
        icon: "error",
        title: t("forgotPassword.messages.requestFailed"),
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper forgot-pass-wrap bg-img">
          <div className="login-content">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <ImageWithBasePath src="assets/img/logo.png" alt="img" />
                </div>
                <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link>
                <div className="login-userheading">
                  <h3>{t("forgotPassword.title")}</h3>
                  <h4>{t("forgotPassword.subtitle")}</h4>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">{t("forgotPassword.emailLabel")}</label>
                  <div className="form-addons" style={{ position: "relative" }}>
                    <Mail
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                        width: "16px",
                        height: "16px",
                        color: "#919EAB",
                      }}
                    />
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder={t("forgotPassword.emailPlaceholder")}
                      {...register("email")}
                      style={{ paddingLeft: "40px" }}
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-danger mt-2 mb-0">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="form-login">
                  <button
                    type="submit"
                    className="btn btn-login w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("forgotPassword.sending") : t("forgotPassword.sendResetLink")}
                  </button>
                </div>
                <div className="signinform text-center">
                  <h4>
                    {t("forgotPassword.returnToLogin")}
                    <Link to={route.signin} className="hover-a">
                      {" "}
                      {t("forgotPassword.login")}{" "}
                    </Link>
                  </h4>
                </div>
                {/* <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div>
                <div className="form-sociallink">
                  <ul className="d-flex justify-content-center">
                    <li>
                      <Link to="#" className="facebook-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/google.png"
                          alt="Google"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="apple-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </li>
                  </ul>
                </div> */}
                {/* <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                  <p>Copyright © 2023 DreamsPOS. All rights reserved</p>
                </div> */}
              </div>
            </form>
          </div>
          <div className="login-img">
            <ImageWithBasePath
              src="assets/img/authentication/login02.png"
              alt="img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
