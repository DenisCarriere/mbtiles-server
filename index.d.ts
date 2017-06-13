/// <reference types="node" />

import {EventEmitter} from 'events'

interface Log {
  body: any
  ip: string
  method: string
  url: string
  query: any
  params: any
}

declare interface Options {
  protocol?: string
  domain?: string
  port?: number
  cache?: string
}

interface Server extends EventEmitter {
  // Operations
  start(options: Options): Promise<Options>;
  restart(options: Options): Promise<Options>;
  close(): Promise<void>;

  // Listeners
  on(type: 'start', callback: (options: Options) => void): this;
  on(type: 'end', callback: () => void): this;
  on(type: 'log', callback: (log: Log) => void): this;
}

declare function server(options?: Options): Server
declare namespace server {}
export = server