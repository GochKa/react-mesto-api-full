import React from 'react';
import checkIcon from '../images/Union(3).svg';
import crossIcon from '../images/Union(2).svg';

function InfoTooltip(props) {
    const closeClickOverlay = (e) => {
        if (e.target.classList.contains('popup')) {
          props.onClose()
        }
      }
      React.useEffect(() => {
        const closeClickEsc = (e) => {
          if (e.key === "Escape") {
            props.onClose()
          }
        }
        document.addEventListener('keyup', closeClickEsc);
        return () => {
          document.removeEventListener('keyup', closeClickEsc);
        }
      }, []);
  return ( 
    <div className= {`popup popup_type_open ${props.isOpen && 'popup_opened'}`} onClick={closeClickOverlay}>
      <div className="popup__container">
      <button type="button" className="popup__close" onClick={props.onClose} ></button>
        <img className="popup__img_info" src={props.status ? crossIcon : checkIcon} />
        <p className="popup__text_info">
          {props.status ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
        </p>
      </div>
    </div>
  )
}

export default InfoTooltip;