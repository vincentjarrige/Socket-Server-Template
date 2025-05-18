let ws = new WebSocket('wss://web-touchdesigner-1-13ad4ce86bcf.herokuapp.com:443');

let inputElements = document.querySelectorAll('input');

inputElements.forEach(input => {
  // Vérifie si l'input a au moins une classe qui commence par 'in'
  const matchingClass = Array.from(input.classList).find(c => c.startsWith('in'));
  
  if (matchingClass) {
    input.addEventListener('input', () => {
      let value;

      if (input.type === 'checkbox' || input.type === 'radio') {
        value = input.checked ? 1 : 0;
      } else {
        value = input.value;
      }

      ws.send(JSON.stringify({ [matchingClass]: isNaN(value) ? value : parseFloat(value) }));
    });
  }
});





let controlledByTD1 = document.querySelector('.controlledByTD1');
let controlledByTD2 = document.querySelector('.controlledByTD2');

ws.addEventListener('open', (event) => {
  console.log('Socket connection open');
  // alert('Successfully connected to socket server 🎉');
  ws.send('pong');
});

ws.addEventListener('message', (message) => {
  if (message && message.data) {
    if (message.data === "ping") {
      console.log("got ping");
      ws.send("pong");
      return;
    }
    let data = JSON.parse(message.data);
    if (data) {
      if ("slider1" in data) {
        controlledByTD1.value = data["slider1"] * 100;
      }
      if ("slider2" in data) {
        controlledByTD2.value = data["slider2"] * 100;
      }
      console.log("got data", data);
    }
  }
  console.log("message", message)
});

ws.addEventListener('error', (error) => {
    console.error('Error in the connection', error);
    alert('error connecting socket server', error);
});

ws.addEventListener('close', (event) => {
    console.log('Socket connection closed');
    alert('closing socket server');
});
