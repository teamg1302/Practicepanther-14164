import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Twitter, Linkedin, Facebook, Globe } from "react-feather";
import { all_routes } from "@/Router/all_routes";

/**
 * Footer component for the application
 * @component
 * @returns {JSX.Element} Footer component with links, copyright and social media icons
 */
const Footer = () => {
  const auth = useSelector((state) => state.auth);
  const currentYear = new Date().getFullYear();
  const companyName =  "Jurisoft";
  const route = all_routes;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-column">
            <h6 className="footer-heading">Company</h6>
            <ul className="footer-links">
              <li>
                <Link to="#">About Jurisoft</Link>
              </li>
              <li>
                <Link to="#">Product Vision</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h6 className="footer-heading">Product</h6>
            <ul className="footer-links">
              <li>
                <Link to="#">Features</Link>
              </li>
              <li>
                <Link to="#">Updates</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h6 className="footer-heading">Support</h6>
            <ul className="footer-links">
              <li>
                <Link to="#">Help Center</Link>
              </li>
              <li>
                <Link to="#">Contact Support</Link>
              </li>
              <li>
                <Link to="#">Report Issue</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h6 className="footer-heading">Legal</h6>
            <ul className="footer-links">
              <li>
                <Link to="#">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="#">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#">Data Protection</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h6 className="footer-heading">Account</h6>
            <ul className="footer-links">
              <li>
                <Link to={route.settings?.[2]?.path || "#"}>Subscription</Link>
              </li>
              <li>
                <Link to="#">Billing</Link>
              </li>
              <li>
                <Link to={route.settings?.[1]?.children?.[0]?.path || "#"}>
                  User Management
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>© {currentYear} {companyName}. All Rights Reserved.</p>
            </div>
            <div className="footer-social">
              <Link to="#" aria-label="Twitter">
                <Twitter size={18} />
              </Link>
              <Link to="#" aria-label="LinkedIn">
                <Linkedin size={18} />
              </Link>
              <Link to="#" aria-label="Facebook">
                <Facebook size={18} />
              </Link>
              <Link to="#" aria-label="Website">
                <Globe size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
