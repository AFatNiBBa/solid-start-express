
import { Adapter } from "vite";

declare module "solid-start-server" {
    export default function(): Adapter;
}