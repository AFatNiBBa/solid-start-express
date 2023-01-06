
import sirv from "sirv";
import express from "express";
import compression from "compression";
import { Readable } from "stream";
import { createRequest } from "solid-start/node/fetch.js";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { once } from "events";
import { join } from "path";

// Handles unhandled rejections
globalThis.onunhandledrejection = ({ reason }) => console.error(reason);

/**
 * Creates an express server on which the application will be served
 * @param {import("solid-start-express").Handler} handler A function that handles requests
 * @param {string} assetsPath The path to the public assets
 * @param {{ manifest: object, getStaticHTML?(assetsPath: string): Promise<Response> }} env Environment
 */
export function createServer(handler, assetsPath, env) {
  const server = express();

  const comp = compression({
    threshold: 0,
    filter: x => !x.headers["accept"]?.startsWith("text/event-stream")
  });

  handler.beforePublic?.(server);

  server.use("/", comp, !existsSync(assetsPath) ? (req, res, next) => next() : sirv(assetsPath, {
    setHeaders: (res, pathname) => 
      pathname.startsWith("/assets/") &&
        res.setHeader("cache-control", "public, immutable, max-age=31536000")
  }));

  handler.beforeRoutes?.(server);

  server.use(comp, async (req, res) => {
    try
    {
      env.getStaticHTML = async assetPath => {
        const text = await readFile(join(assetsPath, `${ assetPath }.html`), "utf8");
        return new Response(text, {
          headers: {
            "content-type": "text/html"
          }
        });
      };

      const webRes = await handler({ request: createRequest(req), env });

      res.statusCode = webRes.status;
      res.statusMessage = webRes.statusText;

      for (const [name, value] of webRes.headers)
        res.setHeader(name, value);

      if (webRes.body)
      {
        const readable = Readable.from(webRes.body);
        readable.pipe(res);
        await once(readable, "end");
      } 
      else res.end();
    }
    catch (e)
    {
      console.error(e);
      res.statusCode = 500;
      res.statusMessage = "Internal Server Error";
      res.end();
    }
  });

  handler.beforeListen?.(server);

  return server;
}