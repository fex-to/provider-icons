/**
 * Filesystem helper utilities
 * @module fs-helpers
 */

import fs from 'fs';

/**
 * Check if file or directory exists
 * @param {string} filePath - Path to check
 * @returns {boolean} True if exists
 */
export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Normalize icon name to lowercase
 * @param {string} name - Name to normalize
 * @returns {string} Normalized name
 */
export function normalizeName(name) {
  return name.trim().toLowerCase();
}

/**
 * Read JSON file safely
 * @param {string} filePath - Path to JSON file
 * @returns {Object|null} Parsed JSON or null if error
 */
export function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Write JSON file with formatting
 * @param {string} filePath - Path to JSON file
 * @param {Object} data - Data to write
 * @param {number} spaces - Number of spaces for indentation (default: 2)
 */
export function writeJsonFile(filePath, data, spaces = 2) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, spaces), 'utf8');
}

/**
 * Delete file if it exists
 * @param {string} filePath - Path to file
 * @returns {boolean} True if deleted, false otherwise
 */
export function deleteFileIfExists(filePath) {
  if (fileExists(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}
