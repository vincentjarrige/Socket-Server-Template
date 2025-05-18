let inputElements = document.querySelectorAll('input');

inputElements.forEach(input => {
  const matchingClass = Array.from(input.classList).find(c => c.startsWith('in'));

  if (!matchingClass) return;

  if (input.type === 'button') {
    input.addEventListener('click', () => {
      ws.send(JSON.stringify({ [matchingClass]: 1 }));
      setTimeout(() => {
        ws.send(JSON.stringify({ [matchingClass]: 0 }));
      }, 500);
    });
  }

  else if (input.type === 'checkbox') {
    input.addEventListener('input', () => {
      const value = input.checked ? 1 : 0;
      ws.send(JSON.stringify({ [matchingClass]: value }));
    });
  }

  else if (input.type === 'radio') {
    input.addEventListener('input', () => {
      if (input.checked) {
        ws.send(JSON.stringify({ [matchingClass]: input.value }));
      }
    });
  }

  else {
    input.addEventListener('input', () => {
      let value = input.value;
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
