const fs = require('fs');
const path = require('path');

const colorTokensPath = path.join(__dirname, 'color-tokens.json');
const designTokensPath = path.join(__dirname, 'design-tokens.json');

// --- 1. Fix color-tokens.json `error` ---
const colorTokens = JSON.parse(fs.readFileSync(colorTokensPath, 'utf8'));

if (!colorTokens.color.palette.error) {
  colorTokens.color.palette.error = {
    "0": "hsl(0, 0%, 0%)",
    "10": "hsl(0, 100%, 13%)",
    "20": "hsl(0, 100%, 25%)",
    "30": "hsl(0, 95%, 40%)",
    "40": "hsl(0, 85%, 50%)",
    "50": "hsl(0, 80%, 60%)",
    "60": "hsl(0, 75%, 70%)",
    "70": "hsl(0, 70%, 80%)",
    "80": "hsl(0, 60%, 90%)",
    "87": "hsl(0, 60%, 94%)",
    "90": "hsl(0, 60%, 95%)",
    "92": "hsl(0, 60%, 96%)",
    "94": "hsl(0, 60%, 97%)",
    "95": "hsl(0, 60%, 98%)",
    "96": "hsl(0, 60%, 98%)",
    "98": "hsl(0, 60%, 99%)",
    "99": "hsl(0, 60%, 99%)",
    "100": "hsl(0, 0%, 100%)"
  };
}

fs.writeFileSync(colorTokensPath, JSON.stringify(colorTokens, null, 2), 'utf8');
console.log('Fixed color-tokens.json -> Added error palette.');

// --- 2. Update Typography in design-tokens.json to MD3 ---
const designTokens = JSON.parse(fs.readFileSync(designTokensPath, 'utf8'));

const createTypographyToken = (size, lineH, weight, letterS, family = 'Inter') => ({
  type: "custom-fontStyle",
  value: {
    fontSize: size,
    textDecoration: "none",
    fontFamily: family,
    fontWeight: weight,
    fontStyle: "normal",
    fontStretch: "normal",
    letterSpacing: letterS,
    lineHeight: lineH,
    paragraphIndent: 0,
    paragraphSpacing: 0,
    textCase: "none"
  }
});

// Overwrite 'font' block completely
designTokens.font = {
  display: {
    large: createTypographyToken(57, 64, 400, -0.25),
    medium: createTypographyToken(45, 52, 400, 0),
    small: createTypographyToken(36, 44, 400, 0)
  },
  headline: {
    large: createTypographyToken(32, 40, 400, 0),
    medium: createTypographyToken(28, 36, 400, 0),
    small: createTypographyToken(24, 32, 400, 0)
  },
  title: {
    large: createTypographyToken(22, 28, 400, 0),
    medium: createTypographyToken(16, 24, 500, 0.15),
    small: createTypographyToken(14, 20, 500, 0.1)
  },
  body: {
    large: createTypographyToken(16, 24, 400, 0.5, 'Satoshi'),
    medium: createTypographyToken(14, 20, 400, 0.25, 'Satoshi'),
    small: createTypographyToken(12, 16, 400, 0.4, 'Satoshi')
  },
  label: {
    large: createTypographyToken(14, 20, 500, 0.1, 'Satoshi'),
    medium: createTypographyToken(12, 16, 500, 0.5, 'Satoshi'),
    small: createTypographyToken(11, 16, 500, 0.5, 'Satoshi')
  }
};

// Also remove `typography` object if it existed from earlier, to avoid duplication
if (designTokens.typography) {
  delete designTokens.typography;
}

fs.writeFileSync(designTokensPath, JSON.stringify(designTokens, null, 2), 'utf8');
console.log('Fixed design-tokens.json -> Updated to Material Design 3 Typography System.');
