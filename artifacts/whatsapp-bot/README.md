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

## Instalación en Termux (Android)

1. Actualiza paquetes e instala Node.js y Git:
   ```bash
   pkg update && pkg upgrade -y
   pkg install -y nodejs-lts git
   ```
2. Instala pnpm (gestor de paquetes que usa este proyecto):
   ```bash
   npm install -g pnpm
   ```
3. Clona el repositorio completo (el bot vive dentro de un monorepo, así que se necesita todo el repo, no solo la carpeta):
   ```bash
   git clone https://github.com/amilcargit1/Bot-base.git
   cd Bot-base
   ```
4. Instala las dependencias de todo el proyecto (esto también descarga las del bot):
   ```bash
   pnpm install
   ```
5. Levanta el bot:
   ```bash
   pnpm --filter @workspace/whatsapp-bot run start
   ```
   - Para vincular por código QR (por defecto): escanea el QR que aparece en la terminal.
   - Para vincular por código de teléfono en vez de QR:
     ```bash
     PAIRING_METHOD=code PAIRING_NUMBER=549XXXXXXXXX pnpm --filter @workspace/whatsapp-bot run start
     ```
6. Para que el bot siga corriendo aunque cierres Termux, usa `tmux` o `screen`:
   ```bash
   pkg install -y tmux
   tmux new -s bot
   pnpm --filter @workspace/whatsapp-bot run start
   # Ctrl+B luego D para salir sin cerrar el proceso
   # Para volver: tmux attach -t bot
   ```

**Nota:** mantén encendida la opción "Sin restricciones de batería" para Termux en los ajustes de Android, o el sistema puede matar el proceso en segundo plano.

## Agregar nuevos comandos

Edita `src/commands/index.ts` y agrega una nueva entrada al objeto `commands` con el nombre del comando (sin el prefijo `!`) y una función `async ({ sock, jid, args, msg }) => { ... }`.
