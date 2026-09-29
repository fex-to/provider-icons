import fs from 'fs'
import path, { resolve, basename } from 'path'
import { fileURLToPath } from 'url'
import svgParse from 'parse-svg-path'
import svgpath from 'svgpath'
import { parseSync } from 'svgson'
import { optimize } from 'svgo'
import sharp from 'sharp'
import minimist from 'minimist'

export const getCurrentDirPath = () => {
  return path.dirname(fileURLToPath(import.meta.url));
}

export const HOME_DIR = resolve(getCurrentDirPath(), '..')

export const ICONS_SRC_DIR = resolve(HOME_DIR, 'src/_icons')
export const ICONS_DIR = resolve(HOME_DIR, 'icons')
export const PACKAGES_DIR = resolve(HOME_DIR, 'packages')

export const getArgvs = () => {
  return minimist(process.argv.slice(2))
}

/**
 * Return project package.json
 * @returns {any}
 */
export const getPackageJson = () => {
  return JSON.parse(fs.readFileSync(resolve(HOME_DIR, 'package.json'), 'utf-8'))
}

/**
 * Reads SVGs from directory
 *
 * @param directory
 * @returns {string[]}
 */
export const readSvgDirectory = (directory) => {
  return fs.readdirSync(directory).filter((file) => path.extname(file) === '.svg')
}

export const readSvgs = () => {
  const svgFiles = readSvgDirectory(ICONS_DIR)

  return svgFiles.map(svgFile => {
    const name = basename(svgFile, '.svg'),
        namePascal = toPascalCase(`icon ${name}`),
        rawContents = readSvg(svgFile, ICONS_DIR).trim(),
        // Remove YAML front matter if present (---\nversion: "x.x.x"\n---)
        // Match only if there's content or empty lines between the --- markers
        contents = rawContents.replace(/^---\n(?:.*\n)?---\n/, '').trim(),
        path = resolve(ICONS_DIR, svgFile);

    let obj;
    try {
      obj = parseSync(contents.replace('<path stroke="none" d="M0 0h48v48H0z" fill="none"/>', ''));
    } catch (error) {
      console.error(`Error parsing ${svgFile}:`);
      console.error(`Contents: ${contents.substring(0, 100)}...`);
      throw error;
    }

    return {
      name,
      namePascal,
      contents,
      obj,
      path
    };
  });
}

/**
 * Read SVG
 *
 * @param fileName
 * @param directory
 * @returns {string}
 */
export const readSvg = (fileName, directory) => {
  return fs.readFileSync(path.join(directory, fileName), 'utf-8')
}

/**
 * Convert string to CamelCase
 * @param string
 * @returns {*}
 */
export const toCamelCase = (string) => {
  return string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase())
}

export const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);

  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

export const optimizePath = function(path) {
  let transformed = svgpath(path).rel().round(3).toString()

  return svgParse(transformed).map(function(a) {
    return a.join(' ')
  }).join('')
}

export const optimizeSVG = (data) => {
  return optimize(data, {
    js2svg: {
      indent: 2,
      pretty: true
    },
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            mergePaths: false
          }
        }
      }]
  }).data
}

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export const createScreenshot = async (filePath) => {
  const [png, png2x] = await Promise.all([
    sharp(filePath, { density: 144 }).png().toBuffer(),
    sharp(filePath, { density: 288 }).png().toBuffer(),
  ])
  fs.writeFileSync(filePath.replace('.svg', '.png'), png)
  fs.writeFileSync(filePath.replace('.svg', '@2x.png'), png2x)
}

export const generateIconsPreview = async function(files, destFile, {
  columnsCount = 18,
  paddingOuter = 8,
  color = '#354052',
  background = '#ffffff'
} = {}) {

  const padding = 8,
      iconSize = 48

  const iconsCount = files.length,
      rowsCount = Math.ceil(iconsCount / columnsCount),
      width = columnsCount * (iconSize + padding) + 2 * paddingOuter - padding,
      height = rowsCount * (iconSize + padding) + 2 * paddingOuter - padding

  let svgContentSymbols = '',
      svgContentIcons = '',
      x = paddingOuter,
      y = paddingOuter

  files.forEach(function(file, i) {
    let name = path.basename(file, '.svg')

    let svgFile = fs.readFileSync(file),
        svgFileContent = svgFile.toString()

    svgFileContent = svgFileContent.replace('<svg', `<symbol id="${name}"`)
        .replace(' width="48" height="48"', '')
        .replace('</svg>', '</symbol>')
        .replace(/\n\s+/g, '')

    svgContentSymbols += `\t${svgFileContent}\n`
    svgContentIcons += `\t<use xlink:href="#${name}" x="${x}" y="${y}" width="${iconSize}" height="${iconSize}" fill="currentColor" />\n`

    x += padding + iconSize

    if (i % columnsCount === columnsCount - 1) {
      x = paddingOuter
      y += padding + iconSize
    }
  })

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="color: ${color}"><rect x="0" y="0" width="${width}" height="${height}" fill="${background}"></rect>\n${svgContentSymbols}\n${svgContentIcons}\n</svg>`

  fs.writeFileSync(destFile, svgContent)
  await createScreenshot(destFile)
}


export const printChangelog = function(newIcons, modifiedIcons, renamedIcons, pretty = false) {
  if (newIcons.length > 0) {
    if (pretty) {
      console.log(`### ${newIcons.length} new icons:\n`)

      newIcons.forEach(function(icon, i) {
        console.log(`- \`${icon}\``)
      })
    } else {
      let str = ''
      str += `${newIcons.length} new icons: `

      newIcons.forEach(function(icon, i) {
        str += `\`${icon}\``

        if ((i + 1) <= newIcons.length - 1) {
          str += ', '
        }
      })

      console.log(str)
    }

  }

  if (modifiedIcons.length > 0) {
    let str = ''
    str += `Fixed icons: `

    modifiedIcons.forEach(function(icon, i) {
      str += `\`${icon}\``

      if ((i + 1) <= newIcons.length - 1) {
        str += ', '
      }
    })

    console.log(str)
    console.log('')
  }

  if (renamedIcons.length > 0) {
    console.log(`Renamed icons: `)

    renamedIcons.forEach(function(icon, i) {
      console.log(`- \`${icon[0]}\` renamed to \`${icon[1]}\``)
    })
  }
}
