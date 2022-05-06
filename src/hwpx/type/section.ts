export interface Section {
  "?xml": XML;
  sec: SEC;
}

export interface XML {
  version: number;
  encoding: string;
  standalone: string;
}

export interface SEC {
  p: P;
}

export interface Lineseg {
  // 텍스트 시작 위치
  textpos: number;
  // 줄의 세로 위치
  vertpos: number;
  // 줄의 높이
  textheight: number;
  // 텍스트 부분의 높이
  vertsize: number;
  // 줄의 세로 위치에서 베이스라인까지의 거리
  baseline: number;
  // 줄간격
  spacing: number;
  // 컬럼에서의 시작 위치
  horzpos: number;
  // 새그먼트의 폭
  horzsize: number;
  // 태그(flags)
  flags: number;
}
export interface Linesegarray {
  lineseg: Lineseg
}

export interface P {
  run: Partial<Run[]>;
  id: number;
  paraPrIDRef: number;
  styleIDRef: number;
  pageBreak: number;
  columnBreak: number;
  merged: number;
  linesegarray:Linesegarray
}

export interface Run {
  secPr?: SECPR;
  ctrl?: Ctrl;
  charPrIDRef: number;
  // 텍스트 문자열
  t?: string;
  // 표
  tbl?:any;
  // 그림
  pic?:any;
  // 묶음 객체
  container?:any;
  // OLE
  ole?:any;
  // 수식
  equation?:any;
  // 선
  line?:any;
  // 사각형
  rect?:any;
  // 호
  ellipse?:any;
  // 타원
  arc?:any;
  // 다각형
  polygon?:any;
  // 곡선
  curve?:any;
  // 연결선
  connectLine?:any;
  // 글맵시
  textart?:any;
  // 글자 겹침
  compose?:any;
  // 덧말
  dutmal?:any;
  // 버튼
  btn?:any;
  // 라디오 버튼
  radioBtn?:any;
  // 체크 버튼
  checkBtn?:any;
  // 콤보 박스
  comboBox?:any;
  // 에디트
  edit?:any;
  // 리스트 박스
  listBox?:any;
  // 스크롤바
  scrollBar?:any;
  // 비디오
  video?:any; 
}

export interface Ctrl {
  colPr: ColPR;
}

export interface ColPR {
  id: null;
  type: string;
  layout: string;
  colCount: number;
  sameSz: number;
  sameGap: number;
}

export interface SECPR {
  grid: Grid;
  startNum: StartNum;
  visibility: Visibility;
  lineNumberShape: LineNumberShape;
  pagePr: PagePR;
  footNotePr: NotePR;
  endNotePr: NotePR;
  pageBorderFill: PageBorderFill[];
  id: null;
  textDirection: string;
  spaceColumns: number;
  tabStop: number;
  tabStopVal: number;
  tabStopUnit: string;
  outlineShapeIDRef: number;
  memoShapeIDRef: number;
  textVerticalWidthHead: number;
  masterPageCnt: number;
}

export interface NotePR {
  autoNumFormat: AutoNumFormat;
  noteLine: NoteLine;
  noteSpacing: NoteSpacing;
  numbering: Numbering;
  placement: Placement;
}

export interface AutoNumFormat {
  type: string;
  userChar: null;
  prefixChar: null;
  suffixChar: string;
  supscript: number;
}

export interface NoteLine {
  length: number;
  type: string;
  width: string;
  color: string;
}

export interface NoteSpacing {
  betweenNotes: number;
  belowLine: number;
  aboveLine: number;
}

export interface Numbering {
  type: string;
  newNum: number;
}

export interface Placement {
  place: string;
  beneathText: number;
}

export interface Grid {
  lineGrid:       number;
  charGrid:       number;
  wonggojiFormat: number;
  strtnum:        Strtnum;
}

export interface Strtnum {
  pagestartson: string;
  page:         number;
  pic:          number;
  tbl:          number;
  equation:     number;
  visibility:   Visibility;
}
export interface LineNumberShape {
  restartType: number;
  countBy: number;
  distance: number;
  startNumber: number;
}

export interface PageBorderFill {
  offset: Offset;
  type: string;
  borderFillIDRef: number;
  textBorder: string;
  headerInside: number;
  footerInside: number;
  fillArea: string;
}

export interface Offset {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * 용지방향
 * @default NARROWLY
 */
export type LandScape = "WIDELY" | "NARROWLY"

/**
 * 제책방법
 * @default LEFT_ONLY
 */
export type GutterType = "LEFT_ONLY" | "LEFT_RIGHT" | "TOP_BOTTOM"


/**
 * 용지 설정 정보
 * @height { 84188 } 용지 세로 크기, 단위는 HWPUINT
 * @width { 59258 } 용지 가로 크기, 단위는 HWPUINT
 */
export interface PagePR {
  margin: Margin;
  landscape: LandScape;
  width: number;
  height: number;
  gutterType: GutterType;
}

/**
 * 여백정보
 * @top { 0 } 위쪽 여백, 단위는 HWPUINT
 * @bottom { 0 } 아래쪽 여백, 단위는 HWPUINT
 * @left { 0 } 왼쪽 여백, 단위는 HWPUINT
 * @right { 0 } 오른쪽 여백, 단위는 HWPUINT
 * 음수는 들어가지 않음
 */
export interface MarginAttributeGroup {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
/**
 * 여백
 * @header { 4252 } 머리말 여백
 * @footer { 4252 } 꼬리말 여백
 * @gutter { 0 } 제본 여백
 */
export interface Margin extends MarginAttributeGroup {
  header: number;
  footer: number;
  gutter: number;
}

export interface StartNum {
  pageStartsOn: string;
  page: number;
  pic: number;
  tbl: number;
  equation: number;
}

export interface Visibility {
  hideFirstHeader: number;
  hideFirstFooter: number;
  hideFirstMasterPage: number;
  border: string;
  fill: string;
  hideFirstPageNum: number;
  hideFirstEmptyLine: number;
  showLineNumber: number;
}
