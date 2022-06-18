import React from "react";
import '../index.css';

function ImagePopup(props){
  return(
    <article className={`popup preview-popup ${props.card.link && "popup_opened"}`}>
    <div className="preview-popup__container">
        <button className="popup__close button-close-preview-popup" type="button" onClick={props.onClose}></button>
        <img 
        src={props.card.link}
        alt={props.card.name}  
        className="preview-popup__img" />
        <h2 className="preview-popup__title">{props.card.name}</h2>
    </div>
</article>
  )
}
export default ImagePopup