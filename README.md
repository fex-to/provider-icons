# Provider Icons

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/fex-to/provider-icons/blob/main/.github/icons-dark@2x.png?raw=true">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/fex-to/provider-icons/blob/main/.github/icons@2x.png?raw=true">
    <img src="https://github.com/fex-to/provider-icons/blob/main/.github/icons@2x.png?raw=true" alt="Provider Icons preview" width="840">
  </picture>
</p>

## Icons

A set of <!--icons-count-->251<!--/icons-count--> provider icons.

## Installation

### Install from GitHub

Since these packages are not published to npm registry, install them directly from GitHub:

#### Using npm

```bash
# Install with specific version tag
npm install github:fex-to/provider-icons#v3.0.2

# Or install the latest from main branch
npm install github:fex-to/provider-icons#main
```

#### Using package.json

Add to your `package.json`:

```json
{
  "dependencies": {
    "@fex-to/provider-icons": "github:fex-to/provider-icons#v3.0.2",
    "@fex-to/provider-icons-react": "github:fex-to/provider-icons#v3.0.2",
    "@fex-to/provider-icons-png": "github:fex-to/provider-icons#v3.0.2"
  }
}
```

Then run `npm install`.

## Usage

### JavaScript/Node.js

```javascript
import { IconFex } from '@fex-to/provider-icons';

// Icon as SVG string
console.log(IconFex);
```

### React

```jsx
import { IconFex } from '@fex-to/provider-icons-react';

function App() {
  return (
    <div>
      <IconFex size={24} color="blue" />
    </div>
  );
}
```

### PNG Icons

PNG icons are available in `@fex-to/provider-icons-png` package:

```ini
node_modules/@fex-to/provider-icons-png/icons/
```

## Available Icons

All <!--icons-count-->204<!--/icons-count--> icons are available in three formats:

- **SVG** (JavaScript/Node.js) - `@fex-to/provider-icons`
- **React Components** - `@fex-to/provider-icons-react`
- **PNG Images** - `@fex-to/provider-icons-png`

📋 **[Browse all icons with IDs and React components →](PREVIEW.md)**

For a visual preview of all icons, see the [icon grid](.github/icons@2x.png).

## Disclaimer

⚠️ **Important Legal Notice**

All logos, trademarks, and brand names displayed in this repository are the property of their respective owners. This repository:

- Does not claim ownership of any intellectual property
- Is provided for informational and educational purposes only
- Is not affiliated with any of the companies whose logos appear here

Users are responsible for:

- Obtaining proper permissions before commercial use
- Complying with applicable intellectual property laws
- Respecting the rights of trademark holders

For detailed information, see [**DISCLAIMER.md**](DISCLAIMER.md)

## License

MIT License - See [LICENSE](LICENSE) file for details.

The license applies to the code and structure of this repository, not to the logos and trademarks contained within.
