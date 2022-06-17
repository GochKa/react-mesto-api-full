import React from "react";
import '../index.css';
import { Link, Switch, Route } from 'react-router-dom';
import logo from '../Images/logo.svg';

function Header({userEmailOnHeader}){



  return(
    <header className="header">
        <img src={logo} alt="Логотип" className="header__logo" />
        <div className="header__links">
          <Switch>
            <Route path="/sign-in">
              <Link to="/sign-up"  className="header__link">             
                  Регистрация               
              </Link>
            </Route>
            <Route path="/sign-up">
              <Link to="/sign-in" className="header__link">                
                  Войти
              </Link>
            </Route>
            <Route path="/">
                <p className="header__link header__link_email">
                 {userEmailOnHeader}
                </p>
              <Link to="/sign-in" className="header__link header__link_exit">           
                  Выйти              
              </Link>
            </Route>
          </Switch>
        </div>
    </header>
    
  );
}
export default Header