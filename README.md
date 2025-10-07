# Sources Icons

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/cr-today/sources-icons/blob/main/.github/icons-dark@2x.png?raw=true">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/cr-today/sources-icons/blob/main/.github/icons@2x.png?raw=true">
    <img src="https://github.com/cr-today/sources-icons/blob/main/.github/icons@2x.png?raw=true" alt="Sources Icons preview" width="840">
  </picture>
</p>

## Icons

A set of <!--icons-count-->204<!--/icons-count--> sources icons.

## Installation

### Install from GitHub

Since these packages are not published to npm registry, install them directly from GitHub:

#### Using npm

```bash
# Install with specific version tag
npm install github:cr-today/sources-icons#v1.2.3

# Or install the latest from main branch
npm install github:cr-today/sources-icons#main
```

#### Using package.json

Add to your `package.json`:

```json
{
  "dependencies": {
    "@cr.today/icons": "github:cr-today/sources-icons#v1.2.3",
    "@cr.today/icons-react": "github:cr-today/sources-icons#v1.2.3",
    "@cr.today/icons-png": "github:cr-today/sources-icons#v1.2.3"
  }
}
```

Then run `npm install`.

## Usage

### JavaScript/Node.js

```javascript
import { IconFex } from '@cr.today/icons';

// Icon as SVG string
console.log(IconFex);
```

### React

```jsx
import { IconFex } from '@cr.today/icons-react';

function App() {
  return (
    <div>
      <IconFex size={24} color="blue" />
    </div>
  );
}
```

### PNG Icons

PNG icons are available in `@cr.today/icons-png` package:

```ini
node_modules/@cr.today/icons-png/icons/
```

## Available Icons

All <!--icons-count-->204<!--/icons-count--> icons are available in three formats:

- **SVG** (JavaScript/Node.js) - `@cr.today/icons`
- **React Components** - `@cr.today/icons-react`
- **PNG Images** - `@cr.today/icons-png`

For a complete list of available icons, see the [preview](.github/icons@2x.png).

## Many thanks

Some of the source code was borrowed from another repository. I reserve the right to point to the source:

- **Author**: Paweł Kuna
- **Repository**: https://github.com/tabler/tabler-icons
- **License**: https://github.com/tabler/tabler-icons/blob/master/LICENSE
