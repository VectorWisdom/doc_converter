import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' });
const execAsync = promisify(exec);

app.post('/convert', upload.single('document'), async (req, res) => {
    console.log(req.file)
    console.log(req.body)
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const inputPath = req.file.path;
  console.log(`existsSync inputPath : ${fs.existsSync(inputPath)}`)
  const outputPath = path.join('converted', `${req.file.filename}.png`);

  try {
    // Command to convert DOCX/PPTX to SVG using LibreOffice
    const { stdout, stderr } = await execAsync(`libreoffice --headless --convert-to png ${inputPath} --outdir converted`);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    console.log(`existsSync outputPath : ${fs.existsSync(outputPath)}`)
    if (fs.existsSync(outputPath)) {
      res.sendFile(path.resolve(outputPath), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error sending file.');
        }
        // Optionally delete the files after sending
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    } else {
      res.status(500).send('Conversion failed.');
    }
  } catch (error) {
    console.error('Conversion command failed:',error);
    res.status(500).send('Internal server error.');
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
