/**
 * @param json json파일
 * @returns string형태의 숫자 데이터를 숫자로 변환하여 리턴
 */
export const String2Number = (json:string) => {
  return JSON.parse(JSON.stringify(json), (key, value)=> {
    if(Number.isNaN(Number(value)) === false) {
      return parseFloat(value)
    } else {
      return value;
    }
  });
}