import React, { useEffect, useState } from "react";
import { Timer as TimerIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLayoutChange } from "../core/redux/action";
import {
  StartTimerButton,
  TimerDisplay,
} from "../feature-module/components/timer";
import { CheckOutlined, CancelOutlined } from "@mui/icons-material";
import { setTimerDescription, resetTimer } from "../core/redux/action";
import { all_routes } from "../Router/all_routes";

const ThemeSettings = () => {
  const timerRunning = useSelector(
    (state) => state.timer?.timerRunning || false
  );
  const totalTime = useSelector(
    (state) => state.timer?.totalTime || "00:00:00"
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerDescription = useSelector(
    (state) => state.timer?.description || ""
  );

  const [show, setShow] = useState(false);
  const showSettings = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="customizer-links" id="setdata">
        <ul className="sticky-sidebar">
          <li className="sidebar-icons" onClick={showSettings}>
            <Link
              to="#"
              className="navigation-add"
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              data-bs-original-title="Theme"
            >
              <TimerIcon fontSize="large" />
            </Link>
          </li>
        </ul>
      </div>

      <div
        className={
          show
            ? "sidebar-settings nav-toggle show-settings"
            : "sidebar-settings nav-toggle"
        }
        id="layoutDiv"
        // onclick="toggleClassDetail()"
      >
        <div className="sidebar-content sticky-sidebar-one">
          <div className="sidebar-header">
            <div className="sidebar-theme-title">
              <h5>Timer</h5>
              <p>Timer Settings</p>
            </div>
            <div className="close-sidebar-icon d-flex">
              {/* <Link className="sidebar-refresh me-2" onclick="resetData()"> */}
              {/* <Link className="sidebar-refresh me-2" onClick={ResetData}>
                ⟳
              </Link> */}
              <Link className="sidebar-close" to="#" onClick={showSettings}>
                X
              </Link>
            </div>
          </div>
          <div className="sidebar-body p-0">
            <form id="theme_color" method="post">
              <div className="theme-mode mb-0">
                <div className="theme-body-main d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-start gap-5">
                    <StartTimerButton />
                    <TimerDisplay />
                  </div>
                  {(timerRunning || totalTime !== "00:00:00") && (
                    <div className="d-flex flex-column align-items-center justify-content-start gap-5">
                      <textarea
                        rows={3}
                        cols={3}
                        value={timerDescription}
                        onChange={(e) =>
                          dispatch(setTimerDescription(e.target.value))
                        }
                        className="form-control"
                        placeholder="Description"
                      />
                      <div className="d-flex align-items-center justify-content-start gap-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => navigate(all_routes.addTimeEntry.path)}
                        >
                          <CheckOutlined /> Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            // reset timer & description
                            dispatch(resetTimer());
                            dispatch(setTimerDescription(""));
                          }}
                        >
                          <CancelOutlined /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {/* <div className="theme-head">
                    <h6>Theme Mode</h6>
                    <p>Enjoy Dark &amp; Light modes.</p>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div
                            className="status-toggle d-flex align-items-center me-2"
                            onClick={LightThemes}
                          >
                            <input
                              type="radio"
                              name="theme-mode"
                              id="light_mode"
                              className="check color-check stylemode lmode"
                              defaultValue="light_mode"
                              defaultChecked
                            />
                            <label
                              htmlFor="light_mode"
                              className="checktoggles"
                            >
                              <ImageWithBasePath
                                src="assets/img/theme/theme-img-01.jpg"
                                alt="img"
                              />
                              <span className="theme-name">Light Mode</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 ere">
                      <div className="layout-wrap">
                        <div className="d-flex align-items-center">
                          <div className="status-toggle d-flex align-items-center me-2">
                            <input
                              type="radio"
                              name="theme-mode"
                              id="dark_mode"
                              className="check color-check stylemode"
                              defaultValue="dark_mode"
                            />
                            <label htmlFor="dark_mode" className="checktoggles">
                              <div onClick={DarkThemes}>
                                <ImageWithBasePath
                                  src="assets/img/theme/theme-img-02.jpg"
                                  alt="img"
                                />
                              </div>

                              <span className="theme-name">Dark Mode</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="theme-mode border-0">
                    {/* <div className="theme-head">
                      <h6>Direction</h6>
                      <p>Select the direction for your app.</p>
                    </div>
                    <div className="row">
                      <div className="col-xl-6 ere">
                        <div className="layout-wrap">
                          <div className="d-flex align-items-center">
                            <div className="status-toggle d-flex align-items-center me-2">
                              <input
                                type="radio"
                                name="direction"
                                id="ltr"
                                className="check direction"
                                defaultValue="ltr"
                                defaultChecked
                              />
                              <label htmlFor="ltr" className="checktoggles">
                                <Link to="/">
                                  <ImageWithBasePath
                                    src="assets/img/theme/theme-img-01.jpg"
                                    alt
                                  />
                                </Link>
                                <span className="theme-name">LTR</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 ere">
                        <div className="layout-wrap">
                          <div className="d-flex align-items-center">
                            <div className="status-toggle d-flex align-items-center me-2">
                              <input
                                type="radio"
                                name="direction"
                                id="rtl"
                                className="check direction"
                                defaultValue="rtl"
                              />
                              <label htmlFor="rtl" className="checktoggles">
                                <Link
                                  to="https://dreamspos.dreamstechnologies.com/react/template-rtl/"
                                  target="_blank"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/theme/theme-img-03.jpg"
                                    alt
                                  />
                                </Link>
                                <span className="theme-name">RTL</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="theme-mode border-0 mb-0">
                      {/* <div className="theme-head">
                        <h6>Layout Mode</h6>
                        <p>Select the primary layout style for your app.</p>
                      </div> */}
                      <div className="row">
                        {/* <div className="col-xl-6 ere">
                          <div className="layout-wrap">
                            <div className="d-flex align-items-center">
                              <div
                                className="status-toggle d-flex align-items-center me-2"
                                onClick={DefaultStyle}
                              >
                                <input
                                  type="radio"
                                  name="layout"
                                  id="default_layout"
                                  className="check layout-mode"
                                  defaultValue="default"
                                />
                                <label
                                  htmlFor="default_layout"
                                  className="checktoggles"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/theme/theme-img-01.jpg"
                                    alt="img"
                                  />
                                  <span className="theme-name">Default</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6 ere">
                          <div className="layout-wrap">
                            <div className="d-flex align-items-center">
                              <div
                                className="status-toggle d-flex align-items-center me-2"
                                onClick={LayoutBox}
                              >
                                <input
                                  type="radio"
                                  name="layout"
                                  id="box_layout"
                                  className="check layout-mode"
                                  defaultValue="box"
                                />
                                <label
                                  htmlFor="box_layout"
                                  className="checktoggles"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/theme/theme-img-07.jpg"
                                    alt="img"
                                  />
                                  <span className="theme-name">Box</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6 ere">
                          <div className="layout-wrap">
                            <div className="d-flex align-items-center">
                              <div
                                className="status-toggle d-flex align-items-center me-2"
                                onClick={collapsedLayout}
                              >
                                <input
                                  type="radio"
                                  name="layout"
                                  id="collapse_layout"
                                  className="check layout-mode"
                                  defaultValue="collapsed"
                                />
                                <label
                                  htmlFor="collapse_layout"
                                  className="checktoggles"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/theme/theme-img-05.jpg"
                                    alt="img"
                                  />
                                  <span className="theme-name">Collapsed</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        {/* <div className="col-xl-6 ere">
                          <div className="layout-wrap">
                            <div className="d-flex align-items-center">
                              <div
                                className="status-toggle d-flex align-items-center me-2"
                                onClick={HorizontalLayout}
                              >
                                <input
                                  type="radio"
                                  name="layout"
                                  id="horizontal_layout"
                                  className="check layout-mode"
                                  defaultValue="horizontal"
                                />
                                <label
                                  htmlFor="horizontal_layout"
                                  className="checktoggles"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/theme/theme-img-06.jpg"
                                    alt
                                  />
                                  <span className="theme-name">Horizontal</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6 ere">
                          <div className="layout-wrap">
                            <div className="d-flex align-items-center">
                              <div
                                className="status-toggle d-flex align-items-center me-2"
                                onClick={modernLayout}
                              >
                                <input
                                  type="radio"
                                  name="layout"
                                  id="modern_layout"
                                  className="check layout-mode"
                                  defaultValue="modern"
                                />
                                <label
                                  htmlFor="modern_layout"
                                  className="checktoggles"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/theme/theme-img-04.jpg"
                                    alt
                                  />
                                  <span className="theme-name">Modern</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    {/* <div id="nav_color" method="post">
                      <div className="theme-mode">
                        <div className="theme-head">
                          <h6>Navigation Colors</h6>
                          <p>Setup the color for the Navigation</p>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 ere">
                            <div className="layout-wrap">
                              <div className="d-flex align-items-center">
                                <div className="status-toggle d-flex align-items-center me-2">
                                  <input
                                    type="radio"
                                    name="nav_color"
                                    id="light_color"
                                    className="check nav-color"
                                    defaultValue="light"
                                  />
                                  <label
                                    htmlFor="light_color"
                                    className="checktoggles"
                                  >
                                    <span
                                      className="theme-name"
                                      onClick={LayoutLight}
                                    >
                                      Light
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4 ere">
                            <div className="layout-wrap">
                              <div className="d-flex align-items-center">
                                <div className="status-toggle d-flex align-items-center me-2">
                                  <input
                                    type="radio"
                                    name="nav_color"
                                    id="grey_color"
                                    className="check nav-color"
                                    defaultValue="grey"
                                  />
                                  <label
                                    htmlFor="grey_color"
                                    className="checktoggles"
                                  >
                                    <span
                                      className="theme-name"
                                      onClick={LayoutGrey}
                                    >
                                      Grey
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4 ere">
                            <div className="layout-wrap">
                              <div className="d-flex align-items-center">
                                <div className="status-toggle d-flex align-items-center me-2">
                                  <input
                                    type="radio"
                                    name="nav_color"
                                    id="dark_color"
                                    className="check nav-color"
                                    defaultValue="dark"
                                  />
                                  <label
                                    htmlFor="dark_color"
                                    className="checktoggles"
                                  >
                                    <span
                                      className="theme-name"
                                      onClick={LayoutDark}
                                    >
                                      Dark
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* <div className="sidebar-footer">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="footer-preview-btn">
                        <button
                          type="button"
                          className="btn btn-secondary w-100"
                          onClick={ResetData}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="footer-reset-btn">
                        <Link to="#" className="btn btn-primary w-100">
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSettings;
