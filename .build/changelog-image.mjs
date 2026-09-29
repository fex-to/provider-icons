import { globSync } from 'glob'
import { join, basename } from 'path'
import { readFileSync } from 'fs'
import { generateIconsPreview, getArgvs, getPackageJson, ICONS_DIR, ICONS_SRC_DIR } from './helpers.mjs'

const argv = getArgvs(),
    p = getPackageJson()

const version = (argv['new-version'] || `${p.version}`).replace(/\.0$/, '')

if (version) {
  const files = globSync(join(ICONS_SRC_DIR, '*.svg'))
  const newIcons = []

  files.forEach(function(file) {
    const svgFileContent = readFileSync(file).toString()
    const value = svgFileContent.match(/version:\s*"?([0-9.]+)"?/i)

    if (value && value[1] === version) {
      newIcons.push(`${ICONS_DIR}/${basename(file)}`)
    }
  })

  if (newIcons.length > 0) {
    generateIconsPreview(newIcons, `.github/provider-icons-${version}.svg`)
    generateIconsPreview(newIcons, `.github/provider-icons-${version}-dark.svg`, {
      color: '#ffffff',
      background: '#354052'
    })
  }
}
