/**
 * asdf
 */
export const XML = {
  /**
   * Content
   * @prefix hh
   */
  Header: {
    /** page, footnote, endnote, pic, tbl, eqation */
    BEGIN_NUM: "*|beginNum",
    /** 참조 리스트 */
    REF_LIST: {
      FONT_FACES : "*|fontfaces",
      BORDER_FILLS : "*|borderFills",
      CHAR_PROPERTIES : "*|charProperties",
      TAB_PROPERTIES : "*|tabProperties",
      NUMBERINGS : "*|numberings",
      PARA_PROPERTIES : "*|paraProperties",
      STYLES : "*|styles",
    },
    /** 금지단어 목록 */
    FORBIDDEN_WORD_LIST: "*|forbiddenWordList",
    /** 문서 옵션 */
    DOC_OPTION: "*|docOption",
    /** 트랙변경구성 */ 
    TRACK_CHAGE_CONFIG: `*|trackchageConfig`,
  },
  /**
   * Content
   * @prefix opf
   */
  Content: {
    //부모 메타데이터 선언
    METADATA: "*|metadata",
    /** 제목 */
    TITLE: "*|title", //asdf
    /** 언어 */ 
    LANGUAGE: `*|language`,
    /** 생성자 */
    CREATOR: `*|meta[name="creator"]`,
    /** 제목 */
    SUBJECT: `*|meta[name="subject"]`,
    /** 설명 */
    DESCRIPTION: `*|meta[name="description"]`,
    /** 마지막 수정자 */
    LAST_SAVE_BY: `*|meta[name="lastsaveby"]`,
    /** 생성일 */
    CREATED_DATE: `*|meta[name="CreatedDate"]`,
    /** 수정일 */
    MODIFIED_DATE: `*|meta[name="ModifiedDate"]`,
    /** 날짜 */
    DATE: `*|meta[name="date"]`,
    /** 키워드 */
    KEYWORD: `*|meta[name="keyword"]`,
  },
} as const;

/**asdf */
export type XML = typeof XML[keyof typeof XML];
