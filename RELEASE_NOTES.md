# Release 1.2.0

## 🎉 Major Changes

### Migration to npm
- ✅ Migrated from pnpm to npm
- ✅ Removed `pnpm-lock.yaml` and `pnpm-workspace.yaml`
- ✅ Created `package-lock.json`
- ✅ Added `.npmrc` with `legacy-peer-deps=true`
- ✅ Updated all scripts to use `npm run` instead of `pnpm run`
- ✅ Configured npm workspaces

### New Icon
- ✅ Added **fex** icon (version 1.2)

### Improvements
- ✅ Fixed preview generation script (async → sync)
- ✅ Added version-based sorting for icon preview (old icons first, new icons last)
- ✅ Fixed React icon component (color → fill attribute)
- ✅ Updated snapshot tests
- ✅ Updated LICENSE year to 2025

## 📊 Stats
- **Total icons**: 205
- **New icons**: 1 (fex)
- **Tests**: All passing ✅

## 🔧 Technical Details
- Package manager: npm@11.6.0
- Node.js: v24.8.0
- Turbo: v2.5.8
