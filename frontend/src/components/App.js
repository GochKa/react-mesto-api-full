import React from 'react';
import '../index.css';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

function App() {

//Переменные состояния видимости popup'ов
const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
const [selectedCard, setSelectCard] = React.useState({link:"", name:""})

//Стейт currentUser и initialCards
const [currentUser, setCurrentUser] = React.useState({})
const [initialCards, setInitialCard] = React.useState([])

//Эффект getUserInfo
React.useEffect(() =>{
  api.getProfile()
  .then((res) =>{
    setCurrentUser(res)
  })
  .catch((err) =>{
    console.error(err)
  })
}, []);

//Эффект getInitialCards
React.useEffect(() =>{
  api.getInitialCards()
    .then((res) =>{
      setInitialCard(res)
    })
    .catch((err)=>{
      console.error(err)
    })
}, [])

//Обновление аватара 
const handleUpdateAvatar = (data) =>{
  api.updateAvatar(data)
   .then((res) =>{
     setCurrentUser(res)
     closeAllPopups()
   })
   .catch((err) =>{
     console.error(err)
   })
}
//Поддержка лайков и дизлайков 
function handleCardLike(card){
  const isLiked = card.likes.some(elm => elm._id === currentUser._id)

    api.changeLikeStatus(card._id, !isLiked)
      .then((newCard) =>{
        setInitialCard((state) => state.map((c) => c._id === card._id ? newCard: c))
      })
   
}

//Удаление карточки со страницы 
function handleDeleatCard(card){
  api.deleatCard(card._id)
    .then(() =>{
      setInitialCard(initialCards => initialCards.filter(c => c._id !== card._id))
    })
    .catch((err) =>{
      console.error(err)
    })
}

//Обновление данных профиля 
const handleUpdateUserInfo = (data) =>{
  api.editProfile(data)
    .then((res) =>{
      setCurrentUser(res)
      closeAllPopups()
    })
    .catch((err) =>{
      console.error(err)
    })
}

//Добавление новой карточки на страницу
const handleAddCard = (newCard) =>{
api.addCard(newCard)
  .then((res) =>{
    setInitialCard([res, ...initialCards]);
    closeAllPopups()
  })
  .catch((err) =>{
    console.error(err)
  })
}

//Обработчики событий на открытие и закрытие popup'ов
    const profileEditClick = () =>{
      setEditProfilePopupOpen(true);
    }    

    const addNewPlaceClick = () =>{
        setAddPlacePopupOpen(true)
    }
    
    const changeAvatarClick = () =>{
        setEditAvatarPopupOpen(true);
    }

    const closeAllPopups = () =>{
        setEditProfilePopupOpen(false)
        setAddPlacePopupOpen(false)
        setEditAvatarPopupOpen(false)
        setSelectCard({link:"", name:""})
    }

    const handleCardClick = (card) =>{
      setSelectCard(card)
      
    }

//JSX код страницы и popup'ов в виде функциональных компонентов
  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page-site">
      <Header />
      <Main 
        onCardClick={handleCardClick}
        onEditProfile={profileEditClick}
        onEditAvatar={changeAvatarClick}
        onAddPlace={addNewPlaceClick}
        cards={initialCards}
        onCardLike={handleCardLike}
        onCardDeleat={handleDeleatCard}
      />
      <Footer />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUserInfo}/>
    
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddCard}/>

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/> 

      <PopupWithForm id="4" name="deleat-submit" title="Вы уверены?" buttonText="Да" />

      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>  
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;