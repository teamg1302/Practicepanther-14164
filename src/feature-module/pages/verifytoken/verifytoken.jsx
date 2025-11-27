import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { verifyToken } from "../../../core/services/authService";
import { setAuthData } from "../../../core/redux/action";
import Swal from "sweetalert2";

const Verifytoken = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const route = all_routes;
  const loginEmail = useSelector((state) => state.auth?.loginEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  // Redirect to login if email is not in Redux
  useEffect(() => {
    if (!loginEmail) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to verify OTP.",
        showConfirmButton: true,
      });
      navigate(route.signin);
    }
  }, [loginEmail, navigate, route.signin]);

  // Focus first input on mount
  useEffect(() => {
    if (loginEmail && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [loginEmail]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check if login email exists
    if (!loginEmail) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to verify OTP.",
        showConfirmButton: true,
      });
      navigate(route.signin);
      return;
    }

    const otpValue = otp.join("");

    // Validate all fields are filled
    if (otpValue.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete OTP",
        text: "Please enter all 6 digits.",
        showConfirmButton: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send payload with email and OTP
      const responseData = await verifyToken({
        email: loginEmail,
        otp: otpValue,
        type: type,
      });

      if (type === "forgot-password") {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "OTP Verified",
          text: "Your OTP has been verified successfully.",
          showConfirmButton: true,
          timer: 2000,
        });
        navigate(route.resetpassword.replace(":token", responseData?.token));
      } else {
        // Extract data from response (service already extracts response.data.data)
        const token = responseData?.token;
        const user = responseData?.user;
        const role = user?.role?.name || user?.role;
        const permissions = user?.permissions || [];

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

        // Show success message
        Swal.fire({
          icon: "success",
          title: "OTP Verified",
          text: "Your OTP has been verified successfully.",
          showConfirmButton: true,
          timer: 2000,
        });

        // Navigate to dashboard
        navigate(route.dashboard);
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.message ||
        error?.error ||
        "OTP verification failed. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errorMessage,
        showConfirmButton: true,
      });
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render form if no login email
  if (!loginEmail) {
    return null;
  }

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper forgot-pass-wrap bg-img">
          <div className="login-content">
            <form noValidate onSubmit={onSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <ImageWithBasePath src="assets/img/logo.png" alt="img" />
                </div>
                <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link>
                <div className="login-userheading">
                  <h3>Verify OTP</h3>
                  <h4>
                    Please enter the 6-digit OTP sent to your email to complete
                    the authentication process.
                  </h4>
                </div>
                <div className="form-login mb-4">
                  <label className="form-label text-center d-block mb-3">
                    Enter 6-Digit OTP
                  </label>
                  <div className="wallet-add">
                    <div className="otp-box">
                      <div
                        className="forms-block text-center d-flex justify-content-center align-items-center"
                        style={{
                          flexWrap: "nowrap",
                          gap: "10px",
                          width: "100%",
                        }}
                      >
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="form-control"
                            disabled={isSubmitting}
                            inputMode="numeric"
                            autoComplete="off"
                            style={{
                              width: "clamp(40px, 8vw, 60px)",
                              height: "clamp(40px, 8vw, 60px)",
                              fontSize: "clamp(18px, 4vw, 24px)",
                              textAlign: "center",
                              padding: "0",
                              margin: "0",
                              flex: "0 0 auto",
                              border: "1px solid #E1E1E1",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              color: "#000",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-login">
                  <button
                    type="submit"
                    className="btn btn-login w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
                <div className="signinform text-center">
                  <h4>
                    Return to
                    <Link to={route.signin} className="hover-a">
                      {" "}
                      login{" "}
                    </Link>
                  </h4>
                </div>
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

export default Verifytoken;
