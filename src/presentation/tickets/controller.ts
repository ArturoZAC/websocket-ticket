import { Request, Response } from "express";
import { TicketService } from "../services/ticket-service";

export class TicketController {

  constructor(
    private readonly ticketService: TicketService
  ){}

  getTickets = async ( req: Request, res: Response) => {
    res.json( this.ticketService.tickets! );
  }

  getLastTicketNumber = async ( req: Request, res: Response) => {
    res.json( this.ticketService.lastTicketNumber );
  }

  pendingTickets = async ( req: Request, res: Response) => {
    res.json( this.ticketService.pendingTickets );
  }

  createTicket = async ( req: Request, res: Response) => {
    res.status(201).json( this.ticketService.createTicket() );
  }

  drawTicket = async ( req: Request, res: Response) => {
    const { desk } = req.params;
    res.json( this.ticketService.drawTicket( desk ) );
  }

  ticketFinished = async ( req: Request, res: Response) => {
    const { ticketId } = req.params;
    res.json( this.ticketService.onFinishedTicket( ticketId ));
  }

  workingOn = async ( req: Request, res: Response) => {
    res.json( this.ticketService.lastWorkingOnTickets )
  }

}