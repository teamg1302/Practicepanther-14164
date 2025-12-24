import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { User, Lock } from "react-feather";
import ImageWithBasePath from "@/core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { all_routes } from "@/Router/all_routes";
import { login } from "@/core/services/authService";
import { setLoginEmail } from "@/core/redux/action";
import Swal from "sweetalert2";

const Signin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const signInSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email(t("signin.validation.emailInvalid"))
      .required(t("signin.validation.emailRequired")),
    password: yup.string().required(t("signin.validation.passwordRequired")),
    rememberMe: yup.boolean().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const route = all_routes;

  const onSubmit = async (formData) => {
    try {
      await login(formData);

      // Store login email in Redux
      dispatch(setLoginEmail(formData.email));

      // Show success message
      // Swal.fire({
      //   icon: "success",
      //   title: t("signin.messages.loginSuccess"),
      //   text: t("signin.messages.loginSuccessMessage"),
      //   showConfirmButton: true,
      //   timer: 2000,
      // });

      // Navigate to verify token screen
      navigate(route.verifyToken);
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.message ||
        error?.error ||
        t("signin.messages.loginFailedMessage");
      Swal.fire({
        icon: "error",
        title: t("signin.messages.loginFailed"),
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img">
          <div className="login-content">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <ImageWithBasePath
                    src="assets/img/Jurisoft-logo-hr.png"
                    alt="img"
                  />
                </div>
                <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link>
                <div className="login-userheading">
                  <h3>{t("signin.welcomeBack")}</h3>
                  <h4>{t("signin.subtitle")}</h4>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">{t("signin.emailLabel")}</label>
                  <div className="form-addons" style={{ position: "relative" }}>
                    <User
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
                      placeholder={t("signin.emailPlaceholder")}
                      {...register("email")}
                      style={{ paddingLeft: "40px" }}
                    />
                    {!errors.email && (
                      <ImageWithBasePath
                        src="assets/img/icons/mail.svg"
                        alt="img"
                      />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-danger mt-2 mb-0">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">
                    {t("signin.passwordLabel")}
                  </label>
                  <div className="pass-group" style={{ position: "relative" }}>
                    <Lock
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
                      type={isPasswordVisible ? "text" : "password"}
                      className={`pass-input form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder={t("signin.passwordPlaceholder")}
                      {...register("password")}
                      style={{ paddingLeft: "40px" }}
                    />

                    {!errors.password ? (
                      <span
                        className={`fas toggle-password ${
                          isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    ) : (
                      ""
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-danger mt-2 mb-0">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input
                            type="checkbox"
                            className="form-control"
                            {...register("rememberMe")}
                          />
                          <span className="checkmarks" />
                          {t("signin.rememberMe")}
                        </label>
                      </div>
                      <div className="text-end">
                        <Link className="forgot-link" to={route.forgotPassword}>
                          {t("signin.forgotPassword")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-login">
                  <button
                    type="submit"
                    className="btn btn-login"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("signin.signingIn")
                      : t("signin.signInButton")}
                  </button>
                </div>
                {/* <div className="signinform">
                  <h4>
                    New on our platform?
                    <Link to={route.register} className="hover-a">
                      {" "}
                      Create an account
                    </Link>
                  </h4>
                </div>
                <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div> */}
                {/* <div className="form-sociallink">
                  <ul className="d-flex">
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
                  <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>
                      Copyright © {new Date().getFullYear()} DreamsPOS. All
                      rights reserved
                    </p>
                  </div>
                </div> */}
              </div>
            </form>
          </div>
          {/* <div className="login-img">
            <ImageWithBasePath
              src="assets/img/authentication/login_law.png"
              alt="img"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Signin;
