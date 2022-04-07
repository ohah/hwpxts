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

export interface P {
  run: Run[];
  id: number;
  paraPrIDRef: number;
  styleIDRef: number;
  pageBreak: number;
  columnBreak: number;
  merged: number;
}

export interface Run {
  secPr?: SECPR;
  ctrl?: Ctrl;
  charPrIDRef: number;
  t?: null;
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
  lineGrid: number;
  charGrid: number;
  wonggojiFormat: number;
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

export interface PagePR {
  margin: Margin;
  landscape: string;
  width: number;
  height: number;
  gutterType: string;
}

export interface Margin {
  header: number;
  footer: number;
  gutter: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
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
