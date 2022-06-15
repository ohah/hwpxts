import Hwpx from "../hwpx/hwpx";
import { Header } from "../type"

export class HwpDocument {
  private static _instance: HwpDocument
  #hwpx:Hwpx
  #header:Header

  public static set hwpx(hwpx:Hwpx) {
    this.getInstance().hwpx = hwpx;
  }
  public static get hwpx(): Hwpx {
    return this.getInstance().hwpx;
  }

  public static get refList(): Hwpx {
    return this.getInstance().hwpx
  }

  public static getInstance () {
    if (!HwpDocument._instance) {
      HwpDocument._instance = new HwpDocument();      
    }
    return HwpDocument._instance;
  }

  set hwpx(hwpx:Hwpx) {
    this.#hwpx = hwpx;
  }
  get hwpx(): Hwpx {
    return this.#hwpx;
  };
    
  // public static set header(header: Header) {
  //   this._header = header;
  // }

  // public static set setHwpx(hwpx: Hwpx) {
  //   this._hwpx = hwpx;
  // }
  // public static get hwpx() {
  //   return this.hwpx;
  // }
  
}
export default HwpDocument