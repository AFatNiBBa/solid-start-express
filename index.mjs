
import solidStartNode from "solid-start-node";
import { copyFileSync } from "fs";
import { join } from "path";

export default function() {
    // Extends the standard implementation
    return new class extends function () { return solidStartNode(); } {
        async build() {
            // Tries to be as dependent as possible from the standard implementation in order to be as compatible as possible with new versions
            await super.build();

            // Uses the custom version of "entry.js"
            const from = import.meta.resolve("./entry.js");
            const to = join(config.root, ".solid", "server", "server.js");
            copyFileSync(from, to);
        }
    };
}