import React from 'react';
import successIcon from '../Images/success-icon.svg';
import failIcon from '../Images/fail-icon.svg';

function InfoTooltip(props) {

  return (
    <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className="infoTooltip">
        <img className="infoTooltip__image" src={props.status ? successIcon : failIcon} />
        <p className="infoTooltip__text">
          {props.status ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
        </p>
        <button type="button" className="popup__close" onClick={props.onClose} />
      </div>
    </div>
  )
}

export default InfoTooltip;