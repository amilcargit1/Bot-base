import type { WASocket, proto } from "@whiskeysockets/baileys";

export interface CommandContext {
  sock: WASocket;
  jid: string;
  args: string[];
  msg: proto.IWebMessageInfo;
}

export type CommandHandler = (ctx: CommandContext) => Promise<void>;

const start = Date.now();

export const commands: Record<string, CommandHandler> = {
  async ping({ sock, jid }) {
    await sock.sendMessage(jid, { text: "🏓 Pong!" });
  },

  async menu({ sock, jid }) {
    const list = Object.keys(commands)
      .sort()
      .map((name) => `• !${name}`)
      .join("\n");
    await sock.sendMessage(jid, {
      text: `*Comandos disponibles*\n\n${list}`,
    });
  },

  async uptime({ sock, jid }) {
    const seconds = Math.floor((Date.now() - start) / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    await sock.sendMessage(jid, { text: `⏱️ Activo desde hace ${h}h ${m}m ${s}s` });
  },

  async echo({ sock, jid, args }) {
    const text = args.join(" ").trim();
    await sock.sendMessage(jid, {
      text: text.length > 0 ? text : "Escribe algo después de !echo",
    });
  },
};
