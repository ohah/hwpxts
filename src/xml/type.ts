import { LandScape } from "../hwpx/type/section";
import { LineType1, LineType2, LineWidth, NumberType2, RGBColorType } from "../hwpx/type/xml";
import { LineWrap } from "../type";

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
// export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type Range<start extends number, end extends number> = number & [start,end];

/**
 * @prefix hp
 * p(paragraph)
 */
export interface P {
  id? : number
  paraPrIDRef?: number
  styleIDRef?: number
  pageBreak?:number
  columBreak?:number
  merged?:number,
  paraTcId?:number,
  run?:Run[],
  linesegarray?:LineSegArray,
}
//<hp:linesegarray><hp:lineseg textpos="0" vertpos="0" vertsize="1000" textheight="1000" baseline="850" spacing="600" horzpos="0" horzsize="42520" flags="393216"></hp:lineseg></hp:linesegarray>
export interface LineSegArray {
  lineseg:LineSeg[]
}

/**
 * @prefix hp
 * lineseg
 */
export interface LineSeg {
  textpos?:number
  vertpos?:number
  vertsize?:number
  textheight?:number
  baseline?:number
  spacing?:number
  horzpos?:number
  horzsize?:number
  flags?:number
}

/**
 * textWrap
 * 오브젝트 주위를 텍스트가 어떻게 흘러갈지 정하는 옵션
 * 하위요소 pos의 속성 중 "treatAsChar"이 "false" 일 때만 사용
 */
export type TextWrap = "SQUARE" | "TIGHT" | "THROUGH" | "TOP_AND_BOTTOM" | "BEHIND_TEXT" | "IN_FRONT_OF_TEXT"
/**
 * TextFlow
 * 오브젝트의 좌우 어느 쪽에 글을 배치할지 정하는 옵션
 * textWrap 속성이 "SQUARE" 또는 "TIGHT" 또는 "THROUGH" 일 때에만 사용
 * @defalut BOTH_SIDES
 */
export type TextFlow = "BOTH_SIDES" | "LEFT_ONLY" | "RIGHT_ONLY" | "LARGEST_ONLY"

/**
 * 기본도형객체(137 p)
 * @param { number } id
 * @param { number } zOrder
 * @param { NumberingType } numberingType 이 객체가 속하는 번호 범위
 * @param { boolean } lock 객체 선택 가능 여부
 * @param { TextFlow } textFlow
 * @param { TexWrap } textWrap
 * @param { DropCapStyleType } dropCapStyle 
 * @param { Sz } sz 크기 정보
 * @param { Pos } pos 위치정보
 * @param { outMargin } outMargin 바깥 여백
 * @param { caption } Caption 캡션
 * @param { string } 주석
 */
export interface ShapeObjectType {
  id:number
  zOrder:number
  numberingType:NumberingType
  textFlow:TextFlow
  textWrap:TextWrap
  lock:boolean
  dropcapstyle: DropCapStyleType
  sz:Sz
  pos:AbstractShapeObjectType
  outMargin:OutMargin
  caption:Caption
  shapeComment:string   
}

/**
 * @name 위치정보
 * @param { number } width 오브젝트 폭
 * @param { number } widthRelTo 오브젝트 폭의 기준 @default ABSOLUTE
 * @param { number } height 오브젝트 높이
 * @param { number } heightRelTo 오브젝트 높이의 기준 @default ABSOLUTE
 * @param { boolean } protect 크기 보호 여부 @default false
 */
export interface Sz {
  width:number
  widthRelTo:number
  height:number
  heightRelTo:number
  protect:boolean
} 


export interface AbstractShapeComponentType extends AbstractShapeObjectType {
  /**
   * 하이퍼링크 속성
   */
  href:string
  /**
   * 그룹핑 횟수
   */
  groupLevel:number
  /**
   * 객체 아이디
   */
  instid:number
  /**
   * 객체가 속한 그룹내에서의 오프셋 정보
   */
  offset: {
    x:number
    y:number
  },
  /**
   * 객체 생성시 최초 크기
   */
  orgSz: {
    /**
     * 객체 생성시 최초 폭, 단위는 HWPUINT  
     */
    width:number
    /**
     * 객체 생성시 최초 높이, 단위는 HWPUINT
     */
    height:number
  },
  /**
   * 객체의 현재 크기
   */
  curSz: {
    /**
     * 객체의 현재 폭, 단위는 HWPUINT
     */
    width:number
    /**
     * 객체의 현재 높이, 단위는 HWPUINT
     */
    height:number
  },
  /** 객체가 뒤집어진 상태인지 여부 */
  filp:{
    /**
     * 좌우로 뒤집어진 상태인지 여부
     */
    horizontal:boolean
    /**
     * 상하로 뒤집어진 상태인지 여부
     */
    vertical:boolean
  }
  /** 객체 회전 정보 */
  rotationInfo: {
    /** 
     * 회전각
     * @default 0
     */
    angle:number
    /** 회전 중심의 x 좌표 */
    centerX:number
    /** 회전 중심의 y 좌표 */
    centerY:number
    /** 이미지 회전 여부 */
    ratateImage:boolean
  },
  /* 객체 렌더링 정보 */
  renderingInfo:{
    /* Translation Matirx */
    transMatrix:any
    /* Scaling Matirx */
    scaMatrix:any
    /* Rotation Matirx */
    rotMatrix:any
  }
}

/**
 * 행렬 요소 형식
 * 9x9행렬에서 2행의 요소까지 표현, 3행의 요소는 (0, 0, 1)로 일정하기 때문에 표현하지 않는다
 */
export interface MatirxType {
  /* 9x9 행렬의 첫 번쨰 요소(0,0) */
  e1:number;
  /* 9x9 행렬의 두 번째 요소(0,1) */
  e2:number;
  /* 9x9 행렬의 세 번째 요소(0,2) */
  e3:number;
  /* 9x9 행렬의 네 번째 요소(1,0) */
  e4:number;
  /* 9x9 행렬의 다섯 번째 요소(1,1) */
  e5:number;
  /* 9x9 행렬의 여섯 번째 요소(1,2) */
  e6:number;
}

/**
 * @name 객체위치정보
 * @param { boolean } treatAsChar 글자처럼 취급 여부
 * @param { boolean } affectLSpacing 줄 간격에 영향을 줄지 여부 treatAsChar 속성이 "true" 일때만 사용
 * @param { boolean } flowWithText 오브젝트의 세로 위치를 본문 영역으로 제한할지 여부 하위요소 RelativeTo의 속성 중 vertical이 "PARA" 일 때에만 사용
 * @param { boolean } allowOverlap 다른 오브젝트와 겹치는 것을 허용할지 여부  treatAsChar 속성이 "false" 일때만 사용 flowWithText 속성이 "true"이면 무조건 "false"로 간주함
 * @param { boolean } holdAnchorAndSO 객체와 조판 부호를 항상 같은 쪽에 놓을지 여부
 * @param { VertRelTo } vertRelTo 세로위치의 기준 treatAsChar 속성이 "false" 일때만 사용
 * @param { string } horzRelTo 가로위치의 기준 treatAsChar 속성이 "false" 일때만 사용
 * @param { string } vertAlign 대한 상대적인 배열 방식 vertRelTo의 값에 따라 가능한 범위가 제한됨
 * @param { string } horzAlign 대한 상대적인 배열 방식
 * @param { number } vertOffset vertRelTo와 vertAlign을 기준점으로 한 상대적인 오프셋 값, 단위는 HWPUINT
 * @param { number } horzOffset horzRelTo와 horzAlign을 기준점으로 한 상대적인 오프셋 값, 단위는 HWPUINT
 */
export interface AbstractShapeObjectType {
  treatAsChar:boolean
  affectLSpacing:boolean
  flowWithText:boolean
  allowOverlap:boolean
  holdAnchorAndSO:boolean
  vertRelTo:VertRelTo
  horzRelTo:HorzRelTo
  vertAlign:string
  horzAlign:string
  vertOffset:number
  horzOffset:number
}

/**
 * @name 세로위치기준
 * 세로위치의 기준 treatAsChar 속성이 "false" 일때만 사용
 */
export type VertRelTo = "PAPER" | "PAGE" | "PARA"
/**
 * @name 가로위치기준
 * 가로위치의 기준 treatAsChar 속성이 "false" 일때만 사용
 */
export type HorzRelTo = VertRelTo | "COLUMN"

/**
 * @name 세로정렬
 * 세로정렬의 기준 treatAsChar 속성이 "false" 일때만 사용
 */
export type VertAlign = "TOP" | "CENTER" | "BOTTOM" | "INSIDE" | "OUTSIDE"

/**
 * @name 가로정렬
 * 가로정렬의 기준 treatAsChar 속성이 "false" 일때만 사용
 */
export type HorzAlign = VertAlign

/**
 * 테이블 
 * @param { number } id
 * @param { PageBreak } pageBreak TABLE(테이블은 나뉘지만 셀은 나뉘지 않음) | CELL(셀 내의 텍스트도 나뉨) | NONE
 * @param { boolean } repeatHeader 테이블이 나뉘었을 경우, 제목 행을 나뉜 페이지에도 반복할지 여부
 * @param { number } rowCnt 테이블 행 개수
 * @param { number } noAdjust 셀 너비/높이 값의 최소 단위(1pt) 보정 여부
 * @param { number } colCnt 테이블 열 개수
 * @param { number } cellSpacing 셀 간격, 단위는 HWPUINT
 * @param { number } borderFillIDRef 테두리/배경 아 이디 참조값
 * @param { InMargin } inMargin 안쪽 여백
 * @param { CellZoneList } cellzoneList 셀존 목록
 * @param { Tr } tr 행
 * @param { Label } label 라벨
  */
export interface Tbl extends Partial<ShapeObjectType> {
  id:number
  pageBreak:PageBreak
  repeatHeader:boolean
  rowCnt:number
  noAdjust:boolean
  colCnt:number
  cellSpacing:number
  borderFillIDRef:number
  inMargin:InMargin
  outMargin:OutMargin
  cellzoneList:CellZoneList
  tr:TcObject;
  label:Label;
}

export type NumberingType = "NONE" | "PICUTRE" | "TABLE" | "EQUATION"

/**
 * @param { boolean } fullSz
 * @param { gap } number
 * @param { number } lastWidth (양수)
 * @param { number } gap defalut 850
 * @param { number } width number
 */
export interface Caption {
  fullSz:boolean
  gap:number
  lastWidth:number
  side:Side
  subList:SubList
}

/**
 * 첫 글자 장식 스타일
 * @property { DCS_NONE } 없음
 * @property { DCS_DOUBLELINE } 2줄
 * @property { DCS_TRIPLELINE } 3줄
 * @property { DCS_MARGIN } 여백
 */
export type DropCapStyleType = "DCS_NONE" | "DCS_DOUBLELINE" | "DCS_TRIPLELINE" | "DCS_MARGIN"

export type Side = "LEFT" | "RIGHT" | "TOP" | "BOTTOM"

/**
 * 페이지 브레이크
 */
export type PageBreak = "TABLE" | "CELL" | "NONE" | 0

export interface TcObject {
  [key: number]: Tr;
}

/**
 * 
 */
export interface Tr {
  tc: Tc[]
}

/**
 * Label 요소
 * @param { number } id
 * @param { number } topmargin
 * @param { number } leftmargin 
 * @param { number } boxwidth
 * @param { number } boxlength
 * @param { number } boxmarginhor
 * @param { number } boxmarginver
 * @param { number } labelcols
 * @param { number } labelrows
 * @param { LandScape } landscape
 * @param { number } pagewidth
 * @param { number } pageheight
 */
export interface Label {
  topmargin:number
  leftmargin:number
  boxwidth:number
  boxlength:number
  boxmarginhor:number
  boxmarginver:number
  labelcols:number
  labelrows:number
  landscape:LandScape
  pagewidth:number
  pageheight:number
}

/**
 * 테이블 열
 * @param { string } name 셀 필드 이름
 * @param { boolean } header 제목 셀 여부
 * @param { any } hasMargin 테이블 기본 셀 여백이 아닌 독자적인 여백을 사용하는지 여부
 * @param { boolean } editable
 * @param { boolean } dirty
 * @param { number } borderFillIDRef
 * @param { CellAddr } cellAddr 셀 주소
 * @param { CellSpan } colSpan 열 개수
 * @param { cellSz } cellSz 셀 크기
 * @param { cellMargin } cellMargin 셀 여백
 * @param { subList } subList 셀 내용(10.1.1 참조)
 * @param { boolean } protect 크기 보호 여부 @default false
 */
export interface Tc {
  /**
   * @param { string } name 셀 필드 이름
   */
  name:string
  /**
   * @param { boolean } header 제목 셀 여부
   */
  header:boolean
  /**
   * @param { boolean } hasMargin 테이블 기본 셀 여백이 아닌 독자적인 여백을 사용하는지 여부
   */
  hasMargin:boolean
  /**
   * @param { boolean } editable
   */
  editable:boolean
  /**
   * @param { boolean } dirty
   */
  dirty:boolean
  /**
   * @param { number } borderFillIDRef
   */
  borderFillIDRef:number
  /**
   * @param { CellAddr } cellAddr 셀 주소
   */
  cellAddr:CellAddr
  /**
   * @param { CellSpan } colSpan 열 개수
   */
  cellSpan:CellSpan
  /**
   * @param { cellSz } cellSz 셀 크기
   */
  cellSz:CellSz
  /**
   * @param { cellMargin } cellMargin 셀 여백
   */
  cellMargin:CellMargin
  /**
   * @param { subList } subList 셀 내용(10.1.1 참조)
   */
  subList:SubList
  /**
   * @param { boolean } protect 크기 보호 여부 @default false
   */
  protect:boolean
}

export type TextDirection = "HORIZONTAL" | "VERTICAL"

/**
 * 서브 리스트
 * @param { number } id 문단 목록을 식별하기 위한 아이디
 * @param { TextDirection } textDirection 문단 속성을 참조하는 아이디
 * @param { LineWrap } lineWrap 경계에서 줄나눔 방식
 * @param { VertAlign } vertAlign 세로 정렬
 * @param { number } linkListIDRef list ID reference
 * @param { number } linkListNextIDRef list ID와 연결된 ID reference
 * @param { P } p 문단
 * @param { number } textHeight 텍스트 높이
 * @param { number } textWidth 텍스트 너비
 */
export interface SubList {
  id:number | ""
  textDirection:TextDirection
  lineWrap:LineWrap
  vertAlign:VertAlign
  linkListIDRef:number
  linkListNextIDRef:number
  p:P
  textHeight:number
  textWidth:number  
}

/**
 * 셀 주소
 * @param { number } rowAddr 셀이 위치한 행
 * @param { number } colAddr 셀이 위치한 열
 */
export interface CellAddr {
  colAddr: number
  rowAddr: number
}

/**
 * 셀 병합 정보
 * @param { number } rowSpan 행 병합 개수
 * @param { number } colSpan 열 병합 개수 
 */
export interface CellSpan {
  colSpan: number
  rowSpan: number
}

/**
 * 셀 크기
 * @param { number } width 셀의 폭, 단위는 HWPUINT
 * @param { number } height 셀 높이, 단위는 HWPUINT
 */
export interface CellSz {
  width: number
  height: number
}

/**
 * 라벨 요소
 * @param { number } topmargin 용지 위쪽 여백
 * @param { number } leftmargin 용지 왼쪽 여백
 * @param { number } boxwidth 이름표 폭
 * @param { number } boxlength 이름표 길이
 * @param { number } boxmarginhor 이름표 좌우 여백
 * @param { number } boxmarginver 이름표 상하 여백
 * @param { number } labelcols 이름표 행의 개수
 * @param { number } labelrows 이름표 높이
 * @param { LandScape } LandScape 용지 방향
 * @param { number } pageWidth 문서의 폭
 * @param { number } pageHeight 문서의 높이
 */
export interface Label {
  topmargin: number
  leftmargin: number
  boxwidth: number
  boxlength: number
  boxmarginhor: number
  boxmarginver: number
  labelcols: number
  labelrows: number
  LandScape: LandScape
  pageWidth: number
  pageHeight: number
}

/**
 * 셀존 목록
 */
export interface CellZoneList {
  cellzone: CellZone[];
}

/**
 * 표에서 스타일 모양이 적용되는 단위
 */
export interface CellZone {
  /**
   * 셀존 row의 시작 주소
   * 주소는 0부터 시작
   */
  startRowAddr:number
  /**
   * 셀존 column의 시작 주소
   * 주소는 0부터 시작
   */
  startColAddr:number
  /**
   * 셀존 row의 끝 주소
   * 주소는 0부터 시작
   */
  endRowAddr:number
  /**
   * 셀존 column의 끝 주소
   * 주소는 0부터 시작
   */
  endColAddr:number
  /**
   * 테두리/배경 아이디 참조값
   */
  borderFillIDRef:number
}

/**
 * 안쪽 여백(단위 HWPUINT)
 */
export interface InMargin {
  left:number
  top:number
  right:number
  bottom:number
}

export type OutMargin = InMargin;
export type CellMargin = InMargin;

/**
 * @prefix hp
 * run(text)
 */
export interface Run {
  // 구역 설정 정보
  secPr?: SecPr;
  // 문단 제어 정보
  ctrl?: Ctrl;
  // 텍스트 문자열
  t?: string | string[];
  // 표
  tbl?: Partial<Tbl>;
  // 그림
  pic?: any;
  // 묶음 객체
  container?: any;
  // OLE
  ole?: any;
  // 수식
  equation?: any;
  // 선
  line?: any;
  // 사각형
  rect?: any;
  // 호
  ellipse?: any;
  // 타원
  arc?: any;
  // 다각형
  polygon?: any;
  // 곡선
  curve?: any;
  // 연결선
  connectLine: any;
  // 글맵시
  textart?: any;
  // 글자 겹침
  compose?: any;
  // 덧말
  dutmal?: any;
  // 버튼
  btn?: any;
  // 라디오버튼
  radioBtn?: any;
  // 체크 버튼
  checkBtn?: any;
  // 콤보 박스
  comboBox?: any;
  // 애디트
  edit?: any;
  // 리스트 박스
  listBox?: any;
  // 스크롤바
  scrollBar?: any;
  // 비디오
  video?: any;
  // 글자 모양 설정 아이디 참조 값
  charPrIDRef?: number;
  // 글자 모양 변경 추적 아이디
  charTcId?: number;
}
/**
 * @prefix hp
 * secpr(section properties)
 */
export interface SecPr {
  id? : number
  textdireaction? : "HORIZONTAL" | "VERTICAL"
  spacecolumns? : number
  tabstop? : number
  outlineshapeidref? : number
  menoshapeidref? : number
  textverticalwidthhead? : number
  masterpagecnt? : number
}

/**
 * @prefix hp
 * grid
 */
export interface Grid {
  linegrid?:number
  chargrid?:number
  wonggogijiformat?:number
  startnum?:StartNum,
}

/**
 * @prefix hp
 * startnum
 */
export interface StartNum {
  pagestartson?: "BOTH" | "EVEN" | "ODD"
  page?:number
  pic?:number
  tbl?:number
  equation?:number
  visibility?:Visibility
}

/**
 * @prefix hp
 * visibility
 */
export interface Visibility {
  hidefirstheader?:number
  hidefirstfooter?:number
  hidefirstmasterpage?:number
  border?:"SHOW_ALL" | "SHOW_NONE" | "SHOW_BORDER"
  fill?:"SHOW_ALL" | "SHOW_NONE" | "SHOW_FILL"
  hidefirstnum?:number
  hidefirstemptyline?:number
  showlinenumber?:number
}

/**
 * @description 이미지 좌표 정보
 */
export interface ImgRect {
  pt0:any
  pt1:any
  pt2:any
  pt3:any
}

/** @description 포인트 정보 */
export interface PointType {
  x:number
  y:number
}

/**
 * @description 이미지 자르기 정보
 */
export interface ImgClip {
  left:number
  right:number
  top:number
  bottom:number
}

/**
 * @prefix hp
 * linenumbershape
 */
export interface Linenumbershape {
  restarttype?:number,
  countby?:number,
  distance?:number,
  startnumber?:number,
}

/**
 * @prefix hp
 * pagepr
 */
export interface PagePr {
  landscape? : "WIDELY" | string
  width?:number
  height?:number
  guttertype?:"LEFT_ONLY" | string
  margin?:Margin,
  footnotepr?:NotePR,
  endnotepr?:NotePR,
  pageborderfill:PageBorderFill
}

/**
 * 
 */

/**
 * @prefix hp
 * NotePR
 */
 export interface NotePR {
  autonumformat?: AutoNumFormat;
  noteline?: NoteLine;
  notespacing?: NoteSpacing;
  numbering?: Numbering;
  placement?: Placement;
}

export interface AutoNumFormat {
  type?: NumberType2;
  userchar?: string;
  prefixchar?: string;
  suffixchar?: string;
  supscript?: number;
}

export interface NoteLine {
  length?: number;
  type?: string;
  width?: string;
  color?: string;
}

export interface NoteSpacing {
  betweennotes?: number;
  belowLine?: number;
  aboveLine?: number;
}

export interface Numbering {
  //앞 구역에 이어서, 현재구역부터 새로 시작, 쪽마다 새로 시작
  type?: "CONTINUOUS" | "ON_SECTION" | "ON_PAGE";
  newnum?: number;
}

export interface Placement {
  /** 
   * 헤더
   * 한 페이지 내에서 각주를 다단에 어떻게 위치 시킬지 표시함 
   * 각 단마다 따로 배열
   * 통단으로 배열
   * 가장 오른쪽 단에 배열
   * 푸터
   * 한 패이지 내에서 미주를 다단에 어떻게 위치시킬지 표시한다
   * 문서의 마지막
   * 구역의 마지막
  */
  place?: "EACH_COLUMN" | "MERGED_COLUMN" | "MERGED_COLUMN" | "END_OF_DOCUMENT" | "END_OF_SECTION";
  /** 텍스트에 이어 바로 출력할지 여부 */
  beneathtext?: number;
}
/**
 * @prefix hp
 * margin
 */
export interface Margin {
  header?:number
  footer?:number
  gutter?:number
  left?:number
  right?:number
  top?:number
  bottom?:number
}

/**
 * @prefix hp
 * pageborderfill
 */
export interface PageBorderFill {
  // 테두리 배경 위치
  offset?: Offset;
  // 양쪽, 짝수쪽, 홀수쪽
  type?: "BOTH" | "EVEN" | "ODD";
  // 테두리/배경 아이디 참조 값
  borderFillIDRef?: number;
  /**
   * 쪽 테두리 위치 기준
   * CONTENT : 본문 기준
   * PAPER : 종이 기준
   */
  textBorder?: "CONTENT" | "PAPER";
  // 머리말 포함 여부
  headerInside?: number;
  // 꼬리말 포함 여부
  footerInside?: number;
  /**
   * 채울 영역
   * 종이, 쪽, 테두리 
   **/
  fillArea?: "PAPER" | "PAGE" | "BORDER";
}

/**
 * @prefix hp
 * offset
 */
export interface Offset {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * @prefix hp
 * run(text)
 */
export interface Run {
  charpridref?:number
  secpr?:SecPr
}

/**
 * @prefix hp
 * ColPr
 */
export interface ColPr {
  id? : number | ""
  type? : "NEWSPAPER" | "BALANCED_NEWSPAPER" | "PARALLEL"
  samSz? : boolean
  sameGap? : number
  wordSize? : number
  colCount : Range<1, 255>  
  colLine?:ColLine[]
  colSz?:ColSz[]
  layout: "LEFT" | "RIGHT" | "MIRROR",
}
/**
 * @prefix hp
 * @parent ColPr
 * @param { type : 구분선 종류, width : 구분선 굵기, color : 구분선 색}
 * ColLine
 */
export interface ColLine {
  // 구분선 종류
  type?:LineType2
  // 구분선 굵기
  width?:LineWidth
  // 구분선 색
  color?:RGBColorType
}
/**
 * @prefix hp
 * @parent ColPr
 * @param { width : 단의 크기, gap : 단 사이의 간격}
 * sameSz 속성이 false일 때(1)
 */
export interface ColSz {
  // 단의 크기
  width:number
  gap:number
}
/**
 * @prefix hp
 * Ctrl
 */
export interface Ctrl {
  colPr : ColPr
}