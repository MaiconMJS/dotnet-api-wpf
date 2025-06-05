import dotenv from "dotenv";
dotenv.config();
const UDP_PORT = Number(process.env.PORT_UDP);
const WS_PORT = Number(process.env.WS_PORT);
import dgram from "dgram";
import { WebSocketServer } from "ws";

const socket = dgram.createSocket("udp4");
const wss = new WebSocketServer({ port: WS_PORT });

let percent = "50";

socket.on("message", (msg, rinfo) => {
  console.log(`Mensagem recebida: ${msg} de ${rinfo.address}:${rinfo.port}`);

  percent = msg.toString();

  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(percent);
    }
  });
});

wss.on("connection", (ws: any) => {
  console.log("Cliente websocket conectado.");
  ws.send(percent);

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
