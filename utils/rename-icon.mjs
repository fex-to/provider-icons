#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`${colors.cyan}[${step}]${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function logInfo(message) {
  console.log(`${colors.gray}ℹ${colors.reset} ${message}`);
}

// Normalize icon name to lowercase
function normalizeName(name) {
  return name.trim().toLowerCase();
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Rename files in directories
function renameFiles(oldName, newName) {
  const directories = [
    'src/_icons',
    'icons',
    '_draft'
  ];

  const results = [];
  
  for (const dir of directories) {
    const oldPath = path.join(rootDir, dir, `${oldName}.svg`);
    const newPath = path.join(rootDir, dir, `${newName}.svg`);
    
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
  const jsonPath = path.join(rootDir, 'packages/icons/provider-nodes.json');
  
  if (!fileExists(jsonPath)) {
    logError(`File not found: ${jsonPath}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(content);
    
    if (jsonData[oldName]) {
      jsonData[newName] = jsonData[oldName];
      delete jsonData[oldName];
      
      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
      logSuccess(`Updated packages/icons/provider-nodes.json`);
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
  const filePath = path.join(rootDir, '_draft', `${newName}.svg`);
  
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
    'packages/icons/provider-sprite.svg'
  ];
  
  let updatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(rootDir, file);
    
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
    const oldPath = path.join(rootDir, 'src/_icons', `${oldName}.svg`);
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
