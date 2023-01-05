
# solid-start-server
Modified version of `solid-start-node` that allows access to the server. <br />
To use, just edit your `entry-server.tsx` file from this:
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
import { Polka } from "polka";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";

const handler = createHandler(renderAsync((event) => <StartServer event={event} />));
export default Object.assign(handler, {
  onServer(server: Polka) {
    // Your code...
  }
});
```