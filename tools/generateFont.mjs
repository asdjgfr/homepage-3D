import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Fontmin from "fontmin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "../");
console.log(rootDir);
// const fontmin = new Fontmin().src("fonts/*.ttf").dest("build/fonts");
//
// fontmin.run(function (err, files) {
//   if (err) {
//     throw err;
//   }
//
//   console.log(files[0]);
//   // => { contents: <Buffer 00 01 00 ...> }
// });
