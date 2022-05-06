import hwpx from "../hwpx/hwpx";
import { P, PagePR, Run } from "../hwpx/type/section";
import { LineSeg } from "../xml/type";

interface SVGAttribute {
  [key:string]:string | number
}


export class SVGDocument {
  // 최상위 SVGElement를 반환한다.
  /** 루트(페이지당) */
  public root: SVGSVGElement;
  // 미리보기 감싸는 div
  public wrapper:Element;
  public file:hwpx;
  public page:SVGElement[];
  constructor(file:hwpx) {
    console.log('file', file);
    this.file = file;
    this.wrapper = document.createElement('div');
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.root.setAttribute("version", "1.1");
    this.root.setAttribute("viewBox", "0 0 1200 1200");
    this.root.setAttribute("preserveAspectRatio", "xMidYMid meet");
    // this.root.setAttribute("width", "100%");
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
      console.log('p.run', p.run);
      const run = p.run.find((run)=>run.t)
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
            const text = this.page[this.page.length - 1].addChild("text", {
              y: linesegarray.lineseg[i].vertpos ? linesegarray.lineseg[i].vertpos.HWPUINT() : 0,
              x: linesegarray.lineseg[i].horzpos ? linesegarray.lineseg[i].horzpos.HWPUINT() : 0,
              // width : linesegarray.lineseg[i].horzsize ? linesegarray.lineseg[i].horzsize.HWPUINT() : 0,
              // height : linesegarray.lineseg[i].textheight ? linesegarray.lineseg[i].textheight.HWPUINT() : 0,
            });
            text.addChild("tspan", {
              dx:0,
              dy:0,
              y: linesegarray.lineseg[i].vertpos ? linesegarray.lineseg[i].vertpos.HWPUINT() : 0,
              x: linesegarray.lineseg[i].horzpos ? linesegarray.lineseg[i].horzpos.HWPUINT() : 0,
              width : linesegarray.lineseg[i].horzsize ? linesegarray.lineseg[i].horzsize.HWPUINT() : 0,
              height : linesegarray.lineseg[i].textheight ? linesegarray.lineseg[i].textheight.HWPUINT() : 0,
              text : run.t.substring(start, end),
            })
          }
        } else {
          const text = this.page[this.page.length - 1].addChild("text", {
            y: linesegarray.lineseg.vertpos ? linesegarray.lineseg.vertpos.HWPUINT() : 0,
            x: linesegarray.lineseg.horzpos ? linesegarray.lineseg.horzpos.HWPUINT() : 0,
            // width : linesegarray.lineseg.horzsize ? linesegarray.lineseg.horzsize.HWPUINT() : 0,
            // height : linesegarray.lineseg.textheight ? linesegarray.lineseg.textheight.HWPUINT() : 0,
            // text: run.t,
          });
          text.addChild("tspan", {
            dx:0,
            dy:0,
            width : linesegarray.lineseg.horzsize ? linesegarray.lineseg.horzsize.HWPUINT() : 0,
            height : linesegarray.lineseg.textheight ? linesegarray.lineseg.textheight.HWPUINT() : 0,
            text : run.t,
          })
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
    // this.root.setAttribute("width", `${width.HWPUINT()}px`);
    // this.root.setAttribute("height", `${height.HWPUINT()}px`);
    const pageWrapper = this.root.cloneNode(true) as SVGElement;
    
    // 페이지 사각형.
    pageWrapper.addChild("rect", {
      x:`${width.HWPUINT() / 4}px`,
      y:0,
      // transfrom:"translate(-25, 0)",
      width: `${width.HWPUINT()}px`,
      height: `${height.HWPUINT()}px`,
      // width:"100%",
      // height:"100%",
      
      // style : `margin-bottom:${margin.bottom.HWPUINT()}px;margin-top:${margin.top.HWPUINT()}px;margin-left:${margin.left.HWPUINT()}px;margin-right:${margin.right.HWPUINT()}px;`,
      fill:"#ffffff",
    });

    // 페이지 크기 svg 엘리먼트
    this.page.push(pageWrapper.addChild("svg", {
      // width: `${width.HWPUINT()}`,
      // height: `${height.HWPUINT()}`,
      x: `${(width.HWPUINT() / 4) + margin.left.HWPUINT()}`,
      y: `${margin.top.HWPUINT()}`,
      style: `overflow:visible;`
      // viewBox: "0 0 100 100",
      // x: "1000px",
      // y: "1000px",
      // fill:"#000000",
      // "stroke-width": "10",
      // style : `overflow:visible;margin-bottom:${margin.bottom.HWPUINT()}px;margin-top:${margin.top.HWPUINT()}px;margin-left:${margin.left.HWPUINT()}px;margin-right:${margin.right.HWPUINT()}px;`,
    }));
   
    this.wrapper.appendChild(pageWrapper);
  }
  /**
   * 실제로 그리는 부분
   */
  run() {
    document.body.appendChild(this.wrapper);
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
  // child.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  // child.setAttribute("version", "1.1");
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