import Zip from 'adm-zip'
import { getPackageJson, HOME_DIR } from './helpers.mjs'
import { resolve } from 'path'

const p = getPackageJson()
const zip = new Zip()

zip.addLocalFolder(resolve(HOME_DIR, `packages/icons/icons/`), 'svg')
zip.addLocalFolder(resolve(HOME_DIR, `packages/icons-png/icons/`), 'svg')

zip.writeZip(resolve(HOME_DIR, `packages-zip/icons-${p.version}.zip`));