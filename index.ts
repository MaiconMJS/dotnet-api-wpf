import dotenv from "dotenv";
dotenv.config();
const UDP_PORT = Number(process.env.PORT_UDP);
const WPF_PORT = Number(process.env.WPF_PORT);
const WPF_HOST = process.env.WPF_HOST;
import dgram from "dgram";

const socket = dgram.createSocket("udp4");

socket.on("message", (msg, rinfo) => {
  console.log(`Mensagem recebida: ${msg} de ${rinfo.address}:${rinfo.port}`);

  socket.send(msg, WPF_PORT, WPF_HOST, (err) => {
    if (err) {
      console.error(`Erro ao enviar para WPF: ${err}`);
    } else {
      console.log(`Mensagem enviada para WPF: ${msg}`);
    }
  });
});

socket.bind(UDP_PORT, "0.0.0.0", () => {
  console.log(`Servidor UDP escutando na porta ${UDP_PORT}`);
});
