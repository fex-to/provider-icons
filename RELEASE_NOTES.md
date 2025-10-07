## Version 2.0.0

### Breaking Changes

- **Renamed all packages from `@cr.today` to `@fex.to`**
  - `@cr.today/icons` → `@fex.to/icons`
  - `@cr.today/icons-react` → `@fex.to/icons-react`
  - `@cr.today/icons-png` → `@fex.to/icons-png`
  - `@cr.today/sources-icons` → `@fex.to/sources-icons`

### New Features

- **Preview page generation** - Added `generate-preview.mjs` script
  - Generates `PREVIEW.md` with all available icons
  - Uses PNG from `packages/icons-png/icons/` as source of truth
  - Shows only successfully built icons
  - Preview images stored in `.preview/icons/` directory

### Improvements

- **Icon management utilities**
  - Moved utilities to `utils/` folder for better organization
  - `utils/rename-icon.mjs` - Interactive icon renaming
  - `utils/delete-icon.mjs` - Safe icon deletion (preserves `icons/` and `_draft/`)

- **Documentation**
  - Updated project description
  - Added comprehensive documentation for preview system
  - Updated all examples and installation instructions

### Technical Details

- 204 icons available
- All packages updated to use `@fex.to` namespace
- Preview system integrated into build process
- Updated README with proper icon count markers

For installation and usage, see [README.md](README.md) and [PREVIEW.md](PREVIEW.md).
