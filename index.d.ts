
import { Adapter } from "solid-start/vite";

declare module "solid-start-server" {
    export default function(): Adapter;
}