import { Cursor } from "../cursor";
import { Char, CTRL_ID, HwpBlob } from "../type";
import { Bit, isCommon, buf2hex, OBJECT_COMMON_ATTRIBUTE, RGB, isElement } from "../util";
import { SECTION_DEFINE, COLD_DEFINE } from "./CtrlID";

/**
 * 
 * @param content 
 */
 export const PAGE_BORDER_FILL = (content: HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
  // console.log('PAGE_BORDER_FILL', size);
  const attribute:any = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
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
  data.headerInside = Bit(attribute, 1, 1);
  data.footerInside = Bit(attribute, 2, 2);
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
  const { headerInside, footerInside, borderFillIDRef, textBorder, fillArea } = data;
  return {
    offset: {
      ...data.offset,
    },
    borderFillIDRef: borderFillIDRef,
    textBorder: textBorder,
    headerInside: headerInside,
    footerInside: footerInside,
    fillArea: fillArea,
  }
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
    landscape: landscape,
    width: width,
    height: height,
    gutterType: gutterType,
    margin: {
      ...margin
    }
  }
  return pagepr;
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
      // 텍스트 시작 위치
      textpos: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      // 줄의 세로 위치
      vertpos: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      // 줄의 높이
      textheight: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      // 텍스트 부분의 높이
      vertsize: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      // 줄의 세로 위치에서 베이스라인까지의 거리
      baseline: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      // 줄간격
      spacing: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      // 컬럼에서의 시작 위치
      horzpos: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      // 새그먼트의 폭
      horzsize: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      // 태그(flags)
      flags: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
    }
    const flagsBit:any = {}
    // 페이지 첫 줄인지 여부
    flagsBit.page_start_line = Bit(result.flags, 0, 0);
    // 컬럼의 첫 줄인지 여부
    flagsBit.column_start_line = Bit(result.flags, 1, 1);
    // 텍스트가 배열되지 않은 빈 세그먼트인지 여부
    flagsBit.empty_text = Bit(result.flags, 16, 16);
    // 줄의 첫 세그먼트인지 여부
    flagsBit.line_first_sagment = Bit(result.flags, 17, 17);
    // 줄의 마지막 세그먼트인지 여부
    flagsBit.line_last_sagment = Bit(result.flags, 18, 18);
    // 줄의 마지막에 auto-hyphenation이 수행되었는지 여부
    flagsBit.line_last_auto_hyphenation = Bit(result.flags, 19, 19);
    // indentaion 적용
    flagsBit.indent = Bit(result.flags, 20, 20);
    // 문단 머리 모양 적용
    flagsBit.ctrl_id_header_shape_apply = Bit(result.flags, 21, 21);
    // 구현상의 편의를 위한 property
    flagsBit.property = Bit(result.flags, 31, 31);
    console.log(result.flags, flagsBit, buf2hex(content.slice(c.pos - 4, c.pos)))
    // console.log('플라그쉽', flagsBit);
    seg.push({
      ...result,
      ...flagsBit,
    });
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
  // console.log('야야', ctrlId);
  let result:any = [];
  // 공통 속성
  const isComAttr = isCommon(ctrlId);
  const isEleAttr = isElement(ctrlId);
  console.log('ctrlId', ctrlId);
  
  switch (ctrlId) {
    // 섹션
    case CTRL_ID.secd:
      // const result = new TextDecoder("utf8").decode(content as any);
      // OBJECT_COMMON_ATTRIBUTE(content.slice(4, content.length ));
      result = SECTION_DEFINE(ctrl_content);
      // const { tag_id, level, size : secDSize, move } = readRecord(new Uint8Array(content.slice(c.pos, c.move(4) + 4)));
      // console.log('secd', tag_id, level, size, move);   
      break;
    // 단
    case CTRL_ID.cold:
      result = COLD_DEFINE(ctrl_content);
      break;
    case CTRL_ID.tbl:
      const tbl = OBJECT_COMMON_ATTRIBUTE(content.slice(0, content.length));
      // console.log('tbl', tbl, buf2hex(content));
      break;
    case CTRL_ID.pgct:
      console.log('pgct');
      break;
    case CTRL_ID.line:
      console.log('한줄 끝');
      break;
    default:
      console.warn('작업 안된 ctrl_id', ctrlId)
      break;
  }
  return {
    ctrlId: ctrlId,
    ...result,
  };
}

/**
 * @param content 
 * @explain 길이 22, 5032버전 이상일시 변경추적 병합 문단여부 추가됨(2바이트)
 * @length 22 OR 24
 */
export const PARA_HEADER = (content:HwpBlob, version:number) => {
  const size = content.length;
  const c = new Cursor(0);
  //chars
  let text = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  if(text & 0x80000000) {
    //nchars
    text &= 0x7fffffff;
  }
  const data:any = {
    /** 텍스트 */
    text : text,
    /** 컨트롤 마스크 */
    control_mask: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    /** 문단 모양 아이디 참조값 */
    paraPrIDRef: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 문단 스타일 아이디 참조값 */
    styleIDRef: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 단 나누기 종류 */
    DivideType: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 글자 모양 정보 수 */
    text_shapes: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint8(0),
    /** range tag 정보 수 */
    range_tags: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 각 줄에 대한 정보 수 */
    line_align: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 문단 Instance Id */
    id: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    /** 변경추적 병합 문단 여부(5.0.3.2 이상) */
    merged : 0
  }
  switch (data.DivideType) {
    case 0x01:
      // 구역 나누기
      data.Type = "구역나누기";
      break;
    case 0x02:
      // 다단 나누기
      data.Type = "다단 나누기"
      break;
    case 0x04:
      // 쪽 나누기
      data.Type = "쪽 나누기"
      break;
    case 0x08:
      // 단 나누기
      data.Type = "단 나누기"
    default:
      break;
  }
  if(version === 5032) {
    data.merged = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  }
  // console.log('PARAP_HEADER', data);
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
        // console.log('PARA_BREAK', Char.PARA_BREAK);
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
  // console.log(result);
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

/**
 * FOOTNOTE_SHAPE
 * @param content
 * @size 28(공식문서 26)
 * @debug noteLine(length)[구분선 길이]가 HWPUINT16이 아닌 INT32임. 길이도 2가 아닌 4로 되어 있음.
 */
export const FOOTNOTE_SHAPE = (content:HwpBlob) => {
  const c = new Cursor(0);
  const size = content.length;
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  /**
   * 번호 모양
   * 0~16은 범용
   * 0x80, 0x81은 각주/미주 전용
   */
  const autoNumForamt = {
    // 번호 모양 종류
    type: Bit(attr, 0, 7),
    /**
     * 사용자 정의 기호
     * type이 USER_CHAR로 설정된 경우, 번호 모양으로 사용될 사용자 정의 글자
     */
    userChar: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint8(0),
    // 앞 장식 문자
    prefixChar: new TextDecoder("utf-16le").decode(content.slice(c.pos, c.move(2)) as any),
    // 뒷 장식 문자
    suffixChar: new TextDecoder("utf-16le").decode(content.slice(c.pos, c.move(2)) as any),
    // 각주 내용 중 번호 코드의 모양을 위 첨자 형식으로 할 지 여부
    supscript: Bit(attr, 12, 12)
  };
  // footNotePr numbering
  const numbering = {
    /**
     * 0 앞 구역에 이어서
     * 1 현재 구역부터 새로 시작
     * 2 쪽마다 새로 시작(각주 전용)
     */
    type: Bit(attr, 10, 11),
    // 시작번호
    newNum: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  }
  // 구분선 길이
  /**
   * FIX: 구분선 길이의 데이터 형이 INT32이며 크기도 4이다.
   */
  const length = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true);
  // 구분선 위 여백
  // c.move(2);
  const aboveLine = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  // 구분선 아래 여백
  const belowLine = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  // 주석 사이 여백
  const betweenNotes = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  // 구분선 종류(테두리/배경의 테두리 선 종류 참조)
  const type = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0);
  // 구분선 굵기(테두리/배경의 테두리 선 굵기 참조)
  const width = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0);
  // 구분선 색상(테두리/배경의 테두리 선 색상 참조)
  const color = RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
  /**
   * 한 페이지 내에서 각주를 다단에 위치시킬 방법
   * 각주인 경우(footNotePr)
   * EACH_COLUMN | MERGED_COLUMN | RIGHT_MOST_COLUMN
   * 미주인 경우(endNotePr)
   * END_OF_DOCUMENT | END_OF_SECTION
   */
  const place = Bit(attr, 8, 9);
  // 각주 내용 중 번호 코드의 모양을 위 첨자 형식으로 할 지 여부
  const beneathText = Bit(attr, 13, 13);
  // 각주/미주 내에서 사용되는 구분선 모양 정보를 가지고 있는 요소
  const noteLine = {
    /**
     * 구분선 길이
     * 0(구분선 없음), 5cm, 2cm, Column/3(단 크기의 1/3), Column(단 크기), 그 외(HWPUINT 단위의 사용자 지정 길이)
     */
    length: length,
    // 구분선 종류
    type: type,
    // 구분선 굵기(단위는 mm)
    width: width,
    // 구분선 색
    color: color,
  };
  const noteSpacing = {
    // 주석 사이 여백
    betweenNotes: betweenNotes,
    // 구분선 아래 여백
    belowLine: belowLine,
    // 구분선 위 여백
    aboveLine: aboveLine,
  }
  const placement = {
    // 한 페이지 내에서 격주를 다단계 어떻게 위치시킬지에 대한 설정
    place: place,
    // 텍스트에 이어 바로 출력할지 여부
    beneathText: beneathText,
  }
  return {
    autoNumForamt: autoNumForamt,
    noteLine: noteLine,
    noteSpacing: noteSpacing,
    numbering: numbering,
    placement: placement,
  }
}
/**
 * 테이블(표 개체)
 * @n 개체 공통 속성(표 68 참조)
 * @n2 표 개체 속성(표 75 참조)
 * @n3 셀 리스트(표 79 참조) 셀 size * 셀 개수
 * @size n + n2 + n3
 */
export const TABLE = (content:HwpBlob, version:number) => {
  const c = new Cursor(0);
  const size = content.length;
  console.log('TABLE', size);
  // const n = OBJECT_COMMON_ATTRIBUTE(content.slice(c.pos, c.move(46)));
  // console.log('TABLE', n);
  // n2
  // 속성
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  // RowCount
  const rowCnt = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  // colCnt
  const colCnt = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  // CellSpacing
  const cellSpacing = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  // 안쪽 여백
  const inMargin = {
    // 왼쪽
    left : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    // 오른쪽
    right : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    // 위쪽
    top : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    // 아래쪽
    bottom : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  }
  for(let i=0; i < rowCnt; i++) {
    // 셀 사이즈
    const cellSize = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint8(0);
    console.log('cellSize', cellSize);
  }
  // Border Fill ID
  const borderFillIDRef = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  if(version >= 5010) {
    // Valid Zone Info Size (5.0.1.0 이상)
    const validZoneInfoSize = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
    // 영역 속성(표 73 참조) (5.0.1.0 이상)
    const zoneAttr = new DataView(new Uint8Array(content.slice(c.pos, c.move(10 * validZoneInfoSize))).buffer, 0).getUint32(0, true);
  }
}