const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')

socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
})

socket.on('buzzes', (buzzes) => {
  console.log(buzzes);
  if (buzzList.children.length == 0 && buzzes.length > 0) {
    // Play sound
    const audio = new Audio(`/sounds/${buzzes[0].sound}.mp3`);
    audio.play();
  }
  buzzList.innerHTML = buzzes
    .map(user => `<div class="buzz">${user.name}</div>`)
    .join('')
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})

