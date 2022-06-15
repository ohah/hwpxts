import { AbstractShapeComponentType, ImgClip, ImgRect, NumberingType, ShapeObjectType, SubList, Tbl } from "../../xml/type";
import { LineType2, RGBColorType } from "./xml";

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

/**
 * 객체 위치
 * @param { number } textpos 텍스트 시작 위치
 * @param { number } vertpos 줄의 세로 위치
 * @param { number } textheight 줄의 높이
 * @param { number } baseline 줄의 세로 위치에서 베이스라인까지의 거리
 * @param { number } spacing 줄 간격
 * @param { number } horzpos 새그먼트의 폭
 * @param { number } flags 플래그
 */
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
  lineseg: Lineseg[]
}

export interface P {
  run: Partial<Partial<Run>[]>;
  id: number;
  paraPrIDRef: number;
  styleIDRef: number;
  pageBreak: number;
  columnBreak: number;
  merged: number;
  linesegarray:Linesegarray
}

export interface TitleMark {
  width:number;
  leader:LineType2;
  type: "LEFT" | "RIGHT" | "CENTER" | "DECIMAL"
}

/**
 * @param text 입력된 텍스트
 * @param markpenBegin 형광펜 시작
 * @param markpenEnd 형광펜 끝
 * @param titleMark 제목 차례 표시
 * @param tab 탭(하위 속성들은 integer type지만 단위는 HWPUNIT)
 * @param lineBreak 강제 줄나눔
 * @param hypen 하이픈
 * @nbSpace 묶음 빈칸
 * @fwSpace 고정폭 빈칸
 * @inertBegin 변경 추적 삽입 시작지점
 * @inertEnd 변경 추적 삽입 끝지점
 * @deleteBegin 변경 추적 삭제 시작지점 
 * @deleteEnd 변경 추적 삭제 끝지점
 */
export interface T {
  /**
   * 입력된 텍스트
   */
  text: string;
  /**
   * 형광펜 시작
   */
  markpenBegin: {
    color: RGBColorType
  };
  /**
   * 형광펜 끝
   */
  markpenEnd: string;
  /**
   * 제목 차례 표시
   */
  titleMark: TitleMark;
  /** 
   * 텝(하위 속성)
   */
  tab: number;
  /**
   * 강제 줄나눔
   */
  lineBreak: number;
  /**
   * 하이픈
   */
  hypen: number;
  /**
   * 묶음 빈칸
   */
  nbSpace: number;
  /**
   * 고정폭 빈칸
   */
  fwSpace: number;
  /**
   * 변경 추적 삽입 시작지점
   */
  inertBegin: number;
  /**
   * 변경 추적 삽입 끝지점
   */
  inertEnd: number;
  /**
   * 변경 추적 삭제 시작지점
   */
  deleteBegin: number;
  /**
   * 변경 추적 삭제 끝지점
   */
  deleteEnd: number;
  // ctrl:Partial<Ctrl>
  /**
   * SVG 표시를 위한 커스텀 
   */
  _text:{
    t:string,
    length:number,
    charPrIDRef?:number,
    linesegarray?:Linesegarray
  }
}

/**
 * ObjectPositionInfo
 * AbstractShapeComponentType를 상속
 */
export interface Pic extends AbstractShapeComponentType, ShapeObjectType {
  /* 그림 색상 반전 */
  reverse:boolean
  /* 테두리선 모양 */
  // lineShape:LineType
  /* 이미지 좌표 정보 */
  imgRect:ImgRect
  /* 이미지 자르기 정보 */
  imgClip:ImgClip
  /* 이미지 효과 정보 */
  effects:any,
  /* 안쪽 여백 정보 */
  inMargin:any
  /* 그림 정보 */
  img: {
    /* 그림의 밝기 */
    birght:number
    /* 그림의 명암 */
    contrast:number
    /**
     * 그림의 추가효과 
     * @param {string} REAL_PICK 원래 그림대로
     * @param {string} GRAY_SCALE 그레이 스케일로
     * @param {string} BLACK_WHITE 흑백으로
     */
    effects:"REAL_PICK" | "GRAY_SCALE" | "BLACK_WHITE"
    /**
     * BinDataItem 요소의 아이디 참조값
     * 그림의 바이너리 데이터에 대한 연결 정보     * 
     */
    binaryItemIDRef:string
    /* 투명도 */
    alpha:number
  },
}

export interface Run {
  secPr: SecPR;
  ctrl: Ctrl;
  charPrIDRef: number;
  // 텍스트 문자열
  t: string[] | Partial<T> | string;
  // 표7
  tbl:Tbl;
  // 그림
  pic:Pic;
  // 묶음 객체
  container:any;
  // OLE
  ole:any;
  // 수식
  equation:any;
  // 선
  line:any;
  // 사각형
  rect:any;
  // 호
  ellipse:any;
  // 타원
  arc:any;
  // 다각형
  polygon:any;
  // 곡선
  curve:any;
  // 연결선
  connectLine:any;
  // 글맵시
  textart:any;
  // 글자 겹침
  compose:any;
  // 덧말
  dutmal:any;
  // 버튼
  btn:any;
  // 라디오 버튼
  radioBtn:any;
  // 체크 버튼
  checkBtn:any;
  // 콤보 박스
  comboBox:any;
  // 에디트
  edit:any;
  // 리스트 박스
  listBox:any;
  // 스크롤바
  scrollBar:any;
  // 비디오
  video:any; 
  // 웹으로 그릴 때 임의로 추가해야할 텍스트 좌표 실제 문서에는 없는 것.
  start:number;
  end:number;
}

export type FieldType = "WAB" | "USER_DEFINE"

export type Id = number | "";

/**
 * 메모, 외부연결, 북마크 등 문서 내에서 부가적인 부분들을 표현하기 위한 요소
 * @param { Id } id 아이디
 * @param { FieldType } type 필드 종류
 * @param { string } name 필드 이름
 * @param { boolean } editable 읽기 전용 상태에서도 수정 가능한지 여부
 * @param { boolean } dirty 필드 내용이 수정 되었는지 여부
 * @param { number } zOrder
 */
export interface FieldBegin {
  id: Id;
  type: FieldType;
  name: string;
  editable:boolean
  dirty:boolean
  zOrder:number
  parameters:any
  subList:SubList
}


/**
 * FieldBegin과 쌍을 이루는 요소
 * @param { Id } beginIDRef
 */
export interface FieldEnd {
  beginIDRef: Id;
}

/**
 * 책갈피
 * @param { string } 책갈피 이름
 */
export interface BookMark { 
  name:string;
}
/**
 * 본문 내 제어 관련 요소
 * @param { colPR } 단 설정 정보
 * @param { FieldBegin } fieldBegin 필드 시작
 * @param { FieldBegin } fieldEnd 필드 끝
 * @param { BookMark } bookMark 북마크
 * @param { Header } header 헤더
 * @param { Footer } footer 푸터
 * @param { FootNote } footNote 각주
 * @param { Endnote } endNote 주석
 * @param { AutoNum } autoNum 자동번호
 * @param { AutoNum } newNum 새 번호
 * @param { PageNumCtrl } pageNumCtrl 홀/짝수 조정
 * @param { PageHiding } pageHiding 페이지 숨김
 * @param { PageNum } pageNum 페이지 번호 형식
 * @param { IndexMark } indexmark 찾아보기 표식
 * @param { hiddenComment } 숨은 설명
 */
export interface Ctrl {
  colPr: ColPR;
  fieldBegin: FieldBegin;
  fieldEnd: FieldEnd;
  bookMark: BookMark;
  header: any;
  footer: any;
  footNote: any;
  endNote: any;
  autoNum: AutoNum;
  newNum: AutoNum;
  pageNumCtrl: any;
  pageHiding: any;
  pageNum: any;
  indexmark: any;
  hiddenComment: any;
}

export interface ColPR {
  id: null;
  type: string;
  layout: string;
  colCount: number;
  sameSz: number;
  sameGap: number;
}

export interface SecPR {
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

export interface AutoNum {
  autoNumFormat: AutoNumFormat;
  num: number;
  numType:NumberingType;
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
