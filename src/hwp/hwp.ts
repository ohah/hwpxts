import pako from "pako";
import CFB from "cfb";
import { HWPTAG } from "./type";
import { Header } from "../type";
import { readRecord } from "./function";

export class Cursor {
  public pos:number = 0;
  constructor(start:number) {
    this.pos = start;
  }
  /**
   * @param cnt 만큼 이동
   */
  move(cnt:number):number {
    return this.pos += cnt;
  }

  /**
   * @param cnt 값으로 이동
   */
  set(cnt:number) {
    return this.pos = cnt;
  }
}

export class Hwp {
  #hwp:CFB.CFB$Entry[];
  public header:Header;
  constructor(filepath: string) {
    this.header = {
      xml : {version : '1.0', encoding : "UTF-8", standalone : 'yes'},
      head : {
        beginNum : {
          page : '1', footnote : '1', endnote : '1', pic : '1', tbl : '1', equation : "1",
        },
        refList : {
          borderFills : {
            borderFill: [],
            itemCnt : "0",
          },
          charProperties : {
            charPR : [],
            itemCnt : "0",
          },
          fontfaces : {
            fontface : [],
            itemCnt : "0",
          },
          numberings : {
            numbering : {
              paraHead : [],
              id : "1",
              start : "0",
            },
            itemCnt : "0",
          },
          paraProperties : {
            paraPR : [],
            itemCnt : "0"
          },
          styles : {
            style : [],
            itemCnt : "0",
          },
          tabProperties : {
            tabPR : [],
            itemCnt : "0",
          },
        },
        trackchageConfig : {
          flags : "0",
        },
        secCnt : "1",
        version : "1.31",
        forbiddenWordList: {
          forbiddenWord : [],
          itemCnt : "0",
        },
        compatibleDocument: {
          layoutCompatibility : "",
          targetProgram : "",
        },
        docOption: {
          linkinfo : {
            footnoteInherit : "0",
            pageInherit : "0",
            path : "",
          }
        },
      },
    };
    (async () => {
      const file = await fetch(filepath);
      const arraybuffer = await file.arrayBuffer();
      const hwp = CFB.read(new Uint8Array(arraybuffer), { type: "buffer",}).FileIndex.map((entry) => {
        try {
          const uint8 = new Uint8Array(entry.content);
          entry.content = pako.inflate(uint8, { windowBits: -15 });
        } catch (e) {
          const uint8 = new Uint8Array(entry.content);
          entry.content = uint8;
          // console.log("압축풀이가 안되는", entry.name);
        }
        return entry
      });
      // console.log("hwp", hwp);
      this.#hwp = hwp;
      // console.log('this', this.#hwp)
      console.log(this.docInfo);
    })();
  }

  get docInfo() {
    const { content } = this.#hwp.find((entry)=>entry.name === "DocInfo");
    const c = new Cursor(0);
    const test = [];
    while(c.pos < content.length) {
      const { tag_id, level, size, move } = readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
      // c.move(move);
      var start = c.pos;
      // console.log('tag_id' , tag_id, c.pos, tag_id == HWPTAG.FACE_NAME)
      // c.move(size);
      switch (tag_id) {
        case HWPTAG.DOCUMENT_PROPERTIES:
          // console.log('??')
          var end = c.pos;
          c.move(size - (end - start));
          break;
        case HWPTAG.ID_MAPPINGS:
          // console.log('??')
          var end = c.pos;
          c.move(size - (end - start));
          // this.header.head.
          break;
        case HWPTAG.FACE_NAME:
          var data = {
            font : {
              type : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0) === 1 ? "HTF" : "TTF",
            }
          }
          test.push(data);
          var end = c.pos;
          console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        default:
          var end = c.pos;
          c.move(size - (end - start));
          break;
      }
    }
    console.log('test', test);
    // return this.hwp.find((entry)=>entry.name === "DocInfo").content;
    return "tq";
  }

  slice = () => {

  }
  
}

export default Hwp;
