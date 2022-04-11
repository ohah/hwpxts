import CFB from "cfb";
import { Cursor } from "./cursor";
import { Char, CTRL_ID, HwpBlob } from "./type"
/**
 * 바이너리 레코드 읽기
 * @param data 
 * @returns {tag_id, level, size, move}
 */
export const readRecord = (data: Uint8Array) => {
  const value = new DataView(data.slice(0, 4).buffer, 0).getUint32(0, true);
  const tagID = value & 0x3FF;
  const level = (value >> 10) & 0x3FF;
  const size = (value >> 20) & 0xFFF;
  if (size === 0xFFF) {
    return {
      tag_id: tagID,
      level: level,
      size: new DataView(data.slice(4, 8)).getUint32(0, true),
      move: 4,
    }
  }
  return { tag_id: tagID, level: level, size: size, move: 0 }
}

/**
 * Flags
 * @param bits 
 * @param position 
 * @returns 
 */
export const Flags = (bits:number, position:number) => {
  const mask = 1 << position;
  return (bits & mask) === mask;
}

/**
 * 
 * @param value 
 * @returns 
 */
export const BinaryRecord = (value) => {
  const Type = Bit(value, 0x00, 0x03);
  const Compress = Bit(value, 0x04, 0x05);
  const Status = Bit(value, 0x08, 0x09);
  return { type: Type, compress: Compress, status: Status }
}
/**
 * 비트연산 값 가져오기
 * @param mask(uint8Array)
 * @param start(start)
 * @param end(end)
 * @returns 
 */
export const Bit = (mask:number, start:number, end:number) => {
  const target = mask >> start
  let temp = 0
  for (let index = 0; index <= (end - start); index += 1) {
    temp <<= 1
    temp += 1
  }
  return target & temp;
}
/**
 * 색깔 값을 가져옴
 * @param value 
 * @returns 
 */
export const RGB = (value:number) => {
  return [
    Bit(value, 0, 7),
    Bit(value, 8, 15),
    Bit(value, 16, 24),
  ]
}

/**
 * Uint8Array -> hex
 * @param buffer 
 * @returns hex code
 */
export const buf2hex = (buffer: HwpBlob) => {
  return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join(' ').toUpperCase();
}
/**
 * hwp 파일 헤더값 가져오기
 * @param content 
 * @returns 
 */
export const HwpHeader = (content: HwpBlob) => {
  return {
    signature: new TextDecoder("utf8").decode(new Uint8Array(content.slice(0, 32))),
    version: parseInt(new Uint8Array(content.slice(32, 36)).reverse().join("")),
    attribute: new Uint8Array(content.slice(36, 40)),
    license: new Uint8Array(content.slice(40, 44)),
    hwpversion: buf2hex(new Uint8Array(content.slice(44, 48))),
    kogl: buf2hex(content.slice(48, 49)),
    reservation: buf2hex(content.slice(49, 256)),
  }
}

/**
 * hwp 파일을 읽어옴.
 * @param cfb 
 * @returns 
 */
export const HwpReader = (cfb:CFB.CFB$Entry[]) => {  
  return {
    DocOptions : {
      _LinkDoc : cfb.find((entry) => entry.name === "_LinkDoc"),
      DrmLicense : cfb.find((entry) => entry.name === "DrmLicense"),
      DrmRootSect : cfb.find((entry) => entry.name === "DrmRootSect"),
      CertDrmHeader : cfb.find((entry) => entry.name === "CertDrmHeader"),
      CertDrmInfo : cfb.find((entry) => entry.name === "CertDrmInfo"),
      DigitalSignature : cfb.find((entry) => entry.name === "DigitalSignature"),
      PublicKeyInfo : cfb.find((entry) => entry.name === "PublicKeyInfo"),
    },
    DocInfo : cfb.find((entry) => entry.name === "DocInfo"),
    FileHeader : cfb.find((entry) => entry.name === "FileHeader"),
    Scripts: {
      DefaultJScript : cfb.find((entry) => entry.name === "DefaultJScript"),
      JScriptVersion : cfb.find((entry) => entry.name === "JScriptVersion"),
    },
    XMLTemplate: {
      Schema : cfb.find((entry) => entry.name === "Schema"),
      Instance : cfb.find((entry) => entry.name === "Instance"),
    },
    DocHistory: cfb.filter((entry)=>entry.name.match(/VersionLog[0-9]{1,1000}/)),
    Section : cfb.filter((entry)=>entry.name.match(/Section[0-9]{1,1000}/))
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
 * 
 * @param content 
 */
export const CTRL_HEADER = (content:HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
  const ctrlId = new TextDecoder("utf8").decode((content as any).slice(c.pos, c.move(4)).reverse());
  // console.log('ctrlId', ctrlId, content);
  if(size >= 46) {
    const _attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
    const objectCommonAttribute = {
      /** 속성 */
      attr : {
        like_letters : Bit(_attr, 0, 0),
        reservation : Bit(_attr, 1, 1),
        VertRelTo : Bit(_attr, 3, 4) === 0 ? "paper" : Bit(_attr, 3, 4) === 1 ? "page" : "para",
        VertRelTo_relative : Bit(_attr, 5, 7),
        HorzRelTo : Bit(_attr, 8, 9) === 2 ? "column" : Bit(_attr, 8, 9) === 3 ? "para" : "page",
        HorzRelTo_relative : Bit(_attr, 10, 12),
        VertRelTo_para : Bit(_attr, 13, 13) === 0 ? "off" : "on",
        overlap : Bit(_attr, 14, 14),
        size_protect : Bit(_attr, 20, 20) === 0 ? "off" : "on",
      },
      /** 세로/가로 오프셋값 */
      offset : {
        vertical : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
        horzontal : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      },
      /** 오브젝트 넓이/높이 */
      object : {
        width : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
        height : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      },
      /** zIndex */  
      zOrder : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      /** 오브젝트의 바깥 4방향 여백 */
      margin : {
        bottom : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
        left : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
        right : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
        top : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      },
      /** 고유 ID */
      instance_id : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      /** 쪽 나눔 방지 on(1) / off(0) */
      pageDivde : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      /** 개체 설명문 글자 길이(len) */
      len : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    } 
    return objectCommonAttribute;
    /** 개체 설명문 글자 */
    // const text = new DataView(new Uint8Array(content.slice(c.pos, c.move(2 * objectCommonAttribute.len))).buffer, 0).getUint16(0, true);
  } else {
    console.log('없음', ctrlId) 
  }
  switch (ctrlId) {
    case CTRL_ID.secd:
      const secd_content = content.slice(0, 32);
      const result = new TextDecoder("utf8").decode(content as any);
      // const { tag_id, level, size : secDSize, move } = readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
      // console.log('secd', tag_id, level, size, move);   
      break;
    case CTRL_ID.cold:
      COLD_DEFINE(content.slice(4, content.length ));
      break;
  
    default:
      // console.warn('작업 안된 ctrl_id', ctrlId)
      break;
  }
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
  while (pc.pos < text_content.length) {
    const charCode = new DataView(new Uint8Array(text_content.slice(pc.pos, pc.pos + 2)).buffer, 0).getUint16(0, true);
    switch (charCode) {
      case Char["ZONE/SINGLE_DEFINITION"]:
        const para_id = new TextDecoder("utf8").decode(text_content.slice(pc.pos + 2, pc.pos + 6).reverse());
        console.log('para_id', para_id)
        if(para_id == "secd") {
          const t = SECTION_DEFINE(text_content.slice(pc.pos + 6, pc.pos + 32));
          console.log('t', t);
        }
        pc.move(32);
        break;
      case Char.RESERVED_CHAR:
        pc.move(2);
        break;
      case Char.RESERVED_INLINE:
        pc.move(16);
        break;
      case Char.RESERVED_EXTENDED: //예약
        pc.move(16);
        break;
      case Char.UNUSABLE:
        pc.move(2);
        break;
      case Char.FIELD_START:
        pc.move(16);
        break;
      case Char.FIELD_END:
        pc.move(16)
        break;
      case Char.TITLE_MARK:
        pc.move(16);
        break;
      case Char.TAB:
        pc.move(2);
        break;
      case Char.LINE_BREAK:
        pc.move(2);
        break;
      case Char["DRAWING_OBJECTS/TABLE"]:
        pc.move(16);
        break;
      case Char.PARA_BREAK:
        pc.move(2);
        break;
      case Char.HIDDEN_EXPLANATION:
        pc.move(16);
        break;
      case Char["FOOTER/PREFACE"]:
        pc.move(16);
        break;
      case Char["FOOTNOTE/ENDNOTE"]:
        pc.move(16);
        break;
      case Char.AUTO_NUMBER:
        pc.move(16);
        break;
      case Char.PAGE_CTRL:
        pc.move(16);
        break;
      case Char["BOOKMARK/BROWSE_MARK"]:
        pc.move(16);
        break;
      case Char.OVERLAP_WORD:
        pc.move(16);
        break;
      case Char.HYPEN:
        pc.move(2);
        break;
      case Char.BUNDLE_BLANK:
        pc.move(2);
        break;
      case Char.FIXED_WIDTH_BLANK:
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
  const result = new TextDecoder("utf-16le").decode(text);
  console.log(ctrl_id, result)
  return result;
}

/**
 * 구역 정의
 */
const SECTION_DEFINE = (content:HwpBlob) => {
  const c = new Cursor(0);
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  /** 구역정의 속성 */
  const attribute = {
    /** 머리말을 감출지 여부 */
    hide_header: Bit(attr, 0, 0),
    /** 꼬리말을 감출지 여부 */
    hide_footer: Bit(attr, 1, 1),
    /** 바탕쪽을 감출지 여부 */
    hide_background: Bit(attr, 2, 2),
    /** 테두리를 감출지 여부 */
    hide_border: Bit(attr, 3, 3),
    /** 배경을 감출지 여부 */
    hide_background_image: Bit(attr, 4, 4),
    /** 쪽 번호 위치를 감출지 여부 */
    hide_page_number: Bit(attr, 5, 5),
    /** 구역의 첫 쪽에만 테두리 표시 여부 */
    hide_border_first_page: Bit(attr, 8, 8),
    /** 구역의 첫 쪽에만 배경 표시 여부 */
    hide_background_first_page: Bit(attr, 9, 9),
    /** 텍스트 방향(0 : 가로 1 : 세로) */  
    textdirection: Bit(attr, 16, 18),
    /** 빈 줄 감춤 여부 */
    hide_empty_line: Bit(attr, 19, 19),
    /** 구역 나눔으로 새 페이지가 생길 떄의 페이지 번호 적용할지 여부 */
    page_number_apply_section_break: Bit(attr, 20, 21),
    /** 원고지 정서법 적용 여부 */
    apply_syllable_rule: Bit(attr, 22, 22),
  }
  
  const result:any = {
    /** 구역정의 속성 */
    attribute : attribute,
    /** 단 사이의 간격  */
    spacecolumns: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 텍스트 방향(세로로 줄맞춤을 할지 여부) grid */
    lineGrid: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 텍스트 방향(가로로 줄맞춤을 할지 여부) grid */
    charGrid: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 기본탭 간격 */
    tabStop: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
    /** 번호 문단 모양ID */
    outlineshapeidref: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 쪽 번호 */
    page: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 그림 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) */
    pic: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 표(테이블) 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) */
    tbl: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 수식 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) */
    equation: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 대표 Language */
    language: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  }
  console.log('무야', result, content.length);
  return result;
};

/**
 * 문단 정의
 * @param content 
 * @returns 
 * @missing_link 
 */
export const COLD_DEFINE = (content: HwpBlob) => {
  console.log('cold_size', content, content.length);
  const c = new Cursor(0);
  /** 속성의 bit */
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  const data:any = {
    /** 단 종류 */
    type: Bit(attr, 0, 1) === 0 ? '일반' : Bit(attr, 0, 1) === 1 ? '배분' : '평행',
    /** 단 개수 1~255 */
    count: Bit(attr, 2, 9),
    /** 단 방향 지정 */
    direction: Bit(attr, 10, 11) === 0 ? '왼쪽' : Bit(attr, 10, 11) === 1 ? '오른쪽' : '맞쪽',
    /** 단 너비 동일하게 */
    same_width: Bit(attr, 12, 12),
    /** 단 사이의 간격 */
    spacecolumns: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 단 너비가 동일하지 않으면, 단의 개수만큼 단의 폭(2 * cnt) */
    // wordSize: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 속성의 bit 16-32 */
    attr2 : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 단 구분선 종류 */
    lineType: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 단 구분선 굵기 */
    lineWeight: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 단 구분선 색상 */
    lineColor: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
  }
  if(data.count > 1) {
    /** 단 너비가 동일하지 않으면, 단의 개수만큼 단의 폭(2 * cnt) */
    data.wordSize = new DataView(new Uint8Array(content.slice(c.pos, c.move(2 * data.count))).buffer, 0).getInt16(0, true);
  }
  console.log('cold define', data);
  // const attr2 = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  return data;
  /** 속성의 bit 16-32 */
  /** 단 구분선 종류 */

  
}

/**
 * 개체 공통 속성
 */
export const isCommon = (object:CTRL_ID) => {
  return [CTRL_ID.tbl, CTRL_ID.line, CTRL_ID.rec, CTRL_ID.ell, CTRL_ID.arc, CTRL_ID.pol, CTRL_ID.cur, CTRL_ID.eqed, CTRL_ID.cur, CTRL_ID.pic, CTRL_ID.ole, CTRL_ID.con, CTRL_ID.gso].includes(object);
}
/**
 * 개체 요소 속성
 */
 export const isElement = (object:CTRL_ID) => {
  return [CTRL_ID.line, CTRL_ID.rec, CTRL_ID.ell, CTRL_ID.arc, CTRL_ID.pol, CTRL_ID.cur, CTRL_ID.eqed, CTRL_ID.cur, CTRL_ID.pic, CTRL_ID.ole, CTRL_ID.con, CTRL_ID.gso].includes(object);
}