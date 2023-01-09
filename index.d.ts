
import { FetchEvent } from "solid-start/server";
import { Adapter } from "solid-start/vite";
import { Express } from "express";

export default function (): Adapter;

export type Handler = Observer & ((event: FetchEvent) => Promise<Response>);

export type Observer = {
  beforePublic?(app: Express): void,
  beforeRoutes?(app: Express): void,
  beforeListen?(app: Express): void,
  afterListen?(app: Express, server: ReturnType<typeof app.listen>): void
};