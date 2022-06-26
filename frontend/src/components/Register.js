import React from 'react';
import { Link } from 'react-router-dom';

function Register(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onRegister(password, email);
  }
  return (
    <section className="login">
      <h2 className="login__title">Регистрация</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <input className="login__input" type="email" placeholder="Email" value={email}
          onChange={handleEmailChange} required />
        <input className="login__input" type="password" placeholder="Пароль" value={password} autoComplete="on"
          onChange={handlePasswordChange} required />
        <button className="login__button" type="submit">Зарегистрироваться</button>
      </form>
      <p className="login__text">Уже зарегистрированы? <Link to="/sign-in" className="login__link">Войти</Link></p>
    </section>
  );
}

export default Register;