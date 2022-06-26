import React from 'react';
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import ImagePopup from './ImagePopup'
import api from '../utils/Api'
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Login from './Login';
import * as auth from "../utils/auth";
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import Register from './Register';
function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
   const [currentUser, setCurrentUser] = React.useState({});
   const history = useHistory();
   const [userEmailOnHeader, setUserEmailOnHeader] = React.useState('');
   const [message, setMessage] = React.useState(false);
   const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);

   //Стейты popup'ов
   const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
   const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
   const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
   const [selectedCard, setSelectedCard] = React.useState({});

   //Стейт для card'а
   const [cards, setCards] = React.useState([])
  React.useEffect(() => {
    checkToken();
  }, []);

  React.useEffect(() =>{
    if (loggedIn) {
      history.push('/');
    Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([user,cards]) => {
        setCards(cards);
        setCurrentUser(user);
      })
      .catch((err) => {
        console.log(err);
      })
      }
  }, [loggedIn])

//Открытие модалок
function handleEditAvatarClick ()  {
    setIsEditAvatarPopupOpen(true)
}; 
function handleAddPlaceClick ()  {
 setIsAddPlacePopupOpen(true)
}; 
function handleEditProfileClick ()  {
   setIsEditProfilePopupOpen(true)
}
//Закрытие модалок
function closeAllPopups () {
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setSelectedCard({});
    setIsInfoTooltipOpen(false);
}
//Модалка фотографии 
function handleCardClick(card) {
    setSelectedCard(card);
}
//Редактирование информации профиля пользователя
function handleUpdateUser(user) {
  api.editProfile(user.name, user.about)
    .then((user) => {
        setCurrentUser(user)
        closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
}
//Редактирование аватара пользователя
function handleAvatarUpdate({ avatar }) {
  api.setAvatar(avatar)
    .then(() => {
      setCurrentUser({ ...currentUser, avatar });
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    });
}
//Лайк карточки
function handleCardLike(card) {
  const isLikedByCurrentUser = card.likes.some((i) => i === currentUser._id);
  api.changeLikeCardStatus(card._id, isLikedByCurrentUser)
    .then((newCard) => {
      const newCards = cards.map((c) => (c._id === card._id ? newCard.data : c));
      setCards(newCards);
    })
    .catch((res) => {
      console.log(res);
    });
}
//Удаление карточки
function handleCardDelete(card) {
  api.deleteCard(card._id)
    .then(() => {
      setCards((items) => items.filter((c) => c._id !== card._id && c));
    }).catch((err) => {
      console.error(err);
    });
}
//Добваление новой карточки
function handleAddPlaceSubmit(data) {
  api.addCard(data.name, data.link).then((newCard) => {
    setCards([newCard, ...cards]);
    closeAllPopups();
  }).catch((err) => {
    console.error(err);
  });
}
//Логин пользователя
const onLogin = (password, email) => {
  auth
    .authorization(password, email)
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
// Регистрация нового пользователя
const onRegister = (password, email) => {
  auth
    .register(password, email)
    .then((res) => {        
      if(res) {
        setMessage(true);
        history.push('/signin');
      }
    })
    .catch(() => {
      setMessage(false);        
    })
    .finally(() => {
      setIsInfoTooltipOpen(true);
    });
}
//Проверка токена
const checkToken = () => {
  const token = localStorage.getItem('jwt');
  if(token) {
  auth
    .validityToken(token)
    .then((res) => {
      setLoggedIn(true);
      if(res) {
        setUserEmailOnHeader(res.email)
      };
      history.push('/');
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
//Вызод из профиля 
const logoutProfile = () => {
  localStorage.removeItem('jwt');
  setLoggedIn(false);
  setCurrentUser({});
}
//JSX разметка страницы в виде функциональных компонентов
  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="App">
      <div className="wrapper">
      <div className="page">
      <Header userEmailOnHeader={userEmailOnHeader}
      logoutProfile={logoutProfile}
      />
      <Switch>
      <ProtectedRoute
            onCardClick={handleCardClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            component={Main}
            exact path="/"
            loggedIn={loggedIn}
          />
      <Route path="/signin">  
      <Login onLogin={onLogin}></Login>     
          </Route>
          <Route path="/signup">
          <Register 
              onRegister={onRegister}
            />
          </Route>
          <Route path='*'>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signup"/>}
          </Route>
      </Switch>
      <Footer />
      <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          status={message}
        />
      <EditProfilePopup 
      isOpen={isEditProfilePopupOpen} 
      onClose={closeAllPopups} 
      onUpdateUser={handleUpdateUser}/>
      <EditAvatarPopup 
       isOpen={isEditAvatarPopupOpen} 
       onClose={closeAllPopups}
       onSubmit={handleAvatarUpdate} />
      <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleAddPlaceSubmit}
        />
      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
    </div>
    </div>
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
