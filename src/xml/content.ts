import { XML } from "../type";
import { Xml } from "./xml";

export class XmlContent extends Xml {
  /** 문서 제목 */
  get title ():string {
    return this.document.querySelector(XML.Content.TITLE).textContent ? this.document.querySelector(XML.Content.TITLE).textContent : ''
  }

  /** 언어 */
  get language ():string {
    return this.document.querySelector(XML.Content.LANGUAGE).textContent ? this.document.querySelector(XML.Content.LANGUAGE).textContent : ''
  }

  /** 작성자 */
  get creator ():string {
    return this.document.querySelector(XML.Content.CREATOR).textContent ? this.document.querySelector(XML.Content.CREATOR).textContent : ''
  }

  /** 설명 */
  get description ():string {
    return this.document.querySelector(XML.Content.DESCRIPTION).textContent ? this.document.querySelector(XML.Content.DESCRIPTION).textContent : ''
  }

  /** 마지막 편집자 */
  get lastsaveby ():string {
    return this.document.querySelector(XML.Content.LAST_SAVE_BY).textContent ? this.document.querySelector(XML.Content.LAST_SAVE_BY).textContent : ''
  }

  /** 생성일 */
  get createdDate ():string {
    return this.document.querySelector(XML.Content.CREATED_DATE).textContent ? this.document.querySelector(XML.Content.CREATED_DATE).textContent : ''
  }

  /** 수정일 */
  get modifiedDate ():string {
    return this.document.querySelector(XML.Content.MODIFIED_DATE).textContent ? this.document.querySelector(XML.Content.MODIFIED_DATE).textContent : ''
  }
  
  /** 수정일 */
  get date ():string {
    return this.document.querySelector(XML.Content.DATE).textContent ? this.document.querySelector(XML.Content.DATE).textContent : ''
  }
}