# .preview/

This directory contains PNG icons for local preview purposes.

## Structure

```sh
.preview/
└── icons/       # PNG files copied from packages/icons-png/
```

## Purpose

- PNG files are copied here from `packages/icons-png/icons/` for local preview
- Used by `PREVIEW.md` to display icons on GitHub
- Not committed to the repository (see `.gitignore`)

## Source of Truth

**Important:** The script reads PNG icons from `packages/icons-png/icons/` to determine which icons successfully built. Only icons that exist in this directory will appear in `PREVIEW.md`.

This ensures that `PREVIEW.md` only shows icons that:

- ✅ Successfully passed the build process
- ✅ Are available in the `@fex-to/icons-png` package
- ✅ Are ready for use

## Usage

Run the preview generation:

```bash
npm run generate:preview
```

This will:

1. Scan `packages/icons-png/icons/` for available PNG icons
2. Copy PNG icons to `.preview/icons/`
3. Generate `PREVIEW.md` with listings of successfully built icons

## Build Process

1. Run `npm run build` to generate PNG icons in `packages/icons-png/icons/`
2. Run `npm run generate:preview` to create preview from built icons
3. `PREVIEW.md` will only show icons that were successfully built

## Notes

- These PNG files are NOT committed to the repository to save space (~4.6MB)
- They are regenerated locally when needed
- The script exits with error if no PNG icons found (build required first)
