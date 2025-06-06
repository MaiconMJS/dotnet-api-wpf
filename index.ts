import dotenv from "dotenv";
dotenv.config();
const UDP_PORT = Number(process.env.PORT_UDP);
const WS_PORT = Number(process.env.WS_PORT);
import dgram from "dgram";
import { WebSocket, WebSocketServer } from "ws";

const socket = dgram.createSocket("udp4");
const wss = new WebSocketServer({ port: WS_PORT });

let percentString = "50";
let percent = 50;

socket.on("message", (msg, rinfo) => {
  console.log(`Mensagem recebida: ${msg} de ${rinfo.address}:${rinfo.port}`);

  percentString = msg.toString().trim();

  if (percentString.includes("+") || percentString.includes("-")) {
    const numericPart = percentString.replace(/[+-]/g, "");

    if (!isNaN(Number(numericPart))) {
      percent = parseInt(numericPart, 10);

      if (percentString.includes("+")) {
        percent++;
      } else {
        percent--;
      }
      percent = Math.max(0, Math.min(percent, 100));
    } else {
      console.error(`⚠️ Mensagem inválida recebida: ${percentString}`);
    }
  }

  wss.clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(percent.toString());
    }
  });
});

wss.on("connection", (ws: any) => {
  console.log("Cliente websocket conectado.");
  ws.send(percent.toString());

  ws.on("close", () => {
    console.log("Cliente websocket desconectado.");
  });

  ws.on("error", (error: any) => {
    console.error(`Erro no WebSocket: ${error}`);
  });
});

socket.bind(UDP_PORT, "0.0.0.0", () => {
  console.log(`Servidor UDP escutando na porta ${UDP_PORT}`);
});
