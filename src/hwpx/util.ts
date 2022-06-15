/**
 * @param json json파일
 * @returns string형태의 숫자 데이터를 숫자로 변환하여 리턴
 */
export const String2Number = (json:string) => {
  return JSON.parse(JSON.stringify(json), (key, value)=> {
    if(value === '') {
      return value;
    } else if(Number.isNaN(Number(value)) === false) {
      return parseFloat(value)
    } else {
      return value;
    }
  });
}

/**
 * 
 * @param rgb hwpx 문서에서 RGB가 아닌 BGR으로 되어 있음
 */
export const FixRGB = (rgb:string) => {
  const rgbArr = rgb.split("#");
  const b = rgbArr[1].substring(0, 2);
  const g = rgbArr[1].substring(2, 4);
  const r = rgbArr[1].substring(4, 6);
  return `#${r}${g}${b}`;
}