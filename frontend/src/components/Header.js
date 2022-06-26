import logo from '../images/Vector.svg'
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
function Header(props) {
    const location = useLocation();
    const [isClicked, setIsClicked] = React.useState(false);

  React.useEffect(() => {
    setIsClicked(!isClicked);
  }, [location])
    return (
        <header className="header">
             <img src={logo} className="header__logo" alt="Логотип"/>
            <div className='header__auth-group'>
            <p className="header__email">
            {location.pathname === "/" ? props.userEmailOnHeader : ""}</p>
          <Link to={location.pathname === "/sign-up" ? "/sign-in" : location.pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
            className="header__link"
            onClick={location.pathname === "/" ? props.logoutProfile : () => {}}>
            {location.pathname === "/sign-up" ? "Войти" : location.pathname === "/sign-in" ? "Регистрация" : "Выйти"}
          </Link>
          </div>
    </header>
    );
  }
  
  export default Header;

