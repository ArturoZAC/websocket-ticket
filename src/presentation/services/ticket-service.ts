import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";

export class TicketService {

  public readonly tickets: Ticket[] = [
    {id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false},
    {id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false},
    {id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false},
    {id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false},
    {id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false},
    {id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false},
  ];

  private readonly workingOnTickets: Ticket[] = [];

  get pendingTickets(): Ticket[] {
    return this.tickets.filter( ticket => !ticket.handleAtDesk )
  }

  get lastWorkingOnTickets ():Ticket[] {
    return this.workingOnTickets.splice(0,4);
  }
  
  get lastTicketNumber(){
    return this.tickets.length > 0 ? this.tickets.at(-1)?.number: 0;
  }

  createTicket(){
    
    const ticket: Ticket = {
      id: UuidAdapter.v4(),
      number: this.lastTicketNumber! + 1,
      createdAt: new Date(),
      done: false,
      handleAt: undefined,
      handleAtDesk: undefined,
    }

    this.tickets.push(ticket);

    return ticket;
  }

  drawTicket = ( desk: string) => {
    const ticket = this.tickets.find( t => !t.handleAtDesk );
    if( !ticket ) return { status: 'error', message: 'No hay tickets pendientes' };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({...ticket})

    return { status: 'ok', ticket}
  }

  onFinishedTicket ( id: string ) {
    const ticket = this.tickets.find( t => t.id === id);
    if( !ticket ) return { status: 'error', message: 'Ticket not found'}

    this.tickets.map( ticket => {
      if( ticket.id === id ) {
        ticket.done = true;
      }

      return ticket;
    })

    return { status: 'ok' };
  }

}