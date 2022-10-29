import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import MenuIcon from "./MenuIcon";
import "./navbar.scss";

const Navbar = () => {
  // const [error, setError] = useState();

  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img style={{ width: "250px", height: "80px" }} src={logo} />
      </Link>
      {/* <div onClick={handleClick} className="nav-icon">
        {open ? <FiX /> : <FiMenu />}
      </div> */}
      <ul className={open ? "nav-links active" : "nav-links"}>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={closeMenu}>
            <div className="navtextstyle">Home</div>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/player" className="nav-link" onClick={closeMenu}>
            <div className="navtextstyle">Player</div>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/explore" className="nav-link" onClick={closeMenu}>
            <div className="navtextstyle">Explore</div>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/streaming" className="nav-link" onClick={closeMenu}>
            <div className="navtextstyle">Stream</div>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link" onClick={closeMenu}>
            <div className="navtextstyle">Profile</div>
          </Link>
        </li>
      </ul>
      <div className="nav-ham-menu"  onClick={()=>{setMenu(!menu)}}>
        <MenuIcon />
      </div>
      {
        menu
          ?
          <div className="mobile-menu">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/">Player</Link>
              </li>
              <li>
                <Link to="/">Explore</Link>
              </li>
              <li>
                <Link to="/">Stream</Link>
              </li>
              <li>
                <Link to="/">Profile</Link>
              </li>
            </ul>
          </div>
          :
          null
      }
    </nav>
  );
};

export default Navbar;
