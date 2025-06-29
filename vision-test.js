const vision = require('@google-cloud/vision');
const fs = require('fs');

// Save your service account JSON as 'key.json' in the same folder as this script
const client = new vision.ImageAnnotatorClient({
  keyFilename: './key.json'
});

async function quickTest() {
  // Replace with your image path
  const fileName = './your-screenshot.png';
  const [result] = await client.documentTextDetection(fileName);
  if (result.fullTextAnnotation) {
    console.log('Extracted Text:\n');
    console.log(result.fullTextAnnotation.text);
    fs.writeFileSync('vision-output.json', JSON.stringify(result.fullTextAnnotation, null, 2));
    console.log('\nFull annotation saved to vision-output.json');
  } else {
    console.log('No text found.');
  }
}

quickTest(); 