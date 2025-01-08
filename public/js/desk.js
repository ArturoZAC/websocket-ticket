const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');
const lblCurrentTicket = document.querySelector('small');

const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('Escritorio es requerido')
}

const deskNumber = searchParams.get('escritorio');
let workingTicket = null;
deskHeader.innerText = deskNumber;

const checkTicketCount = ( initialCount = 0 ) => {
  if( initialCount === 0 ){
    noMoreAlert.classList.remove('d-none');
  }else {
    noMoreAlert.classList.add('d-none');
  }

  lblPending.innerHTML = initialCount;
}

const loadInitialCount = async () => {
  try {
    const pending = await fetch('/api/ticket/pending')
    const data = await pending.json();
    // console.log(data)
    checkTicketCount( data.length );
  } catch (error) {
    throw new Error ({error: error})
  }
}

const getTicket = async() => {
  await finishTicket();

  try {
    const data = await fetch(`/api/ticket/draw/${ deskNumber}`)
    const { status, ticket, message } = await data.json();
    
    if( status === 'error' ){
      lblCurrentTicket.innerText = message;
      return;
    }

    workingTicket = ticket;
    lblCurrentTicket.innerText = ticket.number;

  } catch (error) {
    throw new Error ({ error: error})
  }
}

const finishTicket = async () => {
  if( !workingTicket ) return;

  const data = await fetch(`/api/ticket/done/${ workingTicket.id}`, {
    method: 'PUT',
  })
  const { status, message } = await data.json();

  console.log({status, message})

  if( status === 'ok') {
    workingTicket = null;
    lblCurrentTicket.innerText = 'Nadie';
  }
}



function connectToWebSockets() {

  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  socket.onmessage = ( event ) => {
    // console.log(event.data);
    const { type, payload } = JSON.parse( event.data );
    if ( type !== 'on-ticket-count-changed') return;

    checkTicketCount( payload );
  };

  socket.onclose = ( event ) => {
    console.log( 'Connection closed' );
    setTimeout( () => {
      console.log( 'retrying to connect' );
      connectToWebSockets();
    }, 1500 );

  };

  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };

}

//*Listeners
btnDraw.addEventListener('click', getTicket)
btnDone.addEventListener('click', finishTicket)

connectToWebSockets();
loadInitialCount();