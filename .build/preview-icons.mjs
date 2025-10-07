import { glob, globSync } from 'glob'
import { generateIconsPreview } from './helpers.mjs'

const files = globSync('icons/*.svg')

await generateIconsPreview(files, '.github/icons.svg')
await generateIconsPreview(files, '.github/icons-dark.svg', {
  color: '#ffffff',
  background: '#354052'
})