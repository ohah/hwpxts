import pako from "pako";
import CFB from "cfb";
import { Char, CTRL_ID, HWPTAG } from "./type";
import { Fontface, Header } from "../type";
import { buf2hex, HwpHeader, HwpReader, readRecord } from "./util";
import { Cursor } from "./cursor";
import { Section } from "../hwpx/type/section";
import { BIN_DATA, BORDER_FILL, BULLET, CHAR_SHAPE, COMPATIBLE_DOCUMENT, DOCUMENT_PROPERTIES, DOC_DATA, FACE_NAME, FORBIDDEN_CHAR, ID_MAPPINGS, LAYOUT_COMPATIBILITY, MEMO_SHAPE, NUMBERING, PARA_SHAPE, STYLE, TAB_DEF, TRACKCHANGE, TRACK_CHANGE, TRACK_CHANGE_AUTHOR } from "./util/DocInfo";
import { BORDER_FILLS, CHAR_SHAPES, FONT_FACES, STYLES, TAB_DEFS } from "./util/SetID"
import { CTRL_HEADER, FOOTNOTE_SHAPE, LINE_SEG, PAGE_BORDER_FILL, PAGE_DEF, PARA_CHAR_SHAPE, PARA_HEADER, PARA_TEXT, TABLE } from "./util/BodyText";
import { SECTION } from "./util/Section";
export class Hwp {
  #cfb: CFB.CFB$Entry[];
  #hwpx: {
    header: Header;
    section:Section[]
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
              charPr: [],
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
              paraPr: [],
              itemCnt: 0,
            },
            styles: {
              style: [],
              itemCnt: 0,
            },
            tabProperties: {
              tabPr: [],
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
      section : [],
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
          // console.log("??????????????? ?????????", entry.name);
        }
        return entry;
      });
      this.#cfb = cfb;
      console.log(this.#cfb);
      this.#hwp = HwpReader(this.#cfb);
      // console.log('reader', this.#hwp);
      // console.log('hwpversion', this.version);
      // console.log('docinfo', this.docInfo);
      // console.log('section', this.section);
      console.log('json', this.json);
      // this.section
    })();
  }
  
  get version() {
    const { content } = this.#hwp.FileHeader;
    return HwpHeader(content).version;
    // return this.#hwp.fileHeader.version;
  }

  get header() {
    return this.#hwp.fileHeader;
  }

  get docInfo() {
    const { content } = this.#hwp.DocInfo;
    const c = new Cursor(0);
    // console.log('tq')
    const result = [];
    let data;
    while (c.pos < content.length) {
      const { tag_id, level, size, move } = readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
      // c.move(move);
      var start = c.pos;
      // console.log('tag_id' , tag_id, c.pos, tag_id == HWPTAG.FACE_NAME)
      // c.move(size);
      switch (tag_id) {
        case HWPTAG.DOCUMENT_PROPERTIES:
          result.push({name : "DOCUMENT_PROPERTIES", tag_id : tag_id, size : size, content : DOCUMENT_PROPERTIES(content.slice(c.pos, c.move(size)))});
          // result.push(data);
          // console.log("HWPTAG_DOCUMENT_PROPERTIES", data);
          // this.#hwpx.header.head.beginNum.page = data.page;
          // this.#hwpx.header.head.beginNum.footnote = data.footnote;
          // this.#hwpx.header.head.beginNum.endnote = data.endnote;
          // this.#hwpx.header.head.beginNum.pic = data.pic;
          // this.#hwpx.header.head.beginNum.tbl = data.tbl;
          // this.#hwpx.header.head.beginNum.equation = data.equation;
          var end = c.pos;
          c.move(size - (end - start));
          break;
          case HWPTAG.ID_MAPPINGS:
          result.push({name : "ID_MAPPINGS", tag_id : tag_id, size : size, content : ID_MAPPINGS(content.slice(c.pos, c.move(size)), this.version)});
          // this.header.head.
          var end = c.pos;
          c.move(size - (end - start));
          // this.header.head.
          break;
        case HWPTAG.BIN_DATA:
          result.push({name : "BIN_DATA", tag_id : tag_id, size : size, content : BIN_DATA(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.FACE_NAME:
          result.push({name : "FACE_NAME", tag_id : tag_id, size : size, content : FACE_NAME(content.slice(c.pos, c.move(size)))});
          // this.#hwpx.header.head.refList.fontfaces.itemCnt += 1;
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.BORDER_FILL:
          result.push({name : "BORDER_FILL", tag_id : tag_id, size : size, content : BORDER_FILL(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.CHAR_SHAPE:
          result.push({name : "CHAR_SHAPE", tag_id : tag_id, size : size, content : CHAR_SHAPE(content.slice(c.pos, c.move(size)), this.version)});
          // result.push({name : "CHAR_SHAPE", size : size});
          var end = c.pos;
          c.move(size - (end - start));
          break;
        case HWPTAG.TAB_DEF:
          result.push({name : "TAB_DEF", tag_id : tag_id, size : size, content : TAB_DEF(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.NUMBERING:
          result.push({name : "NUMBERING", tag_id : tag_id, size : size, content : NUMBERING(content.slice(c.pos, c.move(size)), this.version)});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.BULLET:
          result.push({name : "BULLET", tag_id : tag_id, size : size, content : BULLET(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.PARA_SHAPE:
          result.push({name : "PARA_SHAPE", tag_id : tag_id, size : size, content : PARA_SHAPE(content.slice(c.pos, c.move(size)), this.version)});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.STYLE:
          result.push({name : "STYLE", tag_id : tag_id, size : size, content : STYLE(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          c.move(size - (end - start));
          break;
        case HWPTAG.MEMO_SHAPE:
          result.push({name : "MEMO_SHAPE", tag_id : tag_id, size : size, content : MEMO_SHAPE(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          c.move(size - (end - start));
          break;
        case HWPTAG.TRACK_CHANGE_AUTHOR :
          result.push({name : "TRACK_CHANGE_AUTHOR", tag_id : tag_id, size : size, content : TRACK_CHANGE_AUTHOR(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.TRACK_CHANGE :
          result.push({name : "TRACK_CHANGE", tag_id : tag_id, size : size, content : TRACK_CHANGE(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.DOC_DATA :
          result.push({name : "DOC_DATA", tag_id : tag_id, size : size, content : DOC_DATA(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.FORBIDDEN_CHAR:
          result.push({name : "FORBIDDEN_CHAR", tag_id : tag_id, size : size, content : FORBIDDEN_CHAR(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.COMPATIBLE_DOCUMENT:
          result.push({name : "COMPATIBLE_DOCUMENT", tag_id : tag_id, size : size, content : COMPATIBLE_DOCUMENT(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.LAYOUT_COMPATIBILITY:
          result.push({name : "LAYOUT_COMPATIBILITY", tag_id : tag_id, size : size, content : LAYOUT_COMPATIBILITY(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.DISTRIBUTE_DOC_DATA:
          result.push({name : "DISTRIBUTE_DOC_DATA", tag_id : tag_id, size : size, content : DISTRIBUTE_DOC_DATA(content.slice(c.pos, c.move(size)))});          
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        case HWPTAG.TRACKCHANGE:
          result.push({name : "TRACKCHANGE", tag_id : tag_id, size : size, content : TRACKCHANGE(content.slice(c.pos, c.move(size)))});
          var end = c.pos;
          // console.log('FONT_NAME',data)
          c.move(size - (end - start));
          break;
        default:
          var t = Object.keys(HWPTAG).filter((key) => !isNaN(Number(HWPTAG[key])));
          var v = Object.values(HWPTAG).filter((key) => isNaN(Number(HWPTAG[key])));
          const Idx = v.findIndex((v) => v === tag_id);
          console.log("???????????????", tag_id);
          var end = c.pos;
          c.move(size - (end - start));
          break;
      }
    }
    const fontfaces = FONT_FACES(result);
    const borderFill = BORDER_FILLS(result);
    const charPr = CHAR_SHAPES(result);
    const tabProperties = TAB_DEFS(result);
    const styles = STYLES(result);
    // console.log('styles', styles)
    // return this.hwp.find((entry)=>entry.name === "DocInfo").content;
    return result;
  }

  get section() {
    const result = [];
    const { version } = this;
    this.#hwp.Section.map((section, i)=>{
      const { content } = section;
      let data:any;
      const c = new Cursor(0);
      let ctrl_id;
      const hp = {} as any;
      const paragraph = [];
      while(c.pos < content.length) {
        const { tag_id, level, size, move } = readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
        // console.log(size);
        var start = c.pos;
        switch (tag_id) {
          case HWPTAG.CTRL_HEADER:
            result.push({tag_id : tag_id, level : level, name : "CTRL_HEADER", size : size, content : CTRL_HEADER(content.slice(c.pos, c.pos + size))});
            // const tt = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
            const ctrlId = new TextDecoder("utf8").decode(content.slice(c.pos, c.move(4)).reverse());
            // console.log("CTRL_HEADER", ctrlId);
            ctrl_id = ctrlId;
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.PARA_HEADER:
            result.push({tag_id : tag_id, level : level, name : "PARA_HEADER", size : size, content : PARA_HEADER(content.slice(c.pos, c.pos + size), version)});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.PARA_TEXT:
            result.push({tag_id : tag_id, level : level, name : "PARA_TEXT", size : size, content : PARA_TEXT(content.slice(c.pos, c.pos + size), ctrl_id)});
            // result.push({tag_id : tag_id, level : level, name : "PARA_TEXT", size : size});
            // console.log('text', PARA_TEXT(content.slice(c.pos, c.pos + size), ctrl_id))
            // const temp = new TextDecoder("utf8").decode(content);
            // console.log('temp', temp);
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.PARA_CHAR_SHAPE:
            result.push({tag_id : tag_id, level : level, name : "PARA_CHAR_SHAPE", size : size, content : PARA_CHAR_SHAPE(content.slice(c.pos, c.pos + size))});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.PARA_LINE_SEG:
            result.push({tag_id : tag_id, level : level, name : "PARA_LINE_SEG", size : size, content : LINE_SEG(content.slice(c.pos, c.pos + size))});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.PARA_RANGE_TAG:
            result.push({tag_id : tag_id, level : level, name : "PARA_RANGE_TAG", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.CTRL_HEADER:
            result.push({tag_id : tag_id, level : level, name : "CTRL_HEADER", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.LIST_HEADER:
            result.push({tag_id : tag_id, level : level, name : "LIST_HEADER", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.PAGE_DEF:
            result.push({tag_id : tag_id, level : level, name : "PAGE_DEF", size : size, content : PAGE_DEF(content.slice(c.pos, c.pos + size))});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.FOOTNOTE_SHAPE:
            result.push({tag_id : tag_id, level : level, name : "FOOTNOTE_SHAPE", size : size, content: FOOTNOTE_SHAPE(content.slice(c.pos, c.pos + size))});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.PAGE_BORDER_FILL:
            result.push({tag_id : tag_id, level : level, name : "PAGE_BORDER_FILL", size : size, content : PAGE_BORDER_FILL(content.slice(c.pos, c.pos + size))});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.TABLE:
            console.log('table', '??');
            result.push({tag_id : tag_id, level : level, name : "TABLE", size : size, content : TABLE(content.slice(c.pos, c.pos + size), version)});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_LINE:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_LINE", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_RECTANGLE:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_RECTANGLE", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_ELLIPSE:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_ELLIPSE", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_ARC:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_ARC", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_POLYGON:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_POLYGON", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_CURVE:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_CURVE", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_OLE:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_OLE", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_PICTURE:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_PICTURE", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.CTRL_DATA:
            result.push({tag_id : tag_id, level : level, name : "CTRL_DATA", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.EQEDIT:
            result.push({tag_id : tag_id, level : level, name : "EQEDIT", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_TEXTART:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_TEXTART", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.FORM_OBJECT:
            result.push({tag_id : tag_id, level : level, name : "FORM_OBJECT", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.MEMO_SHAPE:
            result.push({tag_id : tag_id, level : level, name : "MEMO_SHAPE", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.MEMO_LIST:
            result.push({tag_id : tag_id, level : level, name : "MEMO_LIST", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.CHART_DATA:
            result.push({tag_id : tag_id, level : level, name : "CHART_DATA", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.VIDEO_DATA:
            result.push({tag_id : tag_id, level : level, name : "VIDEO_DATA", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          case HWPTAG.SHAPE_COMPONENT_UNKNOWN:
            result.push({tag_id : tag_id, level : level, name : "SHAPE_COMPONENT_UNKNOWN", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
          default:
            result.push({tag_id : tag_id, level : level, name : "????????????", size : size});
            var end = c.pos;
            c.move(size - (end - start));
            break;
        }
      }
    })
    return result;
  }
  get json() {
    const result = {
      sec : {
        p : []
      }
    };
    return SECTION(this.section);
    this.section.forEach((sec) => {
      result.sec.p.push({
        columnBreak : 0,
        linesegarray: {
          lineseg : [],
        },
        run:{
          t:"Hello, World!",
          charPrIDRef : 0,
        },
        id : 0,
        paraPrIDRef : 0,
        merged : 0,
        pageBreak : 0,
        styleIDRef : 0,
      });
    });
    return {  };
  }
}

export default Hwp;

function DISTRIBUTE_DOC_DATA(arg0: any) {
  throw new Error("Function not implemented.");
}
