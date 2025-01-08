
const renderTickets = ( tickets = [] ) => {
  for (let i = 0; i < tickets.length; i++) {
    if( i >= 4 ) break;

    const ticket = tickets[i];
    if ( !ticket ) continue;

    const lblTicket = document.querySelector(`#lbl-ticket-0${i + 1}`)
    const lblDesk = document.querySelector(`#lbl-desk-0${i + 1}`)

    lblTicket.innerText = `Ticket ${ ticket.number}`;
    lblDesk.innerHTML = ticket.handleAtDesk
  }
}

const loadCurrentTickets = async () => {
  try {
    const data = await fetch('/api/ticket/working-on')
    const tickets = await data.json();
    renderTickets( tickets )
    console.log(tickets)
  } catch (error) {
    throw new Error({error: error.message})
  }
}


function connectToWebSockets() {

  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  socket.onmessage = ( event ) => {
    // console.log(event.data);
    const { type, payload } = JSON.parse( event.data );
    if ( type !== 'on-working-changed') return;

    renderTickets( payload )
  };

  socket.onclose = ( event ) => {
    setTimeout( () => {
      connectToWebSockets();
    }, 1500 );

  };

  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };

}

connectToWebSockets();
loadCurrentTickets();