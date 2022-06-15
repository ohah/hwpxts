import { XMLBuilder } from "fast-xml-parser";
import { SecPR } from "../../hwpx/type/section";
import { FamilyType, LineType1 } from "../../hwpx/type/xml";
import { Cursor } from "../cursor";
import { HwpBlob, SymMark } from "../type";
import { Bit, borderType, buf2hex, Flags, isFillType, numFormatType, paraHeadType, paraShapeType, RGB, setWidth, tabType } from "../util";

/**
 * 문서 속성
 * @param {Uint8Array} content
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
 * @param {Uint8Array} content
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
 * @param {Uint8Array} content
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
 * @param {Uint8Array} content
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
      type : borderType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    rightBorder : {
      type : borderType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    topBorder : {
      type : borderType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    bottomBorder : {
      type : borderType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    diagonal : {
      type : borderType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      width : setWidth(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0)),
      color : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
    },
    
  }; 
  /** 표일때만 사용 */
  // data.breakCellSeparateLine = null0
  /** 
   * 채우기 종류(type) 
   * 0x00000000 : 채우기 없음
   * 0x00000001 : 단색 채우기
   * 0x00000002 : 이미지 채우기
   * 0x00000004 : 그러데이션 채우기
   * */
  const isFill = isFillType(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint8(0));
  if(isFill) data.fillBrush = {};
  switch (isFill) {
    // 채우기 없음
    case 0:
      break;
    /** 면(단색) 채우기 */
    case 1:
      data.fillBrush.winBrush = {
        //배경색
        faceColor : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
        //무늬색
        hatchColor : RGB(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true)),
        /**
         * 무늬 종류(0 ~ 6)
         * @research -1이 나옴. 기본 테두리에서. 왜인지는 모름 hwpx 기준으론 1이 기본값
         */
        alpha : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
      }
      break;
    /** 그라데이션 채우기(효과) */
    case 4:
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
    case 2:
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
 * @param {Uint8Array} content
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
  if(count === 0) {
    // autoTab = new DataView(new Uint8Array(content.slice(5, 6)).buffer, 0).getUint8(0);
    return {
      autoTabLeft : Bit(attr, 0, 0) ? 1 : 0,
      autoTabRight : Bit(attr, 0, 1) ? 1 : 0,
    }
  } else if(count === 1) {
    const pos = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint16(0, true);
    const type = tabType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0));
    const leader = borderType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0));
    return {
      autoTabLeft : Bit(attr, 0, 0) ? 1 : 0,
      autoTabRight : Bit(attr, 0, 1) ? 1 : 0,
      /**
       * @prfix hh
       * @pos {hwpUNIT}
       */
      tabItem : {
        pos : pos,
        type : type,
        leader : leader,
      }
    }
  } else {
    const tabItems = [];
    for(let i = 0; i < count; i++) {
      const pos = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint16(0, true);
      const type = tabType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0));
      const leader = borderType(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getInt8(0));
      tabItems.push({
        pos : pos,
        type : type,
        leader : leader,
      });
      c.move(2);
    }
    return {
      autoTabLeft : Bit(attr, 0, 0) ? 1 : 0,
      autoTabRight : Bit(attr, 0, 1) ? 1 : 0,
      /**
       * @prfix hh
       * @pos {hwpUNIT}
       * @a
       */
      tabItem : tabItems
    }
  }
}
/**
 * NUMBERING
 * 탭 정보
 * TODO : numFormat, checkable,  level 8 ~ 10 등 해결 안된것이 많음
 * @param {Uint8Array} content
 */
export const NUMBERING = (content:HwpBlob, version:number) => {
  const size = content.length;
  const c = new Cursor(0);
  var start = c.pos;
  try {
    // c.move(12);
    /** 7회 반복
     * @level {number} 1 ~ 7
     * @content 각 레벨에 해당하는 숫자 또는 문자 또는 기호를 표시
     */
    for (let i = 0; i < 7; i++) {
      /** 속성 */
      const paraHead = paraHeadType(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
      /** 너비 보정값(너비 조정) */
      const widthAdjust = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
      /** 본문과의 거리(단위 종류 PERCENT / HWPUNIT) */
      const textOffset = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
      /** 글자모양 아이디 참조값 */
      const charPrIDRef = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
      /** 번호 형식 길이(len) */
      // console.log('c', c.pos, paraHead, widthAdjust, textOffset, charPrIDRef);
      const level = i + 1;
      const len = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
      // console.log('len', len);
      const WChar = new Uint8Array(content.slice(c.pos, c.move(2 * len)));
      // console.log('WChar', new TextDecoder('utf-16le').decode(WChar));
    }
    // ((4×7) + (2×len))×3
    // ((4×7) + (2×len))×3
    // (2 + (2xlen)) * 3
    // 2 + ((4 x 7) + 2 + (2 x len)) * 3
    const numFormat = numFormatType(new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true));
    // console.log('numFormat', numFormat);
    if(version >= 5025) {
      // console.log('여기 돌린단 뜻인데?');
      for (let i = 0; i < 7; i++) {
        const level = i + 1;
        const start = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
        // console.log('level', level, start)
      }
      for (let k = 0; k < 3; k++) {
        // 값을 읽으면 8인데 실제 배열 크기는 6이다. 그래서 - 2를 해준다??
        const len2 = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true) - 2;        
        const level = k + 8;
        const WChar = new Uint8Array(content.slice(c.pos, c.move(2 * len2)));
        // console.log('hex', buf2hex(content.slice(c.pos, c.move(2 * len2))));
        // console.log('WChar3', new TextDecoder('utf-16le').decode(WChar), c.pos);
        // c.move(12)
      }
    }
    for (let i = 0; i < 3; i++) {
      if(version >= 5100) {
        const startNumber = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
        // console.log('startNum', startNumber)
        // console.log('확장startNum', startNumber);
      }
    }
  } catch(e) {
    var end = c.pos;
    // console.log('numbering', e);
    // console.log('move', start, end, size)
  }
  var end = c.pos;
  // console.log('move', start, end, size)
  return {
    test : "tq",
  }
}
/**
 * 문단 모양(표 43 참조)
 * @length 54
 * @level 1
 * TODO : XML 문서에서 나오지 않음??
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
export const PARA_SHAPE = (content:HwpBlob, version:number) => {
  const size = content.length;
  const c = new Cursor(0);
  const attr = paraShapeType(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true));
  const data:any = {
    ...attr,
    margin: {
      ...attr.margin,
      // 왼쪽 여백
      left: {
        value: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
        unit: "HWPUINT",
      },
      // 오른쪽 여백
      right: {
        value: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
        unit: "HWPUINT",
      },
      /**
       * 들여쓰기 / 내어쓰기
       * n이 0보다 크면 들여쓰기 n
       * n이 0이면 보통
       * n이 0보다 작으면 내어쓰기 n
       */
      intent: {
        value: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
        unit: "HWPUINT",
      },
      // 위쪽 문단 간격
      prev: {
        value: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
        unit: "HWPUINT",
      },
      // 아래쪽 문단 간격
      next: {
        value: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
        unit: "HWPUINT",
      }
    },
    // 탭 정의 아이디(TabDef ID) 참조 값
    tabPrIDRef: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint16(0, true),
    /**
     * 문단 모양 정보를 구별하기 위한 아이디
     * 번호 문단 ID(Numbering ID) 또는 글머리표 문단 모양 ID(Bullet ID) 참조 값
     */
    id: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint16(0, true),
    border: {
      ...attr.border,
      // 테두리/배경 모양 ID(테두리/배경 모양 아이디 참조값)
      borderFillIDRef: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint16(0, true),
      // 문단 테두리 왼쪽 간격(단위는 HWPUINT)
      offsetLeft: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      // 문단 테두리 오른쪽 간격(단위는 HWPUINT)
      offsetRight: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      // 문단 테두리 위쪽 간격(단위는 HWPUINT)
      offsetTop: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      // 문단 테두리 아래쪽 간격(단위는 HWPUINT)
      offsetBottom: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    }
  }  
  // 속성 2(표 40 참조)라고 써있지만 표 45(문단 모양 속성2) 참조
  if(version >= 5017) {
    const attr2 = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
    // 한 줄로 입력 여부
    const onlineuse = Bit(attr2, 0, 1);
    // Reserved
    const reserved = Bit(attr2, 2, 3);
    // 한글과 영어 간격을 자동 조절 여부
    data.autoSpacing.eAsianEng = Bit(attr2, 4, 4);
    // 한글과 숫자 간격을 자동 조절 여부
    data.autoSpacing.eAsianNum = Bit(attr2, 5, 5);
    data.attr2 = attr2;
  }
  // 속성3(표 41 참조)라고 써있지만 표 46(줄 간격 종류) 참조
  if(version >= 5025) {
    const attr3 = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
    const lineType = Bit(attr3, 0, 4);
    data.attr3 = attr3;
  }
  // 줄 간격
  if(version >= 5025) {
    switch (Bit(new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),0, 4)) {
      case 0:
        // 글자에 따라
        data.lineSpacing.type = "PERCENT"
        break;
      case 1:
        // 고정 값
        data.lineSpacing.type = "FIXED"
        break;
      case 2:
        // 여백만 지정
        data.lineSpacing.type = "BETWEEN_LINES"
        break;
      case 3:
        // AT_LEAST(최소)
        data.lineSpacing.type = "AT_LEAST"
    }
  }  
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
  /**
   * 스타일의 로컬 이름
   * 한글 윈도에서는 한글 스타일 이름
   */
  data.name = new TextDecoder("utf-16le").decode(new Uint8Array(content.slice(c.pos, c.move(2 * styleSize))));
  const enSize = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);  
  // 스타일의 영문 이름
  data.engName = new TextDecoder("utf-16le").decode(new Uint8Array(content.slice(c.pos, c.move(2 * enSize))));
  /**
   * 스타일 종류
   * PARA: 문단 스타일
   * CHAR: 글자 스타일
   */
  data.type = Bit(new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0), 0, 2) === 0 ? "PARA" : "CHAR";
  /**
   * 다음 스타일 아이디 참조 값
   * 문단 스타일에서 사용자가 리턴 키를 입력하여 다음 문단으로 이동하였을 때 적용될 문단 스타일을 지정함
   */
  data.nextStyleIDRef = new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0);
  /**
   * 언어 아이디
   * http://www.w3.org/WAI/ER/IG/ert/iso639.htm
   */
  data.langID = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  /**
   * 문단 모양 아이디 참조값
   * 스타일의 종류가 문단인 경우 반드시 지정해야함
   */
  data.paraPrIDRef = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  /**
   * 글자 모양 아이디 참조값
   * 스타일의 종류가 글자인 경우 반드시 지정해야함
   */
  data.charPrIDRef = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  /**
   * lockFrom(unknown)
   * 양식 모드에서 style 보호하기 여부
   * 5.0 문서에는 아예 언급이 없으나 hwpx 문서에는 있고 2바이트가 항상 있다. 아마도 이것으로 추정됨.
   */
  data.lockForm = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  return data;
}

/**
 * 메모 모양(5.0.2.1 이상)
 * 5.0 공식 문서에 없다..
 * @param {Uint8Array} content
 */
export const MEMO_SHAPE = (content:HwpBlob) => {
  const size = content.length;
  console.log('size', size);
  const c = new Cursor(0);
  /**
   * @id 메모 모양 정보를 구별하기 위한 아이디
   * @width 메모가 보이는 넓이 4
   * @lineType 메모의 선 종류 1
   * @lineColor 메모의 선 색 4
   * @fillColor 메모의 색 4
   * @activeColor 메모의 활성화 되었을때 색 4
   * @memoType 메모 변경 추적을 위한 속성 1
   * @lineWidth 메모의 라인 두께 4
   */
  return {
    // id: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    width: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    lineType: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    lineColor: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    fillColor: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    activeColor: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    memoType: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    lineWidth: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
  };
}

/**
 * 변경 추적 작성자(가변)
 * 모름
 * @param {Uint8Array} content
 * @level 1
 */
export const TRACK_CHANGE_AUTHOR = (content:HwpBlob) => {
}

/**
 * 변경 추적 내용 및 모양
 * 모름
 * @param {Uint8Array} content
 * @level 1
 */
export const TRACK_CHANGE = (content:HwpBlob) => {
}
/**
 * 문서 임의의 데이터(표 49 참조)
 * @length 54
 * @level 0
 * @param {Uint8Array} content
 */
export const DOC_DATA = (content:HwpBlob) => {
}

/** 
 * 금칙처리 문자
 * @param {Uint8Array} content
 * @level 0
 */
export const FORBIDDEN_CHAR = (content:HwpBlob) => {
}

/**
 * 호환 문서(표 54 참조)
 * @param {Uint8Array} content
 */
export const COMPATIBLE_DOCUMENT = (content:HwpBlob) => {
}

/**
 * 레이아웃 호환성(표 56 참조)
 * @param {Uint8Array} content
 * @level 1
 * @size 20
 */
export const LAYOUT_COMPATIBILITY = (content:HwpBlob) => {
}

/** 
 * 배포용 문서
 * @param {Uint8Array} content
 * @level 0
 * @size 256
 */
export const DISTRIBUTION_DOC_DATA = (content:HwpBlob) => {
}


/**
 * 변경 추적 정보
 * @param {Uint8Array} content
 * @level 1
 * @size 1032
 */
export const TRACKCHANGE = (content:HwpBlob) => {
  console.log('asdf');
}
