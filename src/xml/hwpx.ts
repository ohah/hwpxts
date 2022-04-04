import JSZip from "jszip";

export class Hwpx extends JSZip {
  #filename:string;
  constructor() {
    super();
    console.log("console", this);
  }

  set filename(name:string) {
    this.filename = name;
  }

  
  async arraybuffer():Promise<JSZip> {
    console.log('array', this.#filename);
    const file = await fetch(this.#filename);
    const arraybuffer = await file.arrayBuffer();
    return this.loadAsync(arraybuffer);
  }

  get header() {
    return (async () => {
      try {
        return await this.arraybuffer();
        console.log(await this.arraybuffer());
      } catch (e) {
        console.log("error", e);
      }
    })();
  }
}
