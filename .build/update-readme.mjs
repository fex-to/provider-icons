import { readFileSync, writeFileSync } from 'fs'
import { glob, globSync } from 'glob'
import { resolve, basename } from 'path'
import { HOME_DIR, ICONS_SRC_DIR } from './helpers.mjs'

let files = glob.sync(resolve(ICONS_SRC_DIR, '*.svg'))
let count = files.length

console.log('count', count);

const readmes = glob.sync(resolve(HOME_DIR, '{.,packages/*}/README.md'))

readmes.forEach(readme => {
  let fileData = readFileSync(readme).toString()

  let tableData = "\n| Icons |\n| ------------- |\n"
  tableData += files.map((file) => `| ${basename(file)} |`).join('\n')
  tableData += "\n"

  fileData = fileData.replace(/<!--icons-count-->(.*?)<!--\/icons-count-->/, `<!--icons-count-->${count}<!--/icons-count-->`)

  writeFileSync(readme, fileData)
})


