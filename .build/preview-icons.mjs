import fs from 'fs'
import path from 'path'
import { glob, globSync } from 'glob'
import { generateIconsPreview } from './helpers.mjs'

const files = globSync('icons/*.svg')

// Сортировка по версии (от старых к новым)
const sortedFiles = files.map(file => {
  const basename = path.basename(file, '.svg')
  const srcFile = `src/_icons/${basename}.svg`
  
  let version = '0.0.0'
  if (fs.existsSync(srcFile)) {
    const content = fs.readFileSync(srcFile, 'utf-8')
    const match = content.match(/version:\s*"([0-9.]+)"/)
    if (match) {
      version = match[1]
    }
  }
  
  return { file, version }
})
.sort((a, b) => {
  // Сравниваем версии как числа
  const aParts = a.version.split('.').map(Number)
  const bParts = b.version.split('.').map(Number)
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aNum = aParts[i] || 0
    const bNum = bParts[i] || 0
    if (aNum !== bNum) return aNum - bNum
  }
  return 0
})
.map(item => item.file)

await generateIconsPreview(sortedFiles, '.github/icons.svg')
await generateIconsPreview(sortedFiles, '.github/icons-dark.svg', {
  color: '#ffffff',
  background: '#0c1117'
})