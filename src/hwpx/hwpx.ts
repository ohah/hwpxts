import JSZip from "jszip";
import { Url } from "url";
import { X2jOptions, XMLParser } from "fast-xml-parser"
import { Content, Header } from "../type";
import { String2Number } from "./util";
import SVGDocument from "../svg/SVGDocument";
import { HwpDocument } from "../util/HwpDocument";
// import HwpDocument from "../HWPDocument";
const options: Partial<X2jOptions> = {
  ignoreAttributes: false,
  removeNSPrefix: true,
  attributeNamePrefix: "",
  allowBooleanAttributes: false,
  attributesGroupName : false,
  textNodeName : "text",
  numberParseOptions : {
    leadingZeros : false,
    hex : false,
  },
  parseAttributeValue : false,
};
export class Hwpx extends JSZip {
  #filepath: string;
  private zip: JSZip;
  constructor(filepath:string) {
    super();
    this.#filepath = filepath;
    this.Init();
  }

   /**
   * @Function 파일을 불러 온 후 zip에 압축 푼 xml 파일.
   */
  async Init(): Promise<void> {
    if(!this.zip) {
      const file = await fetch(this.#filepath);
      const arraybuffer = await file.arrayBuffer();
      this.zip = await JSZip.loadAsync(arraybuffer);
      HwpDocument.hwpx = this;
    }
  }

  /**
   * 바이너리 데이터 가져옴
   */
  get binData() {
    const binDatas = [];
    return (async () => {
      await this.Init();
      try {
        const name = Object.keys(this.zip.files).filter(file => file.match(/BinData/))
        console.log(this.zip.files , name);
        await Promise.all(
          Object.keys(this.zip.files).map(async (file) => {
            if (name.includes(file)) {
              const uint8Array = await this.zip.files[`${file}`].async("uint8array");
              const base64 = await this.zip.files[`${file}`].async("base64");
              const ext = file.split('.').pop();
              const URL = window.URL.createObjectURL(
                new Blob([uint8Array], { type: `image/${ext}`})
              );
              const filename = file.split('/').pop().split('.').shift();
              binDatas.push({ name :filename, file: this.zip.files[`${file}`], src: URL, ext:ext, base64:`data:image/${ext};base64,${base64}` });
            } else {
              // return null;
            }
          })
        )
        return binDatas;
      } catch (e) {
        return binDatas;
        console.log('e', e)
      }
    })();
  }

  /**
   * header 데이터 가져옴
   * @returns XMLDocument
   */
  get header(): Promise<Header> | Promise<undefined> {
    return (async () => {
      await this.Init();
      // console.log(this.zip.files);
      try {
        if (this.zip.files["Contents/header.xml"]) {
          const json = String2Number(new XMLParser(options).parse(await this.zip.files["Contents/header.xml"].async("string")))
          // document.body.innerHTML = JSON.stringify(test, null, 2); // stringify with tabs inserted at each level
          // console.log(json);
          // document.body.style.whiteSpace = "pre-wrap";
          // Object.entries(json).map(row=>{
            // console.log('row', row)
          // })
          // console.log(json);
          // console.log('test', JSON.stringify(json, null, 2));
          return json;
        }
        // console.log(await this.arraybuffer());
      } catch (e) {
        return undefined;
        console.log("header error", e);
      }
    })();
  }

  /**
   * content 데이터 가져옴
   * @returns XMLDocument
   */
  get content(): Promise<Content> | Promise<undefined> {
    return (async () => {
      await this.Init();
      try {
        if (this.zip.files["Contents/content.hpf"]) {
          const json = new XMLParser(options).parse(await this.zip.files["Contents/content.hpf"].async("string"))
          return json;
        }
        // console.log(await this.arraybuffer());
      } catch (e) {
        console.log("error", e);
        return undefined;
      }
    })();
  }
  
  /**
   * section 데이터 가져옴
   * @returns XMLDocument
   */
  get section(): Promise<any[]> {
    const sections: Array<Document> = [];
    return (async () => {
      await this.Init();
      try {
        const name = Object.keys(this.zip.files).filter(file => file.match(/Contents\/section[0-9]{1,1000}/))
        await Promise.all(
          Object.keys(this.zip.files).map(async (file) => {
            if (name.includes(file)) {
              const json = String2Number(new XMLParser(options).parse(await this.zip.files[`${file}`].async("string")))
              sections.push(json);
              // return json;
            } else {
              // return null;
            }
          })
        )
        return sections;
      } catch (e) {
        console.log('e', e)
      }
    })();
  }

  /**
   * META-INF 데이터 가져옴
   * @returns Array<XMLDocument>
   */
  get metaInf(): [Document] | any {
    const metas: Array<Document> = [];
    return (async () => {
      await this.Init();
      try {
        const name = Object.keys(this.zip.files).filter(file => file.match(/META-INF/))
        await Promise.all(
          Object.keys(this.zip.files).map(async (file) => {
            if (name.includes(file)) {
              const json = String2Number(new XMLParser(options).parse(await this.zip.files[`${file}`].async("string")))
              metas.push(json);
              // return xmlDoc;
            } else {
              // return null;
            }
          })
        )
        // metas.forEach(element => {
        // element.set
        // });
        return metas;
      } catch (e) {
        console.log('e', e)
      }
    })();
  }

  /**
   * version 데이터 가져옴
   * @returns XMLDocument
   */
  get version(): Document | any {
    return (async () => {
      await this.Init();
      try {
        if (this.zip.files["version.xml"]) {
          const json = String2Number(new XMLParser(options).parse(await this.zip.files["version.xml"].async("string")))
          // console.log('version', JSON.stringify(json));
          return json;
        }
        // console.log(await this.arraybuffer());
      } catch (e) {
        console.log("error", e);
      }
    })();
  }

  /**
   * settings 데이터 가져옴
   * @returns XMLDocument
   */
  get settings(): Document | any {
    return (async () => {
      await this.Init();
      try {
        if (this.zip.files["settings.xml"]) {
          const json = String2Number(new XMLParser(options).parse(await this.zip.files["settings.xml"].async("string")))
          return json;
        }
        // console.log(await this.arraybuffer());
      } catch (e) {
        console.log("error", e);
      }
    })();
  }


  /**
   * mimetype 데이터 가져옴
   * @returns XMLDocument
   */
  get mimetype(): Document | any {
    return (async () => {
      await this.Init();
      try {
        if (this.zip.files["mimetype"]) {
          const json = String2Number(new XMLParser(options).parse(await this.zip.files["mimetype"].async("string")))
          return json;
        }
        // console.log(await this.arraybuffer());
      } catch (e) {
        console.log("error", e);
      }
    })();
  }

  /**
   * 미리보기 1 페이지 
   * @returns { image : URL, text : string}
   */
  get preview(): { image: Url, text: string } | any {
    return (async () => {
      await this.Init();
      const result = {
        image : null,
        text : null,
      }
      try {
        if (this.zip.files["Preview/PrvImage.png"]) {
          result.image = URL.createObjectURL(new Blob([new Uint8Array(await this.zip.files["Preview/PrvImage.png"].async("uint8array"))], { type: `image/png` }));
          // const image = new Image();
          // image.src = result.image;
          // document.body.appendChild(image);
        }
        if (this.zip.files["Preview/PrvText.txt"]) {
          const uint_8 = new Uint8Array(await this.zip.files["Preview/PrvText.txt"].async("uint8array"));
          const Decoder = new TextDecoder("utf8");
          result.text = Decoder.decode(uint_8)
          // console.log(Decoder.decode(uint_8));
        }
        return result;
        // console.log(await this.arraybuffer());
      } catch (e) {
        console.log("error", e);
      }
    })();
  }

  /**
   * 스크립트 
   * @type { Uint8Array }
   * @returns { header : URL, header : string} 
   */
  get scripts(): { header: string, source: string } | any {
    return (async () => {
      await this.Init();
      const result = {
        header : null,
        source : null,
      }
      try {
        if (this.zip.files["Scripts/headerScripts.js"]) {
          const uint_8 = new Uint8Array(await this.zip.files["Scripts/headerScripts.js"].async("uint8array"));
          const Decoder = new TextDecoder("utf-16le");
          result.header = Decoder.decode(uint_8);
          // result.header = await this.zip.files["Scripts/headerScripts.js"].async("uint8array");
        }
        if (this.zip.files["Scripts/sourceScripts.js"]) {
          const uint_8 = new Uint8Array(await this.zip.files["Scripts/sourceScripts.js"].async("uint8array"));
          const Decoder = new TextDecoder("utf-16le");
          result.header = Decoder.decode(uint_8);
        }
        return result;
      } catch (e) {
        console.log("error", e);
      }
    })();
  }

  /**
   * 그리기
   * @type { Hwpx }
   */
  async draw() {
    await this.Init();
    const svg = new SVGDocument();
    svg.run();
  }
}


export default Hwpx;