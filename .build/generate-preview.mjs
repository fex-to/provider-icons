import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT_DIR, 'src/_icons');
const PREVIEW_FILE = path.join(ROOT_DIR, 'PREVIEW.md');
const PNG_BASE_URL = 'https://raw.githubusercontent.com/fex-to/provider-icons/main/packages/icons-png/icons';

// Get all icon files
const iconFiles = glob.sync(path.join(ICONS_DIR, '*.svg'));

// Sort icons alphabetically
const icons = iconFiles
  .map(file => path.basename(file, '.svg'))
  .sort((a, b) => a.localeCompare(b));

console.log(`Found ${icons.length} icons`);

// Generate markdown content
let markdown = `# Icons Preview

This page shows all ${icons.length} available icons with their IDs and React components for easy copying.

## Quick Navigation

- [All Icons](#all-icons)
- [Usage Examples](#usage-examples)
- [Installation](README.md#installation)

---

## All Icons

Total: **${icons.length} icons**

| Preview | ID | React Component |
|---------|----|-----------------|\n`;

// Add each icon to the table
icons.forEach((iconName) => {
  const iconId = iconName;
  const pngUrl = `${PNG_BASE_URL}/${iconName}.png`;
  const reactComponent = `Icon${toPascalCase(iconName)}`;
  
  markdown += `| ![${iconId}](${pngUrl}) | \`${iconId}\` | \`<${reactComponent} />\` |\n`;
});

// Add usage examples
markdown += `\n---

## Usage Examples

### JavaScript/Node.js

\`\`\`javascript
import { IconFex } from '@cr.today/icons';

// Icon as SVG string
console.log(IconFex);
\`\`\`

### React

\`\`\`jsx
import { IconFex } from '@cr.today/icons-react';

function App() {
  return (
    <div>
      <IconFex size={24} color="blue" />
    </div>
  );
}
\`\`\`

### React Component Props

All React icon components accept the following props:

- \`size\` - Icon size (number or string, default: 24)
- \`color\` - Icon color (any valid CSS color)
- \`stroke\` - Stroke width (number, default: 2)
- \`className\` - Additional CSS classes
- Any other HTML/SVG attributes

Example:
\`\`\`jsx
<IconUsFed 
  size={32} 
  color="#0066cc" 
  stroke={1.5}
  className="my-icon"
  onClick={() => console.log('clicked')}
/>
\`\`\`

---

## Installation

### Using npm

\`\`\`bash
# Install with specific version tag
npm install github:fex-to/provider-icons#v1.2.5

# Or install the latest from main branch
npm install github:fex-to/provider-icons#main
\`\`\`

### Using package.json

\`\`\`json
{
  "dependencies": {
    "@cr.today/icons": "github:fex-to/provider-icons#v1.2.5",
    "@cr.today/icons-react": "github:fex-to/provider-icons#v1.2.5",
    "@cr.today/icons-png": "github:fex-to/provider-icons#v1.2.5"
  }
}
\`\`\`

---

## Available Packages

- **@cr.today/icons** - SVG icons as JavaScript strings
- **@cr.today/icons-react** - React components
- **@cr.today/icons-png** - PNG images (24x24, 48x48)

---

*Generated automatically. Do not edit manually.*
`;

// Write the file
fs.writeFileSync(PREVIEW_FILE, markdown, 'utf8');

console.log(`✓ Preview page generated: ${PREVIEW_FILE}`);
console.log(`✓ Total icons: ${icons.length}`);

// Helper function to convert to PascalCase
function toPascalCase(string) {
  return string
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
