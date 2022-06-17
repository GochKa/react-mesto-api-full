import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props){
  const avatarRef = React.useRef()

  function handleSubmit(e) {
    e.preventDefault();
    const avatar = avatarRef.current.value
    props.onUpdateAvatar(avatar);
    }
    
    React.useEffect(() =>{
      avatarRef.current.value=""
    },[props.onClose, props.isOpen])

  return(
    <PopupWithForm onSubmit={handleSubmit} onClose={props.onClose} isOpen={props.isOpen} title="Обновить аватар" buttonText="Сохранить" name="avatar" >
      <input 
        ref={avatarRef}
        id="image-link"
        type="url"
        className="popup__text profile-photo" 
        name="link"       
        required
        autoComplete="off"
        placeholder="Ссылка на изображение" 
        
         />
      <span id="error-image-link" className="error-message"></span>

    </PopupWithForm>
  )
}

export default EditAvatarPopup