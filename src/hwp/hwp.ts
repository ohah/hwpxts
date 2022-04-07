import pako from "pako";
import CFB from "cfb";
import { HWPTAG } from "./type";
import { Fontface, Header } from "../type";
import { buf2hex, HwpHeader, readRecord } from "./util";
import { Cursor } from "./cursor";
export class Hwp {
  #cfb: CFB.CFB$Entry[];
  #hwpx: {
    header: Header;
  };
  #hwp:any;
  constructor(filepath: string) {
    this.#hwpx = {
      header: {
        xml: { version: "1.0", encoding: "UTF-8", standalone: "yes" },
        head: {
          beginNum: {
            page: 1,
            footnote: 1,
            endnote: 1,
            pic: 1,
            tbl: 1,
            equation: 1,
          },
          refList: {
            borderFills: {
              borderFill: [],
              itemCnt: 0,
            },
            charProperties: {
              charPR: [],
              itemCnt: 0,
            },
            fontfaces: {
              fontface: [],
              itemCnt: 0,
            },
            numberings: {
              numbering: {
                paraHead: [],
                id: 1,
                start: 0,
              },
              itemCnt: 0,
            },
            paraProperties: {
              paraPR: [],
              itemCnt: 0,
            },
            styles: {
              style: [],
              itemCnt: 0,
            },
            tabProperties: {
              tabPR: [],
              itemCnt: 0,
            },
          },
          trackchageConfig: {
            flags: 0,
          },
          secCnt: 1,
          version: 1.31,
          forbiddenWordList: {
            forbiddenWord: [],
            itemCnt: 0,
          },
          compatibleDocument: {
            layoutCompatibility: "",
            targetProgram: "",
          },
          docOption: {
            linkinfo: {
              footnoteInherit: 0,
              pageInherit: 0,
              path: "",
            },
          },
        },
      },
    };
    (async () => {
      const file = await fetch(filepath);
      const arraybuffer = await file.arrayBuffer();
      const cfb = CFB.read(new Uint8Array(arraybuffer), {
        type: "buffer",
      }).FileIndex.map((entry) => {
        try {
          const uint8 = new Uint8Array(entry.content);
          entry.content = pako.inflate(uint8, { windowBits: -15 });
        } catch (e) {
          const uint8 = new Uint8Array(entry.content);
          entry.content = uint8;
          // console.log("압축풀이가 안되는", entry.name);
        }
        return entry;
      });
      this.#cfb = cfb;
      console.log(this.#cfb);
      console.log('hwpversion', this.version);
      const DocOptions = this.#cfb.find((entry) => entry.name === "DocOptions");
      console.log(DocOptions);
    })();
  }
  
  get version() {
    const { content } = this.#cfb.find((entry) => entry.name === "FileHeader");
    return HwpHeader(content).version;
    // return this.#hwp.fileHeader.version;
  }

  get header() {
    return this.#hwp.fileHeader;
  }

  get docInfo() {
    const { content } = this.#cfb.find((entry) => entry.name === "DocInfo");
    const c = new Cursor(0);
    // console.log('tq')
    const test = [];
    let data;
    while (c.pos < content.length) {
      const { tag_id, level, size, move } = readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
      // c.move(move);
      var start = c.pos;
      // console.log('tag_id' , tag_id, c.pos, tag_id == HWPTAG.FACE_NAME)
      // c.move(size);
      switch (tag_id) {
        case HWPTAG.DOCUMENT_PROPERTIES:
          data = {
            name: "HWPTAG_DOCUMENT_PROPERTIES",
            tag_id: tag_id,
            level: level,
            size: size,
            hex: buf2hex(content.slice(c.pos, c.pos + size)),
            area_count: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
            //문서 내 각종 시작번호에 대한 정보
            page: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
            footnote: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
            endnote: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
            pic: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
            tbl: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
            equation: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
            //문서 내 캐럿의 위치 정보
            list_id: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getUint32(0, true),
            section_id: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getUint32(0, true),
            paragraph_location: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
          };
          // result.push(data);
          console.log("HWPTAG_DOCUMENT_PROPERTIES", data);
          this.#hwpx.header.head.beginNum.page = data.page;
          this.#hwpx.header.head.beginNum.footnote = data.footnote;
          this.#hwpx.header.head.beginNum.endnote = data.endnote;
          this.#hwpx.header.head.beginNum.pic = data.pic;
          this.#hwpx.header.head.beginNum.tbl = data.tbl;
          this.#hwpx.header.head.beginNum.equation = data.equation;
          var end = c.pos;
          c.move(size - (end - start));
          break;
        case HWPTAG.ID_MAPPINGS:
          content.slice(c.pos, c.pos + size);
          data = {
            name: "HWPTAG_ID_MAPPINGS",
            tag_id: tag_id,
            level: level,
            size: size,
            hex: buf2hex(content.slice(c.pos, c.pos + size)),
            binary_data: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getInt32(0, true), // 바이너리 데이터
            font_ko: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 한글 글꼴
            font_en: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 영어 글꼴
            font_cn: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 한자 글꼴
            font_jp: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 일어 글꼴
            font_other: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 기타 글꼴
            font_symbol: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getInt32(0, true), // 기호 글꼴
            font_user: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), //사용자 글꼴
            shape_border: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), //테두리 배경
            shape_font: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getInt32(0, true), //글자 모양
            tab_def: new DataView( new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), //탭 정의
            paragraph_number: new DataView( new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), //문단 번호
            bullet_table: new DataView( new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), // 글머리표
            shape_paragraph: new DataView( new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), //문단 모양
            style: new DataView( new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), //스타일
          };
          // this.header.head.
          // console.log('??', data)
          var end = c.pos;
          c.move(size - (end - start));
          // this.header.head.
          break;
        case HWPTAG.FACE_NAME:
          data = {
            font: {
              type: new DataView( new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0) === 1 ? "HTF" : "TTF",
            },
          };
          const length = new DataView( new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0);
          // this.header.head.refList.fontfaces.fontface.push()
          this.#hwpx.header.head.refList.fontfaces.itemCnt += 1;
          test.push(data);
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.TRACKCHANGE:
          data = {
            name: "HWPTAG_TRACKCHANGE",
            tag_id: tag_id,
            level: level,
            size: size,
            hex: buf2hex(content.slice(c.pos, c.pos + size)),
          };
          console.log("size", size);
          c.move(size);
          // result.push(data);
          break;
        case HWPTAG.TRACK_CHANGE_AUTHOR:
          data = {
            name: "HWPTAG_TRACK_CHANGE_AUTHOR",
            tag_id: tag_id,
            level: level,
            size: size,
            hex: buf2hex(content.slice(c.pos, c.pos + size)),
          };
          console.log("TRACK_CHANGE_AUTHOR", size);
          c.move(size);
          // result.push(data);
          break;
        default:
          var t = Object.keys(HWPTAG).filter((key) => !isNaN(Number(HWPTAG[key])));
          var v = Object.values(HWPTAG).filter((key) => isNaN(Number(HWPTAG[key])));
          const Idx = v.findIndex((v) => v === tag_id);
          console.log("모르는것들", t[Idx]);
          var end = c.pos;
          c.move(size - (end - start));
          break;
      }
    }
    console.log("test", test);
    // return this.hwp.find((entry)=>entry.name === "DocInfo").content;
    return "tq";
  }
}

export default Hwp;
