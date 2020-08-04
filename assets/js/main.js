const authData = JSON.parse(localStorage.getItem("authData"))
if(!authData || !authData.authToken){
  window.location.replace('http://localhost:3001')
}

const socket = io();
const inboxPeople = document.querySelector(".inbox__people");
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");
const fallback = document.querySelector('.fallback');
let timeout, previousValue='';
// Handled new user listing

let userName = "";

const newUserConnected = (user) => {
  // userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  userName = user || ( {
    _id: authData._id,
    email: authData.email,
    userName: authData.username.charAt(0).toUpperCase() + authData.username.slice(1)
  } );
  socket.emit("new user", userName);
  addToUsersBox(userName);
};

const addToUsersBox = (userName) => {
  if (document.querySelector(`.${userName.userName}-userlist`)) {
    return;
  }
  let localStore = JSON.parse(localStorage.getItem("authData"))
  const userBox = `
    <div class="chat_ib ${userName.userName}-userlist ${userName._id === authData._id ? 'its-me' : ''}">
      <h5>${userName.userName}</h5>
    </div>
  `;
  inboxPeople.innerHTML += userBox;
};

// Focus on inputField
inputField.focus()
// new user is created so we generate nickname and emit event
newUserConnected();

socket.on("new user", function (data) {
  data.map((user) => addToUsersBox(user));
});

socket.on("user disconnected", function (userName) {
  if(userName && userName.userName){
    document.querySelector(`.${userName.userName}-userlist`).remove();
  }
});

// Handled message renderning

inputField.addEventListener('keyup',(e)=>{
  clearInterval(timeout)
  timeout = setInterval(()=>{
    let val = ''
    if(previousValue !== inputField.value){
      val = inputField.value
      previousValue = inputField.value
    } else {

    }
    socket.emit('typing',{
      isTyping: val.length > 0,
      user: userName.userName
    })
  }, 1000)
  socket.emit('typing',{
    isTyping: inputField.value.length > 0,
    user: userName.userName
  })
})

// inputField.addEventListener('keydown',(e)=>{
//   clearInterval(timeout)
// })
//
inputField.addEventListener('blur',(e)=>{
  clearInterval(timeout)
  previousValue = ''
  socket.emit('typing',{
    isTyping: false,
    user: userName.userName
  })
})

socket.on('typing',(data)=>{
  if(data.isTyping){
    fallback.innerHTML = `<p>${data.user} is typing...</p>`
  } else {
    fallback.innerHTML = ''
  }
  return;
})

messageForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  if(!inputField.value){
    return;
  }
  socket.emit("chat message",{
    message:inputField.value,
    user: userName
  })
  inputField.value = '';
})

socket.on('chat message',(data)=>{
  addNewMessage({
    user: data.user,
    message: data.message
  })
})

const addNewMessage = ({user, message})=>{
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleString('en-US',{ hour: "numeric", minute: "numeric" })

  const receivedMsg = `
  <div class="incoming__message">
    <div class="received__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="message__author">${user.userName}</span>
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>
  `

  const myMsg = `
  <div class="outgoing__message">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`

  messageBox.innerHTML += user._id === userName._id ? myMsg : receivedMsg;
  messageBox.scrollTop = messageBox.scrollHeight;
}
