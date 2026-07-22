const fs = require('fs');
const path = require('path');

const src = `C:\\Users\\prasa\\.gemini\\antigravity-ide\\brain\\3fb7bc10-873d-4880-9550-8c4d6b9d0642\\hero_bedding_luxury_1784697878177.png`;
const dest = `i:\\closerush_new\\public\\hero_bedding.png`;

fs.copyFileSync(src, dest);
console.log("Successfully copied luxury hero image to public/hero_bedding.png");
