import { HWPTAG } from "../type";

interface docinfos {
  name : string,
  tag_id : HWPTAG,
  size : number,
  content : any
}

/**
 * FACE_NAME 아이디 배열화
 * @param param0 
 */
export const FACE_NAME_ID = (content:docinfos[]) => {
  const ID_MAPPINGS = content.find((item) => item.tag_id === HWPTAG.ID_MAPPINGS).content;
  const { HANGUL, LATIN, HANJA, JAPANESE, OTHER} = ID_MAPPINGS.cnt;
  console.log('FACE_NAME_ID', ID_MAPPINGS.cnt)
}