export const Base_Url = "https://api.mestogram.gocha.nomoreparties.sbs";

function getResponse(res){
  if(res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
}


export const register = (data) => {
  return fetch(`${Base_Url}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password: data.password, email: data.email})
  })
  .then((res) => {
    console.log(res)
    return getResponse(res)
  })
};
export const authorization = (data) => {
  return fetch(`${Base_Url}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password: data.password, email: data.email})
  })
  .then((res) => {
    return getResponse(res)
  })
}

export const validityToken = (token) => {
  return fetch(`${Base_Url}/users/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${token}`
    } 
  })
  .then((res) => {
    return getResponse(res)
  })
}