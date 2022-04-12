import { XMLBuilder } from "fast-xml-parser";
import { SECPR } from "../../hwpx/type/section";
import { Cursor } from "../cursor";
import { HwpBlob } from "../type";
import { Bit } from "../util";

/**
 * 구역 정의
 */
export const SECTION_DEFINE = (content:HwpBlob) => {
  const c = new Cursor(0);
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  /** 구역정의 속성 */
  const attribute = {
    /** 머리말을 감출지 여부 */
    hideFirstHeader: Bit(attr, 0, 0),
    /** 꼬리말을 감출지 여부 */
    hideFirstFooter: Bit(attr, 1, 1),
    /** 바탕쪽을 감출지 여부 */
    hideFirstMasterPage: Bit(attr, 2, 2),
    /** 테두리를 감출지 여부 */
    border: Bit(attr, 3, 3),
    /** 배경을 감출지 여부 */
    fill: Bit(attr, 4, 4),
    /** 쪽 번호 위치를 감출지 여부 */
    hideFirstPageNum: Bit(attr, 5, 5),
    /** 구역의 첫 쪽에만 테두리 표시 여부 Border랑 겹침..?*/
    hide_border_first_page: Bit(attr, 8, 8),
    /** 구역의 첫 쪽에만 배경 표시 여부 fill이랑 겹침...?*/
    hideFirstBackground: Bit(attr, 9, 9),
    /** 텍스트 방향(0 : 가로 1 : 세로) */  
    textDirection: Bit(attr, 16, 18),
    /** 빈 줄 감춤 여부 */
    hideFirstEmptyLine: Bit(attr, 19, 19),
    /** 구역 나눔으로 새 페이지가 생길 떄의 페이지 번호 적용할지 여부 */
    pagestartson: Bit(attr, 20, 21),
    /** 원고지 정서법 적용 여부 */
    wonggojiFormat: Bit(attr, 22, 22),
  }
  
  const result:any = {
    /** 구역정의 속성 */
    attribute : attribute,
    /** 단 사이의 간격  */
    spacecolumns: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 텍스트 방향(세로로 줄맞춤을 할지 여부) grid */
    lineGrid: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 텍스트 방향(가로로 줄맞춤을 할지 여부) grid */
    charGrid: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 기본탭 간격 */
    tabStop: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getInt32(0, true),
    /** 번호 문단 모양ID */
    outlineshapeidref: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 쪽 번호 */
    page: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 그림 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) */
    pic: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 표(테이블) 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) */
    tbl: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 수식 번호 (0 = 앞 구역에 이어, n = 임의의 번호로 시작) */
    equation: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 대표 Language */
    language: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  }
  console.log('무야', result, content.length);
  const { spacecolumns, lineGrid, charGrid, tabStop, outlineshapeidref, page, pic, tbl, equation, language } = result;
  const { hideFirstHeader, hideFirstFooter, hideFirstMasterPage, border, fill, hideFirstPageNum, hide_border_first_page, textDirection, hideFirstEmptyLine, pagestartson, wonggojiFormat } = attribute;
  /** 구역 정의 */
  const secd = {
    /** 구역정의 정보 */
    secpr:  {
      /**아이디 */
      id : null,
      /** 텍스트 방향(0 : 가로 1 : 세로) */
      textDirection: textDirection === 0? "HORIZONTAL" : "VERTICAL",
      /** 단 사이의 간격 */
      spacecolumns: spacecolumns,
      /** 기본탭 간격 */
      tabStop: tabStop,
      /** 번호 문단 모양 ID */
      outlineshapeidref: outlineshapeidref,
      /** 모름 메모 모양 설정 정보 아이디 참조값 */
      memoShapeIDRef: 0,
      /** 모름 머리말 /꼬리말 세로 쓰기 여부*/
      extVerticalWidthHead: 0,
      /** 모름 확장 바탕쪽 개수*/
      masterPageCnt: 0
    },
    /** 그리드 */
    grid : {
      /** 텍스트 방향(세로로 줄맞춤을 할지 여부) grid */
      lineGrid : lineGrid,
      /** 텍스트 방향(가로로 줄맞춤을 할지 여부) grid */
      charGrid : charGrid,
      /** 원고지 포맷 */
      wonggojiFormat : wonggojiFormat,
      strtnum : {
        pagestartson : pagestartson === 0 ? "BOTH" : pagestartson === 1 ? "EVEN" : "ODD",
        page : page,
        pic : pic,
        tbl : tbl,
        equation : equation,
        visibility : {
          /** 구역의 첫 쪽에만 배경 표시 여부 */
          hideFirstHeader : hideFirstHeader,
          border: "SHOW_ALL",
          fill: "SHOW_ALL",
          hideFirstEmptyLine: hideFirstEmptyLine,
          hideFirstFooter: hideFirstFooter,
          hideFirstMasterPage: 0,
          hideFirstPageNum: hideFirstPageNum,
          showLineNumber: 0,
        }
      }
    },
  }
  console.log('secd', JSON.stringify(secd));
  return result;
};

/**
 * 문단 정의
 * @param content 
 * @returns 
 * @missing_link 
 */
export const COLD_DEFINE = (content: HwpBlob) => {
  console.log('cold_size', content, content.length);
  const c = new Cursor(0);
  /** 속성의 bit */
  const attr = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  const data:any = {
    /** 단 종류 */
    type: Bit(attr, 0, 1) === 0 ? '일반' : Bit(attr, 0, 1) === 1 ? '배분' : '평행',
    /** 단 개수 1~255 */
    count: Bit(attr, 2, 9),
    /** 단 방향 지정 */
    direction: Bit(attr, 10, 11) === 0 ? '왼쪽' : Bit(attr, 10, 11) === 1 ? '오른쪽' : '맞쪽',
    /** 단 너비 동일하게 */
    same_width: Bit(attr, 12, 12),
    /** 단 사이의 간격 */
    spacecolumns: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 단 너비가 동일하지 않으면, 단의 개수만큼 단의 폭(2 * cnt) */
    // wordSize: new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getInt16(0, true),
    /** 속성의 bit 16-32 */
    attr2 : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    /** 단 구분선 종류 */
    lineType: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 단 구분선 굵기 */
    lineWeight: new DataView(new Uint8Array(content.slice(c.pos, c.move(1))).buffer, 0).getUint8(0),
    /** 단 구분선 색상 */
    lineColor: new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true),
  }
  if(data.count > 1) {
    /** 단 너비가 동일하지 않으면, 단의 개수만큼 단의 폭(2 * cnt) */
    data.wordSize = new DataView(new Uint8Array(content.slice(c.pos, c.move(2 * data.count))).buffer, 0).getInt16(0, true);
  }
  console.log('cold define', data);
  // const attr2 = new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true);
  return data;
  /** 속성의 bit 16-32 */
  /** 단 구분선 종류 */
}

export const PAGE_BORDER_FILL = (content: HwpBlob) => {
  const c = new Cursor(0);
  const attribute = new DataView(new Uint8Array(content.slice(c.pos, c.move(4))).buffer, 0).getUint32(0, true);
  const pageBorderFill:any = {
    offset : {
      left : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      right : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      top : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
      botom : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
    },
    borderFillIDRef : new DataView(new Uint8Array(content.slice(c.pos, c.move(2))).buffer, 0).getUint16(0, true),
  }
  pageBorderFill.textBorder = Bit(attribute, 0, 0) === 0 ? "CONTENT" : "PAPER";
  pageBorderFill.attribute.headerInside = Bit(attribute, 1, 1);
  pageBorderFill.attribute.footerInside = Bit(attribute, 2, 2);
  switch (Bit(attribute, 3, 4)) {
    case 0:
      pageBorderFill.fillArea = "PAPER";
      break;
    case 1:
      pageBorderFill.fillArea = "PAGE";
      break;
    case 2:
      pageBorderFill.fillArea = "BORDER";
      break;
  }
}