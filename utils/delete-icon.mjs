#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {
  colors,
  log,
  logStep,
  logSuccess,
  logError,
  logWarning,
  logInfo,
  logDanger
} from './logger.mjs';
import { fileExists, normalizeName, readJsonFile, writeJsonFile } from './fs-helpers.mjs';
import {
  ROOT_DIR,
  ICON_DIRECTORIES,
  PROVIDER_NODES_PATH,
  PROVIDER_SPRITE_PATH,
  GITHUB_ICONS_SVG,
  GITHUB_ICONS_DARK_SVG,
  SYMBOL_ID_PREFIX
} from './constants.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Delete files from directories
function deleteFiles(iconName) {
  // Only delete from src/_icons - the source directory used in build
  // icons/ and _draft/ are storage/drafts and not used in final build
  const directories = [
    ICON_DIRECTORIES.SOURCE
  ];

  const results = [];
  let deletedCount = 0;
  
  for (const dir of directories) {
    const filePath = path.join(ROOT_DIR, dir, `${iconName}.svg`);
    
    if (fileExists(filePath)) {
      try {
        fs.unlinkSync(filePath);
        results.push({ dir, success: true });
        logSuccess(`Deleted: ${dir}/${iconName}.svg`);
        deletedCount++;
      } catch (error) {
        results.push({ dir, success: false, error: error.message });
        logError(`Failed to delete: ${dir}/${iconName}.svg - ${error.message}`);
      }
    } else {
      results.push({ dir, success: false, notFound: true });
      logWarning(`Not found: ${dir}/${iconName}.svg`);
    }
  }
  
  // Check if icon exists in storage directories (info only, no deletion)
  const storageDirectories = [ICON_DIRECTORIES.BUILD, ICON_DIRECTORIES.DRAFT];
  for (const dir of storageDirectories) {
    const filePath = path.join(ROOT_DIR, dir, `${iconName}.svg`);
    if (fileExists(filePath)) {
      logInfo(`Icon also exists in ${dir}/ (storage directory - not deleted)`);
    }
  }
  
  return { results, deletedCount };
}

// Remove from JSON configuration
function removeFromJsonConfig(iconName) {
  if (!fileExists(PROVIDER_NODES_PATH)) {
    logError(`File not found: ${PROVIDER_NODES_PATH}`);
    return false;
  }
  
  try {
    const jsonData = readJsonFile(PROVIDER_NODES_PATH);
    
    if (jsonData && jsonData[iconName]) {
      delete jsonData[iconName];
      
      writeJsonFile(PROVIDER_NODES_PATH, jsonData);
      logSuccess(`Removed from provider-nodes.json`);
      return true;
    } else {
      logWarning(`Key "${iconName}" not found in provider-nodes.json`);
      return false;
    }
  } catch (error) {
    logError(`Error updating JSON: ${error.message}`);
    return false;
  }
}

// Remove from generated files
function removeFromGeneratedFiles(iconName) {
  const files = [
    GITHUB_ICONS_SVG,
    GITHUB_ICONS_DARK_SVG,
    PROVIDER_SPRITE_PATH
  ];
  
  let updatedCount = 0;
  
  for (const file of files) {
    if (!fileExists(file)) {
      logWarning(`File not found: ${path.relative(ROOT_DIR, file)}`);
      continue;
    }
    
    try {
      let content = fs.readFileSync(file, 'utf8');
      const oldContent = content;
      
      // Remove symbol definition
      const symbolRegex = new RegExp(`\\s*<symbol id="${iconName}"[^>]*>.*?</symbol>`, 'gs');
      content = content.replace(symbolRegex, '');
      
      // Remove provider- prefixed symbol
      const providerSymbolRegex = new RegExp(`\\s*<symbol id="${SYMBOL_ID_PREFIX}${iconName}"[^>]*>.*?</symbol>`, 'gs');
      content = content.replace(providerSymbolRegex, '');
      
      // Remove use references
      const useRegex = new RegExp(`\\s*<use[^>]*xlink:href="#${iconName}"[^>]*/>`, 'g');
      content = content.replace(useRegex, '');
      
      const providerUseRegex = new RegExp(`\\s*<use[^>]*xlink:href="#${SYMBOL_ID_PREFIX}${iconName}"[^>]*/>`, 'g');
      content = content.replace(providerUseRegex, '');
      
      if (content !== oldContent) {
        fs.writeFileSync(file, content, 'utf8');
        logSuccess(`Updated ${path.relative(ROOT_DIR, file)}`);
        updatedCount++;
      } else {
        logWarning(`No references found in ${path.relative(ROOT_DIR, file)}`);
      }
    } catch (error) {
      logError(`Error updating ${path.relative(ROOT_DIR, file)}: ${error.message}`);
    }
  }
  
  return updatedCount > 0;
}

// Find all files containing the icon name
function findReferences(iconName) {
  const searchDirs = [
    'packages',
    'test',
    '.github'
  ];
  
  const references = [];
  
  function searchInDirectory(dir) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          if (item.name !== 'node_modules' && !item.name.startsWith('.')) {
            searchInDirectory(fullPath);
          }
        } else if (item.isFile() && (item.name.endsWith('.json') || item.name.endsWith('.svg'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(iconName)) {
              references.push(fullPath.replace(__dirname + '/', ''));
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be accessed
    }
  }
  
  for (const dir of searchDirs) {
    const fullDir = path.join(ROOT_DIR, dir);
    if (fileExists(fullDir)) {
      searchInDirectory(fullDir);
    }
  }
  
  return references;
}

// Confirm before deletion
async function confirmDeletion(iconName, originalInput) {
  console.log('\n' + '='.repeat(60));
  log('⚠️  DELETION PREVIEW - PERMANENT ACTION!', 'red');
  console.log('='.repeat(60));
  log(`Icon to delete: ${iconName}`, 'red');
  
  if (originalInput !== iconName) {
    logInfo(`Original input: "${originalInput}"`);
    logInfo(`Auto-converted to lowercase`);
  }
  
  console.log('='.repeat(60) + '\n');
  
  log('The following actions will be performed:', 'bright');
  console.log('  1. Delete file from src/_icons/ (build source)');
  console.log('  2. Remove key from packages/icons/provider-nodes.json');
  console.log('  3. Remove from generated files (.github/, packages/)');
  console.log('  4. Clean up all references');
  console.log('');
  logInfo('Note: icons/ and _draft/ are storage directories - not deleted');
  console.log('');
  
  logDanger('THIS ACTION CANNOT BE UNDONE!');
  console.log('');
  
  const answer = await question(`${colors.red}Type "${iconName}" to confirm deletion: ${colors.reset}`);
  return answer === iconName;
}

// Show summary of what will be deleted
async function showDeletionSummary(iconName) {
  console.log('\n' + '='.repeat(60));
  log('SCANNING FOR ICON...', 'bright');
  console.log('='.repeat(60) + '\n');
  
  // Only check src/_icons for deletion
  const sourceDir = 'src/_icons';
  const sourceFile = path.join(ROOT_DIR, sourceDir, `${iconName}.svg`);
  const foundInSource = fileExists(sourceFile);
  
  // Check storage directories (info only)
  const storageDirectories = ['icons', '_draft'];
  const foundInStorage = [];
  
  for (const dir of storageDirectories) {
    const filePath = path.join(ROOT_DIR, dir, `${iconName}.svg`);
    if (fileExists(filePath)) {
      foundInStorage.push(dir);
    }
  }
  
  // Check JSON
  const jsonPath = path.join(ROOT_DIR, 'packages/icons/provider-nodes.json');
  let jsonExists = false;
  if (fileExists(jsonPath)) {
    const content = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(content);
    jsonExists = !!jsonData[iconName];
  }
  
  // Find references
  logInfo('Scanning for references...');
  const references = findReferences(iconName);
  
  console.log('');
  
  if (!foundInSource && !jsonExists && references.length === 0) {
    logWarning(`Icon "${iconName}" not found in project!`);
    return false;
  }
  
  log('FOUND:', 'bright');
  
  if (foundInSource) {
    console.log(`\n  ${colors.yellow}Source file (will be deleted):${colors.reset}`);
    console.log(`    • ${sourceDir}/${iconName}.svg`);
  } else {
    console.log(`\n  ${colors.gray}Source file: Not found in ${sourceDir}/${colors.reset}`);
  }
  
  if (foundInStorage.length > 0) {
    console.log(`\n  ${colors.cyan}Storage files (will NOT be deleted):${colors.reset}`);
    foundInStorage.forEach(dir => console.log(`    • ${dir}/${iconName}.svg`));
  }
  
  if (jsonExists) {
    console.log(`\n  ${colors.yellow}JSON Configuration:${colors.reset}`);
    console.log(`    • packages/icons/provider-nodes.json`);
  }
  
  if (references.length > 0) {
    console.log(`\n  ${colors.yellow}References (${references.length}):${colors.reset}`);
    references.slice(0, 10).forEach(ref => console.log(`    • ${ref}`));
    if (references.length > 10) {
      console.log(`    ... and ${references.length - 10} more`);
    }
  }
  
  console.log('');
  
  return true;
}

// Main function
async function main() {
  console.clear();
  log('╔════════════════════════════════════════════════════════════╗', 'red');
  log('║              ICON DELETE UTILITY                           ║', 'red');
  log('╚════════════════════════════════════════════════════════════╝', 'red');
  console.log('');
  
  logDanger('This utility permanently deletes icons from the project!');
  console.log('');
  
  try {
    // Step 1: Input icon name
    logStep('1/2', 'Enter icon name to delete');
    const iconNameInput = (await question(`${colors.blue}Icon name: ${colors.reset}`)).trim();
    
    if (!iconNameInput) {
      logError('Icon name cannot be empty!');
      rl.close();
      return;
    }
    
    // Normalize to lowercase
    const iconName = normalizeName(iconNameInput);
    
    if (iconNameInput !== iconName) {
      logInfo(`Auto-converted to lowercase: "${iconNameInput}" → "${iconName}"`);
    }
    
    // Show what will be deleted
    const found = await showDeletionSummary(iconName);
    
    if (!found) {
      rl.close();
      return;
    }
    
    // Step 2: Confirmation
    logStep('2/2', 'Confirm deletion');
    const confirmed = await confirmDeletion(iconName, iconNameInput);
    
    if (!confirmed) {
      console.log('');
      log('Deletion cancelled - no changes made', 'yellow');
      rl.close();
      return;
    }
    
    console.log('');
    log('DELETING...', 'red');
    console.log('');
    
    // Execute deletion
    logStep('1/3', 'Deleting files...');
    const { deletedCount } = deleteFiles(iconName);
    console.log('');
    
    logStep('2/3', 'Removing from JSON configuration...');
    removeFromJsonConfig(iconName);
    console.log('');
    
    logStep('3/3', 'Removing from generated files...');
    removeFromGeneratedFiles(iconName);
    console.log('');
    
    console.log('='.repeat(60));
    if (deletedCount > 0) {
      log('✓ DELETION COMPLETED SUCCESSFULLY!', 'green');
    } else {
      logWarning('No files were deleted (already removed or not found)');
    }
    console.log('='.repeat(60));
    console.log('');
    log('Don\'t forget to run npm run build for rebuild', 'yellow');
    console.log('');
    
  } catch (error) {
    console.log('');
    logError(`Error: ${error.message}`);
    console.error(error);
  }
  
  rl.close();
}

// Start
main();
