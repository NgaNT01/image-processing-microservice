import fs from "fs";
import Jimp from "jimp";
import path from 'path';
import { fileURLToPath } from 'url';
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(inputURL, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const photo = await Jimp.read(buffer);
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            const outDir = path.join(__dirname, '/tmp');
            const outPath = path.join(outDir, `filtered.${Math.floor(Math.random() * 2000)}.jpg`);
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(outPath, (img) => {
                    resolve(outPath);
                });
        } catch (error) {
            reject(error);
        }
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}
