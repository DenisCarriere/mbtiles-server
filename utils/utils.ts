import * as fs from 'fs'
import { URI } from '../index'

/**
 * Tile [x, y, z]
 */
export type Tile = [number, number, number]

export function getFiles(uri = URI, regex = /\.mbtiles$/): string[] {
  let mbtiles = fs.readdirSync(uri).filter(value => value.match(regex))
  mbtiles = mbtiles.map(data => data.replace(regex, ''))
  mbtiles = mbtiles.filter(name => !name.match(/^_.*/))
  return mbtiles
}
