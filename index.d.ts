declare interface Options {
  protocol?: string
  domain?: string
  port?: number
  verbose?: boolean
}
export declare function start (uri?: string, options?: Options): void
