# WhatsApp Bot (Baileys)

Bot de WhatsApp construido desde cero con [Baileys](https://github.com/WhiskeySockets/Baileys).

## Cómo conectarlo

1. Arranca el proceso (workflow "WhatsApp Bot" en Replit, o `pnpm --filter @workspace/whatsapp-bot run dev` localmente).
2. Aparecerá un código QR en la consola/logs.
3. En tu teléfono: WhatsApp → Ajustes → Dispositivos vinculados → Vincular un dispositivo, y escanea el QR.
4. Una vez vinculado, la sesión se guarda en `auth_info/` (no se sube al repositorio) y no tendrás que volver a escanear salvo que cierres sesión o borres esa carpeta.

## Comandos incluidos

- `!ping` — responde "Pong!"
- `!menu` — lista los comandos disponibles
- `!uptime` — tiempo que lleva activo el bot
- `!echo <texto>` — repite el texto enviado

## Agregar nuevos comandos

Edita `src/commands/index.ts` y agrega una nueva entrada al objeto `commands` con el nombre del comando (sin el prefijo `!`) y una función `async ({ sock, jid, args, msg }) => { ... }`.
