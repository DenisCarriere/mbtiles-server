/// <reference types="node" />

import {EventEmitter} from 'events'

interface Status {}

declare interface Options {
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
}

declare function server(options?: Options): Server
declare namespace server {}
export = server