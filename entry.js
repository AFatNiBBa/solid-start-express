
import "solid-start/node/globals.js";
import handler from "solid-start-express/handler.js";
import manifest from "../../dist/public/route-manifest.json";
import { createServer } from "solid-start-express/server.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const { PORT = 3000 } = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = createServer(
  handler,
  join(__dirname, "public"),
  { manifest }
);

server.listen(PORT, e => e
  ? console.error(e)
  : console.log(`Listening on port ${PORT}`)
);