import path from "node:path";
import { fileURLToPath } from "node:url";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  type WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import { logger } from "./logger.js";
import { commands } from "./commands/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_DIR = path.join(__dirname, "..", "auth_info");
const PREFIX = "!";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock: WASocket = makeWASocket({
    version,
    auth: state,
    logger: logger.child({ module: "baileys" }),
    printQRInTerminal: false,
    browser: ["Bot-base", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      logger.info("Escanea el código QR con WhatsApp para vincular el bot:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error as Boom | undefined)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      logger.warn({ statusCode, shouldReconnect }, "Conexión cerrada");
      if (shouldReconnect) {
        startBot().catch((err) => logger.error(err, "Error al reconectar"));
      } else {
        logger.error("Sesión cerrada. Borra la carpeta auth_info y vuelve a escanear el QR.");
      }
    } else if (connection === "open") {
      logger.info("✅ Bot conectado a WhatsApp");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
      if (!jid) continue;

      const text =
        msg.message.conversation ??
        msg.message.extendedTextMessage?.text ??
        msg.message.imageMessage?.caption ??
        "";

      if (!text.startsWith(PREFIX)) continue;

      const [commandName, ...args] = text.slice(PREFIX.length).trim().split(/\s+/);
      const handler = commands[commandName?.toLowerCase() ?? ""];

      if (!handler) continue;

      try {
        await handler({ sock, jid, args, msg });
      } catch (err) {
        logger.error(err, `Error ejecutando comando "${commandName}"`);
        await sock.sendMessage(jid, { text: "⚠️ Ocurrió un error al ejecutar ese comando." });
      }
    }
  });

  return sock;
}

startBot().catch((err) => {
  logger.error(err, "Error fatal al iniciar el bot");
  process.exit(1);
});
