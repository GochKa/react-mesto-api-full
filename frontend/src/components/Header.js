import React from "react";
import '../index.css';
import logo from '../Images/logo.svg';

function Header(){
  return(
    <header className="header">
        <img src={logo} alt="Логотип" className="header__logo" />
    </header>
    
  );
}
export default Header