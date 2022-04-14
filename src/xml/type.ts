import { RGBColorType } from "../hwpx/type/xml";

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
  secPr?: Secpr;
  ctrl?: Ctrl;
  charPrIDRef: number;
  t?: string;
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
  type?: string;
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
  betweenNotes?: number;
  belowLine?: number;
  aboveLine?: number;
}

export interface Numbering {
  type?: string;
  newNum?: number;
}

export interface Placement {
  place?: string;
  beneathText?: number;
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
  offset?: Offset;
  type?: string;
  borderFillIDRef?: number;
  textBorder?: string;
  headerInside?: number;
  footerInside?: number;
  fillArea?: string;
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
  id? : number
  type? : "NEWSPAPER" | "BALANCED_NEWSPAPER" | "PARALLEL"
  samSz? : boolean
  sameGap? : number
  wordSize? : number
  colCount : Range<1, 255>
  width : number
  color : RGBColorType,
  layout: "LEFT" | "RIGHT" | "MIRROR",
}
/**
 * @prefix hp
 * Ctrl
 */
export interface Ctrl {
  colPr : ColPr
}