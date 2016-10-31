import * as path from 'path'
import * as os from 'os'
import * as server from './index'

server.start(path.join(os.homedir(), '.mmb'))
