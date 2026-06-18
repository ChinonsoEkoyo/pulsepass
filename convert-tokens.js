const fs = require('fs');
const path = require('path');

const colorTokensPath = path.join(__dirname, 'color-tokens.json');
const designTokensPath = path.join(__dirname, 'design-tokens.json');
const cssOutputPath = path.join(__dirname, 'theme-tokens.css');

const colorTokens = JSON.parse(fs.readFileSync(colorTokensPath, 'utf8'));
const designTokens = JSON.parse(fs.readFileSync(designTokensPath, 'utf8'));

// Resolves references like "{color.palette.primary.100}" to their actual values
function resolveColorRef(ref, root) {
  if (typeof ref !== 'string' || !ref.startsWith('{') || !ref.endsWith('}')) {
    return ref;
  }
  const pathParts = ref.slice(1, -1).split('.');
  let current = root;
  for (const part of pathParts) {
    if (current === undefined || current[part] === undefined) {
      return ref;
    }
    current = current[part];
  }
  return resolveColorRef(current, root);
}

function kebabCase(str) {
  // Convert camelCase or PascalCase to kebab-case
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

let cssContent = '/* Auto-generated tokens */\n\n:root {\n';

// Process color roles (light theme)
const rolesLight = colorTokens.color.role.light;
cssContent += '  /* === Light Theme Colors (Roles) === */\n';
for (const [key, val] of Object.entries(rolesLight)) {
  const resolvedValue = resolveColorRef(val, colorTokens);
  const cssKey = kebabCase(key);
  cssContent += `  --color-${cssKey}: ${resolvedValue};\n`;
}

// Process Design Tokens
cssContent += '\n  /* === Design Tokens (Typography, etc.) === */\n';
function processDesignTokens(obj, prefix = '') {
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object') {
      if (val.value !== undefined) {
        // It's a token
        const tokenValue = val.value;
        if (typeof tokenValue === 'object') {
          // Complex token (like typography definition)
          for (const [propKey, propVal] of Object.entries(tokenValue)) {
            let cssPropKey = kebabCase(propKey);
            let finalVal = propVal;
            // Add px to numeric values that are strictly not fontWeight or already 0
            if (typeof finalVal === 'number' && propKey.toLowerCase().indexOf('weight') === -1 && finalVal !== 0) {
                finalVal = finalVal + 'px';
            }
            cssContent += `  --${prefix}${kebabCase(key)}-${cssPropKey}: ${finalVal};\n`;
          }
        } else {
          // Simple token value
          let finalVal = tokenValue;
          if (typeof finalVal === 'number' && key.toLowerCase().indexOf('weight') === -1 && finalVal !== 0) {
              finalVal = finalVal + 'px';
          }
          cssContent += `  --${prefix}${kebabCase(key)}: ${finalVal};\n`;
        }
      } else if (key !== 'extensions' && key !== 'type') {
        // Continue recursion, ignoring generic metadata keys
        processDesignTokens(val, `${prefix}${kebabCase(key)}-`);
      }
    }
  }
}
processDesignTokens(designTokens, '');

cssContent += '}\n\n';

// Process color roles (dark theme) inside a media query
const rolesDark = colorTokens.color.role.dark;
cssContent += '@media (prefers-color-scheme: dark) {\n';
cssContent += '  :root {\n';
cssContent += '    /* === Dark Theme Colors (Roles) === */\n';
for (const [key, val] of Object.entries(rolesDark)) {
  const resolvedValue = resolveColorRef(val, colorTokens);
  const cssKey = kebabCase(key);
  cssContent += `    --color-${cssKey}: ${resolvedValue};\n`;
}
cssContent += '  }\n}\n';

fs.writeFileSync(cssOutputPath, cssContent, 'utf8');
console.log(`Tokens successfully written to ${cssOutputPath}`);
