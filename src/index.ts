import JSzip from "jszip";
import { Hwpx } from "./hwpx/hwpx";
import { Hwp } from "./hwp/hwp";
var zip = new JSzip();
(async () => {
  const hwp = new Hwp(`./hwp/text-2.hwp`);
  // return false;
  const hwpx = new Hwpx();
  hwpx.filepath = "./hwpx/text-2.hwpx";
  // console.log('hwpx', hwpx);
  // console.log('hwpx', hwpx.hwpx);
  // console.log("test");
  // console.log('table', table);
  // console.log('array', await table.arrayBuffer());
  // console.log('header', await hwpx.header);
  console.log('section', await hwpx.section);
  // console.log('content', await (await hwpx.content).package);
  // console.log('metaInf', await hwpx.metaInf);
  // console.log('preview', await hwpx.preview);
  // console.log('content', await hwpx.content);
  // console.log('scripts', await hwpx.scripts);
  // console.log('version', await hwpx.version);
  return false;
  const table = await fetch("./hwpx/table.hwpx");
  const arraybuffer = await table.arrayBuffer();
  // console.log('hwpx2', await hwpx.header);
  JSzip.loadAsync(arraybuffer).then(function (zip) {
    // console.log('files', zip);
    Object.keys(zip.files).forEach(async function (filename) {
      const { name } = zip.files[filename];
      // const files = (content as any)._data.compressedContent
      // const uint_8 = new Uint8Array((content as any)._data.compressedContent);
      // const Decoder = new TextDecoder("utf8");
      // console.log(content.unsafeOriginalName , Decoder.decode(uint_8));
      if(["mimetype", "version.xml"].includes(name)) {
        const file = await zip.files[filename].async("string")
      } else if(name.match(/Contents/gi)) {
        // const file = await zip.files[filename].async("string")
        // console.log('file', file);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(await zip.files[filename].async("string"),"application/xml");
        console.log('name', name, xmlDoc);
        // const t = xmlDoc.getElementsByTagName("hh:beginNum");
        // console.log('t' ,t);
      } else if(name.match(/BinData/gi)) {
        const image = new Image();
        image.src = URL.createObjectURL(new Blob([new Uint8Array(await zip.files[filename].async("uint8array"))], { type: `image/png` }));
        document.body.appendChild(image);
        return image;
        // return new Blob([new Uint8Array(uint_8)], { type: `image/${type}` })
      } else if(name.match(/Preview\/.+?/gi)) {
        // const uint_8 = await zip.files[filename].async("string");
        // console.log('test', name,  uint_8);
        // return new Blob([new Uint8Array(uint_8)], { type: `image/${type}` })
        // const uint_8 = new Uint8Array(test);
        const Decoder = new TextDecoder("utf8");
        // console.log(Decoder.decode(uint_8));
        // return Decoder.decode(uint_8);
      } else if(name.match(/META-INF/gi)) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(await zip.files[filename].async("string"),"application/xml");
        // console.log(name ,xmlDoc);
      }
      // console.log(name);
      // console.log('file', file);
      // return Decoder.decode(uint_8);
      // var uint8array = new TextEncoder().encode("¢");
      // var string = new TextDecoder().decode(uint8array);
    });
  });
})();

// hwpjs.prototype.textDecoder = function(uint_8, type = 'utf8') {
//   uint_8 = new Uint8Array(uint_8);
//   const Decoder = new TextDecoder(type);
//   return Decoder.decode(uint_8);
// }
