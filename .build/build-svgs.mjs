import glob from 'glob'
import { readFileSync, writeFileSync } from 'fs'
import { join, basename } from 'path'
import { optimizePath, ICONS_SRC_DIR, ICONS_DIR } from './helpers.mjs'
import { parseSync, stringify } from 'svgson'

glob(join(ICONS_SRC_DIR, '*.svg'), {}, function(er, files) {

  files.forEach(function(file, i) {
    console.log(`Formed ${basename(file)}`);

    let svgFile = readFileSync(file),
        svgFileContent = svgFile.toString()
        svgFileContent = svgFileContent.replace(/(---.*---)/gms, '')

    const obj = parseSync(svgFileContent);
    const JSONObject = { ...obj, ...{
      attributes: {xmlns: "http://www.w3.org/2000/svg",
      width: 48,
      height: 48,
      viewBox: "0 0 48 48",
      fill: 'currentColor',
    }}}
    svgFileContent = stringify(JSONObject)

    if (svgFile.toString() !== svgFileContent) {
      writeFileSync(`${ICONS_DIR}/${basename(file)}`, svgFileContent)
    }
  })
})