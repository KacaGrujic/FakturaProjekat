
import React from "react";
import { Link } from "react-router-dom";
import "./MenuBar.css";

function MenuBar({ isHome, isShop }) {
  return (
    <div className={isHome === 1 ? "menu-bar" : "menu-else"}>
      <Link to="/" className="link-img-nav">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Earth_Icon.png"
          className={isHome === 1 ? "img-nav" : "img-nav-else"}
          
        />
      </Link>
      {isHome === 1 ? <br /> : <></>}

      <Link to="/" className={isHome == 1 ? "txt-nav" : "txt-nav-else"}>
        FPIS projekat
      </Link>
      <div
        className={
          isHome == 1 ? "menu-bar-items-div" : "menu-bar-items-div-else"
        }
      >
        <Link
          to="/faktura"
          className="menu-bar-items"
          style={isShop === 1 && isHome === 0 ? { color: "black" } : { color: "white" }}
          
        >
          Faktura
        </Link>
        <Link
          to="/zaposleni"
          className="menu-bar-items"
          style={isShop === 0 && isHome === 0  ? { color: "black" } : { color: "white" }}
        >
          Zaposleni
        </Link>
      </div>
     
    </div>
  );
}

export default MenuBar;
