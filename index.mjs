
import json from "@rollup/plugin-json";
import common from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { fileURLToPath, pathToFileURL } from "url";
import { join, dirname } from "path";
import { copyFileSync } from "fs";
import { rollup } from "rollup";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function () {
  return {
    name: "express",

    start(config, { port }) {
      process.env.PORT = port;
      import(pathToFileURL(join(config.root, "dist", "server.js")).toString());
      return `http://localhost:${process.env.PORT}`;
    },

    async build(config, builder) {
      const ssrExternal = config?.ssr?.external || [];
      const dist = join(config.root, "dist"); 
      const pub = join(dist, "public");
      const ser = join(config.root, ".solid", "server");

      if (!config.solidOptions.ssr) await builder.spaClient(pub);
      else if (config.solidOptions.islands) await builder.islandsClient(pub);
      else await builder.client(pub);
      await builder.server(ser);

      // Gets the handler (Server entry point) and the server starter
      copyFileSync(join(ser, "entry-server.js"), join(ser, "handler.js"));
      copyFileSync(join(__dirname, "entry.js"), join(ser, "server.js")); // ← What I changed

      builder.debug(`bundling server with rollup`);

      const bundle = await rollup({
        input: join(ser, "server.js"),
        plugins: [
          json(),
          nodeResolve({
            preferBuiltins: true,
            exportConditions: [ "node", "solid" ]
          }),
          common()
        ],
        external: [ "undici", "stream/web", ...ssrExternal ]
      });

      // or write the bundle to disk
      await bundle.write({ format: "esm", dir: dist });

      // closes the bundle
      await bundle.close();

      builder.debug(`bundling server done`);
    }
  }
}