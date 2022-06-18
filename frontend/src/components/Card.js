import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(props){
  function handleClick() {
    props.onCardClick(props.card);
  } 

  function handleLikeClick(){
    props.onCardLike(props.card)
  }

  function handleDeleteClick() {
    props.onCardDeleat(props.card)
  }

  const currentUser = React.useContext(CurrentUserContext);
  
  const isOwn = props.card.owner._id === currentUser._id;
  const onCardDeleteButtonClass = (`button-card-delete ${isOwn ?"button-card-delete" : "button-card-delete_disable"}`)

  const isLiked = props.card.likes.some(elm => elm._id === currentUser._id)
  const isLikedButtonClass = (`post-list__like ${isLiked ? "post-list__like_active" : ""}`)

  return(

        <div className="post-list__item">
            <img className="post-list__photo" onClick={handleClick} src={`${props.card.link}`} alt={props.card.name}/>
            <button className={onCardDeleteButtonClass } type="button" onClick={handleDeleteClick}></button>
            <div className="post-list__info">
              <h2 className="post-list__title">{props.card.name}</h2>
              <button className={isLikedButtonClass} type="button" onClick={handleLikeClick}>
                <span className="like-counter">{props.card.likes.length}</span>
              </button>
            </div>
        </div>

  )
}