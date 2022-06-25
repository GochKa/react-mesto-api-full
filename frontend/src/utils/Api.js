 class Api {
     constructor({ baseUrl }) {
         this.url = baseUrl
     }

     get _headers() {
         return {
             'Content-Type': 'application/json',
             authorization: `Bearer ${localStorage.getItem("jwt")}`,
         }
     }

     _checkResponse(res) {
         if (res.ok) {
             return res.json()
         } else {
             return Promise.reject(res.status)
         }
     }
     getProfile() {
         return fetch(`${this.url}/users/me`, {
             headers: this._headers
         }).then(this._checkResponse)
     }

     getInitialCards() {
         return fetch(`${this.url}/cards`, {
             headers: this._headers
         }).then(this._checkResponse)
     }
     editProfile(name, about) {
         return fetch(`${this.url}/users/me`, {
                 method: 'PATCH',
                 headers: this._headers,
                 body: JSON.stringify({
                     name,
                     about
                 })
             })
             .then(this._checkResponse)
     }
     addCard(name, link) {
         return fetch(`${this.url}/cards`, {
             method: "POST",
             headers: this._headers,
             body: JSON.stringify({
                 name,
                 link
             })
         }).then(this._checkResponse)
     }

     deleteCard(id) {
         return fetch(`${this.url}/cards/${id} `, {
             method: "DELETE",
             headers: this._headers,
         }).then(this._checkResponse)
     }
     deleteLike(id) {
         return fetch(`${this.url}/cards/${id}/likes `, {
             method: "DELETE",
             headers: this._headers,
         }).then(this._checkResponse)
     }
     addLike(id) {
         return fetch(`${this.url}/cards/${id}/likes `, {
             method: "PUT",
             headers: this._headers,
         }).then(this._checkResponse)
     }
     changeLikeCardStatus(id, isLiked) {
         if (isLiked === true) {
             return this.deleteLike(id);
         } else {
             return this.addLike(id);
         }
     }
     setAvatar(avatar) {
         return fetch(`${this.url}/users/me/avatar`, {
             method: 'PATCH',
             headers: this._headers,
             body: JSON.stringify({
                 avatar
             })
         }).then(this._checkResponse)
     }
 }

 const api = new Api({
     baseUrl: 'https://api.mestogram.gocha.nomoreparties.sbs',
 });
 export default api