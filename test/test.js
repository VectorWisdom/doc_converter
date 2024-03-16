import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import process from 'process';

// Check if a filename argument was provided
if (process.argv.length < 3) {
  console.error('Usage: node test.js <filename>');
  process.exit(1);
}

const filename = process.argv[2];
const url = 'http://localhost:5000/convert';

const form = new FormData();
form.append('document', fs.createReadStream(filename));

const config = {
  headers: {
    ...form.getHeaders(),
  },
  responseType: 'blob', // This ensures we can handle the binary data of the SVG
};

axios.post(url, form, config)
  .then(response => {
    // Extract file extension and create output filename
    const outputFilename = filename.replace(/\.[^/.]+$/, '') + '.svg';

    // Save the SVG file
    fs.writeFileSync(outputFilename, response.data);
    console.log(`Saved converted file as ${outputFilename}`);
  })
  .catch(error => {
    console.error('Error during file conversion:', error.message);
  });
