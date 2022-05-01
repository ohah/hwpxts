import { Cursor } from "../cursor";
import { Char, CTRL_ID, HwpBlob } from "../type";
import { Bit, isCommon, buf2hex, OBJECT_COMMON_ATTRIBUTE } from "../util";
import { SECTION_DEFINE, COLD_DEFINE } from "./CtrlID";

/**
 * 
 * @param content 
 */
 export const PAGE_BORDER_FILL = (content: HwpBlob) => {
  const c = new Cursor(0);
  const attribute = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  const data:any = {
    offset : {
      left : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      right : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      top : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      botom : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    },
    borderFillIDRef : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  }
  data.textBorder = Bit(attribute, 0, 0) === 0 ? "CONTENT" : "PAPER";
  data.attribute.headerInside = Bit(attribute, 1, 1);
  data.attribute.footerInside = Bit(attribute, 2, 2);
  switch (Bit(attribute, 3, 4)) {
    case 0:
      data.fillArea = "PAPER";
      break;
    case 1:
      data.fillArea = "PAGE";
      break;
    case 2:
      data.fillArea = "BORDER";
      break;
  }
  const { left, right, top, botom } = data.offset;
  const { borderFillIDRef, textBorder, attribute : attr } = data;
  const { headerInside, footerInside } = attr;
  
}
/**
 * 페이지 정의
 * @param content 
 */
export const PAGE_DEF = (content: HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
  const data:any = {
    /** 용지 가로, 단위는 HWPUNIT */
    width : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
    /** 용지 세로, 단위는 HWPUNIT */
    height : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
    margin : {
      /** 왼쪽 여백 HWPUNIT */
      left : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      /** 오른쪽 여백 HWPUINT */
      right : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      /** 위쪽 여백 HWPUINT */
      top : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      /** 아래쪽 여백 HWPUINIT */
      bottom : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      /** 머리말 여백 */
      header : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      /** 꼬리말 여백 */
      footer : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      /** 제본 여백 */
      gutter : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
    }
  }
  const paper_attribute = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  /** 용지 방향 */
  data.landscape = Bit(paper_attribute, 0, 0) === 0  ? 'WIDELY' : 'NARROWLY';
  /** 제책 방법 */
  data.gutterType = Bit(paper_attribute, 1, 2) === 0 ? 'LEFT_ONLY' : Bit(paper_attribute, 1, 2) === 1 ? 'LEFT_RIGHT' : 'TOP_BOTTOM';

  const { width, height, margin, landscape, gutterType } = data;
  const { left, right, top, bottom, header, footer, gutter } = margin;
  const pagepr = {
    landscape : landscape,
    width : width,
    height : height,
    gutterType : gutterType,
    margin : {
      ...margin
    }
  }
}

/**
 * 문단의 레이아웃
 * @lineCount size / 36 
 * @param content 
 * 
 */
export const LINE_SEG = (content:HwpBlob) => {
  const size = content.length / 36;
  const seg = [];
  const c = new Cursor(0);
  for (let i = 0; i < size; i++) {
    const result = {
      textpos: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      vertpos: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      textheight: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      vertsize: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      baseline: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      spacing: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      horzpos: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      horzsize: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      flags: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
    }
    const flagsBit:any = {}
    flagsBit.page_start_line = Bit(result.flags, 0, 0);
    // flagsBit.page_start_line = [];
    // for (let k = 0; k < 36; k++) {
    //   flagsBit.page_start_line.push(Bit(result.flags, k, k));
    // }
    flagsBit.column_start_line = Bit(result.flags, 1, 1);
    flagsBit.empty_text = Bit(result.flags, 16, 16);
    flagsBit.line_first_sagment = Bit(result.flags, 17, 17);
    flagsBit.line_last_sagment = Bit(result.flags, 18, 18);
    flagsBit.line_last_auto_hyphenation = Bit(result.flags, 19, 19);
    flagsBit.indent = Bit(result.flags, 20, 20);
    flagsBit.ctrl_id_header_shape_apply = Bit(result.flags, 21, 21);
    flagsBit.property = Bit(result.flags, 31, 31);
    // console.log('플라그쉽', flagsBit);
    seg.push(result);
  }
  // console.log('result', seg);
  return seg;
}

/**
 * CTRL_HEADER
 * @param content 
 */
export const CTRL_HEADER = (content:HwpBlob) => {
  const size = content.length;
  console.log('CTRL_HEADER', size);
  const c = new Cursor(0);
  /**
   * @colPr 단 설정정보
   * @fieldBegin 필드 시작
   * @fieldEnd 필드 끝
   * @bookmark 책갈피
   * @header 머리말(9.7.5 머리말/꼬리말 요소 형식 참조)
   * @footer 꼬리말(9.7.5 머리말/꼬리말 요소 형식 참조)
   * @footNote 각주(9.7.6 각주/미주 요소 형식 참조)
   * @endNote 미주(9.7.6 각주/미주 요소 형식 참조)
   * @autoNum 자동번호
   * @pageNum 페이지번호
   * @pageNumCtrl 홀/짝수 조정
   * @pageHiding 감추기
   * @pageNum 쪽번호 위치
   * @indexmark 찾아보기 표식
   * @hiddenComment 숨은 설명
   */
  const ctrlId = new TextDecoder("utf8").decode((content as any).slice(c.pos, c.move(4)).reverse());
  const ctrl_content = content.slice(4, content.length);
  console.log('야야', ctrlId);
  // 공통 속성
  const isComAttr = isCommon(ctrlId);
  switch (ctrlId) {
    // 섹션
    case CTRL_ID.secd:
      // const result = new TextDecoder("utf8").decode(content as any);
      // OBJECT_COMMON_ATTRIBUTE(content.slice(4, content.length ));
      console.log('SECTION_DEFINE', SECTION_DEFINE(ctrl_content));
      // const { tag_id, level, size : secDSize, move } = readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
      // console.log('secd', tag_id, level, size, move);   
      break;
    // 단
    case CTRL_ID.cold:
      return COLD_DEFINE(ctrl_content);
      break;
    case CTRL_ID.tbl:
      const tbl = OBJECT_COMMON_ATTRIBUTE(content.slice(0, content.length));
      console.log('tbl', tbl, buf2hex(content));
      break;
    default:
      console.warn('작업 안된 ctrl_id', ctrlId)
      break;
  }
  return {
    
  };
}

/**
 * @param content 
 * @explain 길이 22, 5032버전 이상일시 변경추적 병합 문단여부 추가됨(2바이트)
 * @length 22 OR 24
 */
export const PARA_HEADER = (content:HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
  //chars
  let text = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  if(text & 0x80000000) {
    //nchars
    text &= 0x7fffffff;
  }
  const data = {
    /** 텍스트 */
    text : text,
    /** 컨트롤 마스크 */
    control_mask: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    /** 문단 모양 아이디 참조값 */
    parapridref: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 문단 스타일 아이디 참조값 */
    styleidref: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 단 나누기 종류 */
    paragraph_dvide_type: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 글자 모양 정보 수 */
    text_shapes: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint8(0),
    /** range tag 정보 수 */
    range_tags: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 각 줄에 대한 정보 수 */
    line_align: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 문단 Instance Id */
    id: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    /** 변경추적 병합 문단 여부(5.0.3.2 이상) */
    merged : null
  }
  if(size === 24) {
    data.merged = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  }
  return data;
}

/**
 * 
 * @param content 
 */
export const PARA_TEXT = (content:HwpBlob, ctrl_id:CTRL_ID) => {
  const size = content.length;
  const c = new Cursor(0);
  const paragraph_text:any = [];
  const text_content = new Uint8Array(content.slice(c.pos, c.pos+size))
  const pc = new Cursor(0);
  const result = {
    charCode: [],
    ctrlId: [],
    text: null,
  }
  while (pc.pos < text_content.length) {
    const charCode = new DataView(new Uint8Array(text_content.slice(pc.pos, pc.pos + 2)).buffer, 0).getUint16(0, true);
    if(charCode <= 31) {
      result.charCode.push(charCode);
    }
    switch (charCode) {
      case Char["ZONE/SINGLE_DEFINITION"]:
        const ctrlId = new TextDecoder("utf8").decode(text_content.slice(pc.pos + 2, pc.pos + 6).reverse());
        result.ctrlId.push(ctrlId);
        console.log(buf2hex(text_content.slice(pc.pos + 6, pc.pos + 16)));
        pc.move(16);
        break;
      case Char.RESERVED_CHAR:
        console.log('RESERVED_CHAR', Char.RESERVED_CHAR);
        pc.move(2);
        break;
      case Char.RESERVED_INLINE:
        console.log('RESERVED_INLINE', Char.RESERVED_INLINE);
        pc.move(16);
        break;
      case Char.RESERVED_EXTENDED: //예약
        console.log('RESERVED_EXTENDED', Char.RESERVED_EXTENDED);
        pc.move(16);
        break;
      case Char.UNUSABLE:
        console.log('UNUSABLE', Char.UNUSABLE);
        pc.move(2);
        break;
      case Char.FIELD_START:
        console.log('FIELD_START', Char.FIELD_START);
        pc.move(16);
        break;
      case Char.FIELD_END:
        console.log('FIELD_END', Char.FIELD_END);
        pc.move(16)
        break;
      case Char.TITLE_MARK:
        console.log('TITLE_MARK', Char.TITLE_MARK);
        pc.move(16);
        break;
      case Char.TAB:
        console.log('TAB', Char.TAB);
        pc.move(2);
        break;
      case Char.LINE_BREAK:
        console.log('LINE_BREAK', Char.LINE_BREAK);
        pc.move(2);
        break;
      case Char["DRAWING_OBJECTS/TABLE"]:
        console.log('DRAWING_OBJECTS/TABLE', Char["DRAWING_OBJECTS/TABLE"]);
        pc.move(16);
        break;
      case Char.PARA_BREAK:
        console.log('PARA_BREAK', Char.PARA_BREAK);
        result.ctrlId.push(new TextDecoder("utf8").decode(text_content.slice(pc.pos, pc.pos + 2).reverse()));
        pc.move(2);
        break;
      case Char.HIDDEN_EXPLANATION:
        console.log('HIDDEN_EXPLANATION', Char.HIDDEN_EXPLANATION);
        pc.move(16);
        break;
      case Char["FOOTER/PREFACE"]:
        console.log('FOOTER/PREFACE', Char["FOOTER/PREFACE"]);
        pc.move(16);
        break;
      case Char["FOOTNOTE/ENDNOTE"]:
        console.log('FOOTNOTE/ENDNOTE', Char["FOOTNOTE/ENDNOTE"]);
        pc.move(16);
        break;
      case Char.AUTO_NUMBER:
        console.log('AUTO_NUMBER', Char.AUTO_NUMBER);
        pc.move(16);
        break;
      case Char.PAGE_CTRL:
        console.log('PAGE_CTRL', Char.PAGE_CTRL);
        pc.move(16);
        break;
      case Char["BOOKMARK/BROWSE_MARK"]:
        console.log('BOOKMARK/BROWSE_MARK', Char["BOOKMARK/BROWSE_MARK"]);
        pc.move(16);
        break;
      case Char.OVERLAP_WORD:
        console.log('OVERLAP_WORD', Char.OVERLAP_WORD);
        pc.move(16);
        break;
      case Char.HYPEN:
        console.log('HYPEN', Char.HYPEN);
        pc.move(2);
        break;
      case Char.BUNDLE_BLANK:
        console.log('BUNDLE_BLANK', Char.BUNDLE_BLANK);
        pc.move(2);
        break;
      case Char.FIXED_WIDTH_BLANK:
        console.log('FIXED_WIDTH_BLANK', Char.FIXED_WIDTH_BLANK);
        pc.move(2);
        break;
      default:
        const CharText = new Uint8Array(text_content.slice(pc.pos, pc.pos + charCode))
        paragraph_text.push(CharText[0]);
        paragraph_text.push(CharText[1]);
        pc.move(2);
    }
  }
  const text = new Uint8Array(paragraph_text);
  result.text = new TextDecoder("utf-16le").decode(text);
  console.log(result);
  return result;
}

/**
 * CHAR_SHAPE 문단 모양
 * @param content 
 * @returns 
 * @size 8 * n
 */
export const PARA_CHAR_SHAPE = (content:HwpBlob) => {
  const c = new Cursor(0);
  const size = content.length;
  const data = [];
  for(let i=0;i<size/8;i++) {
    const shape = {
      /** 글자 모양이 바뀌는 시작 위치 */
      startNumber : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      /** 글자 모양 ID */
      charPriDRef : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    }
    data.push(shape);
  }
  return data;
}

/**
 * 문단의 영역 태그
 * range tag 정보를 정보 수만큼 읽어 온다. range tag는 텍스트의 일정 영역을 마킹하는 용도로 사용되며, 글자 모양과는 달리 각 영역은 서로 겹칠 수 있다.(형광펜, 교정 부호 등)
 * @param content
 * @size 가변 12 * n
 */
export const PARA_RANGE_TAG = (content:HwpBlob) => {
  const c = new Cursor(0);
  const size = content.length;
  const data = [];
  for(let i=0;i<size/12;i++) {
    const range_tag = {
      /** 시작 위치 */
      startNumber : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      /** 끝 위치 */
      endNumber : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      /** 영역 태그 ID */
      rangeTagID : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    }
    data.push(range_tag);
  }
  return data;
}