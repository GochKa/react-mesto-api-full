import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props){
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

//Значение input'ов при открытии popup'ов  
  React.useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen])

//Активация полей формы для изменения их значений  
  function handleChangeCardName(e) {
    setName(e.target.value)
  }

    function handleChangeCardLink(e) {
    setLink(e.target.value)
  }
//Submit формы
  function handleSubmit(e) {
    e.preventDefault();
      props.onAddPlace({
        name,
        link
      });
  }

  return(
    <PopupWithForm name="add" title="Новое место"  buttonText="Создать" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
        <input id="place" type="text" className="popup__text name-place" name="Place" minLength="2" maxLength="30" required
       autoComplete="off" placeholder="Название" value={name} onChange={handleChangeCardName}/>
        <span id="error-place" className="error-message"></span>
        <input id="link" type="url" className="popup__text link" name="Link" required autoComplete="off"
       placeholder="Ссылка на изображение" value={link} onChange={handleChangeCardLink}/>
        <span id="error-link" className="error-message"></span>

</PopupWithForm>  
  )
}

export default AddPlacePopup