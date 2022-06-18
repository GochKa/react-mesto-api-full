import React from "react";
import '../index.css';

function PopupWithForm(props){
  return(
    <article className={`popup ${props.name}-popup ${props.isOpen && "popup_opened"}`}>
    <div className="popup__container">
        <button className="popup__close" type="button" onClick={props.onClose}></button>
        <h2 className="popup__title">{props.title}</h2>
        <form className={`popup__form popup__form-${props.name}`} name="Popup" noValidate onSubmit={props.onSubmit}>
            {props.children}
            <button className="popup__add button-profile-submit" type="submit">{props.buttonText}</button>
        </form>
    </div>
</article>
  )
}

export default PopupWithForm