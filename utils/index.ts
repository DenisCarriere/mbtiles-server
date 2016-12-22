import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize-offline'
import Tiles, {
  TilesAttribute,
  TilesInstance,
  TilesModel } from '../models/Tiles'
import Metadata, {
  MetadataAttribute,
  MetadataInstance,
  MetadataModel } from '../models/Metadata'
import { PATH } from '../index'
/**
 * Tile [x, y, z]
 */
export type Tile = [number, number, number] | number[]

export function getFiles(path = PATH, regex = /\.mbtiles$/): Array<string> {
  let mbtiles = fs.readdirSync(path).filter(value => value.match(regex))
  mbtiles = mbtiles.map(data => data.replace(regex, ''))
  mbtiles = mbtiles.filter(name => !name.match(/^_.*/))
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

export interface Metadata {
  name?: string
  type?: 'baselayer' | 'overlay'
  version?: '1.0.0' | '1.1.0' | '1.2.0'
  attribution?: string
  description?: string
  bounds?: [number, number, number, number]
  center?: [number, number] | [number, number, number]
  minzoom?: number
  maxzoom?: number
  format?: 'png' | 'jpg'
  basename?: string
  uri?: string
  [key: string]: any
}
/**
 * MBTiles
 */
export class MBTiles {
  public uri: string
  private sequelize: Sequelize.Sequelize
  private tilesSQL: TilesModel
  private metadataSQL: MetadataModel

  constructor(uri: string) {
    this.uri = uri
    this.sequelize = connect(uri)
    this.tilesSQL = this.sequelize.define<TilesInstance, TilesAttribute>('tiles', Tiles)
    this.metadataSQL = this.sequelize.define<MetadataInstance, MetadataAttribute>('metadata', Metadata)
  }

  /**
   * Retrieve Buffer from Tile [x, y, z]
   */
  public async getTile(tile: Tile, area?: number): Promise<Buffer> {
    const [x, y, z] = tile
    const data = await this.tilesSQL.find({
      attributes: ['tile_data'],
      where: {
        tile_column: x,
        tile_row: y,
        zoom_level: z,
      },
    })
    return readTileData(data)
  }

  /**
   * Retrieves Metadata from MBTiles
   */
  public async metadata() {
    const metadata: Metadata = {}
    metadata.uri = this.uri
    metadata.basename = path.basename(this.uri)
    const data = await this.metadataSQL.findAll()
    data.map(item => {
      const name = item.name.toLowerCase()
      const value = item.value
      switch (name) {
        case 'minzoom':
        case 'maxzoom':
          metadata[name] = Number(value)
          break
        case 'name':
        case 'attribution':
        case 'description':
          metadata[name] = value
          break
        case 'bounds':
          const bounds = value.split(',').map(i => Number(i))
          metadata.bounds = [bounds[0], bounds[1], bounds[2], bounds[3]]
          break
        case 'center':
          const center = value.split(',').map(i => Number(i))
          switch (center.length) {
            case 2:
              metadata.center = [center[0], center[1]]
              break
            case 3:
              metadata.center = [center[0], center[1], center[2]]
              break
            default:
          }
          break
        case 'type':
          switch (value) {
            case 'overlay':
            case 'baselayer':
              metadata[name] = value
              break
            default:
          }
        case 'format':
          switch (value) {
            case 'png':
            case 'jpg':
              metadata[name] = value
              break
            default:
          }
        case 'version':
          switch (value) {
            case '1.0.0':
            case '1.1.0':
            case '1.2.0':
              metadata[name] = value
              break
            default:
          }
        default:
          metadata[name] = value
      }
    })
    return metadata
  }
}
export default MBTiles
