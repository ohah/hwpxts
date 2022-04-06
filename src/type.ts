export interface Content {
  "?xml": XML;
  package: Package;
}

export interface XML {
  version: string;
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
  "#text"?: string;
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
  xml: XML;
  head: Head;
}

export interface Head {
  beginNum: BeginNum;
  refList: RefList;
  forbiddenWordList: ForbiddenWordList;
  compatibleDocument: CompatibleDocument;
  docOption: DocOption;
  trackchageConfig: TrackchageConfig;
  version: string;
  secCnt: string;
}

export interface BeginNum {
  page: string;
  footnote: string;
  endnote: string;
  pic: string;
  tbl: string;
  equation: string;
}

export interface CompatibleDocument {
  layoutCompatibility: string;
  targetProgram: string;
}

export interface DocOption {
  linkinfo: Linkinfo;
}

export interface Linkinfo {
  path: string;
  pageInherit: string;
  footnoteInherit: string;
}

export interface ForbiddenWordList {
  forbiddenWord: string[];
  itemCnt: string;
}

export interface RefList {
  fontfaces: Fontfaces;
  borderFills: BorderFills;
  charProperties: CharProperties;
  tabProperties: TabProperties;
  numberings: Numberings;
  paraProperties: ParaProperties;
  styles: Styles;
}

export interface BorderFills {
  borderFill: BorderFill[];
  itemCnt: string;
}

export interface BorderFill {
  slash: Slash;
  backSlash: Slash;
  leftBorder: BottomBorder;
  rightBorder: BottomBorder;
  topBorder: BottomBorder;
  bottomBorder: BottomBorder;
  diagonal: BottomBorder;
  id: string;
  threeD: string;
  shadow: string;
  centerLine: CenterLine;
  breakCellSeparateLine: string;
  fillBrush?: FillBrush;
}

export interface Slash {
  type: CenterLine;
  crooked: string;
  isCounter: string;
}

export enum CenterLine {
  None = "NONE",
  Solid = "SOLID",
}

export interface BottomBorder {
  type: CenterLine;
  width: string;
  color: string;
}

export interface FillBrush {
  winBrush: WinBrush;
}

export interface WinBrush {
  faceColor: string;
  hatchColor: string;
  alpha: string;
}

export interface CharProperties {
  charPR: CharPR[];
  itemCnt: string;
}

export interface CharPR {
  fontRef: FontRef;
  ratio: FontRef;
  spacing: FontRef;
  relSz: FontRef;
  offset: FontRef;
  strikeout: Strikeout;
  id: string;
  height: string;
  textColor: string;
  shadeColor: string;
  useFontSpace: string;
  useKerning: string;
  symMark: CenterLine;
  borderFillIDRef: string;
}

export interface FontRef {
  hangul: string;
  latin: string;
  hanja: string;
  japanese: string;
  other: string;
  symbol: string;
  user: string;
}

export interface Strikeout {
  shape: CenterLine;
  color: string;
}

export interface Fontfaces {
  fontface: Fontface[];
  itemCnt: string;
}

export interface Fontface {
  font: Font[];
  lang: string;
  fontCnt: string;
}

export interface Font {
  id: string;
  face: string;
  type: SubstFontType;
  isEmbedded: string;
  substFont?: SubstFont;
}

export interface SubstFont {
  face: string;
  type: SubstFontType;
  isEmbedded: string;
  binaryItemIDRef: string;
}

export enum SubstFontType {
  TTF = "TTF",
}

export interface Numberings {
  numbering: Numbering;
  itemCnt: string;
}

export interface Numbering {
  paraHead: ParaHead[];
  id: string;
  start: string;
}

export interface ParaHead {
  text?: string;
  start: string;
  level: string;
  align: AlignEnum;
  useInstWidth: string;
  autoIndent: string;
  widthAdjust: string;
  textOffsetType: TextOffsetTypeEnum;
  textOffset: string;
  numFormat: string;
  charPRIDRef: string;
  checkable: string;
}

export enum AlignEnum {
  Justify = "JUSTIFY",
  Left = "LEFT",
}

export enum TextOffsetTypeEnum {
  Percent = "PERCENT",
}

export interface ParaProperties {
  paraPR: ParaPR[];
  itemCnt: string;
}

export interface ParaPR {
  align: AlignClass;
  heading?: Heading;
  breakSetting: BreakSetting;
  autoSpacing: AutoSpacing;
  switch: SwitchElement[] | PurpleSwitch;
  border: Border;
  id: string;
  tabPRIDRef: string;
  condense: string;
  fontLineHeight: string;
  snapToGrid: string;
  suppressLineNumbers: string;
  checked: string;
}

export interface AlignClass {
  horizontal: AlignEnum;
  vertical: Vertical;
}

export enum Vertical {
  Baseline = "BASELINE",
}

export interface AutoSpacing {
  eAsianEng: string;
  eAsianNum: string;
}

export interface Border {
  borderFillIDRef: string;
  offsetLeft: string;
  offsetRight: string;
  offsetTop: string;
  offsetBottom: string;
  connect: string;
  ignoreMargin: string;
}

export interface BreakSetting {
  breakLatinWord: BreakLatinWord;
  breakNonLatinWord: BreakLatinWord;
  widowOrphan: string;
  keepWithNext: string;
  keepLines: string;
  pageBreakBefore: string;
  lineWrap: LineWrap;
}

export enum BreakLatinWord {
  BreakWord = "BREAK_WORD",
  KeepWord = "KEEP_WORD",
}

export enum LineWrap {
  Break = "BREAK",
}

export interface Heading {
  type: HeadingType;
  idRef: string;
  level: string;
}

export enum HeadingType {
  None = "NONE",
  Outline = "OUTLINE",
}

export interface SwitchElement {
  case: Case;
  default: Case;
}

export interface Case {
  heading?: Heading;
  requiredNamespace?: string;
  margin?: Margin;
  lineSpacing?: LineSpacing;
}

export interface LineSpacing {
  type: TextOffsetTypeEnum;
  value: string;
  unit: Unit;
}

export enum Unit {
  Hwpunit = "HWPUNIT",
}

export interface Margin {
  intent: Intent;
  left: Intent;
  right: Intent;
  prev: Intent;
  next: Intent;
}

export interface Intent {
  value: string;
  unit: Unit;
}

export interface PurpleSwitch {
  case: Case;
  default: Default;
}

export interface Default {
  margin: Margin;
  lineSpacing: LineSpacing;
}

export interface Styles {
  style: Style[];
  itemCnt: string;
}

export interface Style {
  id: string;
  type: StyleType;
  name: string;
  engName: string;
  paraPRIDRef: string;
  charPRIDRef: string;
  nextStyleIDRef: string;
  langID: string;
  lockForm: string;
}

export enum StyleType {
  Char = "CHAR",
  Para = "PARA",
}

export interface TabProperties {
  tabPR: TabPR[];
  itemCnt: string;
}

export interface TabPR {
  id: string;
  autoTabLeft: string;
  autoTabRight: string;
}

export interface TrackchageConfig {
  flags: string;
}

//version
export interface Version {
  xml: XML;
  hcfVersion: HCFVersion;
}

export interface HCFVersion {
  tagetApplication: string;
  major: string;
  minor: string;
  micro: string;
  buildNumber: string;
  os: string;
  xmlVersion: string;
  application: string;
  appVersion: string;
}