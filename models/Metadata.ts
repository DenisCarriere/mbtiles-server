import * as Sequelize from 'sequelize-offline'
import { TEXT, DefineAttributes } from 'sequelize-offline'

/**
 * Metadata Interface for MBTiles SQL Model
 */
export interface MetadataAttribute {
  name: string
  value: string
}

/**
 * Metadata Instance for MBTiles SQL Model
 */
export interface MetadataInstance extends Sequelize.Instance<MetadataAttribute>, MetadataAttribute { }

/**
 * Metadata Model for MBTiles SQL Model
 */
export interface MetadataModel extends Sequelize.Model<MetadataInstance, MetadataAttribute> { }

/**
 * Metadata Scheme for MBTiles SQL Model
 */
const scheme: DefineAttributes = {
  name: { primaryKey: true, type: TEXT, unique: true },
  value: { allowNull: false, type: TEXT },
}

export default scheme
