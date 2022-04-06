export enum HWPTAG {
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
   * 메모 모양
   * @length 22
   * @level 1
   * */
  DOC_DATA = HWPTAG.BEGIN + 11,
  /**
   * 문서 임의의 데이터(표 49 참조)
   * @length 가변
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
   * @length 가변
   * @level 1
   * */
  TRACK_CHANGE = HWPTAG.BEGIN + 80,
  /**
   * 변경 추적 작성자
   * @length 가변
   * @level 1
   * */
  TRACK_CHANGE_AUTHOR = HWPTAG.BEGIN + 81,
  /**
   * 바이너리 데이터(표 17 참조) 
   * @length 가변
   * @level 1
   * */

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