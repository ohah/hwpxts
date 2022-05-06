import hwpx from "../hwpx/hwpx";
import { P, PagePR, Run } from "../hwpx/type/section";
import { LineSeg } from "../xml/type";

interface SVGAttribute {
  [key:string]:string | number
}


export class SVGDocument {
  // 최상위 SVGElement를 반환한다.
  public root: SVGSVGElement;
  public file:hwpx;
  public page:SVGElement[];
  constructor(file:hwpx) {
    console.log('file', file);
    this.file = file;
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.page = this.page ? this.page : [];
    this.drawSection();
  }
  
  
  /**
   * 각 섹션별로 그리는 부분
   * @param section
   */
  async drawSection() {
    const section = await this.file.section;
    const content = await this.file.content;
    console.log('content', content);
    console.log('section', section);
    const { sec } = section[0];
    /**
     * 한줄만 있을때는 배열이 아님, 여러줄인 경우 배열.
     */
    if(sec.p.length) { 
      sec.p.flatMap((p:P) => {
        this.drawParagraph(p);
      })
    } else {
      this.drawParagraph(sec.p);
    }
    // await this.drawPage(section[0].sec.p[0].run[0].secPr.pagePr as PagePR);
    // console.log(section[0].sec.p.run[0].secPr.pagePr, this.page[0]);
    // if(this.page[0]) {
    //   this.page[0].addChild('text', {
    //     text : "text",
    //     x : 150,
    //     y : 125,
    //     "font-size": 60,
    //     "text-anchor": "middle",
    //     fill:"black"
    //   });
    // }
  }

  async drawParagraph(p:P) {
    /**
     * TODO : 쪽 나누기로 했을땐 pageBreak 값이 1이다
     * 그러나 단순히 엔터로 페이지가 넘어가는 경우에는 해당 정보를 구할 방법이 없다..?
     * linesegment의 이전값보다 이후 값의 좌표가 그 이전이면 페이지 넘김을 해야하나?
     * 그런데 객체나 텍스트의 위치가 그 이후이면서 페이지를 넘어가는 경우도 존재할 수 있다.
     * ???? 그럼 뭐로 구분??
     */
    // console.log(p);
    if(p.run.length > 0) {
      p.run.flatMap((run:Run) => {
        if(run.secPr) {
          this.drawPage(run.secPr.pagePr as PagePR);
        }
      });
    } else {
      const run = (p.run as any) as Run;
      const { linesegarray } = p;
      if(run.t) {
        // console.log('run', run.t, linesegarray.lineseg);
        if(["페이지2", "페이지3"].includes(run.t)) {
          console.log(run.t, linesegarray.lineseg);
        }
        if((linesegarray.lineseg as any).length) {
          for(let i = 0; i < (linesegarray.lineseg as any).length; i++) {
            const length = (linesegarray.lineseg as any).length;
            const lineseg = (linesegarray.lineseg as any)[i] as LineSeg;
            const nextlineseg = (linesegarray.lineseg as any)[i + 1] as LineSeg;
            const start = lineseg.textpos;
            const end = length !== i + 1 ? nextlineseg.textpos : (run.t as any).length;
            // console.log('start', start, 'end', end);
            this.page[this.page.length - 1].addChild("text", {
              y: linesegarray.lineseg[i].vertpos ? linesegarray.lineseg[i].vertpos.HWPUINT() : 0,
              x: linesegarray.lineseg[i].horzpos ? linesegarray.lineseg[i].horzpos.HWPUINT() : 0,
              width : linesegarray.lineseg[i].horzsize ? linesegarray.lineseg[i].horzsize.HWPUINT() : 0,
              height : linesegarray.lineseg[i].textheight ? linesegarray.lineseg[i].textheight.HWPUINT() : 0,
              text: run.t.substring(start, end),
            });
          }
        } else {
          this.page[this.page.length - 1].addChild("text", {
            y: linesegarray.lineseg.vertpos ? linesegarray.lineseg.vertpos.HWPUINT() : 0,
            x: linesegarray.lineseg.horzpos ? linesegarray.lineseg.horzpos.HWPUINT() : 0,
            width : linesegarray.lineseg.horzsize ? linesegarray.lineseg.horzsize.HWPUINT() : 0,
            height : linesegarray.lineseg.textheight ? linesegarray.lineseg.textheight.HWPUINT() : 0,
            text: run.t,
          });
        }
      }
    }
  }
  /**
   * 
   * @param name 
   * @param attr 
   */
  async drawPage(pagePr:PagePR) {
    const { gutterType, margin, landscape, width, height } = pagePr;
    this.root.setAttribute("width", `${width.HWPUINT()}px`);
    this.root.setAttribute("height", `${height.HWPUINT()}px`);
    this.page.push(this.addChild("g", {
      style : `margin-bottom:${margin.bottom.HWPUINT()}px;margin-top:${margin.top.HWPUINT()}px;margin-left:${margin.left.HWPUINT()}px;margin-right:${margin.right.HWPUINT()}px;`,
    }));
    this.page[this.page.length - 1].addChild("rect", {
      width: `${width.HWPUINT()}px`,
      height: `${height.HWPUINT()}px`,
      style : `margin-bottom:${margin.bottom.HWPUINT()}px;margin-top:${margin.top.HWPUINT()}px;margin-left:${margin.left.HWPUINT()}px;margin-right:${margin.right.HWPUINT()}px;`,
      fill:"#ffffff",
    })
  }
  /**
   * 하위 svg 요소 추가
   */
  addChild(name:string, attr:SVGAttribute):SVGElement {
    const child = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attr).forEach(key => {
      child.setAttribute(key, attr[key].toString());
    })
    this.root.appendChild(child);
    return child;
  }
  /**
   * 실제로 그리는 부분
   */
  run() {
    document.body.appendChild(this.root);
  }
}
export default SVGDocument;

declare global {
  interface Number {
    HWPUINT():number;
  }
  interface SVGElement {
    addChild(name:string, attr:SVGAttribute):SVGElement;
  }
}
SVGElement.prototype.addChild = function (name:string, attr:SVGAttribute):SVGElement {
  const child = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.keys(attr).forEach(key => {
    if(key === 'text') {
      child.textContent = attr[key].toString();
    } else {
      child.setAttribute(key, attr[key].toString());
    }
  })
  this.appendChild(child);
  return child;
}
Number.prototype.HWPUINT = function () {
  return (this / 7200) *  96;
}