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
  logInfo
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

// Rename files in directories
function renameFiles(oldName, newName) {
  const directories = [
    ICON_DIRECTORIES.SOURCE,
    ICON_DIRECTORIES.BUILD,
    ICON_DIRECTORIES.DRAFT
  ];

  const results = [];
  
  for (const dir of directories) {
    const oldPath = path.join(ROOT_DIR, dir, `${oldName}.svg`);
    const newPath = path.join(ROOT_DIR, dir, `${newName}.svg`);
    
    if (fileExists(oldPath)) {
      fs.renameSync(oldPath, newPath);
      results.push({ dir, success: true });
      logSuccess(`${dir}/${oldName}.svg → ${dir}/${newName}.svg`);
    } else {
      results.push({ dir, success: false });
      logWarning(`File not found: ${dir}/${oldName}.svg`);
    }
  }
  
  return results;
}

// Update JSON configuration
function updateJsonConfig(oldName, newName) {
  if (!fileExists(PROVIDER_NODES_PATH)) {
    logError(`File not found: ${PROVIDER_NODES_PATH}`);
    return false;
  }
  if (!fileExists(jsonPath)) {
    logError(`File not found: ${jsonPath}`);
    return false;
  }
  
  try {
    const jsonData = readJsonFile(PROVIDER_NODES_PATH);
    
    if (jsonData && jsonData[oldName]) {
      jsonData[newName] = jsonData[oldName];
      delete jsonData[oldName];
      
      writeJsonFile(PROVIDER_NODES_PATH, jsonData);
      logSuccess(`Updated provider-nodes.json`);
      return true;
    } else {
      logWarning(`Key "${oldName}" not found in provider-nodes.json`);
      return false;
    }
  } catch (error) {
    logError(`Error updating JSON: ${error.message}`);
    return false;
  }
}

// Update SVG file content
function updateSvgContent(oldName, newName) {
  const filePath = path.join(ROOT_DIR, ICON_DIRECTORIES.DRAFT, `${newName}.svg`);
  
  if (!fileExists(filePath)) {
    logWarning(`File not found: _draft/${newName}.svg`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace title and id
    content = content.replace(
      new RegExp(`<title>${oldName}</title>`, 'g'),
      `<title>${newName}</title>`
    );
    content = content.replace(
      new RegExp(`id="${oldName}"`, 'g'),
      `id="${newName}"`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    logSuccess(`Updated content in _draft/${newName}.svg`);
    return true;
  } catch (error) {
    logError(`Error updating SVG: ${error.message}`);
    return false;
  }
}

// Update generated files
function updateGeneratedFiles(oldName, newName) {
  const files = [
    '.github/icons.svg',
    '.github/icons-dark.svg',
    PROVIDER_SPRITE_PATH
  ];
  
  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(ROOT_DIR, file);
    
    if (!fileExists(filePath)) {
      logWarning(`File not found: ${file}`);
      continue;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const oldContent = content;
      
      // Replace id in symbol and use
      content = content.replace(
        new RegExp(`id="${oldName}"`, 'g'),
        `id="${newName}"`
      );
      content = content.replace(
        new RegExp(`xlink:href="#${oldName}"`, 'g'),
        `xlink:href="#${newName}"`
      );
      content = content.replace(
        new RegExp(`provider-${oldName}`, 'g'),
        `provider-${newName}`
      );
      
      if (content !== oldContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        logSuccess(`Updated ${file}`);
        updatedCount++;
      } else {
        logWarning(`No changes in ${file}`);
      }
    } catch (error) {
      logError(`Error updating ${file}: ${error.message}`);
    }
  }
  
  return updatedCount > 0;
}

// Confirm before renaming
async function confirmRename(oldName, newName, originalOld, originalNew) {
  console.log('\n' + '='.repeat(60));
  log('RENAME PREVIEW:', 'bright');
  console.log('='.repeat(60));
  log(`Old name: ${oldName}`, 'yellow');
  log(`New name: ${newName}`, 'green');
  
  if (originalOld !== oldName || originalNew !== newName) {
    console.log('');
    logInfo(`Original input: "${originalOld}" → "${originalNew}"`);
    logInfo(`Auto-converted to lowercase`);
  }
  
  console.log('='.repeat(60) + '\n');
  
  log('The following actions will be performed:', 'bright');
  console.log('  1. Rename files in src/_icons/, icons/, _draft/');
  console.log('  2. Update key in packages/icons/provider-nodes.json');
  console.log('  3. Update id and title in SVG files');
  console.log('  4. Update references in generated files\n');
  
  const answer = await question(`${colors.yellow}Continue? (y/n): ${colors.reset}`);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

// Main function
async function main() {
  console.clear();
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║              ICON RENAME UTILITY                           ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log('');
  
  try {
    // Step 1: Input old name
    logStep('1/2', 'Enter current icon name');
    const oldNameInput = (await question(`${colors.blue}Old name: ${colors.reset}`)).trim();
    
    if (!oldNameInput) {
      logError('Name cannot be empty!');
      rl.close();
      return;
    }
    
    // Normalize to lowercase
    const oldName = normalizeName(oldNameInput);
    
    if (oldNameInput !== oldName) {
      logInfo(`Auto-converted to lowercase: "${oldNameInput}" → "${oldName}"`);
    }
    
    // Check if files exist
    const oldPath = path.join(ROOT_DIR, ICON_DIRECTORIES.SOURCE, `${oldName}.svg`);
    if (!fileExists(oldPath)) {
      logWarning(`Warning: file src/_icons/${oldName}.svg not found!`);
      const continueAnyway = await question(`${colors.yellow}Continue anyway? (y/n): ${colors.reset}`);
      if (continueAnyway.toLowerCase() !== 'y' && continueAnyway.toLowerCase() !== 'yes') {
        log('Cancelled', 'red');
        rl.close();
        return;
      }
    }
    
    console.log('');
    
    // Step 2: Input new name
    logStep('2/2', 'Enter new icon name');
    const newNameInput = (await question(`${colors.blue}New name: ${colors.reset}`)).trim();
    
    if (!newNameInput) {
      logError('Name cannot be empty!');
      rl.close();
      return;
    }
    
    // Normalize to lowercase
    const newName = normalizeName(newNameInput);
    
    if (newNameInput !== newName) {
      logInfo(`Auto-converted to lowercase: "${newNameInput}" → "${newName}"`);
    }
    
    if (oldName === newName) {
      logError('Old and new names are identical!');
      rl.close();
      return;
    }
    
    console.log('');
    
    // Confirmation
    const confirmed = await confirmRename(oldName, newName, oldNameInput, newNameInput);
    
    if (!confirmed) {
      log('Cancelled by user', 'red');
      rl.close();
      return;
    }
    
    console.log('');
    log('EXECUTING...', 'bright');
    console.log('');
    
    // Execute operations
    logStep('1/4', 'Renaming files...');
    renameFiles(oldName, newName);
    console.log('');
    
    logStep('2/4', 'Updating JSON configuration...');
    updateJsonConfig(oldName, newName);
    console.log('');
    
    logStep('3/4', 'Updating SVG content...');
    updateSvgContent(oldName, newName);
    console.log('');
    
    logStep('4/4', 'Updating generated files...');
    updateGeneratedFiles(oldName, newName);
    console.log('');
    
    console.log('='.repeat(60));
    log('✓ RENAME COMPLETED SUCCESSFULLY!', 'green');
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
