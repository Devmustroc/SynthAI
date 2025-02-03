const sharp = require('sharp');
const path = require('path');

const sizes = [16, 48, 128];

async function generateIcons() {
  const inputFile = path.join(__dirname, '../public/icons/icon.svg');
  
  for (const size of sizes) {
    await sharp(inputFile)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../public/icons/icon${size}.png`));
  }
}

generateIcons().catch(console.error);
