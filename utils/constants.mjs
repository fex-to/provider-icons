/**
 * Project constants and paths
 * @module constants
 */

import path from 'path';
import { fileURLToPath } from 'url';

// Get root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');

// Icon directories
export const ICON_DIRECTORIES = {
  SOURCE: 'src/_icons',
  BUILD: 'icons',
  DRAFT: '_draft',
};

// Package paths
export const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
export const ICONS_PACKAGE_DIR = path.join(PACKAGES_DIR, 'icons');

// Configuration files
export const PROVIDER_NODES_PATH = path.join(ICONS_PACKAGE_DIR, 'provider-nodes.json');
export const PROVIDER_SPRITE_PATH = path.join(ICONS_PACKAGE_DIR, 'provider-sprite.svg');

// GitHub paths
export const GITHUB_DIR = path.join(ROOT_DIR, '.github');
export const GITHUB_ICONS_SVG = path.join(GITHUB_DIR, 'icons.svg');
export const GITHUB_ICONS_DARK_SVG = path.join(GITHUB_DIR, 'icons-dark.svg');

// Symbol ID prefix
export const SYMBOL_ID_PREFIX = 'provider-';
