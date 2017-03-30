declare interface Options {
  protocol?: string
  domain?: string
  port?: number
  verbose?: boolean
  cache?: string
}
export declare function start (options?: Options): void
