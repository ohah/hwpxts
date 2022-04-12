import { XMLBuilder  } from "fast-xml-parser";
import JSZip from "jszip";

interface files {
  [key: string]: Blob;
}
export class Hwp2Hwpx extends JSZip {
  #files:files[];
  constructor () {
    super();
    this.#files = [
      {"Contents/content.hpf" : new File([], "asdf")},
    ],
  }
}