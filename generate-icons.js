#!/usr/bin/env node
// Executa: node generate-icons.js
// Genera les icones SVG per a la PWA (192x192 i 512x512)
// Les icones es guarden a /public/icons/

const fs = require("fs");
const path = require("path");

const iconSVG = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <!-- Fons blau Erasmus -->
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#003DA5"/>
  
  <!-- Cercle blanc central -->
  <circle cx="${size/2}" cy="${size * 0.42}" r="${size * 0.28}" fill="white" opacity="0.15"/>
  
  <!-- Text E+ -->
  <text 
    x="${size/2}" 
    y="${size * 0.52}" 
    font-family="Georgia, serif" 
    font-size="${size * 0.32}" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >E+</text>
  
  <!-- Text petit a baix -->
  <text 
    x="${size/2}" 
    y="${size * 0.82}" 
    font-family="Arial, sans-serif" 
    font-size="${size * 0.09}" 
    font-weight="600"
    fill="rgba(255,255,255,0.8)" 
    text-anchor="middle"
  >MOBILITAT SF</text>
</svg>`;

const iconsDir = path.join(__dirname, "public", "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Genera SVGs (es poden convertir a PNG amb sharp o squoosh.app)
fs.writeFileSync(path.join(iconsDir, "icon-192.svg"), iconSVG(192));
fs.writeFileSync(path.join(iconsDir, "icon-512.svg"), iconSVG(512));

console.log("✅ Icones SVG generades a /public/icons/");
console.log("📌 Per convertir a PNG: puja els SVG a https://squoosh.app o fes servir:");
console.log("   npm install sharp");
console.log("   node convert-to-png.js");
