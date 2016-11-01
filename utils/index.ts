import * as fs from 'fs'
import * as Sequelize from 'sequelize'
import Tiles, {
  TilesAttribute,
  TilesInstance,
  TilesModel } from '../models/Tiles'
import { PATH } from '../index'
/**
 * Tile [x, y, z]
 */
export type Tile = [number, number, number] | number[]

export function getFiles(path = PATH, regex = /\.mbtiles$/): Array<string> {
  let mbtiles = fs.readdirSync(path).filter(value => value.match(regex))
  mbtiles = mbtiles.map(data => data.replace(regex, ''))
  return mbtiles
}

function readTileData(data: TilesInstance): Buffer {
  if (!data) { throw new Error('Tile has no data') }
  return data.tile_data
}

/**
 * Connect to SQL MBTiles DB
 */
export function connect(uri: string) {
  const options = {
    define: { freezeTableName: true, timestamps: false },
    logging: false,
    pool: { idle: 10000, max: 5, min: 0 },
    storage: uri,
  }
  return new Sequelize(`sqlite://${ uri }`, options)
}

/**
 * MBTiles
 */
export class MBTiles {
  public uri: string
  private sequelize: Sequelize.Sequelize
  private tilesSQL: TilesModel

  constructor(uri: string) {
    this.uri = uri
    this.sequelize = connect(uri)
    this.tilesSQL = this.sequelize.define<TilesInstance, TilesAttribute>('tiles', Tiles)
  }
  /**
   * Retrieve Buffer from Tile [x, y, z]
   */
  public async getTile(tile: Tile, area?: number): Promise<Buffer> {
    const [x, y, z] = tile
    return this.tilesSQL.find({
      attributes: ['tile_data'],
      where: {
        tile_column: x,
        tile_row: y,
        zoom_level: z,
      },
    }).then(readTileData)
  }
}

export default MBTiles
