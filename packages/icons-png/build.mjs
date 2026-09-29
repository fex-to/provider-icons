import sharp from 'sharp'
import { asyncForEach, readSvgs } from '../../.build/helpers.mjs'

let svgFiles = readSvgs()

await asyncForEach(svgFiles, async function(file, i) {
  const distPath = `./icons/${file.name}.png`

  process.stdout.write(`Building ${i}/${svgFiles.length}: ${file.name.padEnd(42)}\r`)

  await sharp(file.path).resize({ height: 480 }).png().toFile(distPath)
})
