export class Xml {
  public document: Document;
  constructor(document: Document) {
    this.document = document;
  }

  getFontFace(document: Element) {
    console.log("document", document);
    const childs = document.childNodes;
    const data = Object.values(childs).map((child:Element) => {
      const { lang, fontCnt } = child.attributes as any
      
      Object.values(child.childNodes).map((node) => {
        console.log(lang.value, fontCnt.value, node);
      });
      return { [`${child.nodeName}`]: child };
    });
  }

  getChild(document: Element) {
    console.log("document", document);
    const childs = document.childNodes;
    const data = Object.values(childs).map((child) => {
      Object.values(child.childNodes).map((node) => {
        console.log(node);
      });
      return { [`${child.nodeName}`]: child };
    });
  }
}
