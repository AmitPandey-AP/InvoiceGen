import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";

import { useNavigate } from "react-router-dom";
const Menubar = () => {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const openLogin = () => {
    openSignIn({});
  };

  const { setInvoiceData, initialInvoiceData, setInvoiceTitle } =
    useContext(AppContext);

  const handleGenerateClick = () => {
    setInvoiceData(initialInvoiceData);
    setInvoiceTitle("New Invoice");
    navigate("/generate");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container py-2">
          <Link className="navbar-brand d-flex align-items-center" to={"/"}>
            <Logo />
            <span
              className="fw-bolder fs-4 mx-3"
              style={{ letterSpacing: "-0.5", color: "#0D6EFDB2" }}
            >
              InvoiceGen
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link fw-medium " to={"/Home"}>
                  Home
                </Link>
              </li>
              <SignedIn>
                <li className="nav-item">
                  <Link className="nav-link fw-medium " to={"/dashboard"}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link fw-medium "
                    onClick={handleGenerateClick}
                  >
                    Generate
                  </button>
                </li>
                <UserButton />
              </SignedIn>

              <SignedOut>
                <li className="nav-item">
                  <button
                    onClick={openLogin}
                    className="btn btn-primary rounded-pill px-4"
                  >
                    Login/Signup
                  </button>
                </li>
              </SignedOut>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Menubar;
