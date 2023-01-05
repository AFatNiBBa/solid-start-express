
import common from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import solidStartNode from "solid-start-node";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { copyFileSync } from "fs";
import { rollup } from "rollup";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default function () {
  return {
    // Extends the standard implementation
    ...solidStartNode(),

    // Overrides the "build()" method
    async build(config, builder) {
      const ssrExternal = config?.ssr?.external || [];
      const dist = join(config.root, "dist"); 
      const pub = join(dist, "public");
      const ser = join(config.root, ".solid", "server");

      if (!config.solidOptions.ssr) await builder.spaClient(pub);
      else if (config.solidOptions.islands) await builder.islandsClient(pub);
      else await builder.client(pub);
      await builder.server(ser);

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