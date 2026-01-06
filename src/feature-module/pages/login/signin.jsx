/**
 * Sign-in page component for user authentication.
 * @module feature-module/pages/login/signin
 *
 * Provides a login form with:
 * - Email and password input fields
 * - Remember me functionality (stores email in localStorage)
 * - Password visibility toggle
 * - Form validation with yup
 * - Integration with Redux for auth state management
 * - Navigation to dashboard or token verification screen
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { User, Lock } from "react-feather";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import ImageWithBasePath from "@/core/img/imagewithbasebath";
import { all_routes } from "@/Router/all_routes";
import { login } from "@/core/services/authService";
import { setLoginEmail } from "@/core/redux/action";
import { setAuthData } from "@/core/redux/action";

/**
 * LocalStorage key for storing remembered email address.
 * @constant {string}
 */
const REMEMBER_ME_EMAIL_KEY = "rememberMeEmail";

/**
 * Sign-in component for user authentication.
 * @component
 * @returns {JSX.Element} Sign-in form component
 *
 * @example
 * <Signin />
 */
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
    setValue,
    watch,
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

  /**
   * Load saved email from localStorage on component mount.
   * If a remembered email exists, populate the email field and check rememberMe.
   */
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_ME_EMAIL_KEY);
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle rememberMe checkbox change.
   * Saves email to localStorage when checked, removes it when unchecked.
   * @param {Event} event - Change event from the checkbox
   */
  const handleRememberMeChange = (event) => {
    const isChecked = event.target.checked;
    const currentEmail = watch("email");

    if (isChecked && currentEmail) {
      // Save email to localStorage when rememberMe is checked
      localStorage.setItem(REMEMBER_ME_EMAIL_KEY, currentEmail);
    } else if (!isChecked) {
      // Remove email from localStorage when rememberMe is unchecked
      localStorage.removeItem(REMEMBER_ME_EMAIL_KEY);
    }
  };

  /**
   * Handle email field change.
   * Updates localStorage if rememberMe is checked and email is provided.
   * @param {Event} event - Change event from the email input
   */
  const handleEmailChange = (event) => {
    const email = event.target.value;
    const rememberMeChecked = watch("rememberMe");

    // Update localStorage if rememberMe is checked and email is provided
    if (rememberMeChecked && email) {
      localStorage.setItem(REMEMBER_ME_EMAIL_KEY, email);
    }
  };

  /**
   * Toggle password visibility between text and password input types.
   */
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const route = all_routes;

  /**
   * Handle form submission.
   * Processes login credentials, handles rememberMe functionality,
   * and navigates to appropriate screen based on response.
   * @param {Object} formData - Form data containing email, password, and rememberMe
   * @param {string} formData.email - User email address
   * @param {string} formData.password - User password
   * @param {boolean} formData.rememberMe - Whether to remember email address
   */
  const onSubmit = async (formData) => {
    try {
      const response = await login(formData);

      // Handle rememberMe functionality
      if (formData.rememberMe && formData.email) {
        // Save email to localStorage when rememberMe is checked
        localStorage.setItem(REMEMBER_ME_EMAIL_KEY, formData.email);
      } else {
        // Remove email from localStorage when rememberMe is unchecked
        localStorage.removeItem(REMEMBER_ME_EMAIL_KEY);
      }

      if (response?.data?.token && response?.data?.user) {
        const token = response?.data?.token;
        const user = response?.data?.user;
        const role =
          response?.data?.user?.role?.name || response?.data?.user?.role;
        const permissions = response?.data?.user?.permissions || [];

        // Store auth data in Redux
        if (token && user) {
          dispatch(
            setAuthData({
              token: token,
              user: user,
              role: role,
              permissions: permissions,
            })
          );
        }

        // Navigate to dashboard
        navigate(route.headers[0].path);
      } else {
        // Store login email in Redux
        dispatch(setLoginEmail(formData.email));

        // Navigate to verify token screen
        navigate(route.verifyToken);
      }
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
                      {...register("email", {
                        onChange: handleEmailChange,
                      })}
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
                            {...register("rememberMe", {
                              onChange: handleRememberMeChange,
                            })}
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
