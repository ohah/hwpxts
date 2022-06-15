import { Cursor } from "../hwp/cursor";
import { BORDER_FILLS } from "../hwp/util/SetID";
import HwpDocument from "../util/HwpDocument";
import { Lineseg, P, PagePR, Pic, Run, T } from "../hwpx/type/section";
import { FixRGB } from "../hwpx/util";
import { CellZone, LineSeg, Tbl, Tc, TcObject, Tr } from "../xml/type";
import { Header } from "../type";
export interface SVGAttribute {
  [key:string]:string | number
}

declare global {
  interface Number {
    HWPUINT(type?:"pt" | "px" | undefined):number;
  }
  interface SVGElement {
    addChild(name:string, attr:SVGAttribute):SVGElement;
    addSvg(svg:SVGElement):SVGElement;
  }
}

SVGElement.prototype.addSvg = function (svg:SVGElement):SVGElement {
  this.appendChild(svg);
  return this;
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
Number.prototype.HWPUINT = function (type?:"pt" | "px" | undefined):number {
  if(type === "px" || type === undefined) {
    return (this / 7200) *  96;
  } else {
    return this / 100;
  }
}

export const Object2Array = <T extends {}>(object):T[] => {
  return Array.isArray(object) === true ? object : [object]
  // if (Array.isArray(object) === false) {
  //   (object as T[]) = [object as T]
  // }
  // return object;
}

/**
 * 
 * @param p Run 그리기
 */
export const RunDraw = (p:P, page:SVGElement) => {
  const runs = Array.isArray(p.run) === true ? p.run : [p.run];
  // if(Object.keys(runs).includes("t")) {
  //   console.warn('있냐', p.run);
  //   (p.run as any).t = Object2Array((p.run as any).t);
  //   (p.run as any).t = Array.isArray((p.run as any).t) === true ? (p.run as any).t : [(p.run as any).t];
  // }
  // 1개의 정보만 있을댄 오브젝트로 리턴되는데 사용하기 편하게 하기 위해서 모두 배열로 변경
  p.linesegarray.lineseg = Object2Array(p.linesegarray.lineseg);
  // console.log('runs', runs);
  const { linesegarray, pageBreak, columnBreak, merged, paraPrIDRef, styleIDRef } = p;
  // console.log(p.run, p.run.length, p, linesegarray);
  const text = page.addChild('text', {});
  text.setAttribute("y", `${linesegarray.lineseg[0].vertpos.HWPUINT()}`)
  text.setAttribute("x", `${linesegarray.lineseg[0].horzpos.HWPUINT()}`)
  const c = new Cursor(0);
  
  let start = 0;
  // // 깊은 복사
  const tempRuns = JSON.parse(JSON.stringify(runs));
  // console.warn("tempRuns", tempRuns);
  runs.map((run:any, i) => {
    if(run.t || run.t == "") {
      run.t = Object2Array<Partial<T>>(run.t);
      run.t.forEach((ele, k) => {
        if(typeof ele === "string") {
          run.t[k] = {
            text:ele,
            length:ele.length,
            start:start,
            end:start + ele.length,
            charPrIDRef:run.charPrIDRef,
          }
          start = start + ele.length;
        }
      });
    }
    return run;
  });
  // const allText = runs.map((run) => run.t).join("");
  linesegarray.lineseg.forEach((lineseg, j)=> {
    const length = linesegarray.lineseg.length;
    const nextlineseg = linesegarray.lineseg[j + 1];
    const Text = page.addChild("text", {
      y: linesegarray.lineseg[j].vertpos ? linesegarray.lineseg[j].vertpos.HWPUINT() : 0,
      // textLength:linesegarray.lineseg[j].horzsize ? linesegarray.lineseg[j].horzsize.HWPUINT() : 0,
      // "word-spacing":"0.1rem",
      textLength:length > 1 && j === 0 ? linesegarray.lineseg[j].horzsize.HWPUINT() : 0,
      // x: linesegarray.lineseg[i].horzpos ? linesegarray.lineseg[i].horzpos.HWPUINT() : 0,
      class: `HStyle${styleIDRef}`,
    });
    const start = lineseg.textpos;
    // textCursor.move(end);
    runs.forEach((run, k)=> {
      // console.warn(runs, run, linesegarray);
      const { charPrIDRef, t, ctrl, tbl, pic } = run as Run;
      // console.log('단일텍스트', t, allText);
      // 단일 텍스트 일 때
      // const t = t.join("")
      if(pic) {
        console.log('pic', pic, run);
        SvgPic(p, page);
      } else if(tbl) {
        SvgTable(p, page);
        // page.addSvg(table);
      } else if(Array.isArray(t)) { 
        t.forEach((t:any, q) => {
          // const condition = t.start >= start && t.end >= end;
          const condition = t.start >= start;
          if(t && t.text) {
            t.text = t.text.replace(/ /g, '\u00a0');
          } else {
            return false;
          }
          const { text, markpenBegin } = t;
          const end = length !== j + 1 ? nextlineseg.textpos : (text as any).length;
          if(text && markpenBegin == undefined) {
            if(condition) {
              Text.addChild("tspan", {
                // dx:0,
                // dy:0,
                // y: linesegarray.lineseg[i].vertpos ? linesegarray.lineseg[i].vertpos.HWPUINT() : 0,
                // x: linesegarray.lineseg[i].horzpos ? linesegarray.lineseg[i].horzpos.HWPUINT() : 0,
                // width : linesegarray.lineseg[i].horzsize ? linesegarray.lineseg[i].horzsize.HWPUINT() : 0,
                // height : linesegarray.lineseg[i].textheight ? linesegarray.lineseg[i].textheight.HWPUINT() : 0,
                // textLength:linesegarray.lineseg[j].horzsize ? linesegarray.lineseg[j].horzsize.HWPUINT() : 0,
                text : `${text.substring(start, end - t.start)}`,
                class: `CharStyle${charPrIDRef}`,
              })
            } else if(t.end <= end) {
              Text.addChild("tspan", {
                text : `${text.substring(start, end - t.start)}`,
                class: `CharStyle${charPrIDRef}`,
              })
            } else {
              // page.removeChild(Text);
              Text.addChild("tspan", {
                text : `${text.substring(start, end)}`,
                class: `CharStyle${charPrIDRef}`,
              })
            }
          } else if(markpenBegin) {
            // console.log('크으으으음영');
            const { markpenBegin, markpenEnd, text } = t as Partial<T>;
            if(markpenBegin) { // 음영
              Text.addChild("tspan", {
                dx:0,
                dy:0,
                y: linesegarray.lineseg[j].vertpos ? linesegarray.lineseg[j].vertpos.HWPUINT() : 0,
                x: linesegarray.lineseg[j].horzpos ? linesegarray.lineseg[j].horzpos.HWPUINT() : 0,
                width : linesegarray.lineseg[j].horzsize ? linesegarray.lineseg[j].horzsize.HWPUINT() : 0,
                height : linesegarray.lineseg[j].textheight ? linesegarray.lineseg[j].textheight.HWPUINT() : 0,
                text : text.substring(start, end),
                style: `${markpenBegin.color ? `filter:url(#${textBgColor(page, markpenBegin.color).id})` : ""};`,
                class: `CharStyle${charPrIDRef}`,
              })
            }
          }
          if(ctrl) {
            const { colPr, fieldEnd, fieldBegin, bookMark, header, footer, footNote, endNote, autoNum, newNum, pageNumCtrl, pageHiding, pageNum, indexmark, hiddenComment } = ctrl;
            if(autoNum) {
              // const Text = page.addChild("text", {
              //   y: linesegarray.lineseg[i].vertpos ? linesegarray.lineseg[i].vertpos.HWPUINT() : 0,
              //   x: linesegarray.lineseg[i].horzpos ? linesegarray.lineseg[i].horzpos.HWPUINT() : 0,            
              //   class: `HStyle${styleIDRef}`,
              // });
              Text.addChild("tspan", {
                dx:0,
                dy:0,
                width: linesegarray.lineseg[j].horzsize ? linesegarray.lineseg[j].horzsize.HWPUINT() : 0,
                height: linesegarray.lineseg[j].textheight ? linesegarray.lineseg[j].textheight.HWPUINT() : 0,
                text: `${autoNum.num}`,
                class: `CharStyle${charPrIDRef}`,
              })
              // 한번만 출력하면 되므로 지워줌.
              delete ctrl.autoNum;
            }
          }
        });
      } else if (typeof t === 'object' && Array.isArray(t) === false) {
        // console.log('오브젝트', run, t);
        // console.log('시발이다', t, run);
      } else if(typeof tbl === 'object') {
        // console.log('tbl2',tbl, linesegarray);
        // const { id, table } = SvgTable(p);
        // page.addSvg(table);
      } else {
        // console.log('시발롬', typeof t);
      }
      
    })
  });
  
  
  return page;
}


/**
 * p.t or p.text를 받아 그림
 * @returns 
 */
export const RunText = (t:Partial<T> | string[]) => {
  if(Array.isArray(t)) {
    t.forEach(_t => {
      if(typeof _t === 'string') {
        const t = _t;
        console.log('문자열', t);
      } else {
        const t = _t as T;
        console.log('오브젝트', t);
      }
    });
  }
}

export const textBgColor = (element:SVGElement, color:string) => {
  const defs = element.addChild("defs", {});
  const id = Math.random().toString(36).substring(2, 15);
  const filter = defs.addChild("filter", {
    x:0,
    y:0,
    width:1,
    height:1,
    id: id,
  })
  filter.addChild("feFlood", {
    "flood-color": FixRGB(color),
  })
  const fgMerage = filter.addChild("feMerge", {})
  fgMerage.addChild("feMergeNode", {
    in:"bg"
  })
  fgMerage.addChild("feMergeNode", {
    in:"SourceGraphic"
  });
  return {
    defs: defs,
    id: id,
  };
}

export const SvgTable = (p:P, page:SVGElement) => {
  const runs = p.run.length ? p.run.filter(run => run) : [p.run];
  // console.warn('runs', runs);
  // 1개의 정보만 있을댄 오브젝트로 리턴되는데 사용하기 편하게 하기 위해서 모두 배열로 변경
  p.linesegarray.lineseg = Object2Array(p.linesegarray.lineseg);
  const { linesegarray } = p;
  const result = runs.map(run => {
    const { tbl } = run as Run;
    if(tbl.cellzoneList && Array.isArray(tbl.cellzoneList.cellzone) === false) {
      (tbl.cellzoneList.cellzone as CellZone[]) = [tbl.cellzoneList.cellzone as any]
    }
    const { borderFillIDRef, caption, cellSpacing, colCnt, dropcapstyle, id, inMargin, lock, noAdjust, numberingType, outMargin, pageBreak, pos, repeatHeader, rowCnt, sz, textFlow, textWrap, tr, zOrder, cellzoneList } = tbl;
    const table = document.createElementNS("http://www.w3.org/2000/svg", "g");
    table.setAttribute("id", `table-${id}`);
    table.setAttribute("name", "table");
    // table.setAttribute("data-border-fill-ref-id", `${borderFillIDRef}`);
    table.setAttribute("width", `${sz.width}`);
    table.setAttribute("height", `${sz.height}`);
    table.style.marginLeft = `${outMargin.left ? outMargin.left.HWPUINT() : 0}px`;
    table.style.marginTop = `${outMargin.top ? outMargin.top.HWPUINT() : 0}px`;
    table.style.marginRight = `${outMargin.right ? outMargin.right.HWPUINT() : 0}px`;
    table.style.marginBottom = `${outMargin.bottom ? outMargin.bottom.HWPUINT() : 0}px`;
    page.addSvg(table);
    const [x , y] = [`${ caption && caption.side === "LEFT" ? linesegarray.lineseg[0].horzpos.HWPUINT() + caption.lastWidth.HWPUINT() : linesegarray.lineseg[0].horzpos.HWPUINT()}`, `${linesegarray.lineseg[0].vertpos.HWPUINT()}`];
    const defs = table.addChild("g", {});
    if(caption) {
      const { side, lastWidth, gap, fullSz, subList  } = caption;
      // console.log('caption', caption);
      const captionSvg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      captionSvg.setAttribute("name", `caption`);
      if(side === "TOP") { 
        captionSvg.setAttribute("transform", `translate(${x},${parseFloat(y) - gap.HWPUINT()})`);
      } else if(side === "BOTTOM") {
        captionSvg.setAttribute("transform", `translate(${x},${parseFloat(y) + sz.height.HWPUINT() + gap.HWPUINT() * 2 })`);
      } else if(side === "RIGHT") {
        if(subList.vertAlign === "TOP") {
          captionSvg.setAttribute("transform", `translate(${parseFloat(x) + sz.width.HWPUINT()},${parseFloat(y) + gap.HWPUINT()})`);
        } else if(subList.vertAlign === "CENTER") {
          captionSvg.setAttribute("transform", `translate(${parseFloat(x) + sz.width.HWPUINT()},${parseFloat(y) + sz.height.HWPUINT() / 2})`);
        } else if(subList.vertAlign === "BOTTOM") {
          captionSvg.setAttribute("transform", `translate(${parseFloat(x) + sz.width.HWPUINT()},${parseFloat(y) + sz.height.HWPUINT()})`);
        }
      } else if(side === "LEFT") {
        if(subList.vertAlign === "TOP") {
          captionSvg.setAttribute("transform", `translate(${parseFloat(x) - lastWidth.HWPUINT()},${parseFloat(y) + gap.HWPUINT()})`);
        } else if(subList.vertAlign === "CENTER") {
          captionSvg.setAttribute("transform", `translate(${parseFloat(x) - lastWidth.HWPUINT()},${parseFloat(y) + sz.height.HWPUINT() / 2})`);
        } else if(subList.vertAlign === "BOTTOM") {
          captionSvg.setAttribute("transform", `translate(${parseFloat(x) - lastWidth.HWPUINT()},${parseFloat(y) + sz.height.HWPUINT()})`);
        }
      }
      
      defs.addSvg(RunDraw(subList.p as any as P, captionSvg));
    }
    try { // 단일행
      if((tr as any).tc && (tr as any).tc.subList) {
        (tr[0] as any) = {tc: [(tr as any).tc]};
        delete (tr as any).tc;
      }
    } catch (e) {
      // console.warn('e', tr);
    }
    if((tr as any).tc && !(tr as any).tc.subList) { // 단일행 여러셀
      const temp = (tr as any).tc;
      (tr[0] as any) = {tc : temp}
      delete (tr as any).tc;
    }
    Object.values(tr).forEach((tr, index) => {
      if(Array.isArray(tr.tc) === false) {
        (tr.tc as any) = [tr.tc];
      }
    });
    /**
     * 테이블 셀 위치 계산하여 정렬
     */
    const TablePosCalCulator = ({table, cell}:{table:SVGElement, cell:SVGElement}) => {
      const row = parseInt(cell.getAttribute("row"));
      const col = parseInt(cell.getAttribute("col"));
      const g = table.querySelectorAll("[data-row][data-col]");
      // console.log('g', g);
      const rowCell = Object.values(g).find((cell:SVGElement) => {
        if(cell.dataset.row.split(",").includes(`${row - 1}`) && cell.dataset.col.split(",").includes(`${col}`)) {
          return cell;
        }
      })
      const colCell = Object.values(g).find((cell:SVGElement) => {
        if(cell.dataset.row.split(",").includes(`${row}`) && cell.dataset.col.split(",").includes(`${col - 1}`)) {
          return cell;
        }
      })
      if(rowCell) {
        const rect = rowCell.querySelector('rect');
        const svg = rowCell.querySelector('svg');
        const pos = rect.getBBox()
        cell.querySelector("rect").setAttribute("y", `${pos.y + pos.height}px`);
        cell.querySelector("svg").setAttribute("y", `${pos.y + pos.height}px`);
      }
      if(colCell) {
        const rect = colCell.querySelector('rect');
        const svg = colCell.querySelector('svg');
        const pos = rect.getBBox()
        cell.querySelector("rect").setAttribute("x", `${pos.x + pos.width}px`);
        cell.querySelector("svg").setAttribute("x", `${pos.x + pos.width}px`);
      }
    };
    const result = Object.values(tr).forEach((tr, q) => {
      return Object.values(tr.tc).forEach((tc:Tc, k)=>{
        const cell = SvgCell({
          id: id,
          cell: tc,
          pos : {
            x: x,
            y: y
          },
          tbl: tbl,
        });
        defs.addSvg(cell);
        TablePosCalCulator({table, cell});
        return {
          tc:tc,
          cell:cell,
        };
      })
    });
    // break;
    return {
      id:"1",
      table: table,
    };
    let height = 0;

    // 테이블이 병합되어 있는 경우 그만큼 셀 개수가 생략되기에, 다시 추가 해줌
    const Table = new Array(tbl.rowCnt).fill(true).map((row, i)=>{
      return new Array(tbl.colCnt).fill(true).map((col, j)=>{
        let data:Partial<Tc> = {};
        Object.values(tr).forEach((tr, q) => {
          Object.values(tr.tc).forEach((tc:Tc, k)=>{
            tc.subList.p.linesegarray.lineseg = Object2Array(tc.subList.p.linesegarray.lineseg);
            if(tc.cellAddr.colAddr === j && tc.cellAddr.rowAddr === i) {
              data = tc;
            } 
          })
        });
        return {
          rowAddr: i,
          colAddr: j,
          ...data,
        }
      });
    });
    Table.map((row, i) => {
      return row.map((tc, j) => {
        // console.log('tc', tc, Object.keys(tc));
        if(Object.keys(tc).length > 2) {          
          if(tc.cellSpan.rowSpan > 1) {
            //최초 행은 제거하기 위해 1부터 시작
            for(let k = 1; k < tc.cellSpan.rowSpan; k++) {
              const Idx = tc.cellAddr.rowAddr + k;
              delete tc.subList;
              Table[Idx][tc.cellAddr.colAddr] = {
                ...tc,
                cellSz : {
                  ...tc.cellSz,
                  // height:0,
                },
              }
            }
          }
          if(tc.cellSpan.colSpan > 1) {
            //최초 행은 제거하기 위해 1부터 시작
            for(let k = 1; k < tc.cellSpan.colSpan; k++) {
              const Idx = tc.cellAddr.colAddr + k;
              delete tc.subList;
              Table[tc.cellAddr.rowAddr][Idx] = {
                ...tc,
                cellSz : {
                  ...tc.cellSz,
                  width:0,
                },
                // cellSpan: {
                //   ...tc.cellSpan,
                //   colSpan:0,
                // }
              }
            }
          }
          tc = {
            ...tc,
            cellAddr : {
              rowAddr: i,
              colAddr: j,
            },
          }
        };
        return tc;
      })
    });
    console.log('table', Table); 
    let prevHeight = 0;
    const drawTable = Table.map((row, i) => {
      let width = 0;
      const rowMaxheight = Math.max(...Object.values(row.flat().map(cell => {
        if(cell.cellSz.height > 0) {
          return cell.cellSz.height
        } else if(cell.subList) {
          console.log('subList', cell.subList.p.linesegarray);
          return (cell.cellMargin.top + cell.cellMargin.bottom + cell.subList.p.linesegarray.lineseg[0].textheight);
        } else {
          return prevHeight
        }
      })) as number[]).HWPUINT();
      prevHeight = rowMaxheight;
      height += i === 0 ? 0 : rowMaxheight;
      return row.map((tc, j) => {
        width += j === 0 ? 0 : row[j - 1].cellSz.width.HWPUINT();
        try {
          return {
            row: tc.cellAddr.rowAddr,
            col: tc.cellAddr.colAddr,
            cellSz: {
              width:width,
              height:height,
            },
            linesegarray : tc.subList.p.linesegarray
          }
        }catch(e) {
          return {
            row: tc.cellAddr.rowAddr,
            col: tc.cellAddr.colAddr,
            cellSz: {
              width:width,
              height:height,
            },
          }
        }
      })
    });
    // console.warn('drawTable', drawTable, tr);
    Object.values(tr).forEach((row, i) => {
      Object.values(row.tc).forEach((tc:Tc, k) => {
        const { rowAddr, colAddr } = tc.cellAddr;
        const pos = drawTable.flat().find((cellSz, k) => {
          if(rowAddr == cellSz.row && colAddr == cellSz.col) {
            return cellSz;
          }
        })
        const cell = SvgCell({
          id: id,
          cell: tc,
          pos : {
            x: pos ? `${parseFloat(x) + pos.cellSz.width}` : x,
            y: pos ? `${parseFloat(y) + pos.cellSz.height}` : y
          },
          tbl: tbl,
        });
        defs.addSvg(cell);
      });
    });
    return {
      id : `table-${id}`,
      table : table,
    }
  });
  return result[0];
}


interface Pos {
  x: string,
  y: string,
}
/**
 * @param {id} id 각각의 요소마다 있어야 함
 * @param {Tc} cell 셀 받아 그림
 */
export const SvgCell = ({id, cell, pos, tbl,}:{id:number, cell:Tc, pos:Pos, tbl:Tbl}) => {
  // console.log('ㅅㅂ', test);
  const { x , y } = pos;
  // if(cell.cellAddr.rowAddr >= 2) {
  //   console.warn('y', y);
  // }
  const { cellzoneList } = tbl;
  if(tbl.cellzoneList && Array.isArray(tbl.cellzoneList.cellzone) === false) {
    tbl.cellzoneList.cellzone = Object2Array(tbl.cellzoneList.cellzone);
  }
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  let row, col;
  try {
    row = cell.cellAddr.rowAddr ? cell.cellAddr.rowAddr : 0
    col = cell.cellAddr.colAddr ? cell.cellAddr.colAddr : 0
  }catch(e) {
    console.warn('error', cell, tbl)
  }
  
  g.setAttribute("row", `${row}`);
  g.setAttribute("col", `${col}`);
  g.setAttribute("id", `t-${id}-${row}-${col}`);
  g.dataset.row = new Array(cell.cellSpan.rowSpan).fill(0).map((_, i) => row + i).join(',');
  g.dataset.col = new Array(cell.cellSpan.colSpan).fill(0).map((_, i) => col + i).join(',');
  g.setAttribute("rowSpan", `${cell.cellSpan.rowSpan}`);
  g.setAttribute("colSpan", `${cell.cellSpan.colSpan}`);
  let cellHeight = 0;
  (cell.subList.p as P[]) = Object2Array(cell.subList.p);
  (cell.subList.p as P[]).forEach((p, i) => {
    p.linesegarray.lineseg = Object2Array(p.linesegarray.lineseg);
    cellHeight = cell.cellSz.height > (cell.cellMargin.top + cell.cellMargin.bottom + p.linesegarray.lineseg.reduce((prev:any, cur:any) => prev ? prev.textheight : 0  + cur.textheight, 0)) * cell.cellSpan.rowSpan ? cell.cellSz.height.HWPUINT() : (cell.cellMargin.top + cell.cellMargin.bottom + p.linesegarray.lineseg.reduce((prev:any, cur:any) => prev ? prev.textheight : 0  + cur.textheight, 0)).HWPUINT() * cell.cellSpan.rowSpan;
  });
  // if(row !== 0) {
  //   // const { x, y } = document.querySelector(`#t-${id}-${row - 1}-${col}`).getBoundingClientRect();
  //   setTimeout(() => {
  //     console.error('시발', document.querySelector(`#t-${id}-${row - 1}-${col}`), `#t-${id}-${row - 1}-${col}`)
      
  //   }, 1000);
  // }
  const rect = g.addChild("rect", {
    id: `t-${id}-${row}-${col}-rect`,
    x:`${x}px`,
    y:`${y}px`,
    colSpan : `${cell.cellSpan.colSpan}`,
    rowSpan : `${cell.cellSpan.rowSpan}`,
    width:`${cell.cellSz.width.HWPUINT()}px`,
    height:`${cellHeight}px`,
    stroke: "#000000",
    "stroke-width": 1,
    fill: "transparent",
  });
  if(cellzoneList) {
    cellzoneList.cellzone.forEach((cellzone, i) => {
      if(row >= cellzone.startRowAddr && row <= cellzone.endRowAddr && col >= cellzone.startColAddr && col <= cellzone.endColAddr) {
        BorderFill({object:rect, borderFillIDRef : cellzone.borderFillIDRef})
      }
    });
  }
  BorderFill({object:rect, borderFillIDRef : cell.borderFillIDRef});
  const svg = g.addChild("svg", {
    width:`${cell.cellSz.width.HWPUINT()}px`,
    height:`${cell.cellSz.height.HWPUINT()}px`,
    xmlns:"http://www.w3.org/2000/svg",
    version:"1.1",
    style:"overflow:visible",
    x:`${x}px`,
    y:`${y}px`,
    // transform:`translate(${parseFloat(y)/2})`
  });
  if(Array.isArray(cell.subList.p) === true ) {
    (cell.subList.p as P[]).forEach((p, i) => {
      const result = RunDraw(p, svg);
      // console.log('p', p)
      result.querySelectorAll("text").forEach((text) => {
        console.log('text', text.textContent);
        // text.setAttribute("dy", "0");
        // text.setAttribute("text-anchor", "middle");
        // text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("x", x);
        // text.setAttribute("y", `${(cellHeight / 2)}px`);
      });
      result.querySelectorAll("tspan").forEach((tspan) => {
        // tspan.setAttribute("dy", "0");
        // tspan.setAttribute("text-anchor", "middle");
        tspan.setAttribute("dominant-baseline", "middle");
        tspan.setAttribute("x", `${(cell.cellMargin.left ? cell.cellMargin.left.HWPUINT() : 0)}px`);
        tspan.setAttribute("y", `${(cellHeight / 2) + (cell.cellMargin.top ? cell.cellMargin.top.HWPUINT() : 0)}px`);
      });
    });
  } else {
    const result = RunDraw(cell.subList.p as any as P, svg);
    result.querySelectorAll("text").forEach((text) => {
      // text.setAttribute("dy", "0");
      // text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("x", x);
      text.setAttribute("y", `${(cellHeight / 2)}px`);
    });
    result.querySelectorAll("tspan").forEach((tspan) => {
      // tspan.setAttribute("dy", "0");
      // tspan.setAttribute("text-anchor", "middle");
      tspan.setAttribute("dominant-baseline", "middle");
      tspan.setAttribute("x", `${(cell.cellMargin.left ? cell.cellMargin.left.HWPUINT() : 0)}px`);
      tspan.setAttribute("y", `${(cellHeight / 2) + (cell.cellMargin.top ? cell.cellMargin.top.HWPUINT() : 0)}px`);
    });
  }
  return g;
  // return result;
};

/**
 * 해당 오브젝트(객체)의 테두리값의 아이디를 받아 그려줌.
 * @constant { object } SVGElement
 * @constant { borderFillIDRef } Number
 */
export const BorderFill = ({object, borderFillIDRef}:{object:SVGElement, borderFillIDRef:Number}) => {
  HwpDocument.hwpx.header.then((header:Header)=>{
    const { borderFills } = header.head.refList
    const borderFill = borderFills.borderFill.find((borderFill) => {
      return borderFill.id === borderFillIDRef;
    });
    const { slash, backSlash, leftBorder, rightBorder, topBorder, bottomBorder, diagonal, id, threeD, shadow, centerLine, breakCellSeparateLine, fillBrush } = borderFill;  
    if(fillBrush) {
      const { winBrush } = fillBrush
      const fill = FixRGB(winBrush.faceColor);
      object.setAttribute("fill", fill);
    }
  });
}

/**
 * SvgPic
 * @param { object } P
 * @param { SVGElement } page
 */
export const SvgPic = async (p:P, page:SVGElement) => {
  const runs = p.run.length ? p.run.filter(run => run) : [p.run];
  // console.log('SvgPic', p, runs);
  // console.warn('runs', runs);
  // 1개의 정보만 있을댄 오브젝트로 리턴되는데 사용하기 편하게 하기 위해서 모두 배열로 변경
  p.linesegarray.lineseg = Object2Array(p.linesegarray.lineseg);
  const { linesegarray } = p;
  const imageData = await HwpDocument.hwpx.binData;
  const result = runs.map(run => {
    const { pic } = run as Run;
    if(pic) {
      const { curSz, dropcapstyle, effects, filp, groupLevel, href, id, img, imgClip, imgRect, inMargin, instid, lock, numberingType, offset, orgSz, outMargin, pos, renderingInfo, reverse, rotationInfo, shapeComment, sz, textFlow, textWrap, zOrder } = pic
      const file = imageData.find((file) => img.binaryItemIDRef === file.name);

      page.addChild("image", {
        "href": "/css/image1.png",
        "xlink:href": "/css/image1.png",
        "width": `${curSz.width.HWPUINT()}px`,
        "height": `${curSz.height.HWPUINT()}px`,
        "x": `${linesegarray.lineseg[0].horzpos.HWPUINT()}`,
        "y": `${linesegarray.lineseg[0].vertpos.HWPUINT()}`,
        // "alt":shapeComment
      })      
    }
  });
}