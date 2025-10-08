import fs from 'fs'
import { glob, globSync } from 'glob'
import { resolve, basename } from 'path'
import { HOME_DIR, optimizeSVG } from './helpers.mjs'


const files = globSync(resolve(HOME_DIR, './new/*.svg'))

files.forEach(function (file, i) {
  let fileData = fs.readFileSync(file).toString(),
    filename = basename(file, '.svg')

  console.log(filename)

  fileData = optimizeSVG(fileData)

  if (fileData.match(/transform="/)) {
    throw new Error(`File ${file} has \`transform\` in code!!`)
  }

  if (filename.match(/\s/)) {
    throw new Error(`File ${file} has space in name!!`)
  }

  fileData = fileData.replace(/---/g, '')
    .replace(/fill="none"/g, '')
    .replace(/fill="(.*?)"/gi, '')
    .replace(/fill-rule="evenodd"/g, '')
    .replace(/stroke-linecap="round"/g, '')
    .replace(/stroke-linejoin="round"/g, '')
    .replace(/viewBox="0 0 48 48"/g, '')
    .replace(/stroke="#000000"/g, '')
    .replace(/stroke="#000"/g, '')
    .replace(/stroke-width="2"/g, '')
    .replace(/width="48"/g, '')
    .replace(/width="48px"/g, '')
    .replace(/height="48"/g, '')
    .replace(/height="48px"/g, '')
    .replace(/clip-rule="evenodd"/g, '')
    .replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g, '')
    .replace(/<path d="M0 0h48v48H0z"*\/>/g, '')
    .replace(/<path d="M0 0h128v128H0z"*\/>/g, '')
    .replace(/<path stroke="red" stroke-width=".1" d="[^"]+"\s?\/>/g, '')
    .replace(/<path[^>]*stroke="red"[^>]*\/>/gs, '')
    .replace(/<defs*>.*?<\/defs>/gs, '')
    .replace(/<circle[^>]*stroke="red"[^>]*\/>/gs, '')
    .replace(/<g[^>]*stroke="red"[^>]*>.*?<\/g>/gs, '')
    .replace(/<svg\s+>/gs, '<svg>')

  fileData = optimizeSVG(fileData)

  // Get current package version for new icons
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  const currentVersion = packageJson.version

  fileData = fileData.replace(/<svg>/g, `---\nversion: "${currentVersion}"\n---\n<svg>`)

  if (fs.existsSync(`./src/_icons/${filename}.svg`)) {
    const newFileData = fs.readFileSync(`./src/_icons/${filename}.svg`).toString()
    const m = newFileData.match(/(---.*---)/gms)

    if (m) {
      fileData = fileData.replace(/---\nversion: ".*?"\n---/, m[0])
    }
  }

  fs.writeFileSync(`./src/_icons/${filename}.svg`, fileData)
})