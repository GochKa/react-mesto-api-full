import React from "react";
import { Link } from "react-router-dom";

export default function Register({onRegister}){

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }
  
  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(email, password);
  }

  return(
    <form className="login-form" onSubmit={handleSubmit}>
      <h3 className="login-form__title">Регистрация</h3>
      <input className="login-form__input login-form__input_login-email" placeholder="Email" 
        type="email" required  onChange={handleEmailChange} value={email}/>
      <input className="login-form__input login-form__input_login-pass" placeholder="Пароль" 
        type="password" required onChange={handlePasswordChange} value={password}/>
      <button className="login-form__button" type="submit">Зарегистрироваться</button>
      <div className="login-form__text">
        Уже зарегистрированы? 
        <Link to="/sign-in" className="login-form__link">Войти</Link>
      </div>
    </form>
  )
} 
