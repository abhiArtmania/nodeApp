const showValidationError = (msg) => {
  errorMessage.innerHTML = `<span>${msg}</span>`
  errorMessage.style.display = 'block';
  setTimeout(()=> {
    errorMessage.innerHTML = '';
    errorMessage.style.display = 'none';
  }, 3000);
}

async function myFunction() {
  let response = await fetch(`http://localhost:3001/api/logout`,{
    method:'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authData.authToken
    },
    body:JSON.stringify({
      _id: authData._id
    })
  })
  let data = await response.json()
  if(data.success){
    localStorage.removeItem("authData")
    window.location.replace('http://localhost:3001')
  } else {
    showValidationError(data.message)
  }
}
