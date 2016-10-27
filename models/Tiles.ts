import * as Sequelize from 'sequelize'
import { BLOB, INTEGER, DefineAttributes } from 'sequelize'

/**
 * Tiles Interface for MBTiles SQL Model
 */
export interface TilesAttribute {
  tile_column: number,
  tile_row: number,
  tile_data?: Buffer,
  zoom_level: number,
}

/**
 * Tiles Instance for MBTiles SQL Model
 */
export interface TilesInstance extends Sequelize.Instance<TilesAttribute>, TilesAttribute { }

/**
 * Tiles Model for MBTiles SQL Model
 */
export interface TilesModel extends Sequelize.Model<TilesInstance, TilesAttribute> { }

/**
 * Tiles Scheme for MBTiles SQL Model
 */
const scheme: DefineAttributes = {
  tile_column: { type: INTEGER },
  tile_data: { type: BLOB },
  tile_row: { type: INTEGER },
  zoom_level: { type: INTEGER },
}

export default scheme
