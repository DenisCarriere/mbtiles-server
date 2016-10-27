import * as path from 'path'
import * as os from 'os'
import * as server from './index'

server.start(5000, path.join(os.homedir(), '.mmb'))
