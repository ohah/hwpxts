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
  beginNum:           BeginNum;
  refList:            RefList;
  forbiddenWordList:  ForbiddenWordList;
  compatibleDocument: CompatibleDocument;
  docOption:          DocOption;
  trackchageConfig:   TrackchageConfig;
  version:            number;
  secCnt:             number;
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
  charPR:  CharPR[];
  itemCnt: number;
}

export interface CharPR {
  fontRef:         FontRef;
  ratio:           FontRef;
  spacing:         FontRef;
  relSz:           FontRef;
  offset:          FontRef;
  strikeout:       Strikeout;
  id:              number;
  height:          number;
  textColor:       string;
  shadeColor:      string;
  useFontSpace:    number;
  useKerning:      number;
  symMark:         CenterLine;
  borderFillIDRef: number;
}

export interface FontRef {
  hangul:   number;
  latin:    number;
  hanja:    number;
  japanese: number;
  other:    number;
  symbol:   number;
  user:     number;
}

export interface Strikeout {
  shape: CenterLine;
  color: Color;
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
  face:       Face;
  type:       SubstFontType;
  isEmbedded: number;
  substFont?: SubstFont;
}

export enum Face {
  고양덕양Eb = "고양덕양 EB",
  함초롬돋움 = "함초롬돋움",
  함초롬바탕 = "함초롬바탕",
}

export interface SubstFont {
  face:            Face;
  type:            SubstFontType;
  isEmbedded:      number;
  binaryItemIDRef: null;
}

export enum SubstFontType {
  TTF = "TTF",
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
  textOffsetType: TextOffsetTypeEnum;
  textOffset:     number;
  numFormat:      string;
  charPRIDRef:    number;
  checkable:      number;
}

export enum AlignEnum {
  Justify = "JUSTIFY",
  Left = "LEFT",
}

export enum TextOffsetTypeEnum {
  Percent = "PERCENT",
}

export interface ParaProperties {
  paraPR:  ParaPR[];
  itemCnt: number;
}

export interface ParaPR {
  align:               AlignClass;
  heading?:            Heading;
  breakSetting:        BreakSetting;
  autoSpacing:         AutoSpacing;
  switch:              SwitchElement[] | PurpleSwitch;
  border:              Border;
  id:                  number;
  tabPRIDRef:          number;
  condense:            number;
  fontLineHeight:      number;
  snapToGrid:          number;
  suppressLineNumbers: number;
  checked:             number;
}

export interface AlignClass {
  horizontal: AlignEnum;
  vertical:   Vertical;
}

export enum Vertical {
  Baseline = "BASELINE",
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
  widowOrphan:       number;
  keepWithNext:      number;
  keepLines:         number;
  pageBreakBefore:   number;
  lineWrap:          LineWrap;
}

export enum BreakLatinWord {
  BreakWord = "BREAK_WORD",
  KeepWord = "KEEP_WORD",
}

export enum LineWrap {
  Break = "BREAK",
}

export interface Heading {
  type:  HeadingType;
  idRef: number;
  level: number;
}

export enum HeadingType {
  None = "NONE",
  Outline = "OUTLINE",
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
  type:  TextOffsetTypeEnum;
  value: number;
  unit:  Unit;
}

export enum Unit {
  Hwpunit = "HWPUNIT",
}

export interface Margin {
  intent: Intent;
  left:   Intent;
  right:  Intent;
  prev:   Intent;
  next:   Intent;
}

export interface Intent {
  value: number;
  unit:  Unit;
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
  paraPRIDRef:    number;
  charPRIDRef:    number;
  nextStyleIDRef: number;
  langID:         number;
  lockForm:       number;
}

export enum StyleType {
  Char = "CHAR",
  Para = "PARA",
}

export interface TabProperties {
  tabPR:   TabPR[];
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