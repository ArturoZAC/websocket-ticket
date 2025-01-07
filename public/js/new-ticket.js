
const currentTicketLbl = document.querySelector('span');
const createTikenBtn = document.querySelector('button');


const getLastTicket =  async () => {
  try {
    const lastTicker = await fetch('/api/ticket/last')
    const data = await lastTicker.json();
    currentTicketLbl.innerText = data;
  } catch (error) {
    throw new Error({message: error.message})
  }
}

const createNewTicker = async () => {
  try {
    const newTicket = await fetch('/api/ticket/', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    })
    // console.log(newTicket)
    const data = await newTicket.json()
    // console.log(data)
    currentTicketLbl.innerText = data.number;

  } catch (error) {
    throw new Error({message: error.message})
  }
}

getLastTicket();

createTikenBtn.addEventListener('click', createNewTicker )