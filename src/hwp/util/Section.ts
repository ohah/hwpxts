import { HwpBlob, HWPTAG, SymMark } from "../type";

/**
 * 섹션 스트림을 형식에 맞는 오브젝트로 변환
 * @param stream 
 */
export const SECTION = (stream:any) => {
  console.log("SECTION", stream);
  const stack = {
    ctrlId: "",

  }
  stream.map((row)=>{
    const { tag_id, content } = row;
    if(tag_id === HWPTAG.CTRL_HEADER) {
      const ctrlId = content.ctrlId;
      console.log('ctrlId', ctrlId);
    }
  });
  return {
    test: "TEST"
  }
}