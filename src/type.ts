import { LineType1, LineType2, RGBColorType } from "./hwpx/type/xml";
import { Range } from "./xml/type";

export interface Content {
  "?xml": XML;
  package: Package;
}

export interface XML {
  version: string | number;
  encoding: string;
  standalone: string;
}

export interface Package {
  metadata: Metadata;
  manifest: Manifest;
  spine: Spine;
  version: string;
  "unique-identifier": string;
  id: string;
}

export interface Manifest {
  item: Item[];
}

export interface Item {
  id: string;
  href: string;
  "media-type": string;
}

export interface Metadata {
  title: string;
  language: string;
  meta: Meta[];
}

export interface Meta {
  text?: string;
  name: string;
  content: string;
}

export interface Spine {
  itemref: Itemref[];
}

export interface Itemref {
  idref: string;
  linear: string;
}


/* Header */

export interface Header {
  xml:  XML;
  head: Head;
}

export interface Head {
  beginNum: BeginNum;
  refList: RefList;
  forbiddenWordList: ForbiddenWordList;
  compatibleDocument: CompatibleDocument;
  docOption: DocOption;
  trackchageConfig: TrackchageConfig;
  version: number;
  secCnt: number;
}

export interface BeginNum {
  page:     number;
  footnote: number;
  endnote:  number;
  pic:      number;
  tbl:      number;
  equation: number;
}

export interface CompatibleDocument {
  layoutCompatibility: string;
  targetProgram:       string;
}

export interface DocOption {
  linkinfo: Linkinfo;
}

export interface Linkinfo {
  path:            string;
  pageInherit:     number;
  footnoteInherit: number;
}

export interface ForbiddenWordList {
  forbiddenWord: string[];
  itemCnt:       number;
}

export interface RefList {
  fontfaces:      Fontfaces;
  borderFills:    BorderFills;
  charProperties: CharProperties;
  tabProperties:  TabProperties;
  numberings:     Numberings;
  paraProperties: ParaProperties;
  styles:         Styles;
}

export interface BorderFills {
  borderFill: BorderFill[];
  itemCnt:    number;
}

export interface BorderFill {
  slash:                 Slash;
  backSlash:             Slash;
  leftBorder:            BottomBorder;
  rightBorder:           BottomBorder;
  topBorder:             BottomBorder;
  bottomBorder:          BottomBorder;
  diagonal:              BottomBorder;
  id:                    number;
  threeD:                number;
  shadow:                number;
  centerLine:            CenterLine;
  breakCellSeparateLine: number;
  fillBrush?:            FillBrush;
}

export interface Slash {
  type:      CenterLine;
  crooked:   number;
  isCounter: number;
}

export enum CenterLine {
  None = "NONE",
  Solid = "SOLID",
}

export interface BottomBorder {
  type:  CenterLine;
  width: Width;
  color: Color;
}

export enum Color {
  The000000 = "#000000",
}

export enum Width {
  The012Mm = "0.12 mm",
  The01Mm = "0.1 mm",
}

export interface FillBrush {
  winBrush: WinBrush;
}

export interface WinBrush {
  faceColor:  string;
  hatchColor: string;
  alpha:      number;
}

export interface CharProperties {
  charPr:  Partial<CharPR[]>;
  itemCnt: number;
}

/**
 * 글자 속성
 * @interface CharPR
 * @extends {Partial<CharPR>}
 * @property {number} id
 * @property {Range<50, 200>} ratio 언어별 장평 단위는 %
 * @property {Range<-50, 50>} spacing 언어별 자간 단위는 %
 * @property {Range<10, 250>} relSz 언어별 글자의 상대 크기, 단위는 %
 * @property {Range<-100, 100>} offset 언어별 오프셋, 단위는 %
 * @property {number} italic 글자 속성 : 기울임
 * @property {number} bold 글자 속성 : 굵게
 * @property {number} underline 글자 속성 : 밑줄
 * @property {number} strikeout { shape, color} 글자 속성 : 취소선
 * @property {number} outline 글자 속성 : 외각선
 * @property {number} shadow 글자 속성 : 그림자
 * @property {number} emboss 글자 속성 : 양각
 * @property {number} engrave 글자 속성 : 음각
 * @property {number} supscript 글자 속성 : 윗첨자
 * @property {number} subscript 글자 속성 : 아래첨자
 * @property {number} id 글자  모양 아이디
 * @property {number} height 글자 크기 (hwpuint 단위, 10 pt = 1000 hwpuint)
 * @property {boolean} useFontSpace 글꼴에 어울리는 빈칸
 * @property {boolean} useKerning 커닝
 * @property {sysMarkType} symMark 강조점 종류
 * @property {number} borderFillIDRef 글자 테두리 ID
 */
export interface CharPR {
  fontRef: FontRef<0, 10000>;
  ratio: FontRef<50, 200>;
  spacing: FontRef<-50, 50>;
  relSz: FontRef<10, 250>;
  offset: FontRef<-100, 100>;
  italic: number;
  bold: number;
  underline: UnderLine;
  strikeout: Strikeout;
  outline:OutLine;
  shadow: Shadow;
  emboss: number;
  engrave: number;
  supscript:number;
  subscript:number;
  id: number;
  height: number;
  textColor: string;
  shadeColor: string;
  useFontSpace: number;
  useKerning: number;
  symMark: SymMarkType;
  borderFillIDRef: number;
}

export interface OutLine {
  type:LineType1;
}

export interface UnderLine {
  color: RGBColorType
  shape: LineType2
  type: "BOTTOM" | "CENTER" | "TOP"
}

/**
 * @name 강조점종류
 */
export enum SymMarkType {
  NONE = "NONE",
  DOT_ABOVE = "DOT_ABOVE",
  RING_ABOVE = "RING_ABOVE",
  TILDE = "TILDE",
  CARON = "CARON",
  SIDE = "SIDE",
  COLON = "COLON",
  GRAVE_ACCENT = "GRAVE_ACCENT",
  ACUTE_ACCENT = "ACUTE_ACCENT",
  CIRCUMFLEX = "CIRCUMFLEX",
  MACRON = "MACRON",
  HOOK_ABOVE = "HOOK_ABOVE",
  DOT_BELOW = "DOT_BELOW",
}
export interface Shadow {
  type: "DROP" | "CONTINLIOUS";
  color: RGBColorType;
  offsetX:number;
  offsetY:number;
  alpha:number;
}
export interface FontRef<min extends number, max extends number> {
  hangul: Range<min, max>;
  latin: Range<min, max>;
  hanja: Range<min, max>;
  japanese: Range<min, max>;
  other: Range<min, max>;
  symbol: Range<min, max>;
  user: Range<min, max>;
}

export interface Strikeout {
  shape: LineType2;
  color: RGBColorType;
}

export interface Fontfaces {
  fontface: Fontface[];
  itemCnt:  number;
}

export interface Fontface {
  font:    Font[];
  lang:    "HANGUL" | "LATIN" | "HANJA" | "JAPANESE" | "OTHER" | "SYMBOL" | "USER";
  fontCnt: number;
}

export interface Font {
  id:         number;
  face:       string;
  type:       SubstFontType;
  isEmbedded: number;
  substFont?: SubstFont;
  typeInfo?: Partial<FontTypeInfo>;
}

/**
 * @param FACT_UNKNOWN
 * @param FACT_MYUNGJO serif
 * @param FACT_GOTHIC sans-serif
 * @param FACT_SSERIF monospace
 * @param FACT_BRUSHSCRIPT cursive
 * @param FACT_DECORATIVE cursive
 * @param FACT_NONRECTMJ serif
 * @param FACT_NONRECTGT sans-serif
 */
export enum FamilyType {
  FACT_UNKNOWN = "FACT_UNKNOWN",
  FACT_MYUNGJO = "FACT_MYUNGJO",
  FACT_GOTHIC = "FACT_GOTHIC",
  FACT_SSERIF = "FACT_SSERIF",
  FACT_BRUSHSCRIPT = "FACT_BRUSHSCRIPT",
  FACT_DECORATIVE = "FACT_DECORATIVE",
  FACT_NONRECTMJ = "FACT_NONRECTMJ",
  FACT_NONRECTGT = "FACT_NONRECTGT",
}
/**
 * @param familyType 글꼴계열
 * @param serifStyle 세리프유형
 * @param weight 굵기
 * @param proportion 비례
 * @param contrast 대조
 * @param strokeWidth 스트로크 편차
 * @param armStyle 자획 유형
 * @param letterform 글자형
 * @param midline 중간선
 * @param xHeight X-높이
 */
export interface FontTypeInfo {
  familyType:FamilyType;
  serifStyle:string;
  weight:number;
  proportion:number;
  contrast:number;
  strokeWidth:number;
  armStyle:number;
  letterform:number;
  midline:number;
  xHeight:number;
}

export interface SubstFont {
  face:            string;
  type:            SubstFontType;
  isEmbedded:      number;
  binaryItemIDRef: null;
}

export enum SubstFontType {
  TTF = "TTF",
  HFT = "HFT",
  OTF = "OTF"
}

export interface Numberings {
  numbering: Numbering;
  itemCnt:   number;
}

export interface Numbering {
  paraHead: ParaHead[];
  id:       number;
  start:    number;
}

export interface ParaHead {
  text?:          string;
  start:          number;
  level:          number;
  align:          AlignEnum;
  useInstWidth:   number;
  autoIndent:     number;
  widthAdjust:    number;
  textOffsetType: LineSpacingTypeEnum;
  textOffset:     number;
  numFormat:      string;
  charPRIDRef:    number;
  checkable:      number;
}


/**
 * 문단 내 정렬
 * 정렬 방식
 */
export enum AlignEnum {
  // 양쪽 정렬
  JUSTIFY = "JUSTIFY",
  // 왼쪽 정렬
  LEFT = "LEFT",
  // 오른쪽 정렬
  RIGHT = "RIGHT",
  // 가운데 정렬
  CENTER = "CENTER",
  // 배분 정렬
  DISTRIBUTE = "DISTRIBUTE",
  // 나눔 정렬(공백에만 배분)
  DISTRIBUTE_SPACE = "DISTRIBUTE_SPACE",
}

// 줄 간격 종류
export enum LineSpacingTypeEnum {
  // 글자에 따라
  PERCENT = "PERCENT",
  // 고정 값
  FIXED = "FIXED",
  // 여백만 지정
  BETWEEN_LINES = "BETWEEN_LINES",
  // 최소
  AT_LEAST = "AT_LEAST",
}

export interface ParaProperties {
  paraPr:  Partial<ParaPR[]>;
  itemCnt: number;
}

export interface ParaPR {
  align: AlignClass;
  heading?: Heading;
  breakSetting: BreakSetting;
  autoSpacing: AutoSpacing;
  switch: SwitchElement[] | PurpleSwitch;
  border: Border;
  id: number;
  tabPRIDRef: number;
  condense: number;
  fontLineHeight: number;
  snapToGrid: number;
  suppressLineNumbers: number;
  checked: number;
  lineSpacing: LineSpacing;
  margin: Margin;
}

export interface AlignClass {
  horizontal: AlignEnum;
  vertical:   VerticalAlign;
}

// 세로 정렬
export enum VerticalAlign {
  // 글꼴 기준
  BASELINE = "BASELINE",
  // 위쪽
  TOP = "TOP",
  // 가운데
  CENTER = "CENTER",
  // 아래
  BOTTOM = "BOTTOM",
}

export interface AutoSpacing {
  eAsianEng: number;
  eAsianNum: number;
}

export interface Border {
  borderFillIDRef: number;
  offsetLeft:      number;
  offsetRight:     number;
  offsetTop:       number;
  offsetBottom:    number;
  connect:         number;
  ignoreMargin:    number;
}

export interface BreakSetting {
  breakLatinWord:    BreakLatinWord;
  breakNonLatinWord: BreakLatinWord;
  // 외톨이줄 보호 여부(boolean)
  widowOrphan:       number;
  // 다음 문단과 함께(boolean)
  keepWithNext:      number;
  // 문단 보호 여부(boolean)
  keepLines:         number;
  // 문단 앞에서 항상 쪽나눔 여부(boolean)
  pageBreakBefore:   number;
  // 한줄로 입력 사용시의 형식
  lineWrap:          LineWrap;
}

// 라틴 문자 이외의 문자의 줄나눔 단위
export enum breakNonLatinWord {
  // 어절
  KEEP_WORD = "KEEP_WORD",
  // 글자
  BREAK_WORD = "BREAK_WORD"
}

// 라틴 문자의 줄나눔 단위
export enum BreakLatinWord {
  // 단어
  KEEP_WORD = "KEEP_WORD",
  //하이픈
  HYPHENATION = "HYPHENATION",
  // 글자
  BREAK_WORD = "BREAK_WORD",
}

// 한줄로 입력 사용시의 형식
export enum LineWrap {
  // 일반적인 줄바꿈
  BREAK = "BREAK",
  // 자간을 조정하여 한 줄을 유지
  SQUEEZE = "SQUEEZE",
  // 내용에 따라 폭이 늘어남
  KEEP = "KEEP",
}

export interface Heading {
  type:  HeadingType;
  idRef: number;
  level: Range<0, 6>;
}

export enum HeadingType {
  // 없음
  NONE = "NONE",
  // 개요
  OUTLINE = "OUTLINE",
  // 번호
  NUMBER = "NUMBER",
  // 글머리표
  BULLET = "BULLET",
}

export interface SwitchElement {
  case:    Case;
  default: Case;
}

export interface Case {
  heading?:           Heading;
  requiredNamespace?: string;
  margin?:            Margin;
  lineSpacing?:       LineSpacing;
}

export interface LineSpacing {
  type:  LineSpacingTypeEnum;
  value: number;
  unit:  Unit;
}

// 줄 간격 값의 단위
export enum Unit {
  HWPUNIT = "HWPUNIT",
  CHAR = "CHAR",
}

/**
 * 들어쓰기/내어쓰기
 * n이 0보다 크면 들여쓰기 n
 * n이 0이면 보통
 * n이 0보다 작으면 내어쓰기
 * 단위를 표기하지 않으면 hwpunit이고, 표기하면 표기한 단위로
 */
export interface Margin {
  // 들여쓰기
  intent: Intent;
  // 왼쪽 여백
  left:   Intent;
  // 오른쪽 여백
  right:  Intent;
  // 문단 간격 위
  prev:   Intent;
  // 문단 간격 아래
  next:   Intent;
}

export interface Intent {
  value: number;
  unit:  Unit | string;
}

export interface PurpleSwitch {
  case:    Case;
  default: Default;
}

export interface Default {
  margin:      Margin;
  lineSpacing: LineSpacing;
}

export interface Styles {
  style:   Style[];
  itemCnt: number;
}

export interface Style {
  id:             number;
  type:           StyleType;
  name:           string;
  engName:        string;
  paraPrIDRef:    number;
  charPrIDRef:    number;
  nextStyleIDRef: number;
  langID:         number;
  lockForm:       number;
}

export enum StyleType {
  Char = "CHAR",
  Para = "PARA",
}

export interface TabProperties {
  tabPr:   TabPR[];
  itemCnt: number;
}

export interface TabPR {
  id:           number;
  autoTabLeft:  number;
  autoTabRight: number;
}

export interface TrackchageConfig {
  flags: number;
}