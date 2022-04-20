import { HWPTAG } from "../type";

interface DocInfos {
  name : string,
  tag_id : HWPTAG,
  size : number,
  content : any
}

export const GET_HWPTAG = (HWPTAG : HWPTAG, content:DocInfos[]) => {
  return content.find((item) => item.tag_id === HWPTAG).content;
}
export const GET_HWPTAG_LIST = (HWPTAG : HWPTAG, content:DocInfos[]) => {
  const result = content.filter((item) => {
    if(item.tag_id === HWPTAG) {
      return item.content;
    }
  });
  return result.map((item) => {return item.content});
}

/**
 * FACE_NAME 아이디 배열화
 * @param param0 
 */
export const FONT_FACES = (content:DocInfos[]) => {
  const ID_MAPPINGS = GET_HWPTAG(HWPTAG.ID_MAPPINGS, content);
  const FACE_NAMES = GET_HWPTAG_LIST(HWPTAG.FACE_NAME, content) ;
  const { HANGUL, LATIN, HANJA, JAPANESE, OTHER} = ID_MAPPINGS.cnt;
  let j = 0;
  const result = Object.keys(ID_MAPPINGS.cnt).map((lang, i) => {
    const fontCnt = Object.values(ID_MAPPINGS.cnt)[i];
    const fontface = [];
    for (let k = 0; k < fontCnt; k++) {
      const font = FACE_NAMES[j];
      font.id = k;
      fontface.push(font);
      j++;
    }
    return {
      font : fontface,
      lang : lang,
      fontCnt : fontCnt,
    }
  });
  return result;
}
/**
 * BORDER_FILL 아이디 배열화
 * @param param0 
 */
export const BORDER_FILLS = (content:DocInfos[]) => {
  // const ID_MAPPINGS = GET_HWPTAG(HWPTAG.ID_MAPPINGS, content);
  // const FACE_NAMES = GET_HWPTAG_LIST(HWPTAG.BORDER_FILL, content) ;
  // const { HANGUL, LATIN, HANJA, JAPANESE, OTHER} = ID_MAPPINGS.cnt;
  return GET_HWPTAG_LIST(HWPTAG.BORDER_FILL, content).map((item, i) => {
    item.id = i + 1;
    return item;
  });
}
/**
 * CHAR 아이디 배열화
 * @hwpx {hh:charPropertis}
 * @param {DocInfos} content
 */
export const CHAR_SHAPES = (content:DocInfos[]) => {
  return GET_HWPTAG_LIST(HWPTAG.CHAR_SHAPE, content).map((item, i) => {
    item.id = i;
    return item;
  });
}