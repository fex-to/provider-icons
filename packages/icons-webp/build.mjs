import { exec } from 'child_process'
import { asyncForEach, readSvgs } from '../../.build/helpers.mjs'

const sizes = [128, 256, 512]
let svgFiles = readSvgs()

console.log(`Building WebP icons in ${sizes.length} sizes: ${sizes.join(', ')}`)

await asyncForEach(svgFiles, async function(file, i) {
  process.stdout.write(`Building ${i}/${svgFiles.length}: ${file.name.padEnd(42)}\r`)

  // Build all sizes for each icon
  for (const size of sizes) {
    const distPath = `./icons/${size}/${file.name}.webp`

    await new Promise((resolve, reject) => {
      // Convert SVG to PNG first, then to WebP
      const convertCmd = `rsvg-convert -h ${size} ${file.path} | cwebp -q 90 -o ${distPath} -- -`
      
      exec(convertCmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`\nError converting ${file.name} to ${size}x${size}:`, error.message)
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
})

console.log(`\n✓ Generated ${svgFiles.length} icons in ${sizes.length} sizes`)
