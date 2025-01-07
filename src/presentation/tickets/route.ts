import { Router } from "express";
import { TicketController } from "./controller";
import { TicketService } from "../services/ticket-service";

export class TicketRoutes {

  static get routes() {
    const router = Router();
    const ticketService = new TicketService();
    const ticketController = new TicketController(ticketService);

    router.get('/', ticketController.getTickets);
    router.get('/last', ticketController.getLastTicketNumber);
    router.get('/pending', ticketController.pendingTickets);
    
    router.post('/', ticketController.createTicket);
    
    router.get('/draw/:desk', ticketController.drawTicket);
    router.put('/done/:ticketId', ticketController.ticketFinished);

    router.get('/working-ong', ticketController.workingOn);

    return router;
  }

}