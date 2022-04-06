import JSZip from "jszip";
import { Url } from "url";
import { X2jOptions, XMLParser } from "fast-xml-parser"
import { Content, Header } from "../type";
const options: Partial<X2jOptions> = {
  ignoreAttributes: false,
  removeNSPrefix: true,
  attributeNamePrefix: "",
  allowBooleanAttributes: true,
  numberParseOptions : {
    leadingZeros : true,
    hex : true,
  },
};
export class Hwpx extends JSZip {
  #filepath: string;
  private zip: JSZip;
  constructor() {
    super();
    if (this.#filepath !== undefined) {
      this.Init();
    }
  }

  /**
   * @param filepath 경로 설정 후 Init 함수 실행.
   */
  set filepath(name: string) {
    this.#filepath = name;
  }

  /**
   * @Function 파일을 불러 온 후 zip에 압축 푼 xml 파일.
   */
  async Init(): Promise<void> {
    const file = await fetch(this.#filepath);
    const arraybuffer = await file.arrayBuffer();
    this.zip = await this.loadAsync(arraybuffer);
  }

  /**
   * 바이너리 데이터 가져옴
   */
  get binData():any {
    const binDatas = [];
    return (async () => {
      await this.Init();
      try {
        const name = Object.keys(this.zip.files).filter(file => file.match(/BinData/))
        await Promise.all(
          Object.keys(this.zip.files).map(async (file) => {
            if (name.includes(file)) {
              binDatas.push(file)
            } else {
              // return null;
            }
          })
        )
        return binDatas;
      } catch (e) {
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
          const json = new XMLParser(options).parse(await this.zip.files["Contents/header.xml"].async("string"))
          Object.entries(json).map(row=>{
            console.log('row', row)
          })
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
  get section(): [Document] | any {
    const sections: Array<Document> = [];
    return (async () => {
      await this.Init();
      try {
        const name = Object.keys(this.zip.files).filter(file => file.match(/Contents\/section[0-9]{1,1000}/))
        await Promise.all(
          Object.keys(this.zip.files).map(async (file) => {
            if (name.includes(file)) {
              const json = new XMLParser(options).parse(await this.zip.files[`${file}`].async("string"));
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
              const json = new XMLParser(options).parse(await this.zip.files[`${file}`].async("string"))
              metas.push(json);
              // return xmlDoc;
            } else {
              // return null;
            }
          })
        )
        metas.forEach(element => {
          // element.set
        });
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
          const json = new XMLParser(options).parse(await this.zip.files["version.xml"].async("string"))
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
          const json = new XMLParser(options).parse(await this.zip.files["settings.xml"].async("string"))
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
        if (this.zip.files["mimetype.xml"]) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(await this.zip.files["Contents/header.xml"].async("string"), "application/xml");
          // console.log('name', name, xmlDoc);
          return xmlDoc;
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
}


export default Hwpx;