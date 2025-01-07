import { Server } from "http";
import { WebSocket, WebSocketServer} from "ws";

interface Options {
  server: Server;
  path?: string;
}

export class WssService {

  private static _instance: WssService;
  private wss: WebSocketServer;


  private constructor ( options: Options ) {
    const { server, path='/ws' } = options;

    this.wss = new WebSocketServer({ server, path });
    this.start();
  }

  static get instance():WssService  {
    if( !WssService._instance) throw 'WssService is not initialized'

    return WssService._instance;
  }

  static initWss ( options: Options ) {
    WssService._instance = new WssService( options );
  }

  start () {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client Connected');

      ws.on('close', () => console.log('Client Disconnected'));
    })
  }
  

}