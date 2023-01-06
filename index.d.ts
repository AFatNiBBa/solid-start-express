
import { FetchEvent } from "solid-start/server";
import { Adapter } from "solid-start/vite";
import { Express } from "express";

declare module "solid-start-server" {
  export default function (): Adapter;
}

export type Handler = Observer & ((event: FetchEvent) => Promise<Response>);

export type Observer = {
  beforePublic?(server: Express): void,
  beforeRoutes?(server: Express): void,
  beforeListen?(server: Express): void
};