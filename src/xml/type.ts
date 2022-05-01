import { LineType1, LineType2, LineWidth, NumberType2, RGBColorType } from "../hwpx/type/xml";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

/**
 * @prefix hp
 * p(paragraph)
 */
export interface P {
  id? : number
  parapridref? : number
  styleidref? : number
  pagebreak?:number
  columbreak?:number
  merged?:number,
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
 * @prefix hp
 * run(text)
 */
export interface Run {
  // 구역 설정 정보
  secPr?: Secpr;
  // 문단 제어 정보
  ctrl?: Ctrl;
  // 텍스트 문자열
  t?: string;
  // 표
  tbl?: any;
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
export interface Secpr {
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
  secpr?:Secpr
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