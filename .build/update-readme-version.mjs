import fs from 'fs'
import path from 'path'
import { HOME_DIR, getPackageJson } from './helpers.mjs'

const README_PATH = path.resolve(HOME_DIR, 'README.md')
const packageJson = getPackageJson()
const version = `v${packageJson.version}`

console.log(`Updating version in README.md to ${version}...`)

// Read README
let readme = fs.readFileSync(README_PATH, 'utf-8')

// Replace version in installation examples
// Pattern 1: npm install command
readme = readme.replace(
  /npm install github:fex-to\/provider-icons#v[\d.]+/g,
  `npm install github:fex-to/provider-icons#${version}`
)

// Pattern 2: package.json examples
readme = readme.replace(
  /"github:fex-to\/provider-icons#v[\d.]+"/g,
  `"github:fex-to/provider-icons#${version}"`
)

// Write updated README
fs.writeFileSync(README_PATH, readme, 'utf-8')

console.log('✓ README.md version updated successfully')
