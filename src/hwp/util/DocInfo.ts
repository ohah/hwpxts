import { XMLBuilder } from "fast-xml-parser";
import { SECPR } from "../../hwpx/type/section";
import { FamilyType, LineType1 } from "../../hwpx/type/xml";
import { Cursor } from "../cursor";
import { HwpBlob, SymMark } from "../type";
import { Bit, Flags, RGB, setWidth } from "../util";

/**
 * 문서 속성
 * @param content 
 */
export const DOCUMENT_PROPERTIES = (content: HwpBlob) => {
  const size = 0;
  const c = new Cursor(0);
  const data:any = {
    /** 구역 개수 */
    area_count: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
    //문서 내 각종 시작번호에 대한 정보
    /** 페이지 시작 번호 */
    page: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
    /** 각주 시작번호 */
    footnote: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
    /** 미주 시작 번호 */
    endnote: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
    /** 그림 시작 번호 */
    pic: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
    /** 표 시작 번호 */
    tbl: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
    /** 수직 시작 번호 */
    equation: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer,0).getUint16(0, true),
    //문서 내 캐럿의 위치 정보
    /** 리스트 아이디 */
    listIDRef: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getUint32(0, true),
    /** 문단 아이디  */
    paraIdRef: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getUint32(0, true),
    /** 문단 내의 글자 단위 위치 */
    pos: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
  };
  return data;
}

/**
 * ID_MAPPINGS
 * @param content 
 */
export const ID_MAPPINGS = (content: HwpBlob, version:number) => {
  const size = 0;
  const c = new Cursor(0);
  const data:any = {    
    binary_data: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getInt32(0, true), // 바이너리 데이터
    cnt : {
      HANGUL: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 한글 글꼴
      LATIN: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 영어 글꼴
      HANJA: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 한자 글꼴
      JAPANESE: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 일어 글꼴
      OTHER: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), // 기타 글꼴
      SYMBOL: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getInt32(0, true), // 기호 글꼴
      USER: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), //사용자 글꼴
    },
    shape_border: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), //테두리 배경
    shape_font: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer,0).getInt32(0, true), //글자 모양
    tab_def: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), //탭 정의
    paragraph_number: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), //문단 번호
    bullet_table: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), // 글머리표
    shape_paragraph: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0 ).getInt32(0, true), //문단 모양
    style: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true), //스타일
  }
  if(version >= 5021) {
    data.style_shape = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true); // 메모 모양
  }
  if(version >= 5032) {
    data.TrackChange = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true); // 변경 추적
    data.TrackChangeAuthor = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true); // 변경 추적 사용자
  }
  console.log('ID_MAPPINGS', data);
  return data;
}

/**
 * 바이너리 데이터
 * @param content 
 */
export const BIN_DATA = (content: HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);

  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  const bin_attribute:any = {
    type : Bit(attr, 0, 3) === 0x0000 ? "LINK" : Bit(attr, 0, 3) === 0x0001 ? "EMBEDDING" : "STORAGE",
    compress : Bit(attr, 4, 5) === 0x0000 ? "default" : Bit(attr, 4, 5) === 0x0010 ? "compress" : "decompress",
    access : Bit(attr, 8, 9) === 0x0000 ? "none" : Bit(attr, 8, 9) === 0x0100 ? "success" : Bit(attr, 8, 9) === 0x0200 ? "error" : "ignore",
  }
  const { type, compress, access } = bin_attribute;
  if(type === "LINK") {
    bin_attribute.link_abspath_length = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
    bin_attribute.link = new DataView(new Uint8Array(content.slice(c.pos, c.move(2 * bin_attribute.link_abspath_length)))).getUint16(0, true);
    bin_attribute.link2_abspath_length = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
    bin_attribute.link2 = new DataView(new Uint8Array(content.slice(c.pos, c.move(2 * bin_attribute.link2_abspath_length)))).getUint16(0, true);
  } else {
    bin_attribute.binary_data_id = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
    if(type === "EMBEDDING") {
      bin_attribute.binary_data_length = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
      bin_attribute.extension = new TextDecoder("utf8").decode(new Uint8Array(content.slice(c.pos, c.move(2 * bin_attribute.binary_data_length)))).replace(/\0/g, '');
      bin_attribute.path = `Root Entry/BinData/BIN${`${bin_attribute.binary_data_id.toString(16).toUpperCase()}`.padStart(4, '0')}.${bin_attribute.extension}`;
      if(bin_attribute.extension === "jpg" || bin_attribute.extension === "bmp" || bin_attribute.extension === "gif") {
        bin_attribute.image = true;
      }else {
        bin_attribute.image = false;
      }
    }
  }
  // data = {
  //   name : "HWPTAG_BIN_DATA",
  //   tag_id : tag_id,
  //   level : level,
  //   size : size,
  //   hex : buf2hex(content.slice(c.pos, c.pos + size)),
  //   attribute : {
  //     ...bin_attribute
  //   },
  // }
}

/**
 * 글꼴
 * @param content
 */
export const FACE_NAME = (content: HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0);
  const data:any = {};
  const length = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  data.face = new TextDecoder("utf-16le").decode(new Uint8Array(content.slice(c.pos, c.move(2 * length))));
  data.type = attr === 1 ? 'HTF' : 'TTF';
  const hasAlternative = Flags(attr, 7);
  const hasAttribute = Flags(attr, 6);
  const hasDefault = Flags(attr, 5);
  
  if(hasAlternative) {
    data.subFonts = [];
    let type = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0);
    const length = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true)
    const subfont = {
      face : new TextDecoder("utf-16le").decode(new Uint8Array(content.slice(c.pos, c.move(2 * length)))),
      type : type === 0 ? false : type === 1 ? 'TTF ': 'HTF',
      binaryItemIDRef : 0,
    }
    data.subfonts.push(subfont);
  }
  if(hasAttribute) {
    data.typeinfo = {
      /** 
       * 글꼴 계열 
       * @type {string}
       * */
      familyType : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 세리프 유형
       * @type {string}
       *  */
      serifStyle : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 굵기 
       * @type {integer}
       * */
      weight : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 비례 
       * @type {integer}
       * */
      proportion : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 대조 
       * @type {integer}
       * */
      contrast : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 스트로크 편차 
       * @type {integer}
       * */
      strokeVariation : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 자획 유형 
       * @type {boolean}
       * */
      aramStyle : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 글자형 
       * @type {boolean}
       * */
      letterform : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * 중간선 
       * @type {boolean}
       * */
      mideline : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      /** 
       * X 높이
       * @type {integer} 
       * */
      xHeight : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    }
  }
  const Idx = Object.values(FamilyType).find((key) => key === data.typeinfo.familyType);
  data.typeinfo.familyType = Object.values(FamilyType)[Idx];
  // if(hasDefault) {
  //   data.default_font = {
  //     length : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
  //   }
  //   data.default_font.name = new TextDecoder("utf-16le").decode(new Uint8Array(content.slice(c.pos, c.move(2 * data.default_font.length))));
  //   data.isEmbedded = 1;
  // } else {
  //   data.isEmbedded = 0;
  // }
  data.isEmbedded = 0;
  // console.log('FACE_NAME', data);
  return data;
}

/**
 * 테두리/배경
 * borderFills
 * @param content 
 */
export const BORDER_FILL = (content: HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  const data:any = {
    threeD : Bit(attr, 0, 0),
    shadow : Bit(attr, 1, 1),
    slash : {
      /** 
       * CENTER : 중심선
       * CENTER_BELOW : 중심선 + 중심선 아래선
       * CNETER_ABOVE : 중심선 + 중심선 위선
       * ALL : 중심선 + 아래선 + 중심선 위선
       */
      type : Bit(attr, 2, 4),
      /** 꺾인 대각선 */
      Crooked : Bit(attr, 8,9),
      /** 대각선 역방향 여부(180 회전) */
      isCounter : Bit(attr, 11, 11),
    },
    backSlash : {
      /** 
       * CENTER : 중심선
       * CENTER_BELOW : 중심선 + 중심선 아래선
       * CNETER_ABOVE : 중심선 + 중심선 위선
       * ALL : 중심선 + 아래선 + 중심선 위선
       */
      type : Bit(attr, 5,7),
      /** 꺾인 대각선 */
      Crooked : Bit(attr, 10,10),
      /** 대각선 역방향 여부(180 회전) */
      isCounter : Bit(attr, 12, 12),
    },
    centerLine : Bit(attr, 13, 13),
    leftBorder : {
      type : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    rightBorder : {
      type : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    topBorder : {
      type : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    bottomBorder : {
      type : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    diagonal : {
      type : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    
  }; 
  /** 표일때만 사용 */
  // data.breakCellSeparateLine = null,
  const isFill = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint8(0);
  data.fillBrush = {}
  switch (isFill) {
    // 채우기 없음
    case 0x00000000:
      break;
    /** 면(단색) 채우기 */
    case 0x00000001:
      data.fillBrush.winBrush = {
        //배경색
        faceColor : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
        //무늬색
        hatchColor : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
        // 무늬 종류(0 ~ 6)
        alpha : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
      }
      break;
    /** 그라데이션 채우기(효과) */
    case 0x00000004:
      data.fillBrush.gradation = {
        // 그라데이션 유형
        type : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
        // 그라데이션 기울기
        angle : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
        // 그라데이션 가로 중심(중심 X 좌표)
        centerX : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
        // 그라데이션 가로 중심(중심 Y 좌표)
        centerY : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
        //그라데이션 번짐 정도
        step : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
        // 그라데이션 색상 수
        colorNum : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
      }
      if(data.colorNum > 2) {
        // 그라데이션 번짐 정도의 중심(0~100) hwpx
        // 색상이 바뀌는 곳의 위치(num이 2일 경우에만) 4 * num hwp
        data.fill.stepCenter = new DataView(new Uint8Array(content.slice(c.pos, c.move(4 + data.fillBrush.gradation.colorNum))).buffer, 0).getInt16(0, true);
        // 투명도 hwpx
        // 색상 hwp
        data.fill.alpha = new DataView(new Uint8Array(content.slice(c.pos, c.move(4 + data.fillBrush.gradation.colorNum))).buffer, 0).getInt16(0, true);
      }
      break;
    /** 이미지(그림) 채우기 */
    case 0x00000002:
      // 부정확함 나중에 ...
      data.fillBrush.imgBrush = {
        // mode : 
      }
      break;
    default:
      break;
  }
  return data;
}

/**
 * 모양
 * charPr
 * @param content 
 */
export const CHAR_SHAPE = (content:HwpBlob, version:number) => {
  const text_shape_attr = (shape:number) => {
    const data:any = {};
    // 기울임
    data.italic = Bit(shape, 0, 0);
    // 굵기
    data.bold = Bit(shape, 1, 1);
    data.outline = {
      type : false,
    }
    data.underline = {
      type : false,
    };
    switch (Bit(shape, 2, 3)) {
      case 0:
        data.underline.type = "NONE";
        break;
      case 1:
        data.underline.type = "BOTTOM";
        break;
      case 3:
        data.underline.type = "CENTER";
        break;
      default:
        break;
    }
    switch (Bit(shape, 4, 7)) {
      case 0:
        data.underline.shape = "solid";
        break;
      case 1:
        data.underline.shape = "dashed";
        break;
      case 2:
        data.underline.shape = "dotted";
        break;
      case 3:
        data.underline.shape = "dotted";
        break;
      case 4:
        data.underline.shape = "dotted";
        break;
      case 5:
        data.underline.shape = "dotted";
        break;
      case 6:
        data.underline.shape = "dotted";
        break;
      case 7:
        data.underline.shape = "second";
        break;
      case 8:
        data.underline.shape = "double";
        break;
      case 9:
        data.underline.shape = "double";
        break;
      case 10:
        data.underline.shape = "double";
        break;
      case 11:
        data.underline.shape = "wavy";
        break;
      case 12:
        data.underline.shape = "wavy";
        break;
      case 13:
        data.underline.shape = "bold 3d";
        break;
      case 14:
        data.underline.shape = "bold 3d(liquid)";
        break;
      case 15:
        data.underline.shape = "3d monorail";
        break;
      case 16:
        data.underline.shape = "3d monorail(liquid)";
        break;
      default:
        break;
    }
    switch (Bit(shape, 8, 10)) {
      case 0:
        //없음
        data.outline.type = "없음";
        break;
      case 1:
        //실선
        data.outline.type = "SOLID";
        break;
      case 2:
        //점선
        data.outline.type = "DOT";
        break;
      case 3:
        //굵은 실선(두꺼운 선)
        data.outline.type = "DASH";
        break;
      case 4:
        //파선(긴 전선)
        data.outline.type = "DASH_DOT";
        break;
      case 5:
        //일점쇄선
        data.outline.type = "DASH_DOT_DOT";
        break;
      case 6:
        //이점쇄선
        data.outline.type = "-..-..-..";
        break;
    }
    data.shadow = {};
    // 그림자의 종류
    switch (Bit(shape, 11, 12)) {
      case 0:
        data.shadow.type = "NONE";
        break;
      case 1:
        // 개체와 분리된 그림자
        data.shadow.type = "DROP";
        break;
      case 2:
        // 개체와 연결된 그림자
        data.shadow.type = "CONTINUOUS";
        break;
    }
    // 양각
    data.emboss = Bit(shape, 13, 13);
    // 음각
    data.engrave = Bit(shape, 14, 14);
    // 위 첨자
    data.supscript = Bit(shape, 15, 15);
    // 아래 첨자
    data.subscript = Bit(shape, 16, 16);
    // Reserved
    data.reserved = Bit(shape, 17, 17);
    // 취소선 여부
    data.strikeout = {};
    data.strikeout.type = Bit(shape, 18, 20);
    // 강조점
    switch (Bit(shape, 21, 24)) {
      case 0:
        // 없음
        data.emphasis = SymMark.NONE;
        break;
      case 1:
        // 검정 동그라미 강조점
        data.emphasis = "&#x307;";
        break;
      case 2:
        // 속 빈 동그라미 강조점
        data.emphasis = "empty circle";
      case 3:
        data.emphasis = "ˇ";
      case 4:
        data.emphasis = "˜";
      case 5:
        data.emphasis = " ･";
      case 6:
        data.emphasis = ":";
        break;
    }
    switch (Bit(shape, 21, 24)) {
      case 0:
        data.strikeout.shape = "solid";
        break;
      case 1:
        data.strikeout.shape = "long dot";
        break;
      case 2:
        data.strikeout.shape = "dot";
        break;
      case 3:
        data.strikeout.shape = "-.-.-.-.";
        break;
      case 4:
        data.strikeout.shape = "-..-..-..";
        break;
      case 5:
        data.strikeout.shape = "long dash loop";
        break;
      case 6:
        data.strikeout.shape = "big dot loop";
        break;
      case 7:
        data.strikeout.shape = "second";
        break;
      case 8:
        data.strikeout.shape = "solid bold";
        break;
      case 9:
        data.strikeout.shape = "bold solid";
        break;
      case 10:
        data.strikeout.shape = "solid bold solid";
        break;
      case 11:
        data.strikeout.shape = "wave";
        break;
      case 12:
        data.strikeout.shape = "wave second";
        break;
      case 13:
        data.strikeout.shape = "bold 3d";
        break;
      case 14:
        data.strikeout.shape = "bold 3d(liquid)";
        break;
      case 15:
        data.strikeout.shape = "3d monorail";
        break;
      case 16:
        data.strikeout.shape = "3d monorail(liquid)";
        break;
      default:
        break;
    }
    data.useKerning = Bit(shape, 30, 30);
    // console.log("CHARACTER_SHAPE", data);
    return data;
  }
  // const 
  const size = content.length;
  const c = new Cursor(0);
  const data:any = {
    /**
     * 50~200
     */
    // 언어별 글꼴
    fontRef : {
      hangul : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      latin : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      hanja : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      japanese : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      other : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      symbol : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      user : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    },
    // 언어별 장평
    ratio : {
      hangul : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      latin : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      hanja : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      japanese : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      other : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      symbol : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      user : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    },
    // 언어별 자간
    spacing : {
      hangul : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      latin : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      hanja : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      japanese : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      other : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      symbol : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      user : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
    },
    // 언어별 상대 크기
    relSz : {
      hangul : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      latin : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      hanja : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      japanese : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      other : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      symbol : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
      user : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    },
    // 언어별 글자 위치
    offset : {
      hangul : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      latin : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      hanja : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      japanese : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      other : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      symbol : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
      user : new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0),
    },
    // 기준 크기
    standard_size : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
  }
  data.shadow = {};
  // 속성
  const font_attr = text_shape_attr(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
  
  // data = {
  //   // ...text_shape_attr(font_attr),
  //   ...data,
  // }
  // 그림자 간격
  data.shadow.offsetX = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0);
  data.shadow.offsetY = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0);
  //글자 색
  data.textColor =  RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
  //밑줄 색
  if(font_attr.underline.type !== "NONE") {
    data.underline = {};
    data.underline = font_attr.underline;
    data.underline.color = RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
  } else {
    c.move(4);
  }
  //음영 색
  data.shadeColor = RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
  //그림자 색
  if(font_attr.shadow.type !== "NONE") {
    data.shadow = font_attr.shadow;
    data.shadow.color = RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
  } else {
    delete data.shadow;
    c.move(4);
  }
  if(version >= 5021) {
    //글자 테두리/배경 ID
    data.borderFillIDRef = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  }
  if(version >= 5030) {
    //취소선 색
    if(font_attr.strikeout.type) {
      data.strikeout.color = RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
    }
  }
  return data;
}

/**
 * TAB_DEF
 * 탭 정보
 * @param {Uint8Array} content
 */
export const TAB_DEF = (content:HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  const count = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt16(0, true);
}
/**
 * NUMBERING
 * 탭 정보
 * @param {Uint8Array} content
 */
export const NUMBERING = (content:HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
}
/**
 * 문단 모양(표 43 참조)
 * @length 54
 * @level 1
 * @param {Uint8Array} content
 */
export const BULLET = (content:HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
}
/**
 * 문단 모양(표 43 참조)
 * @length 54
 * @level 1
 * @param {Uint8Array} content
 */
export const PARA_SHAPE = (content:HwpBlob) => {
  const size = content.length;
  const c = new Cursor(0);
}

/**
 * 스타일(표 47 참조)
 * @length 54
 * @level 1
 * @param {Uint8Array} content
 * @returns {Style}
 */
export const STYLE = (content:HwpBlob) => {
  const c = new Cursor(0);
  const size = content.length;
  const styleSize = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  const data:any = {};

  data.local.name = new TextDecoder("utf-16le").decode(new Uint8Array(content.slice(c.pos, c.move(2 * styleSize))));
  data.en.size = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  data.en.name = new TextDecoder("utf-16le").decode(new Uint8Array(content.slice(c.pos, c.move(2 * data.en.size))));
  data.property = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0);
  data.next_style_id = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  data.lang_id = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  data.para_shape_id = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  data.char_shape_id = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  data.unknown = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  // console.log("STYLE", data);
  return data;
}
/**
 * 문서 임의의 데이터(표 49 참조)
 * @length 54
 * @level 1
 * @param {Uint8Array} content
 */
export const DOC_DATA = (content:HwpBlob) => {
}
