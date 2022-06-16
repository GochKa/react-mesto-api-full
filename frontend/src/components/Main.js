import React from "react";
import '../index.css';
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props){
  
  const currentUser = React.useContext(CurrentUserContext);
  const onEditProfile = () =>{
    props.onEditProfile(props.onClick)
  }

  const onAddPlace = () =>{
    props.onAddPlace(props.onClick)
  }

  const onEditAvatar = () =>{
    props.onEditAvatar(props.onClick)
  }

  return(
    <main className="content">

    <section className="profile">
      <button type="button" className="change-avatar" onClick={onEditAvatar}>
        <img src={currentUser.avatar} alt="Профиль" className="profile__avatar"/>
       </button>
       <div className="profile__info">
          <h1 className="profile__info-title">{currentUser.name}</h1>
          <button className="edit-button" type="button" onClick={onEditProfile}>
           </button>
           <p className="profile__info-subtitle">{currentUser.about}</p>
       </div>
    <button className="add-bottun" type="button" onClick={onAddPlace}></button>
    </section>
    <section className="post-list">
      {props.cards.map(card =>(
        <Card 
        key={card._id}
        card={card}
        onCardDeleat={props.onCardDeleat}
        onCardLike={props.onCardLike}
        onCardClick={props.onCardClick}
        />
      )
      )}
      </section>

  </main>
  );
}

export default Main