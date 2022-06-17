import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props){

//Переменные стейта
const[name, setName] = React.useState("")
const[description, setDescription] = React.useState("")
const currentUser = React.useContext(CurrentUserContext)

React.useEffect(() => {
  setName(currentUser.name);
  setDescription(currentUser.about);
}, [currentUser, props.isOpen]); 

function handleSubmit(e){
  
  e.preventDefault()
  props.onUpdateUser({
    name,
    about: description,
  });
}

function handleChangeUserName(e) {
  setName(e.target.value)
}

function handleChangeUserDescription(e) {
  setDescription(e.target.value)
}

  return(
    <PopupWithForm id="1" name="profile" title="Редактировать профиль" buttonText="Сохранить" onClose={props.onClose} isOpen={props.isOpen} onSubmit={handleSubmit}>
                <input value={name || ''} onChange={handleChangeUserName} id="first" className="popup__text" minLength="2" maxLength="40" required autoComplete="off"
                    name="First_name" />
                <span id="error-first" className="error-message"></span>
                <input value={description || ''} onChange={handleChangeUserDescription} id="profession" className="popup__text profession" minLength="2" maxLength="200" required
                    autoComplete="off" name="Profession" />
                <span id="error-profession" className="error-message"></span>

      </PopupWithForm>  
  )

}

export default EditProfilePopup