/** VisibilityValue */
export enum VisibilityValue {
  HIDE_FIRST = "HIDE_FIRST",
  SHOW_FIRST = "SHOW_FIRST",
  SHOW_ALL = "SHOW_ALL",
}

enum Enum_LineType {
  /**
   * 실선
   * 중간에 끊어짐이 없이 동일한 굵기로 이어지는 선이다.
   * @value none
   **/
  NONE = "없음",
  /**
   * 실선
   * 중간에 끊어짐이 없이 동일한 굵기로 이어지는 선이다.
   * @value 0
   **/
  SOLID = "SOLID",
  /**
   * 점선
   * 동일한 굵기를 가지지만 중간중간에 동일한 간격으로 끊어짐이 있는 선이다.
   * @value 2
   **/
  DOT = "DOT",
  /**
   * 굵은 선(긴 점선)
   * SOLID 형태의 선으로 SOLID 형식의 선보다는 굵은 선이다.
   * @value 1
   **/
  DASH = "DASH",
  /**
   * 긴 점선
   * 중간중간에 끊어짐이 있는 선으로, 끊어진 선들의 길이가 다른 선이다. 길이가 짧은 선과 길이가 긴 선이 번갈아가면서 나오는 선이다.
   * @value 3
   **/
  DASH_DOT = "DASH_DOT",
  /**
   * 긴 점선 점선 점선
   * DASH 형식의 선에서 짧은 선 대신 점이 2개 들어간 형태의 선이다.
   * @value 4 
   **/
  DASH_DOT_DOT = "DASH_DOT_DOT",
}
enum Enum_LineType2 {
  /**
   * DASH
   * DASH 형태의 선으로 DASH 형식의 선보다는 선을 구성하는 단위 선의 길이가 긴 선이다
   * @value 5
   **/
  LONG_DASH = "LONG_DASH",
  /**
   * DOT
   * DOT 형태의 선으로 DOT 형식의 선보다는 점의 굵기가 굵다
   * @value 6
   **/
  CIRCLE = "CIRCLE",
  /**
   * DOUBLE_SLIM
   * SOLID 형식의 선이 이중으로 나란히 표현되는 선이다.
   * @value 7
   **/
  DOUBLE_SLIM = "DOUBLE_SLIM",
  /**
   * SLIM_THICK
   * 위쪽에는 SOLID 형식의 선이, 아래쪽에는 THICK 형식의 선이 나란이 표현되는 선이다.
   * @value 8
   **/
  SLIM_THICK = "SLIM_THICK",
  /**
   * THICK_SLIM
   * 위쪽에는 THICK 형식의 선이, 아래쪽에는 SOLID 형식의 선이 나란이 표현되는 선이다.
   * @value 9
   **/
  THICK_SLIM = "THICK_SLIM",
  /**
   * SLIM_THICK_SLIM
   * SOLID 형식의 선과 THICK 형식의 선이 삼중으로 나란히 표현되는 선이다. 제일 위에는 SOLID 형식의 선이, 중간에는 THICK 형식의 선이, 아래에는 다시 SOLID 형식의 선이 나란히 표현된다.
   * @value 10
   **/
  SLIM_THICK_SLIM = "SLIM_THICK_SLIM",
}

enum Enum_LineType3 {
  /** 
   * 물결선 
   * @value 11
   */
  WAVE = "WAVE",
  /**
   * 이중물결선(물결 2중선)
   * @value 12
   */
  DOUBLE_WAVE = "DOUBLE_WAVE",
  /**
   * Hwpx에서는 없는 선임. 
   * 두꺼운 3D
   * @value 13
   * 두꺼운 3D(광원 반대)
   * @value 14
   * 3D 단선
   * @value 15
   * 3D 단선(광원 반대)
   * @value 16
   */
  NONE = "NONE"
}

/** 단위 mm(float) */
export enum LineWidth {
  "#0.1" = 0.1,
  "#0.12" = 0.12,
  "#0.15" = 0.15,
  "#0.2" = 0.2,
  "#0.25" = 0.25,
  "#0.3" = 0.3,
  "#0.4" = 0.4,
  "#0.5" = 0.5,
  "#0.6" = 0.6,
  "#0.7" = 0.7,
  "#1.0" = 1.0,
  "#1.5" = 1.5,
  "#2.0" = 2.0,
  "#2.5" = 2.5,
  "#3.0" = 3.0,
  "#4.0" = 4.0,
  "#5.0" = 5.0,
}

export type RGBColorType = "/^#[0-9a-fA-F]{6}$/";

/** 라인 Type */
export const LineType1 = { ...Enum_LineType };
export type LineType1 = typeof LineType1;
/** 라인 Type2 */
export const LineType2 = { ...Enum_LineType ,...Enum_LineType2 };
export type LineType2 = typeof LineType2;

/** 라인 Type3 */
export const LineType3 = { ...Enum_LineType ,...Enum_LineType2, ...Enum_LineType3 };
export type LineType3 = typeof LineType3;

export type LineType = {
  [K in keyof LineType3]: {
    [K2 in keyof LineType3[K]]: LineType3[K][K2]
  }[keyof LineType3[K]]
}[keyof LineType3];

export interface ColumnDefType {
  type: LineType2;
  width: LineWidth;
  color: RGBColorType;
}

/**
 * 언어(한글, 영어, 한자, 일어, 기타, 심볼, 사용자)
 * Language
 */
export enum Lang {
  HANGUL = "HANGUL",
  LATIN = "LATIN",
  HANJA = "HANJA",
  JAPANESE = "JAPANESE",
  OTHER = "OTHER",
  SYMBOL = "SYMBOL",
  USER = "USER",
}

/**
 * 중심선 종류
 * CenterLine
 */
export enum CenterLine {
  NONE = "NONE",
  VERTICAL = "VERTICAL",
  HORIZONTAL = "HORIZONTAL",
  CROSS = "CROSS",
}

/** 타겟 프로그램 */
export enum TargetProgram {
  HWP201X = "HWP201X",
  HWP200X = "HWP200X",
  MS_WORD = "MS_WORD",
}

/** 글꼴 계열 */
export enum FamilyType {
  /** 없음 */
  FCAT_UNKNOWN,
  /** 명조(serif) */
  FCAT_MYUNGJO,
  /** 고딕(sans-serif) */
  FCAT_GOTHIC,
  /** 굴림(monospace) */
  FCAT_SSERIF,
  /** cursive */
  FCAT_BRUSHSCRIPT,
  /** cursive */
  FCAT_DECORATIVE,
  /** serif */
  FCAT_NONRECTMJ,
  /** sans-serif */
  FCAT_NONRECTGT
}

/**
 * NumberType1
 */
export enum NumberType1 {
  DIGIT = "DIGIT",
  /** 동그라미 쳐진 1,2,3 */
  CIRCLED_DIGIT = "CIRCLED_DIGIT",
  /** I, II, III */
  ROMAN_CAPITAL = "ROMAN_CAPITAL",
  /** i, ii, iii */
  ROMAN_SMALL = "ROMAN_SMALL",
  /** A, B, C */
  LATIN_CAPITAL = "LATIN_CAPITAL",
  /** a, b, c */
  LATIN_SMALL = "LATIN_SMALL",
  /** 동그라미 쳐 진 A,B,C */
  CIRCLED_LATIN_CAPITAL = "CIRCLED_LATIN_CAPITAL",
  /** 동그라미 쳐 진 a,b,c */
  CIRCLED_LATIN_SMALL = "CIRCLED_LATIN_SMALL",
  /** 가, 나, 다 */
  HANGUL_SYLLABLE = "HANGUL_SYLLABLE",
  /** 동그라미 쳐진 가, 나,다 */
  CIRCLED_HANGUL_SYLLABLE = "CIRCLED_HANGUL_SYLLABLE",
  /** ㄱ, ㄴ, ㄷ */
  HANGUL_JAMO = "HANGUL_JAMO",
  /** 동그라미 쳐진 ㄱ, ㄴ, ㄷ */
  CIRCLED_HANGUL_JAMO = "CIRCLED_HANGUL_JAMO",
  /** 일, 이, 삼 */
  HANGUL_PHONETIC = "HANGUL_PHONETIC",
  /** 一, 二, 三 */
  IDEOGRAPH = "IDEOGRAPH",
  /** 동그라미 쳐진 一, 二, 三 */
  CIRCLED_IDEOGRAPH = "CIRCLED_IDEOGRAPH",
}

/** NumberType2 */
export enum NumberType2 {
  DIGIT = "DIGIT",
  /** 동그라미 쳐진 1,2,3 */
  CIRCLED_DIGIT = "CIRCLED_DIGIT",
  /** I, II, III */
  ROMAN_CAPITAL = "ROMAN_CAPITAL",
  /** i, ii, iii */
  ROMAN_SMALL = "ROMAN_SMALL",
  /** A, B, C */
  LATIN_CAPITAL = "LATIN_CAPITAL",
  /** a, b, c */
  LATIN_SMALL = "LATIN_SMALL",
  /** 동그라미 쳐 진 A,B,C */
  CIRCLED_LATIN_CAPITAL = "CIRCLED_LATIN_CAPITAL",
  /** 동그라미 쳐 진 a,b,c */
  CIRCLED_LATIN_SMALL = "CIRCLED_LATIN_SMALL",
  /** 가, 나, 다 */
  HANGUL_SYLLABLE = "HANGUL_SYLLABLE",
  /** 동그라미 쳐진 가, 나,다 */
  CIRCLED_HANGUL_SYLLABLE = "CIRCLED_HANGUL_SYLLABLE",
  /** ㄱ, ㄴ, ㄷ */
  HANGUL_JAMO = "HANGUL_JAMO",
  /** 동그라미 쳐진 ㄱ, ㄴ, ㄷ */
  CIRCLED_HANGUL_JAMO = "CIRCLED_HANGUL_JAMO",
  /** 일, 이, 삼 */
  HANGUL_PHONETIC = "HANGUL_PHONETIC",
  /** 一, 二, 三 */
  IDEOGRAPH = "IDEOGRAPH",
  /** 동그라미 쳐진 一, 二, 三 */
  CIRCLED_IDEOGRAPH = "CIRCLED_IDEOGRAPH",
  /** 갑, 을, 병, 정, 무, 기, 경, 신, 임, 계 */
  DACAGON_CIRCLE = "DACAGON_CIRCLE",
  /** 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸, */
  DAGON_CIRCLE_HANJA = "DAGON_CIRCLE_HANJA",
  /** 4가지 문자가 차례로 반복 */
  SYMBOL = "SYMBOL",
  /** 사용자 지정 문자 반복 */
  USER_CHAR = "USER_CHAR",
}
