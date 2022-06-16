import React from 'react';
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
import {Switch, Route, Redirect, useHistory} from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRout';
import { register, authorization, validityToken } from '../utils/Auth';
import InfoTooltip from './InfoTooltip';

function App() {

//Переменные состояния видимости popup'ов
const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
const [selectedCard, setSelectCard] = React.useState({link:"", name:""})

//Стейт currentUser и initialCards
const [currentUser, setCurrentUser] = React.useState({})
const [initialCards, setInitialCard] = React.useState([])

//Стейт логина
const [loggedIn, setLoggedIn] = React.useState(false)


//Стейт сообщения обуспешном (или не очень) логине
const [message, setMessage] = React.useState(false)

//Стейт отображения модалки успешной авторизации
const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);

//Стейт получения и отображения почты пользователя в профиле
const [userEmailOnHeader, setUserEmailOnHeader] = React.useState('');

const history = useHistory();

React.useEffect(() => {
  checkUserToken();
}, [])

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


//Регистрация на сайте
function onRegister(email, password) {
  register(password, email)
    .then((res) => {
      setIsInfoTooltipOpen(true);
      if(res) {
        setMessage(true);
        history.push('/sign-in');
      }
    })
    .catch(() => {
      setMessage(false);
      setIsInfoTooltipOpen(true);
    });
}

//Логин на сайте 
function onLogin(email, password) {
  
  authorization(password, email)
    .then((res) => {      
      if(res) {
        setLoggedIn(true);
        setUserEmailOnHeader(email);
        history.push('/');
        localStorage.setItem('jwt', res.token);
      }
    })
    .catch(() => {
      setMessage(false);
      setIsInfoTooltipOpen(true);
    });
}

//Проверка токена пользователя
function checkUserToken() {

  const token = localStorage.getItem('jwt');
  if(token) {
    validityToken(token)
    .then((res) => {
      if(res) {
        setUserEmailOnHeader(res.data.email)
      };
      setLoggedIn(true);
      history.push('/');
    })
    .catch((err) => {
      console.log(err);
    });
  }
}

//Выход из профиля
function logoutProfile() {
  localStorage.removeItem('jwt');
  history.push('/sign-in');
  setLoggedIn(false);
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
        setIsInfoTooltipOpen(false)
    }

    const handleCardClick = (card) =>{
      setSelectCard(card)
      
    }

//JSX код страницы и popup'ов в виде функциональных компонентов
  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page-site">
      <Header 
        userEmailOnHeader={userEmailOnHeader}
        logoutProfile={logoutProfile}
        />
      
      <Switch>
        < ProtectedRoute  exact path="/"
          onCardClick={handleCardClick}
          onEditProfile={profileEditClick}
          onEditAvatar={changeAvatarClick}
          onAddPlace={addNewPlaceClick}
          cards={initialCards}
          onCardLike={handleCardLike}
          onCardDeleat={handleDeleatCard}
          component={Main}
          loggedIn={loggedIn}  
          />
        <ProtectedRoute
          component={Footer}
          exact path="/"
          loggedIn={loggedIn}
        />
      <Route path="/sign-in">
        <Login
        onLogin={onLogin} />
      </Route>

      <Route path="/sign-up">
          <Register 
          onRegister={onRegister}/>
        </Route>
        <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up"/>}
          </Route>
      </Switch>
      <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          status={message}
        />

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