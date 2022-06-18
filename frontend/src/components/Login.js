import { React, useState } from 'react';

export default function Login({onLogin}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(email, password);
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h3 className="login-form__title">Вход</h3>
      <input className="login-form__input login-form__input_login-email" placeholder="Email" 
        type="email" onChange={handleEmailChange} required value={email}/>
      <input className="login-form__input login-form__input_login-pass" placeholder="Пароль" 
        type="password" onChange={handlePasswordChange} required value={password}/>
      <button className="login-form__button" type="submit">Войти</button>
    </form>
  )
}