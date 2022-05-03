export class SVGDocument {
  // 최상위 SVGElement를 반환한다.
  public root: SVGSVGElement;
  constructor() {
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }

  createPage() {
    // svg.style.width = "100px";
    // return svg;
  }
  run() {
    document.appendChild(this.root);
  }
}
export default SVGDocument;