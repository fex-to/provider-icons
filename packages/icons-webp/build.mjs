import sharp from 'sharp'
import { asyncForEach, readSvgs } from '../../.build/helpers.mjs'

const sizes = [128, 256, 512]
let svgFiles = readSvgs()

console.log(`Building WebP icons in ${sizes.length} sizes: ${sizes.join(', ')}`)

await asyncForEach(svgFiles, async function(file, i) {
  process.stdout.write(`Building ${i}/${svgFiles.length}: ${file.name.padEnd(42)}\r`)

  // Build all sizes for each icon
  for (const size of sizes) {
    const distPath = `./icons/${size}/${file.name}.webp`

    await sharp(file.path).resize({ height: size }).webp({ quality: 90 }).toFile(distPath)
  }
})

console.log(`\n✓ Generated ${svgFiles.length} icons in ${sizes.length} sizes`)
