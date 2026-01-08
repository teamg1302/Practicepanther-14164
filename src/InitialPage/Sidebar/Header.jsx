/**
 * Header component for the application navigation bar.
 * @module InitialPage/Sidebar/Header
 *
 * Features:
 * - Logo and branding
 * - Search functionality
 * - Fullscreen toggle
 * - Email notifications
 * - User notifications
 * - Settings access
 * - User profile dropdown with logout
 * - Responsive mobile menu
 * - Sidebar toggle functionality
 *
 * @component
 * @returns {JSX.Element} Header component with navigation and user controls
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { Lock } from "react-feather";
import { Search, Settings, XCircle } from "react-feather";

import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { EventRepeatOutlined } from "@mui/icons-material";
import { all_routes } from "../../Router/all_routes";
import { logout } from "../../core/services/authService";
import { clearAuth } from "../../core/redux/action";
import { useIsOwner } from "../../core/utilities/utility";
import { resetMasters } from "../../core/redux/mastersReducer";

const Header = () => {
  const isOwner = useIsOwner();
  const auth = useSelector((state) => state.auth);
  const route = all_routes;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * Handles user logout process.
   * Clears authentication data from Redux store and localStorage,
   * then navigates to the signin page.
   *
   * @param {Event} e - Click event object
   * @returns {void}
   */
  const handleLogout = (e) => {
    e.preventDefault();
    // Clear auth from Redux store
    dispatch(clearAuth());
    // Clear token from localStorage

    // Clear masters from Redux store
    dispatch(resetMasters());

    logout();
    // Navigate to signin page
    navigate(route.signin);
  };

  /**
   * Checks if an element is visible on the page.
   *
   * @param {HTMLElement|null} element - DOM element to check
   * @returns {boolean} True if element has width or height, false otherwise
   */
  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };

  /**
   * Effect hook to handle mouseover events for sidebar toggle button.
   * Prevents default behavior when sidebar is in mini mode and toggle button is visible.
   */
  useEffect(() => {
    const handleMouseover = (e) => {
      e.stopPropagation();

      const body = document.body;
      const toggleBtn = document.getElementById("toggle_btn");

      if (
        body.classList.contains("mini-sidebar") &&
        isElementVisible(toggleBtn)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("mouseover", handleMouseover);

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
    };
  }, []);

  /**
   * Effect hook to monitor fullscreen state changes.
   * Updates isFullscreen state based on browser fullscreen API support.
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  /**
   * Toggles the sidebar between expanded and mini (collapsed) states.
   * Updates the toggle state and applies CSS class to body element.
   *
   * @returns {void}
   */
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };

  /**
   * Removes the expand-menu class from body element.
   * Called when mouse leaves the header-left area.
   *
   * @returns {void}
   */
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };

  /**
   * Adds the expand-menu class to body element.
   * Called when mouse enters the header-left area.
   *
   * @returns {void}
   */
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  /**
   * Toggles the mobile sidebar overlay.
   * Opens/closes the mobile menu by toggling CSS classes on multiple elements.
   *
   * @returns {void}
   */
  const sidebarOverlay = () => {
    document?.querySelector(".main-wrapper")?.classList?.toggle("slide-nav");
    document?.querySelector(".sidebar-overlay")?.classList?.toggle("opened");
    document?.querySelector("html")?.classList?.toggle("menu-opened");
  };

  let pathname = location.pathname;

  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-one",
  ];
  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }

  /**
   * Toggles fullscreen mode for the application.
   * Supports multiple browser implementations (standard, Mozilla, WebKit, MS).
   *
   * @param {HTMLElement} [elem=document.documentElement] - Element to make fullscreen
   * @returns {void}
   */
  const toggleFullscreen = (elem) => {
    elem = elem || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const getTextColor = (bgColor) => {
    // console.log(bgColor);
    if (!bgColor) {
      return "#000000";
    }
    // Remove '#' if present
    const color = bgColor.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Light background → black text
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  return (
    <>
      <div
        className={`header`}
        style={{
          backgroundColor: auth?.user?.firmId?.colorScheme?.headerColor,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
        }}
      >
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link to="/" className="logo logo-normal">
            <img
              src={
                auth?.user?.firmId?.portalLogo ||
                "/company/assets/img/Jurisoft-logo-hr.png"
              }
              alt={auth?.user?.firmId?.name || "Jurisoft"}
              style={{
                objectFit: "cover",
                maxWidth: "260px",
                maxHeight: "66px",
                width: "auto",
                height: "auto",
                display: "block",
              }}
            />
          </Link>
          {/* <Link to="/dashboard" className="logo logo-white">
            <ImageWithBasePath src="assets/img/logo-white.png" alt="img" />
          </Link>
          <Link to="/dashboard" className="logo-small">
            <ImageWithBasePath src="assets/img/logo-small.png" alt="img" />
          </Link> */}
          <Link
            id="toggle_btn"
            to="#"
            role="button"
            aria-label="Toggle sidebar"
            aria-expanded={!toggle}
            style={{
              display:
                pathname.includes("tasks") || pathname.includes("pos")
                  ? "none"
                  : pathname.includes("compose")
                  ? "none"
                  : "",
            }}
            onClick={handlesidebar}
          >
            <FeatherIcon
              icon="chevrons-left"
              className="feather-16"
              aria-hidden="true"
            />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          role="button"
          aria-label="Toggle mobile menu"
          aria-expanded="false"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
          {/* Search */}
          <li className="nav-item nav-searchinputs">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <Search />
              </Link>
              <form action="#" className="dropdown" role="search">
                <div
                  className="searchinputs dropdown-toggle"
                  id="dropdownMenuClickable"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="false"
                  role="button"
                  aria-label="Search"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <input
                    type="text"
                    placeholder="Search"
                    aria-label="Search input"
                    aria-describedby="search-description"
                  />
                  <div className="search-addon">
                    <span>
                      <XCircle className="feather-14" aria-hidden="true" />
                    </span>
                  </div>
                </div>
                <div
                  className="dropdown-menu search-dropdown"
                  aria-labelledby="dropdownMenuClickable"
                >
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="search" className="feather-16" />
                      </span>
                      Recent Searches
                    </h6>
                    <ul className="search-tags">
                      <li>
                        <Link to="#">Products</Link>
                      </li>
                      <li>
                        <Link to="#">Sales</Link>
                      </li>
                      <li>
                        <Link to="#">Applications</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="help-circle" className="feather-16" />
                      </span>
                      Help
                    </h6>
                    <p>
                      How to Change Product Volume from 0 to 200 on Inventory
                      management
                    </p>
                    <p>Change Product Name</p>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="user" className="feather-16" />
                      </span>
                      Customers
                    </h6>
                    <ul className="customers">
                      <li>
                        <Link to="#">
                          Aron Varu
                          <ImageWithBasePath
                            src="assets/img/profiles/avator1.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Jonita
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Aaron
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-10.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </li>
          {/* /Search */}

          {/* Select Store */}
          {/* <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
            <Link
              to="#"
              className="dropdown-toggle nav-link select-store"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                <span className="user-letter">
                  <ImageWithBasePath
                    src="assets/img/store/store-01.png"
                    alt="Store Logo"
                    className="img-fluid"
                  />
                </span>
                <span className="user-detail">
                  <span className="user-name">Select Store</span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/store/store-01.png"
                  alt="Store Logo"
                  className="img-fluid"
                />{" "}
                Grocery Alpha
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/store/store-02.png"
                  alt="Store Logo"
                  className="img-fluid"
                />{" "}
                Grocery Apex
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/store/store-03.png"
                  alt="Store Logo"
                  className="img-fluid"
                />{" "}
                Grocery Bevy
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/store/store-04.png"
                  alt="Store Logo"
                  className="img-fluid"
                />{" "}
                Grocery Eden
              </Link>
            </div>
          </li> */}
          {/* /Select Store */}

          {/* Flag */}
          {/* <li className="nav-item dropdown has-arrow flag-nav nav-item-box"> */}
          {/* <Link
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              to="#"
              role="button"
            > */}
          {/* <i data-feather="globe" /> */}
          {/* <FeatherIcon icon="globe" /> */}
          {/* <ImageWithBasePath
                src="assets/img/flags/us.png"
                alt="img"
                height={16}
              />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to="#" className="dropdown-item active">
                <ImageWithBasePath
                  src="assets/img/flags/us.png"
                  alt="img"
                  height={16}
                />
                English
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/fr.png"
                  alt="img"
                  height={16}
                />{" "}
                French
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/es.png"
                  alt="img"
                  height={16}
                />{" "}
                Spanish
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/de.png"
                  alt="img"
                  height={16}
                />{" "}
                German
              </Link>
            </div> */}
          {/* </li> */}
          {/* /Flag */}
          <li className="nav-item nav-item-box">
            <Link
              to="#"
              id="btnFullscreen"
              role="button"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              onClick={() => toggleFullscreen()}
              className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
              {/* <i data-feather="maximize" /> */}
              <FeatherIcon icon="maximize" aria-hidden="true" />
            </Link>
          </li>

          {/* <li className="nav-item nav-item-box">
            <Link to="#" aria-label="Email notifications (1 unread)">
              <i data-feather="mail" />
              <FeatherIcon icon="mail" aria-hidden="true" />
              <span className="badge rounded-pill" aria-label="1 unread email">
                1
              </span>
            </Link>
          </li> */}
          {/* Notifications */}
          {/* <li className="nav-item dropdown nav-item-box">
            <Link
              to="#"
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
              role="button"
              aria-label="Notifications (2 unread)"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <i data-feather="bell" />
              <FeatherIcon icon="bell" aria-hidden="true" />
              <span
                className="badge rounded-pill"
                aria-label="2 unread notifications"
              >
                2
              </span>
            </Link>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <Link to="#" className="clear-noti">
                  {" "}
                  Clear All{" "}
                </Link>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message active">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-02.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">John Doe</span> added
                            new task{" "}
                            <span className="noti-title">
                              Patient appointment booking
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              4 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-03.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Tarah Shropshire</span>{" "}
                            changed the task name{" "}
                            <span className="noti-title">
                              Appointment booking with payment gateway
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              6 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-06.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Misty Tison</span>{" "}
                            added{" "}
                            <span className="noti-title">Domenic Houston</span>{" "}
                            and <span className="noti-title">Claire Mapes</span>{" "}
                            to project{" "}
                            <span className="noti-title">
                              Doctor available module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              8 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-17.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Rolland Webber</span>{" "}
                            completed task{" "}
                            <span className="noti-title">
                              Patient and Doctor video conferencing
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              12 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-13.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Bernardo Galaviz</span>{" "}
                            added new task{" "}
                            <span className="noti-title">
                              Private chat module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              2 days ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link to="#">View all Notifications</Link>
              </div>
            </div>
          </li> */}
          {/* /Notifications */}
          <li className="nav-item nav-item-box">
            <Link to="/settings/personal" aria-label="Settings">
              <i data-feather="settings" />
              <FeatherIcon icon="settings" aria-hidden="true" />
            </Link>
          </li>

          {isOwner && (
            <li className="nav-item nav-item-box">
              <Link to={route.settings[2].path} aria-label="Subscriptions">
                <EventRepeatOutlined />
              </Link>
            </li>
          )}

          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
              role="button"
              aria-label="User menu"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span
                className="user-info"
                style={{
                  "--user-info-after-color": getTextColor(
                    auth?.user?.firmId?.colorScheme?.headerColor
                  ),
                }}
              >
                <span className="user-letter">
                  <img
                    src={
                      auth?.user.profileImage ||
                      "/company/assets/img/Jurisoft-logo-hr.png"
                    }
                    alt={auth?.user?.name}
                    className="img-fluid"
                  />
                </span>
                <span className="user-detail">
                  <span
                    className="user-name"
                    style={{
                      color: getTextColor(
                        auth?.user?.firmId?.colorScheme?.headerColor
                      ),
                    }}
                  >
                    {auth?.user.name}
                  </span>
                  <span
                    className="user-role"
                    style={{
                      color: getTextColor(
                        auth?.user?.firmId?.colorScheme?.headerColor
                      ),
                    }}
                  >
                    {auth?.role}
                  </span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                {/* <div className="profileset">
                  <span className="user-img">
                    <ImageWithBasePath
                      src="assets/img/profiles/avator1.jpg"
                      alt="img"
                    />
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6>John Smilga</h6>
                    <h5>Super Admin</h5>
                  </div>
                </div>
                <hr className="m-0" /> */}

                <Link className="dropdown-item" to={route.settings[0].path}>
                  <Settings className="me-2" />
                  Personal Settings
                </Link>
                <hr className="m-0" />
                <Link
                  className="dropdown-item"
                  to={route.settings[0].children[1].path}
                >
                  <Lock className="me-2" />
                  Change Password
                </Link>
                <hr className="m-0" />
                {isOwner && (
                  <>
                    <Link className="dropdown-item" to={route.settings[2].path}>
                      <EventRepeatOutlined className="me-2" />
                      Subscriptions
                    </Link>
                    <hr className="m-0" />
                  </>
                )}

                <Link
                  className="dropdown-item logout pb-0"
                  to="/signin"
                  onClick={handleLogout}
                >
                  <ImageWithBasePath
                    src="assets/img/icons/log-out.svg"
                    alt="img"
                    className="me-2"
                  />
                  Logout
                </Link>
              </div>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            role="button"
            aria-label="Mobile user menu"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <i className="fa fa-ellipsis-v" aria-hidden="true" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="generalsettings">
              Settings
            </Link>
            <Link className="dropdown-item" to="signin" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
