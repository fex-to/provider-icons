import { glob, globSync } from 'glob'
import { join, basename } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { generateIconsPreview, getArgvs, getPackageJson, ICONS_DIR, ICONS_SRC_DIR } from './helpers.mjs'

const argv = getArgvs(),
    p = getPackageJson()

const version = argv['new-version'] || `${p.version}`

if (version) {
  glob(join(ICONS_SRC_DIR, '*.svg'), {}, function(er, files) {
    const newIcons = []
    files.forEach(function(file, i) {
      let svgFile = readFileSync(file),
          svgFileContent = svgFile.toString()
      let value = svgFileContent.match(/version: \"([0-9.]+)\"/i)

      if (`${value[1]}.0` === version) {
        newIcons.push(`${ICONS_DIR}/${basename(file)}`)
      }
    })
    if (newIcons.length > 0) {
        generateIconsPreview(newIcons, `.github/sources-icons-${version}.svg`)
        generateIconsPreview(newIcons, `.github/sources-icons-${version}-dark.svg`, {
        color: '#ffffff',
        background: '#354052'
      })
    }
  })
}

