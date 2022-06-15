import CFB from "cfb";
import { LineType, LineType1, LineType2, LineType3, NumberType1 } from "../hwpx/type/xml";
import { Cursor } from "./cursor";
import { Char, CTRL_ID, HwpBlob } from "./type"
import { COLD_DEFINE, SECTION_DEFINE } from "./util/CtrlID"
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
 * @returns {boolean}
 */
export const Flags = (bits:number, position:number):boolean => {
  const mask = 1 << position;
  return (bits & mask) === mask;
}

/**
 * 
 * @param value 
 * @returns {type, compress, status}
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
 * @returns {number}
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
 * @byte 32byte
 * @length 4
 * @returns {String #RRGGBB}
 */
export const RGB = (value:number) => {
  let [R, G, B] = [ Bit(value, 0, 7), Bit(value, 8, 15), Bit(value, 16, 24)];
  if(R === 511) R = 255;
  if(G === 511) G = 255;
  if(B === 511) B = 255;
  return `#${[
    R.toString(16).padStart(2, '0'),
    G.toString(16).padStart(2, '0'),
    B.toString(16).padStart(2, '0'),
  ].join("")}`
}

/**
 * Uint8Array -> hex
 * @param buffer 
 * @returns {hex String}
 */
export const buf2hex = (buffer: HwpBlob):string => {
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
 * 개체 공통 속성
 * @returns Object
 */
export const OBJECT_COMMON_ATTRIBUTE = (content: HwpBlob) => {
  const c = new Cursor(0);
  const ctrlId = new TextDecoder("utf8").decode((content as any).slice(c.pos, c.move(4)).reverse());
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  
  // 글자처럼 취급 여부
  const like_letters = Bit(attr, 0, 0);
  // 예약
  const reservation = Bit(attr, 1, 1);
  // 줄 간격에 영향을 줄지 여부
  const line_spacing_influence = Bit(attr, 2, 2);
  // 세로 위치의 기준(VertRelTo)
  const VertRelTo = Bit(attr, 3, 4) === 0 ? "PAPER" : Bit(attr, 3, 4) === 1 ? "PAGE" : "PARA";
  // 세로 위치의 기준에 대한 상대적인 배열 방식
  const VertRelTo_relative = Bit(attr, 5, 7);
  // 가로 위치의 기준(HorzRelTo)
  const HorzRelTo = Bit(attr, 8, 9) === 2 ? "COLUMN" : Bit(attr, 8, 9) === 3 ? "PARA" : "PAGE";
  // HorzRelTo에 대한 상대적인 배열 방식
  const HorzRelTo_relative = Bit(attr, 10, 12);
  // VertRelTo이 'para'일 때 오브젝트의 세로 위치를 본문 영역으로 제한할지 여부
  const VertRelTo_para = Bit(attr, 13, 13) === 0 ? "off" : "on";
  // 다른 오브젝트와 겹치는것을 허용할지 여부(오브젝트의 위치가 본문 영역으로 제한 되면 언제나 false로 간주한다)
  const overlap = Bit(attr, 14, 14);
  // 오브젝트의 폭의 기준
  const HorzRelTo_width = Bit(attr, 15, 17);
  // 오브젝트의 높이의 기준
  const VertRelTo_height = Bit(attr, 18, 29);
  // VertRelTo이 Para일 때 크기 보호 여부
  const size_protect = Bit(attr, 20, 20) === 0 ? "off" : "on";
  // 오브젝트 주위를 텍스트가 어떻게 흘러갈지 지정하는 옵션
  const text_flow = Bit(attr, 21, 23);
  // 오브젝트 좌/우 어느쪽에 글을 배치할지 지정하는 옵션
  const text_align = Bit(attr, 24, 25);
  // 이 개체가 속하는 번호 범주
  let numberingType = "NONE";
  switch (Bit(attr, 26, 28)) {
    // NONE
    case 0:
      numberingType = "NONE";
      break;
    // PICTURE(figure)
    case 1:
      numberingType = "PICTURE";
      break;
    // TABLE(table)
    case 2:
      numberingType = "TABLE";
      break;
    // EQUATION(equation)
    case 3:
      numberingType = "EQUATION";
      break;
    default:
      break;
  }
  
  /** 세로/가로 오프셋값 */
  const offset = {
    // 세로 오프셋 값
    vertical : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    // 가로 오프셋 값
    horizontal : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
  };
  /** 오브젝트 넓이/높이 */
  const object = {
    // 오브젝트 넓이
    width : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
    // 오브젝트 높이
    height : new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
  };
  /** zIndex(zOrder) */  
  const zOrder = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true);
  /** 오브젝트의 바깥 4방향 여백 */
  const margin = {
    // 아래
    bottom : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    // 위
    left : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    // 오른쪽
    right : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    // 왼쪽
    top : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  };
  /** 문서 내 각 개체에 대한 고유 아이디(instance ID) */
  const instance_id = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  /** 쪽 나눔 방지 on(1) / off(0) */
  const pageDivde = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  /** 개체 설명문 글자 길이(len) */
  // len : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  return {
    // 객체를 식별하기 위한 아이디
    id : "",
    // z-order
    zOrder: zOrder,
    // 이 객체가 속하는 번호 범위
    numberingType: numberingType,
    /**
     * 오브젝트 주위를 텍스트가 어떻게 흘러갈지 정하는 옵션
     * 하위 요소 pos 속성 중 "treatAsChar"이 "false" 일 때에만 사용
     */
    textWrap: "",
    /**
     * 오브젝트 좌/우 어느쪽에 글을 배치할지 지정하는 옵션
     * textWrap 속성이 "SQUARE" 또는 "TIGHT" 또는 "THROUGH" 일 때에만 사용
     */
    textFlow: "",
    // 객체 선택 가능 여부
    lock: "",
    // 크기 정보
    sz: {
      // 오브젝트 폭
      width: "",
      // 오브젝트 폭의 기준
      widthRelTo: "",
      // 오브젝트 높이
      height: "",
      // 오브젝트 높이의 기준
      heightRelTo: "",
      // 크기 보호 여부
      protect: "",
    },
    // 위치 정보
    pos: {
      // 글자처럼 취급 여부
      treatAsChar: "",
      /**
       * 줄 간격에 영향을 줄지 여부
       * 하위 요소 RelativeTo의 속성 중 "vertical"이 "PARA" 일 때에만 사용
       */
      flowWithText: "",
      /**
       * 다른 오브젝트와 겹치는 것을 허용할지 여부
       * treatAsChar 속성이 "false" 일 때에만 사용
       * flowWithText 속성이 "true"이면 무조건 "false"로 간주함
       */
      allowOverlap: "",
      // 객체와 조판 부호를 항상 같은쪽에 놓을지 여부
      holdAnchorAndSO: "",
      /**
       * 세로 위치의 기준
       * treatAsChar 속성이 "false" 일 때에만 사용
       */
      vertRelTo: "",
      /**
       * 가로 위치의 기준
       * treatAsChar 속성이 "false" 일 때에만 사용
       */
      horzRelTo: "",
      /**
       * vertRelTo에 대한 상대적인 배열 방식
       * vertRelTo의 값에 따라 가능한 범위가 제한됨
       * TOP : 위 (vertRelTo="PAPER" | "PAGE" | "PARA")
       * CENTER : 가운데 (vertRelTo="PAPER" | "PAGE")
       * BOTTOM : 아래 (vertRelTo="PAPER" | "PAGE")
       * INSIDE : 안쪽 (vertRelTo="PARA" | "PAGE")
       * OUTSIDE : 바깥쪽 (vertRelTo="PARA" | "PAGE")
       */
      vertAlign:"",
      // horzRelTo에 대한 상대적인 배열 방식
      horzAlign:"",
      // vertRelTo와 vertAlign을 기준점으로 한 상대적인 오프셋 값, 단위는 HWPUINT
      vertOffset:"",
      // horzRelTo와 horzAlign을 기준점으로 한 상대적인 오프셋 값, 단위는 HWPUINT
      horzOffset:"",
    },
    // 바깥 여백
    outMargin: {},
    // 캡션
    caption: {},
    /**
     * 주석
     * 요소의 값으로 주석 내용을 가짐
     * 해당 요소의 추가적인 설명은 생략
     */
    shapeComment: "",
  }
}
/**
 * 개체 공통 속성
 * @returns boolean
 */
export const isCommon = (object:any) => {
  return [CTRL_ID.tbl, CTRL_ID.line, CTRL_ID.rec, CTRL_ID.ell, CTRL_ID.arc, CTRL_ID.pol, CTRL_ID.cur, CTRL_ID.eqed, CTRL_ID.cur, CTRL_ID.pic, CTRL_ID.ole, CTRL_ID.con, CTRL_ID.gso].includes(object);
}
/**
 * 개체 요소 속성
 */
 export const isElement = (object:any) => {
  return [CTRL_ID.line, CTRL_ID.rec, CTRL_ID.ell, CTRL_ID.arc, CTRL_ID.pol, CTRL_ID.cur, CTRL_ID.eqed, CTRL_ID.cur, CTRL_ID.pic, CTRL_ID.ole, CTRL_ID.con, CTRL_ID.gso].includes(object);
}

/**
 * setWidth
 * @param {number} width
 * @returns {number + "mm"}
 */
export const setWidth = (width:number):number => {
  switch(width) {
    case 0:
      return 0.1;
    case 1:
      return 0.12;
    case 2:
      return 0.15;
    case 3:
      return 0.2;
    case 4:
      return 0.25;
    case 5:
      return 0.3;
    case 6:
      return 0.4;
    case 7:
      return 0.5;
    case 8:
      return 0.6;
    case 9:
      return 0.7;
    case 10:
      return 1.0;
    case 11:
      return 1.5;
    case 12:
      return 2.0;
    case 13:
      return 3.0;
    case 14:
      return 4.0;
    case 15:
      return 5.0;
  }
}

/**
 * 대각선 종류
 * @param {number} type
 * @returns {string} Slash | BackSlash | CrookedSlash
 */
export const diagonalType = (type:number):string => {
  switch(type) {
    case 0:
      return "Slash";
    case 1:
      return "BackSlash";
    case 2:
      return "CrookedSlash";
  }
}
/**
 * 테두리 종류 / 채움 종류
 * @table 표25
 * @param {number} type
 * @returns {string} LineType
 * @reserch 문서와 값이 맞지 않음. 확인 필요 NONE이 0인데 0이 SOLID로 나와있음. 몰라서 그냥 +1씩 함.
 */
export const borderType = (type:number):LineType => {
  switch(type) {
    case 0:
      return LineType3.NONE
    case 1:
      return LineType3.SOLID;
    case 2:
      return LineType3.DASH;
    case 3:
      return LineType3.DOT;
    case 4:
      return LineType3.DASH_DOT;
    case 5:
      return LineType3.DASH_DOT_DOT;
    case 6:
      return LineType3.LONG_DASH;
    case 7:
      return LineType3.CIRCLE;
    case 8:
      return LineType3.DOUBLE_SLIM;
    case 10:
      return LineType3.SLIM_THICK;
    case 11:
      return LineType3.THICK_SLIM;
    case 12:
      return LineType3.SLIM_THICK_SLIM;
    case 13:
      return LineType3.WAVE;
    case 14:
      return LineType3.DOUBLE_WAVE;
    default:
      return LineType3.NONE
  }
}
/**
 * 채우기 종류
 * @value 0x00000000 : 채우기 없음
 * @value 0x00000001 : 단색 채우기
 * @value 0x00000002 : 이미지 채우기
 * @value 0x00000004 : 그러데이션 채우기
 * @param type 
 * @returns {0 : 없음, 1 : 단색 채우기, 2 : 이미지 채우기, 4: 그라데이션 채우기}
 */
export const isFillType = (type:number):0 | 1 | 2 | 4 => {
  return type as any;
  console.log('isFillType', type);
  if(type === 0x00000000) {
    return 0;
  }
  if((type & 0x00000001) != 0) {
    return 0;
  }else if((type & 0x00000002) != 0) {
    return 2;
  }else if((type & 0x00000004) != 0) {
    return 4;
  }
}

/**
 * 탭의 종류
 * @type UINT8
 * @returns { LEFT :  왼쪽, RIGHT : 오른쪽, CENTER: 가운데, DECIMAL : 소수점}
 */
export const tabType = (type:number):"LEFT" | "RIGHT" | "CENTER" | "DECIMAL" => {
  switch(type) {
    case 0:
      return "LEFT";
    case 1:
      return "RIGHT";
    case 2:
      return "CENTER";
    case 3:
      return "DECIMAL";
  }
}

/**
 * @header { paraHead } 문단 머리 정보 속성
 * 문단의 머리 정보 속성
 * @returns { align, useInstWidth, autoIndent, textOffset}
 */
export const paraHeadType = (attr:number) => {
  return {
    /** 문단의 정렬 종류 */
    align:  Bit(attr, 0, 1) === 0 ? "LEFT" : Bit(attr, 0, 1) === 1 ? "CENTER" : "RIGHT",
    /** 번호 너비를 실제 인스턴스 문자열의 너비에 따를지 여부 */
    useInstWidth : Bit(attr, 2, 2) === 0 ? 0 : 1,
    /** 자동 내어 쓰기 여부 */
    autoIndent : Bit(attr, 3, 3) === 0 ? 0 : 1,
    /** 수준별 본문과의 거리 종류 */
    textOffsetType : Bit(attr, 4, 4) === 0 ? "PERCENT" : "HWPUINT",
  } 
}

/**
 * @numformat 속성
 * @return { NumberType1 }
 */
export const numFormatType = (attr:number) => {
  return Object.keys(NumberType1).find((type, i) => {
    if(i === attr) {
      return type;
    }
  });
}


/**
 * ParaShape(paraproperty) 속성 1
 * 문단 모양 속성
 * 표 44 참조
 */
export const paraShapeType = (attr:number) => {
  const attribute:any = {
    // 편집 용지의 줄 격자 사용 여부
    snapToGrid: Bit(attr, 8, 8),
    // 문단 머리 모양 설정 정보
    // 아이디를 가져오는 위치를 모르겠음
    heading:{},
    // 정렬
    align: {},
    // 문단 줄 나눔 설정
    breakSetting: {},
    // 문단 여백 설정
    margin: {},
    // 줄 간격 설정
    lineSpacing: {},
    // 문단 테두리 설정
    border: {},
    // 문단 자동 간격 조절 설정
    autoSpacing: {},
  }
  switch (Bit(attr, 0, 1)) {
    case 0:
      // 글자에 따라
      attribute.lineSpacing.type = "PERCENT"
      break;
    case 1:
      // 고정 값
      attribute.lineSpacing.type = "FIXED"
      break;
    case 2:
      // 여백만 지정
      attribute.lineSpacing.type = "BETWEEN_LINES"
      break;
      // AT_LEAST(최소) 가 있는데 5.X에는 없음
  }
  switch (Bit(attr, 2, 4)) {
    case 0:
      // 양쪽 정렬
      attribute.align.horizontal = "JUSTIFY";
    case 1:
      // 왼쪽 정렬
      attribute.align.horizontal = "LEFT";
      break;
    case 2:
      // 오른쪽 정렬
      attribute.align.horizontal = "RIGHT";
      break;
    case 3:
      // 가운데 정렬
      attribute.align.horizontal = "CENTER";
      break;
    case 4:
      //배분 정렬
      attribute.align.horizontal = "DISTRIBUTE"; 
      break;
    case 5:
      //나눔 정렬(공백에만 배분)
      attribute.align.horizontal = "DISTRIBUTE_SPACE";
      break;
  }
  switch (Bit(attr, 5, 6)) {
    case 0:
      // 단어
      attribute.breakSetting.breakLatinWord = 'KEEP_WORD';
      break;
    case 1:
      // 하이픈
      attribute.breakSetting.breakLatinWord = 'HYPHENATION';
      break;
    case 2:
      // 글자
      attribute.breakSetting.breakLatinWord = 'BREAK_WORD';
      break;
  };
  // 라틴 문자 이외의 문자의 줄나눔 단위
  attribute.breakNonLatinWord = Bit(attr, 7, 7) === 0 ? 'KEEP_WORD' : 'BREAK_WORD';
  // 공백 최소값, 단위는 %
  attribute.condense = Bit(attr, 9, 15);
  // 외톨이줄 보호 여부
  attribute.windowOrphan = Bit(attr, 16, 16);
  // 다음 문단과 함께 여부
  attribute.keepWithNext = Bit(attr, 17, 17);
  // 문단 보호 여부
  attribute.keepLines = Bit(attr, 18, 18);
  // 문단 앞에서 항상 쪽 나눔 여부
  attribute.pageBreakBefore = Bit(attr, 19, 19);

  // 세로 정렬 방식
  switch (Bit(attr, 20, 21)) {
    case 0:
      // 글꼴 기준
      attribute.align.vertical = 'BASELINE';
      break;
    case 1:
      // 위쪽
      attribute.align.vertical = 'TOP';
      break;
    case 2:
      // 가운데
      attribute.align.vertical = 'MIDDLE';
      break;
    case 3:
      // 아래
      attribute.align.vertical = 'BOTTOM';
      break;
  };
  // 글꼴에 어울리는 줄 높이 사용 여부
  attribute.fontLineHeight = Bit(attr, 22, 22);
  switch (Bit(attr, 23, 24)) {
    case 0:
      attribute.heading.type = 'NONE';
      break;
    case 1:
      attribute.heading.type = 'OUTLINE';
      break;
    case 2:
      attribute.heading.type = 'NUMBER';
      break;
    case 3:
      attribute.heading.type = 'BULLET';
      break;
  };
  // 문단 단계(문단 수준 1수준 ~ 7수준)
  attribute.heading.level = Bit(attr, 25, 27);
  // 문단 테두리 연결 여부
  attribute.border.connect = Bit(attr, 28, 28);
  // 문단 테두리 여백 무시 여부
  attribute.border.ignoreMargin = Bit(attr, 29, 29);
  // 문단 꼬리 모양
  attribute.paragraph_tail_shape = Bit(attr, 30, 30);
  return attribute;
}