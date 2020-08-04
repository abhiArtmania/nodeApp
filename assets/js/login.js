const authData = JSON.parse(localStorage.getItem("authData"))
if(authData && authData.authToken){
  window.location.replace('http://localhost:3001/connect')
}

const emailNameInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const loginForm = document.querySelector('.login-form');
const errorMessage = document.querySelector('.error-message');

emailNameInput.focus();
loginForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  if(!emailNameInput.value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailNameInput.value)){
    showValidationError('Invalid email address!');
  } else if(!passwordInput.value){
    showValidationError('Please enter correct password!');
  } else {
    login(emailNameInput.value.trim(),passwordInput.value)
  }
});

const login = async (email,pass) => {
  let response = await fetch(`http://localhost:3001/api/login`,{
    method:'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email:email,
      password:pass
    })
  });
  let data = await response.json()
  if(data.success){
    let authData = {
      authToken: `Bearer ${data.data.authToken}`,
      email: data.data.email,
      username: data.data.username,
      _id: data.data._id
    }
    localStorage.setItem("authData", JSON.stringify(authData))
    window.location.replace('http://localhost:3001/connect')
  } else {
    showValidationError(data.message)
  }
}
