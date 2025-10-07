import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ICONS_PNG_DIR = path.join(ROOT_DIR, 'packages/icons-png/icons');
const PREVIEW_DIR = path.join(ROOT_DIR, '.preview');
const PREVIEW_ICONS_DIR = path.join(PREVIEW_DIR, 'icons');
const PREVIEW_FILE = path.join(ROOT_DIR, 'PREVIEW.md');
const PNG_RELATIVE_PATH = '.preview/icons';

async function generatePreview() {
  console.log('Generating preview from packages/icons-png...\n');

  // Собираем все PNG иконки из packages/icons-png/icons/
  const iconFiles = glob.sync('*.png', { cwd: ICONS_PNG_DIR });
  
  if (iconFiles.length === 0) {
    console.error('❌ No PNG icons found in packages/icons-png/icons/');
    console.error('   Run "npm run build" first to generate PNG icons!');
    process.exit(1);
  }

  console.log(`Found ${iconFiles.length} PNG icons in packages/icons-png/icons/\n`);

  // Копируем PNG в .preview/icons/ для локального просмотра
  if (!fs.existsSync(PREVIEW_ICONS_DIR)) {
    fs.mkdirSync(PREVIEW_ICONS_DIR, { recursive: true });
    console.log('Created .preview/icons/ directory');
  }

  console.log('Copying PNG icons to .preview/icons/...');
  let copiedCount = 0;
  let skippedCount = 0;
  
  for (const file of iconFiles) {
    const sourcePath = path.join(ICONS_PNG_DIR, file);
    const targetPath = path.join(PREVIEW_ICONS_DIR, file);
    
    // Копируем только если файл не существует или отличается
    if (!fs.existsSync(targetPath) || 
        fs.readFileSync(sourcePath).toString() !== fs.readFileSync(targetPath).toString()) {
      fs.copyFileSync(sourcePath, targetPath);
      copiedCount++;
    } else {
      skippedCount++;
    }
  }
  
  if (copiedCount > 0) {
    console.log(`✓ Copied ${copiedCount} PNG icons`);
  }
  if (skippedCount > 0) {
    console.log(`✓ Skipped ${skippedCount} unchanged PNG icons`);
  }
  console.log();

  // Создаём список иконок с их именами
  const icons = iconFiles
    .map(file => {
      const name = path.basename(file, '.png');
      return {
        name,
        fileName: file,
        componentName: name.split('-').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join('') + 'Icon'
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Генерируем markdown контент
  let markdown = `# Icons Preview

This page shows all **${icons.length}** available icons with their IDs and React components for easy copying.

> **📦 Source:** Icons are built from \`packages/icons-png/icons/\`  
> **🔄 Update:** Run \`npm run build\` to rebuild icons

## Quick Navigation

- [All Icons](#all-icons)
- [Usage Examples](#usage-examples)
- [Installation](README.md#installation)

---

## All Icons

Total: **${icons.length} icons**

| Preview | ID | React Component |
|---------|----|-----------------|\n`;

  // Добавляем каждую иконку в таблицу
  icons.forEach(({ name, componentName }) => {
    // Используем относительный путь к PNG для GitHub
    const pngPath = `${PNG_RELATIVE_PATH}/${name}.png`;
    
    markdown += `| <img src="${pngPath}" width="96" height="96" alt="${name}" /> | \`${name}\` | \`<${componentName} />\` |\n`;
  });

  // Добавляем примеры использования
  markdown += `\n---

## Usage Examples

### JavaScript/Node.js

\`\`\`javascript
import { IconFex } from '@fex.to/icons';

// Icon as SVG string
console.log(IconFex);
\`\`\`

### React

\`\`\`jsx
import { IconFex } from '@fex.to/icons-react';

function App() {
  return (
    <div>
      <IconFex size={96} color="blue" />
    </div>
  );
}
\`\`\`

### React Component Props

All React icon components accept the following props:

- \`size\` - Icon size (number or string, default: 96)
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
    "@fex.to/icons": "github:fex-to/provider-icons#v1.2.5",
    "@fex.to/icons-react": "github:fex-to/provider-icons#v1.2.5",
    "@fex.to/icons-png": "github:fex-to/provider-icons#v1.2.5"
  }
}
\`\`\`

---

## Available Packages

- **@fex.to/icons** - SVG icons as JavaScript strings
- **@fex.to/icons-react** - React components
- **@fex.to/icons-png** - PNG images (96x96, 48x48)

---

*Generated automatically from \`packages/icons-png/icons/\`. Do not edit manually.*
`;

  // Записываем файл
  fs.writeFileSync(PREVIEW_FILE, markdown, 'utf8');

  console.log(`✓ Preview page generated: PREVIEW.md`);
  console.log(`✓ Total icons: ${icons.length}\n`);
}

// Запускаем генерацию
generatePreview().catch(error => {
  console.error('Error generating preview:', error);
  process.exit(1);
});
