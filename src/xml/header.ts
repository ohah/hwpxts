import { XML } from "../type";
import { Xml } from "./xml";

const { BEGIN_NUM, REF_LIST } = XML.Header;
export class XmlHeader extends Xml {
  /** 
   * @title beginNum 
   * @returns page : 페이지
   * @returns footnote : 주석
   * @returns endnote : 각주
   * @returns pic : 그림
   * @returns tbl : 테이블
   * @returns equation : 방정식(수식)
   * */
  get beginNum() {
    const { page, footnote, endnote, pic, tbl, equation } = this.document.querySelector(BEGIN_NUM).attributes as any;
    return {
      page : page.value,
      footnote : footnote.value,
      endnote : endnote.value,
      pic : pic.value,
      tbl : tbl.value,
      equation : equation.value,
    }
  }
  /** 
   * @title 참조리스트  
   * @returns page 페이지 
   * @returns footnote : 주석
   * @returns endnote : 각주
   * @returns pic : 그림
   * @returns tbl : 테이블
   * @returns equation : 방정식(수식)
   * */
  get refList() {
    const { FONT_FACES, BORDER_FILLS, CHAR_PROPERTIES, TAB_PROPERTIES, NUMBERINGS, PARA_PROPERTIES, STYLES } = REF_LIST;
    const LIST = { 
      fontFace : this.getFontFace(this.document.querySelector(FONT_FACES))
    }
    return {
      ...LIST
    }
  }
}