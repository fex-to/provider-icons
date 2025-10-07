/**
 * Console logger utility with color support
 * @module logger
 */

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m',
};

/**
 * Log message with optional color
 * @param {string} message - Message to log
 * @param {string} color - Color key from colors object
 */
export function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Log step with cyan color
 * @param {string} step - Step identifier
 * @param {string} message - Message to log
 */
export function logStep(step, message) {
  console.log(`${colors.cyan}[${step}]${colors.reset} ${message}`);
}

/**
 * Log success message with checkmark
 * @param {string} message - Message to log
 */
export function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

/**
 * Log error message with cross mark
 * @param {string} message - Message to log
 */
export function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

/**
 * Log warning message with warning sign
 * @param {string} message - Message to log
 */
export function logWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

/**
 * Log info message with info sign
 * @param {string} message - Message to log
 */
export function logInfo(message) {
  console.log(`${colors.gray}ℹ${colors.reset} ${message}`);
}

/**
 * Log danger message with trash icon
 * @param {string} message - Message to log
 */
export function logDanger(message) {
  console.log(`${colors.red}🗑${colors.reset}  ${message}`);
}
