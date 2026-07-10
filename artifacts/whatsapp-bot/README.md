# WhatsApp Bot (Baileys)

Bot de WhatsApp construido desde cero con [Baileys](https://github.com/WhiskeySockets/Baileys).

## Cómo conectarlo

Hay dos formas de vincular el bot con tu WhatsApp. Elige una con la variable de entorno `PAIRING_METHOD`.

### Opción A — Código QR (por defecto)

1. Arranca el proceso (workflow "WhatsApp Bot" en Replit, o `pnpm --filter @workspace/whatsapp-bot run dev` localmente).
2. Aparecerá un código QR en la consola/logs.
3. En tu teléfono: WhatsApp → Ajustes → Dispositivos vinculados → Vincular un dispositivo, y escanea el QR.

### Opción B — Código de vinculación (sin escanear QR)

1. Define las variables de entorno antes de iniciar:
   - `PAIRING_METHOD=code`
   - `PAIRING_NUMBER=` tu número completo con código de país, sin `+` ni espacios (ej. `549XXXXXXXXX`).
2. Arranca el proceso. En los logs aparecerá un código de 8 dígitos.
3. En tu teléfono: WhatsApp → Ajustes → Dispositivos vinculados → Vincular con número de teléfono, e ingresa el código.

Una vez vinculado (con cualquiera de las dos opciones), la sesión se guarda en `auth_info/` (no se sube al repositorio) y no tendrás que volver a vincular salvo que cierres sesión o borres esa carpeta.

## Comandos incluidos

- `!ping` — responde "Pong!"
- `!menu` — lista los comandos disponibles
- `!uptime` — tiempo que lleva activo el bot
- `!echo <texto>` — repite el texto enviado

## Agregar nuevos comandos

Edita `src/commands/index.ts` y agrega una nueva entrada al objeto `commands` con el nombre del comando (sin el prefijo `!`) y una función `async ({ sock, jid, args, msg }) => { ... }`.
