import fs from 'fs'
import path from 'path'
import { getArgvs, getPackageJson, ICONS_SRC_DIR } from './helpers.mjs'

const p = getPackageJson()

const argv = getArgvs(),
    newVersion = (argv['new-version'] || `${p.version}`).replace(/\.0$/, '')

const files = fs.readdirSync(ICONS_SRC_DIR).filter(file => file.endsWith('.svg'))

for (const file of files) {
  const filePath = path.join(ICONS_SRC_DIR, file)
  let svgFile = fs.readFileSync(filePath).toString()

  if (/version:\s*"?[0-9.]+"?/i.test(svgFile)) {
    continue
  }

  // Drop a complete or dangling front matter block, then prepend a canonical one
  svgFile = svgFile
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/^---\r?\n/, '')

  fs.writeFileSync(filePath, `---\nversion: "${newVersion}"\n---\n${svgFile}`)
  console.log(`Versioned ${file} at ${newVersion}`)
}
