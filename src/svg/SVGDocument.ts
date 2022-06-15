import "./util";
import hwpx from "../hwpx/hwpx";
import { P, PagePR, Run } from "../hwpx/type/section";
import { FixRGB } from "../hwpx/util";
import { LineSeg } from "../xml/type";
import { Object2Array, RunDraw } from "./util";
import { Header } from "../type";
import { HwpDocument } from "../util/HwpDocument";
export class SVGDocument {
  // 최상위 SVGElement를 반환한다.
  /** 루트(페이지당) */
  public root: SVGSVGElement;
  // 미리보기 감싸는 div
  public wrapper:HTMLElement;
  public file:hwpx;
  static header:Promise<Header>
  public page:SVGElement[];
  public pagePr:PagePR;
  public style:CSSStyleSheet;
  constructor() {
    this.file = HwpDocument.hwpx;
    this.wrapper = document.createElement('div');
    this.wrapper.style.margin = "0 auto";
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.root.setAttribute("version", "1.1");
    this.root.style.width = "100%";
    // this.root.setAttribute("viewBox", "0 0 1200 1200");
    this.root.setAttribute("preserveAspectRatio", "xMidYMid meet");
    this.page = this.page ? this.page : [];
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");    
    style.type = "text/css";
    style.title = "hwpxStyle";
    style.id = "hwpXStyle";
    document.head.appendChild(style);
    const CSSStyle = Object.values(document.styleSheets).find((sheet) => {      
      return sheet.title === "hwpxStyle"
    });

    this.style = CSSStyle;
    if(this.style) {
      this.drawHeader();
    }
    this.drawSection();
  }
  
  async drawHeader() {
    console.log('this', this.file);
    const header = await this.file.header;
    console.log('header', header);
    const { borderFills, charProperties, fontfaces, numberings, paraProperties, styles, tabProperties } = header.head.refList;
    // borderFills.borderFill.forEach((borderFill) => {
    //   const { slash, backSlash, leftBorder, rightBorder, topBorder, bottomBorder, diagonal, id, threeD, shadow, centerLine, breakCellSeparateLine, fillBrush } = borderFill;
    //   console.log(id, borderFill)
    //   if(fillBrush) {
    //     const { winBrush } = fillBrush
    //     const fill = FixRGB(winBrush.faceColor);
    //     this.style.insertRule(`g[data-border-fill-ref-id="${id}"] rect { fill: ${fill}; }`, 0);
    //   }
    // });
    console.log(this.style);
    styles.style.forEach((style) => {
      // console.log('style', style);
      const { name, type, id, paraPrIDRef, charPrIDRef } = style;
      const css = [];
      css.push(`content:"${name}"`);
      const paraPr = paraProperties.paraPr.find(paraPr => paraPr.id === paraPrIDRef);
      const charPr = charProperties.charPr.find(charPr => charPr.id === charPrIDRef);
      const { lineSpacing, align, margin, border, tabPRIDRef } = paraPr;
      const tabPr = tabProperties.tabPr.find(tabPr => tabPr.id === tabPRIDRef);
      const { height, supscript, subscript, italic, bold, underline, strikeout, outline, emboss, engrave, spacing, offset, ratio, relSz, shadeColor, textColor, fontRef } = charPr;
      const langHANGUL = fontfaces.fontface.find(fontface => fontface.lang === "HANGUL").font.find(font => font.id === fontRef.hangul);
      // console.log('langHANGUL', langHANGUL);
      // console.log('paraPr', style, name, paraPr, paraPrIDRef, charPr, tabPr);
      const { face, typeInfo } = langHANGUL;
      css.push(`font-family:"${face}"`);
      const { familyType, serifStyle, weight, proportion, contrast, strokeWidth, armStyle, letterform, midline, xHeight } = typeInfo;
      
      if(weight) css.push(`font-weight:${weight * 100}`);
      else css.push(`font-weight:normal`);
      if(familyType) css.push(`font-style:${familyType}`);
      else css.push(`font-style:normal`);
      if(italic) {
        css.push(`font-style:italic`);
      }
      if(bold) {
        css.push(`font-weight:bold`);
      }
      if(underline) {
        css.push(`text-decoration:underline`);
      }
      if(strikeout) {
        css.push(`text-decoration:line-through`);
      }
      if(subscript) {
        css.push(`font-variant:subscript`);
      }
      if(supscript) {
        css.push(`font-variant:superscript`);
      }
      if(spacing.hangul) {
        css.push(`letter-spacing:${spacing.hangul}%`);
      } else {
        css.push(`letter-spacing:0px`);
      }
      // const font = langHANGUL.font.find(fontface => fontface.id === fontRef.hangul);
      if(textColor) {
        css.push(`fill:${FixRGB(textColor)}`);
      }
      if(shadeColor) {
        css.push(`background-color:${shadeColor}`);
      }
      // 글자 크기
      if(height) {
        css.push(`font-size:${height.HWPUINT("pt")}pt`);
      }
      const borderFill = borderFills.borderFill.find(borderFill => borderFill.id === border.borderFillIDRef);
      if(lineSpacing.type === "PERCENT") {
        css.push(`line-height:${lineSpacing.value}%`);
      }
      css.push(`text-align:${align.horizontal}`);
      if(margin) {
        const { left, intent, next, prev, right } = margin;
        if(left.value && left.unit === "HWPUNIT") {
          css.push(`margin-left:${left.value.HWPUINT("pt")}pt`);
        }
        if(right.value && right.unit === "HWPUNIT") {
          css.push(`margin-right:${right.value.HWPUINT("pt")}pt`);
        }
        if(intent.value > 0 && intent.unit === "HWPUNIT") {
          css.push(`text-indent:${intent.value.HWPUINT("pt")}pt`);
        }
        if(next.value && next.unit === "HWPUNIT") {
          css.push(`margin-top:${next.value.HWPUINT("pt")}pt`);
        }
        if(prev.value && prev.unit === "HWPUNIT") {
          css.push(`margin-bottom:${prev.value.HWPUINT("pt")}pt`);
        }
      }
      // const { border } = paraProperties.paraPr[id];
      // console.log(css);
      this.style.insertRule(`${`.HStyle${id}`}{${css.join(";")}}`, id);
    });
    charProperties.charPr.forEach((charPr, i) => {
      const { id, textColor, shadeColor, offset, height, underline, strikeout, fontRef, italic, bold, outline, subscript, supscript, spacing, relSz, ratio } = charPr;
      // console.warn(`charPr${i}` , charPr, textColor);
      const borderfill = borderFills.borderFill.find(borderfill => borderfill.id === id);
      const fontface = fontfaces.fontface.find(fontface => fontface.lang === "HANGUL");
      // console.log('charPr', charPr, borderfill, fontface);
      const css = [];
      if(spacing) {
        if(spacing.hangul !== 0) {
          css.push(`letter-spacing:${spacing.hangul / 100}em`);
        }
      }
      if(typeof italic !== "undefined") {
        css.push(`font-style:italic`);
      }
      if(typeof bold !== "undefined") {
        css.push(`font-weight:bold`);
      }
      if(underline) {
        const { type, color, shape } = underline;
        if(type === "TOP") {
          css.push(`text-decoration:overline`);
        }
        if(type === "BOTTOM") {
          css.push(`text-decoration:underline`);
        }
        css.push(`text-decoration-color:${FixRGB(color)}`);
      }
      if(strikeout) {
        const { color, shape } = strikeout;
        css.push(`text-decoration:line-through`);
        css.push(`text-decoration-color:${FixRGB(color)}`);
      }
      css.push(`fill:${FixRGB(textColor)};`);
      css.push(`font-size:${height.HWPUINT("pt")}pt;`);
      // console.log(css);
      this.style.insertRule(`${`.CharStyle${id}`}{${css.join(";")}}`, id);
    });
    paraProperties.paraPr.forEach((paraPr, i) => {
      
    });
  }

  /**
   * 각 섹션별로 그리는 부분
   * @param section
   */
  async drawSection() {
    const section = await this.file.section;
    const content = await this.file.content;
    // console.log('section', section);
    // console.log('content', content);
    // console.log("test", await this.file.version);
    const { sec } = section[0];
    /**
     * 한줄만 있을때는 배열이 아님, 여러줄인 경우 배열.
     */
    if (sec.p.length) {
      sec.p.flatMap((p:P) => {
        this.drawParagraph(p);
      });
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
     * TODO : 우선은 페이지 마지막 줄인지 아닌지를 계산하여 페이지를 추가 하는 형태로 함. pareBreak도 계산.
     */
    // console.log(p);
    if(p.run.length > 0) {
      p.run.flatMap((run:Run) => {
        if(run.secPr) {
          this.drawPage(run.secPr.pagePr as PagePR);
        }
      });
      const run = p.run.find((run)=>run.t)
      const { linesegarray, pageBreak } = p;
      if(pageBreak === 1 && this.pagePr) {
        this.drawPage(this.pagePr);
      }
      this.addPage(p);
    } else {
      const run = (p.run as any) as Run;
      const { linesegarray, pageBreak } = p;
      if(pageBreak === 1 && this.pagePr) {
        this.drawPage(this.pagePr);
      }
      this.addPage(p);
    }
    const page = RunDraw(p, this.page[this.page.length - 1]);
    this.page[this.page.length - 1] = page;
  }

  /**
   * 페이지 개행을 구분하는 함수
   */
  async addPage(p: P) {
    const { pageBreak } = p;
    const { linesegarray } = p;
    const { margin, height: pageHeight } = this.pagePr;
    const { bottom, footer, header, top } = margin;
    // 1개의 정보만 있을댄 오브젝트로 리턴되는데 사용하기 편하게 하기 위해서 모두 배열로 변경
    if (Array.isArray(p.linesegarray.lineseg) === false) {
      (p.linesegarray.lineseg as LineSeg[]) = new Array(p.linesegarray.lineseg as LineSeg)
    }
    const textheight = linesegarray.lineseg[0].textheight ? linesegarray.lineseg[0].textheight : 0;
    const y = linesegarray.lineseg[0].vertpos ? linesegarray.lineseg[0].vertpos : 0;
    const pagePos = textheight + y + bottom + footer + header + top;
    // console.log('compare', pageHeight, pagePos);
    if(pagePos + textheight > pageHeight) {
      this.drawPage(this.pagePr);
    }
  }

  /**
   * 
   * @param name 
   * @param attr 
   */
  async drawPage(pagePr:PagePR) {
    this.pagePr = pagePr;
    const { gutterType, margin, landscape, width, height } = pagePr;
    this.root.setAttribute("viewBox", `0 0 ${width.HWPUINT()} ${height.HWPUINT()}`);
    this.root.style.transform = "scale(0.95)"
    // this.root.setAttribute("width", `${width.HWPUINT()}px`);
    // this.root.setAttribute("height", `${height.HWPUINT()}px`);
    const pageWrapper = this.root.cloneNode(true) as SVGElement;
    
    // 페이지 사각형.
    pageWrapper.addChild("rect", {
      // x:`${margin.left.HWPUINT()}`,
      // y:`${(margin.top + margin.header).HWPUINT()}`,
      // transfrom:"translate(-25, 0)",
      width: `${width.HWPUINT()}px`,
      height: `${height.HWPUINT()}px`,
      // width:"100%",
      // height:"100%",
      // style : `margin-bottom:${margin.bottom.HWPUINT()}px;margin-top:${margin.top.HWPUINT()}px;margin-left:${margin.left.HWPUINT()}px;margin-right:${margin.right.HWPUINT()}px;`,
      fill:"#ffffff",
    });
    // this.root.setAttribute(`height`, `${height.HWPUINT()}px`);
    // 페이지 크기 svg 엘리먼트
    this.page.push(pageWrapper.addChild("svg", {
      x:`${margin.left.HWPUINT()}px`,
      y:`${(margin.top + margin.header).HWPUINT()}px`,
      // transfrom:"translate(-25, 0)",
      // width: `${width.HWPUINT()}px`,
      // height: `${height.HWPUINT()}px`,
      style: `overflow:visible;`,
      // viewBox: `0 0 ${width.HWPUINT()}px ${height.HWPUINT()}px`,
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
    document.querySelector("#hwp").appendChild(this.wrapper);
    // document.body.appendChild(this.wrapper);
  }
}
export default SVGDocument;
