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
   **/
 SOLID = "SOLID",
 /**
  * 점선
  * 동일한 굵기를 가지지만 중간중간에 동일한 간격으로 끊어짐이 있는 선이다.
  **/
 DOT = "DOT",
 /**
  * 굵은 선
  * SOLID 형태의 선으로 SOLID 형식의 선보다는 굵은 선이다.
  **/
 DASH = "DASH",
 /**
  * 긴 점선
  * 중간중간에 끊어짐이 있는 선으로, 끊어진 선들의 길이가 다른 선이다. 길이가 짧은 선과 길이가 긴 선이 번갈아가면서 나오는 선이다.
  **/
 DASH_DOT = "DASH_DOT",
 /**
  * 긴 점선 점선 점선
  * DASH 형식의 선에서 짧은 선 대신 점이 2개 들어간 형태의 선이다.
  **/
 DASH_DOT_DOT = "DASH_DOT_DOT",
}
enum Enum_LineType2 {
  NONE = "없음",
  /**
   * DASH
   * DASH 형태의 선으로 DASH 형식의 선보다는 선을 구성하는 단위 선의 길이가 긴 선이다
   **/
  LONG_DASH = "LONG_DASH",
  /**
   * DOT
   * DOT 형태의 선으로 DOT 형식의 선보다는 점의 굵기가 굵다
   **/
  CIRCLE = "CIRCLE",
  /**
   * DOUBLE_SLIM
   * SOLID 형식의 선이 이중으로 나란히 표현되는 선이다.
   **/
  DOUBLE_SLIM = "DOUBLE_SLIM",
  /**
   * SLIM_THICK
   * 위쪽에는 SOLID 형식의 선이, 아래쪽에는 THICK 형식의 선이 나란이 표현되는 선이다.
   **/
  SLIM_THICK = "SLIM_THICK",
  /**
   * THICK_SLIM
   * 위쪽에는 THICK 형식의 선이, 아래쪽에는 SOLID 형식의 선이 나란이 표현되는 선이다.
   **/
  THICK_SLIM = "THICK_SLIM",
  /**
   * SLIM_THICK_SLIM
   * SOLID 형식의 선과 THICK 형식의 선이 삼중으로 나란히 표현되는 선이다. 제일 위에는 SOLID 형식의 선이, 중간에는 THICK 형식의 선이, 아래에는 다시 SOLID 형식의 선이 나란히 표현된다.
   **/
  SLIM_THICK_SLIM = "SLIM_THICK_SLIM",
}


enum Enum_LineType3 {
  /* 물결선 */
  WAVE = "WAVE",
  /* 이중물결선 */
  DOUBLE_WAVE = "DOUBLE_WAVE",
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

export type RGBColorType = ("/^#[0-9a-fA-F]{6}$/");

export type LineType1 = Enum_LineType;

export type LineType2 = Enum_LineType | Enum_LineType2;

export type LineType3 = Enum_LineType | Enum_LineType2 | Enum_LineType3;



export interface ColumnDefType {
  type : LineType2,
  width : LineWidth,
  color : RGBColorType,
}
