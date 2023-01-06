
# solid-start-express
Modified version of `solid-start-node` that allows access to the server. <br />
To use, pass the adapter to the solid plugin in `vite.config.ts`, like this:
```js
import adapter from "solid-start-express";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({
      adapter: adapter() // ← This
    })
  ],
});
```
And edit your `entry-server.tsx` file from this:
```js
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";

export default createHandler(renderAsync((event) => <StartServer event={event} />));
```
To this:
```js
import type { Observer } from "solid-start-express";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";

const handler = createHandler(renderAsync((event) => <StartServer event={event} />));
export default Object.assign(handler, {
  beforePublic(server) {
    // Your code...
  }
} satisfies Observer);
```