class Api {
  constructor({ baseUrl, headers}) {
    this._headers = headers;
    this._baseUrl = baseUrl;
  }


  getProfile(){
    return fetch("https://api.mestogram.gocha.nomoreparties.sbs/users/me", {
      headers:  this._headers
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .catch(console.log)
  }

  getInitialCards(){
    return fetch("https://api.mestogram.gocha.nomoreparties.sbs/cards", {
      headers:  this._headers
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .catch(console.log)
  }
  editProfile(data){
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers:  this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .catch(console.log)
  }

  addCard(data){
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers:  this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .catch(console.log)
  }

  deleatCard(id){
    return fetch(`${this._baseUrl}/cards/${id} `, {
      method: "DELETE",
      headers:  this._headers
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .catch(console.log)
  }



  changeLikeStatus(id, isLiked){
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers:  this._headers
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .catch(console.log)
  }

  updateAvatar(avatar){
    return fetch("https://api.mestogram.gocha.nomoreparties.sbs/users/me/avatar" , {
      method: "PATCH",
      headers:  this._headers,
      body: JSON.stringify({
        avatar
      })
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .catch(console.log)
  }
}
 

const api = new Api({
  baseUrl: 'https://api.mestogram.gocha.nomoreparties.sbs',
  headers: {
    authorization: "7d4e165e-60aa-456b-9d6e-f945ad75e103",
    "Content-Type": 'application/json'
  }
});

export default api