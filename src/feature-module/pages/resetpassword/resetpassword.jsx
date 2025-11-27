import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Lock } from "react-feather";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { resetPassword } from "../../../core/services/authService";
import Swal from "sweetalert2";

const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .trim()
    // .min(6, "Password must be at least 6 characters.")
    .required("New password is required."),
  confirmPassword: yup
    .string()
    .trim()
    .required("Confirm password is required.")
    .oneOf([yup.ref("newPassword")], "Passwords must match."),
});

const Resetpassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const route = all_routes;
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };

  const onSubmit = async (formData) => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Request",
        text: "Reset token is missing. Please request a new password reset.",
        showConfirmButton: true,
      });
      navigate(route.forgotPassword);
      return;
    }

    try {
      await resetPassword({
        token: token,
        newPassword: formData.newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "Your password has been reset successfully. Please login with your new password.",
        showConfirmButton: true,
        timer: 3000,
      });

      // Navigate to signin after success
      setTimeout(() => {
        navigate(route.signin);
      }, 2000);
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.error ||
        "Failed to reset password. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper reset-pass-wrap bg-img">
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
                  <h3>Reset password?</h3>
                  <h4>
                    Enter New Password &amp; Confirm Password to get inside
                  </h4>
                </div>

                <div className="form-login mb-3">
                  <label className="form-label">New Password</label>
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
                      type={isNewPasswordVisible ? "text" : "password"}
                      className={`pass-input form-control ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Enter new password"
                      {...register("newPassword")}
                      style={{ paddingLeft: "40px" }}
                    />
                    {!errors.newPassword && (
                      <span
                        className={`fas toggle-passwords ${
                          isNewPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={toggleNewPasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                  {errors.newPassword && (
                    <p className="text-danger mt-2 mb-0">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Confirm Password</label>
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
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      className={`pass-input form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Confirm new password"
                      {...register("confirmPassword")}
                      style={{ paddingLeft: "40px" }}
                    />
                    {!errors.confirmPassword && (
                      <span
                        className={`fas toggle-passworda ${
                          isConfirmPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={toggleConfirmPasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-danger mt-2 mb-0">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div className="form-login">
                  <button
                    type="submit"
                    className="btn btn-login w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Resetting..." : "Change Password"}
                  </button>
                </div>
                <div className="signinform text-center">
                  <h4>
                    Return to{" "}
                    <Link to={route.signin} className="hover-a">
                      {" "}
                      login{" "}
                    </Link>
                  </h4>
                </div>
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

export default Resetpassword;
