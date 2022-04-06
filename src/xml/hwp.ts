import pako from "pako";
import CFB from "cfb";
import { HWPTAG } from "../hwp/type";
import { Header } from "../type";

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
          console.log("압축풀이가 안되는", entry.name);
        }
        return entry
      });
      // console.log("hwp", hwp);
      this.#hwp = hwp;
      console.log('this', this.#hwp)
      console.log(this.docInfo);
    })();
  }

  get docInfo() {
    const { content } = this.#hwp.find((entry)=>entry.name === "DocInfo");
    const c = new Cursor(0);
    while(c.pos < content.length) {
      const { tag_id, level, size, move } = this.readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
      // c.move(move);
      c.move(size);
      switch (tag_id) {
        case HWPTAG.DOCUMENT_PROPERTIES:
          console.log('??')
          break;
        case HWPTAG.ID_MAPPINGS:
          console.log('??')
          // this.header.head.
          break;
        case HWPTAG.FACE_NAME:

          break;
        default:
          break;
      }
    }
    console.log(content);
    // return this.hwp.find((entry)=>entry.name === "DocInfo").content;
    return "tq";
  }

  
  readRecord = function(data:Uint8Array) {
    const value = new DataView(data.slice(0,4).buffer, 0).getUint32(0, true);
    const tagID = value & 0x3FF;
    const level = (value >> 10) & 0x3FF;
    const size = (value >> 20) & 0xFFF;
    if (size === 0xFFF) {
      return {
        tag_id : tagID,
        level : level, 
        size : new DataView(data.slice(4,8)).getUint32(0, true),
        move : 4,
      }
    }
    return {tag_id : tagID, level : level, size : size, move : 0}
  }
}

export default Hwp;
