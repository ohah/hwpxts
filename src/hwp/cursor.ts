export class Cursor {
  public pos:number = 0;
  constructor(start:number) {
    this.pos = start;
  }
  /**
   * @param cnt 만큼 이동
   */
  move(cnt:number):number {
    return this.pos += cnt;
  }

  /**
   * @param cnt 값으로 이동
   */
  set(cnt:number) {
    return this.pos = cnt;
  }
}