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
          <Link to={location.pathname === "/signup" ? "/signin" : location.pathname === "/signin" ? "/signup" : "/signin"}
            className="header__link"
            onClick={location.pathname === "/" ? props.logoutProfile : () => {}}>
            {location.pathname === "/signup" ? "Войти" : location.pathname === "/signin" ? "Регистрация" : "Выйти"}
          </Link>
          </div>
    </header>
    );
  }
  
  export default Header;

