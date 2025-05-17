let ws = new WebSocket('wss://web-touchdesigner-1-13ad4ce86bcf.herokuapp.com:443');

let controllTD = document.querySelector('.controllTD') ;
controllTD.addEventListener('input', (event) => {
  ws.send(JSON.stringify({ 'slider1': controllTD.value / 100 }));
}, false);

let txtcontrollTD = document.querySelector('.txtcontrollTD') ;
txtcontrollTD.addEventListener('input', (event) => {
  ws.send(JSON.stringify({ 'slider2': txtcontrollTD.value }));
}, false);



let pulseButtonTD = document.querySelector('.pulseButtonTD');

pulseButtonTD.addEventListener('click', () => {
  ws.send(JSON.stringify({ 'slider3': 1 }));

  // Attendre 0.5 seconde (500 ms), puis envoyer 0
  setTimeout(() => {
    ws.send(JSON.stringify({ 'slider3': 0 }));
  }, 500);
});


let checkboxTD = document.querySelector('.checkboxTD');
checkboxTD.addEventListener('change', () => {
  const value = checkboxTD.checked ? 1 : 0;
  ws.send(JSON.stringify({ 'slider4': value }));
});


let radioButtons = document.querySelectorAll('input[name="optionTD"]');

radioButtons.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      const selected = parseInt(radio.value);
      const data = {
        slider5: selected === 5 ? 1 : 0,
        slider6: selected === 6 ? 1 : 0,
        slider7: selected === 7 ? 1 : 0
      };
      ws.send(JSON.stringify(data));
    }
  });
});


let radioButtons2 = document.querySelectorAll('input[name="groupTD2"]');

radioButtons2.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      const value = parseInt(radio.value);
      ws.send(JSON.stringify({ slider8: value }));
    }
  });
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
