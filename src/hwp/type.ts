import CFB from "cfb";
/**
 * Uint8array CFB.CFB$Blob
 */
export type HwpBlob = Uint8Array | CFB.CFB$Blob;
export enum HWPTAG {
  //DOC INFO
  BEGIN = 0x10,
  /**
   * 문서 속성(표 14 참조)
   * @length 30byte
   * @level 0
   * */
  DOCUMENT_PROPERTIES = 0x10,
  /**
   * 아이디 매핑 헤더(표 15 참조)
   * @length 32byte
   * @level 0
   * */
  ID_MAPPINGS = HWPTAG.BEGIN + 1,
  /**
   * 바이너리 데이터(표 17 참조)
   * @length 가변
   * @level 1
   * */
  BIN_DATA = HWPTAG.BEGIN + 2,
  /**
   * 글꼴(표 19 참조)
   * @length 가변
   * @level 1
   * */
  FACE_NAME = HWPTAG.BEGIN + 3,
  /**
   * 테두리/배경(표 23 참조)
   * @length 가변
   * @level 1
   * */
  BORDER_FILL = HWPTAG.BEGIN + 4,
  /**
   * 글자 모양(표 33 참조)
   * @length 72
   * @level 1
   * */
  CHAR_SHAPE = HWPTAG.BEGIN + 5,
  /**
   * 탭 정의(표 36 참조)
   * @length 14
   * @level 1
   * */
  TAB_DEF = HWPTAG.BEGIN + 6,
  /**
   * 탭 정의(표 36 참조)
   * @length 14
   * @level 1
   * */
  NUMBERING = HWPTAG.BEGIN + 7,
  /**
   * 글머리표(표 42 참조)
   * @length 10
   * @level 1
   * */
  BULLET = HWPTAG.BEGIN + 8,
  /**
   * 문단 모양(표 43 참조)
   * @length 54
   * @level 1
   * */
  PARA_SHAPE = HWPTAG.BEGIN + 9,
  /**
   * 스타일(표 47 참조)
   * @length 가변
   * @level 1
   * */
  STYLE = HWPTAG.BEGIN + 10,
  /**
   * 문서 임의의 데이터(표 49 참조)
   * @length 가변
   * @level 0
   * */
  DOC_DATA = HWPTAG.BEGIN + 11,
  /**
   * 배포용 문서
   * @length 256
   * @level 0
   * */
  DISTRIBUTE_DOC_DATA = HWPTAG.BEGIN + 12,
  /**
   * @DOC ~예약~
   * @SECTION 예약
   * @length 가변
   * @level 1
   * */
  RESERVED = HWPTAG.BEGIN + 13,
  /**
   * 호환 문서(표 54 참조)
   * @length 4
   * @level 0
   * */
  COMPATIBLE_DOCUMENT = HWPTAG.BEGIN + 14,
  /**
   * 레이아웃 호환성(표 56 참조)
   * @length 20
   * @level 1
   * */
  LAYOUT_COMPATIBILITY = HWPTAG.BEGIN + 15,
  /**
   * 변경 추적 정보
   * @length 1032
   * @level 1
   * */
  TRACKCHANGE = HWPTAG.BEGIN + 16,
  /**
   * 금칙처리 문자
   * @length 가변
   * @level 0
   * */
  FORBIDDEN_CHAR = HWPTAG.BEGIN + 78,
  /**
   * 변경 추적 내용 및 모양
   * @length 1032
   * @level 1
   * */
  TRACK_CHANGE = HWPTAG.BEGIN + 80,
  /**
   * 변경 추적 작성자
   * @length 가변
   * @level 1
   * */
  TRACK_CHANGE_AUTHOR = HWPTAG.BEGIN + 81,

  //SECTION

  /**
   * 문단 헤더(표 58 참조)
   * @length 22
   * @level 0
   * */
  PARA_HEADER = HWPTAG.BEGIN + 50,
  /**
   * 문단의 텍스트(표 60 참조)
   * @length 가변
   * @level 1
   * */
  PARA_TEXT = HWPTAG.BEGIN + 51,
  /**
   * 문단의 글자 모양(표 61 참조)
   * @length 가변
   * @level 1
   * */
  PARA_CHAR_SHAPE = HWPTAG.BEGIN + 52,
  /**
   * 문단의 레이아웃
   * @length 가변
   * @level 1
   * */
  PARA_LINE_SEG = HWPTAG.BEGIN + 53,
  /**
   * 문단의 영역 태그(표 63 참조)
   * @length 가변
   * @level 1
   * */
  PARA_RANGE_TAG = HWPTAG.BEGIN + 54,
  /**
   * 컨트롤 헤더(표 64 참조)
   * @length 4
   * @level 1
   * */
  CTRL_HEADER = HWPTAG.BEGIN + 55,
  /**
   * 문단 리스트 헤더(표 65 참조)
   * @length 6
   * @level 2
   * */
  LIST_HEADER = HWPTAG.BEGIN + 56,
  /**
   * 용지 설정
   * @length 40
   * @level 2
   * */
  PAGE_DEF = HWPTAG.BEGIN + 57,
  /**
   * 각주/미주 모양
   * @length 30
   * @level 2
   * */
  FOOTNOTE_SHAPE = HWPTAG.BEGIN + 58,
  /**
   * 쪽 테두리/배경
   * @length 14
   * @level 2
   * */
  PAGE_BORDER_FILL = HWPTAG.BEGIN + 59,
  /**
   * 개체
   * @length 4
   * @level 2
   * */
  SHAPE_COMPONENT = HWPTAG.BEGIN + 60,
  /**
   * 표 개체
   * @length 가변
   * @level 2
   * */
  TABLE = HWPTAG.BEGIN + 61,
  /**
   * 직선 개체
   * @length 20
   * @level 3
   * */
  SHAPE_COMPONENT_LINE = HWPTAG.BEGIN + 62,
  /**
   * 사각형 개체
   * @length 9
   * @level 3
   * */
  SHAPE_COMPONENT_RECTANGLE = HWPTAG.BEGIN + 63,
  /**
   * 타원 개체
   * @length 60
   * @level 3
   * */
  SHAPE_COMPONENT_ELLIPSE = HWPTAG.BEGIN + 64,
  /**
   * 호 개체
   * @length 25
   * @level 3
   * */
  SHAPE_COMPONENT_ARC = HWPTAG.BEGIN + 65,
  /**
   * 다각형 개체
   * @length 가변
   * @level 3
   * */
  SHAPE_COMPONENT_POLYGON = HWPTAG.BEGIN + 66,
  /**
   * 곡선 개체
   * @length 가변
   * @level 3
   * */
  SHAPE_COMPONENT_CURVE = HWPTAG.BEGIN + 67,
  /**
   * OLE 개체
   * @length 26
   * @level 3
   * */
  SHAPE_COMPONENT_OLE = HWPTAG.BEGIN + 68,
  /**
   * 그림 개체
   * @length 가변
   * @level 3
   * */
  SHAPE_COMPONENT_PICTURE = HWPTAG.BEGIN + 69,
  /**
   * 묶음 개체
   * @length 가변
   * @level ?
   * */
  SHAPE_COMPONENT_CONTAINER = HWPTAG.BEGIN + 70,
  /**
   * 컨트롤 임의의 데이터
   * @length 가변
   * @level 2
   * */
  CTRL_DATA = HWPTAG.BEGIN + 71,
  /**
   * 수식 개체
   * @length 가변
   * @level 2
   * */
  EQEDIT = HWPTAG.BEGIN + 72,
  /**
   * SECTION 임시처리
   * @length 가변
   * @level 1
   * */
  RESERVED2 = HWPTAG.BEGIN + 73,
  /**
   * 글 맵시
   * @length 가변
   * @level 3
   * */
  SHAPE_COMPONENT_TEXTART = HWPTAG.BEGIN + 74,
  /**
   * 양식 개체
   * @length 가변
   * @level 2
   * */
  FORM_OBJECT = HWPTAG.BEGIN + 75,
  /**
   * 메모 모양
   * @length 22
   * @level 1
   * */
  MEMO_SHAPE = HWPTAG.BEGIN + 76,
  /**
   * 메모 리스트 헤더
   * @length 4
   * @level 1
   * */
  MEMO_LIST = HWPTAG.BEGIN + 77,
  /**
   * 차트 데이터
   * @length 2
   * @level 2
   * */
  CHART_DATA = HWPTAG.BEGIN + 79,
  /**
   * 비디오 데이터
   * @length 가변
   * @level 3
   * */
  VIDEO_DATA = HWPTAG.BEGIN + 82,
  /**
   * Unknown
   * @length 36
   * @level 3
   * */
  SHAPE_COMPONENT_UNKNOWN = HWPTAG.BEGIN + 99,
}

/**
 * 0x17~0x49 까지 미싱링크
 * 0x78
 * 0x81
 * 0x83~0x98
 * 49개의 빈 레코드
 */

/**
 * 문서 이력 관리 레코드 정보
 * DocInfo에 새로 추가됨(5.017 버전 이후)
 */
export enum HISTORY {
  /**
   * 히스토리 아이템 정보 시작
   * WORD flag
   * UINT option
   */
  RECORD_TYPE_STAG = 0x10,
  /**
   * 버전 존재
   */
  INFO_FLAG_VERSION = 0x01,
  /**
   * 날짜 존재
   */
  INFO_FLAG_DATE = 0x02,
  /**
   * 작성자 존재
   */
  INFO_FLAG_WRITER = 0x04,
  /**
   * 설명 존재
   */
  INFO_FLAG_DESCRIPTION = 0x08,
  /**
   * Diff Data 존재
   */
  INFO_FLAG_DIFFDATA = 0x010,
  /**
   * 최근 문서 존재(기록하지 않음, 필수)
   */
  INFO_FLAG_LASTDOCDATA = undefined,
  /**
   * 현재 히스토리 아이템 Lock 상태
   */
  INFO_FLAG_LOCK = 0x40,
  /**
   * 문서 저장 시 자동 저장
   */
  HWPVERSION_AUTOSAVE = 0x00000001,
  /**
   * 히스토리 아이템 정보 끝
   */
  RECORD_TYPE_ETAG = 0x11,
  /**
   * 히스토리 아이템 버전
   */
  RECORD_TYPE_VERSION = 0x20,
  /**
   * 히스토리 날짜
   */
  RECORD_TYPE_DATE = 0x21,
  /**
   * 히스토리 작성자
   */
  RECORD_TYPE_WRITER = 0x22,
  /**
   * 히스토리 설명
   */
  RECORD_TYPE_DESCRIPTION = 0x23,
  /**
   * 비교정보
   */
  RECORD_TYPE_DIFFDATA = 0x30,
  /**
   * 가장 마지막 최근 문서
   */
  RECORD_TYPE_LASTDOCDATA = 0x31,
}


/**
 * 제어 문자(컨트롤)
 */
export enum Char {
  /**
   * 언유즈어블
   * @type char
   * @size 2
   */
  UNUSABLE = 0,
  /**
   * 예약
   * @type extended
   * @size 16
   */
  RESERVED_EXTENDED = 1 || 12 || 14,
  /**
   * 구역정의/단 정의
   * @type extended
   * @size 16
   */
  "ZONE/SINGLE_DEFINITION" = 2,
  /**
   * 필드 시작(누름틀, 하이퍼링크, 블록 책갈피, 표 계산식, 문서 요약, 사용자 정보, 현재 날짜/시간, 문서 날짜/시간, 파일 경로, 상호 참조, 메일 머지, 메모, 교정부호, 개인정보)
   * @type extended
   * @size 16
   */
  FIELD_START = 3,
  /**
   * 필드 끝
   * @type extended
   * @size 16
   */
  FIELD_END = 4,
  /**
   * 예약
   * @type inline
   * @size 16
   */
  RESERVED_INLINE = 5 || 6 || 7 || 19 || 20,
  /**
   * 타이틀 마크
   * @type inline
   * @size 16
   */
  TITLE_MARK = 8,
  /**
   * 탭
   * @type inline
   * @size 16
   */
  TAB = 9,
  /**
   * 한 줄 끝
   * @type char
   * @size 2
   */
  LINE_BREAK = 10,
  /**
   * 그리기 개체/표
   * @type extended
   * @size 16
   */
  "DRAWING_OBJECTS/TABLE" = 11,
  /**
   * 문단 끝
   * @type char
   * @size 2
   */
  PARA_BREAK = 13,
  /**
   * 숨은 설명
   * @type extended
   * @size 16
   */
  HIDDEN_EXPLANATION = 15,
  /**
   * 머리말/꼬리말
   * @type extended
   * @size 16
   */
  "FOOTER/PREFACE" = 16,
  /**
   * 각주/미주
   * @type extended
   * @size 16
   */
  "FOOTNOTE/ENDNOTE" = 17,
  /**
   * 자동번호(각주, 표 등)
   * @type extended
   * @size 16
   */
  AUTO_NUMBER = 18,
  /**
   * 페이지 컨트롤(감추기, 새 번호로 시작 등)
   * @type extended
   * @size 16
   */
  PAGE_CTRL = 21,
  /**
   * 책갈/찾아보기 표식
   * @type extended
   * @size 16
   */
  "BOOKMARK/BROWSE_MARK" = 22,
  /**
   * 덧말 글자 겹침
   * @type extended
   * @size 16
   */
  OVERLAP_WORD = 23,
  /**
   * 하이픈
   * @type char
   * @size 2
   */
  HYPEN = 24,
  /**
   * 예약
   * @type char
   * @size 2
   */
  RESERVED_CHAR = 25 || 26 || 27 || 28 || 29,
  /**
   * 묶음 빈칸
   * @type char
   * @size 2
   */
  BUNDLE_BLANK = 30,
  /**
   * 고정폭 빈칸
   * @type char
   * @size 2
   */
  FIXED_WIDTH_BLANK = 31,
}


/** CTRL_HEADER 개체 속성 */
export enum CTRL_ID {
  /** 테이블 TableCreation */
  tbl = "tbl ",
  /** 선(그리기 개체) */
  line = "$lin",
  /** 사각형(그리기 개체) */
  rec = "$rec",
  /** 타원(그리기 개체) */
  ell = "$ell",
  /** 호(그리기 개체) */
  arc = "$arc",
  /** 다각형(그리기 개체) */
  pol = "$pol",
  /** 곡선(그리기 개체) */
  cur = "$cur",
  /** 한글 97 수식(그리기 개체) EqEdit */
  eqed = "eqed",
  /** 그림 */
  pic = "$pic",
  /** OLE */
  ole = "$ole",
  /** 묶음 개체 */
  con = "$con",
  /** GenShapeObject(그리기 개체) ShapeObject */
  gso = "gso ",
  /** 단 ColDef */
  cold = "cold",
  /** 구역 SecDef */
  secd = "secd",
  /** 각주(footnoteShape) */
  fn = "fn  ",
  /** 미주(footnoteShape) */
  en = "en  ",
  /** 번호넣기(AutoNum) */
  atno = "atno",
  /** 번호넣기(AutoNum) 새 번호로 */
  nwno = "nwno",
  /** 페이지 번호 제어(pgct) PageNumCtrl */
  pgct = "pgct",
  /** 감추기(pghd) PageHiding */
  pghd = "pghd",
  /** 머리말 HeaderFooter */
  head = "head",
  /** 꼬리말 HeaderFooter */
  foot = "foot",
  /** 현재의 날짜/시간 필드 FieldCtrl */
  dte = "%dte",
  /** 파일 작성 날짜/시간 필드 FieldCtrl */
  ddt = "%ddt",
  /** 문서 경로 필드 FieldCtrl */
  pat = "%pat",
  /** 블럭 책갈피 FieldCtrl */
  bmk = "%bmk",
  /** 메일 머지 FieldCtrl */
  mmg = "%mmg",
  /** 상호 참조 FieldCtrl */
  xrf = "%xrf",
  /** 계산식 FieldCtrl */
  fmu = "%fmu",
  /** 누름틀 FieldCtrl */
  clk = "%clk",
  /** 문서 요약 정보 필드 FieldCtrl */
  smr = "%smr",
  /** 사용자 정보 필드 FieldCtrl*/
  usr = "%usr",
  /** 하이퍼링크 FieldCtrl */
  hlk = "%hlk",
  /** 책갈피 TextCtrl */
  bokm = "bokm",
  /** 찾아보기 IndexMark */
  idxm = "idxm",
  /** 덧말 Dutmal */
  tdut = "tdut",
  /** 없음(주석) */
  tcmt = "tcmt",
}

/**
 * FILED CTRL_ID 에 대한 속성
 */
export enum FIELD {
  /** UNKNOWN */
  UNKNOWN = "%unk",
  /** 날짜 */
  DATE = "%dte",
  /** DOCDATE */
  DOCDATE = "%ddt",
  /** 파일 경로 */
  FILEPATH = "%pat",
  /** 블럭 책갈피 */
  BOOKMARK = "%bmk",
  /** 메일 머지 */
  MAILMERGE = "%mmg",
  /** 상호 참조 */
  XREF = "%xrf",
  /** 계산식 */
  FORMULA = "%fmu",
  /** 누름틀 */
  CLOCK = "%clk",
  /** 문서 요약 정보 */
  SUMMARY = "%smr",
  /** 사용자 정보 */
  USERINFO = "%usr",
  /** 하이퍼링크 */
  HYPERLINK = "%hlk",
  /** REVISION_SIGN(개정판) */
  REVISION_SIGN = "%sig",
  /** REVISION_DELETE */
  REVISION_DELETE = "%%*d",
  /** REVISION_ATTACH */
  REVISION_ATTACH = "%%*a",
  /** REVISION_CLIPPING */
  REVISION_CLIPPING = "%%*C",
  /** REVISION_SAWTOOTH */
  REVISION_SAWTOOTH = "%%*S",
  /** REVISION_THINKING */
  REVISION_THINKING = "%%*T",
  /** REVISION_PRAISE */
  REVISION_PRAISE = "%%*P",
  /** REVISION_LINE */
  REVISION_LINE = "%%*L",
  /** REVISION_SIMPLECHANGE */
  REVISION_SIMPLECHANGE = "%%*c", 
  /** REVISION_HYPERLINK */
  REVISION_HYPERLINK = "%%*h",
  /** REVISION_LINEATTACH */
  REVISION_LINEATTACH = "%%*A",
  /** REVISION_LINELINK */
  REVISION_LINELINK = "%%*i",
  /** REVISION_LINETRANSFER */
  REVISION_LINETRANSFER = "%%*t",
  /** REVISION_RIGHTMOVE */
  REVISION_RIGHTMOVE = "%%*r",
  /** REVISION_LEFTMOVE */
  REVISION_LEFTMOVE = "%%*l",
  /** REVISION_TRANSFER */
  REVISION_TRANSFER = "%%*n",
  /** REVISION_SIMPLEINSERT */
  REVISION_SIMPLEINSERT = "%%*e",
  /** REVISION_SPLIT */
  REVISION_SPLIT = "%spl",
  /** REVISION_CHANGE */
  REVISION_CHANGE = "%%mr",
  /** MEMO */
  MEMO = "%%me",
  /** PRIVATE_INFO_SECURITY */
  PRIVATE_INFO_SECURITY = "%cpr",
  /** TABLEOFCONTENTS */
  TABLEOFCONTENTS = "%toc",
}
/**
 * 컨트롤 개체의 속성
 */
export enum CtrlCode {
  /** 구역/단 정의 */
 "ZONE/SINGLE_DEFINITION" = 2,
  /** 필드 시작 */
  FIELD_START = 3,
  /** 그리기 개체 /표 */
  DRAWING_OBJECT_TABLE = 11,
  /** 주석 */
  COMMENT = 15,
  /** 머리말 / 꼬리말 */
  HEADER_FOOTER = 16,
  /** 각주 / 미주 */
  FOOTNOTE = 17,
  /** 자동번호 */
  AUTO_NUMBER = 18,
  /** 새번호/번호 감추기/번호 위치 */
  NEW_NUMBER_HIDING_POSITION = 21,
  /** 책갈피 / 찾아보기 표시 */
  BOOKMARK_INDEX_MARK = 22,
  /** 덧말 / 글자 겹침 */
  DUTMAL_OVERLAP = 23,
}