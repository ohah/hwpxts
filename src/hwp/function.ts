import CFB from "cfb";
/**
 * 바이너리 레코드 읽기
 * @param data 
 * @returns {tag_id, level, size, move}
 */
export const readRecord = (data: Uint8Array) => {
  const value = new DataView(data.slice(0, 4).buffer, 0).getUint32(0, true);
  const tagID = value & 0x3FF;
  const level = (value >> 10) & 0x3FF;
  const size = (value >> 20) & 0xFFF;
  if (size === 0xFFF) {
    return {
      tag_id: tagID,
      level: level,
      size: new DataView(data.slice(4, 8)).getUint32(0, true),
      move: 4,
    }
  }
  return { tag_id: tagID, level: level, size: size, move: 0 }
}

/**
 * Flags
 * @param bits 
 * @param position 
 * @returns 
 */
export const Flags = (bits, position) => {
  const mask = 1 << position;
  return (bits & mask) === mask;
}

/**
 * 
 * @param value 
 * @returns 
 */
export const BinaryRecord = (value) => {
  const Type = Bit(value, 0x00, 0x03);
  const Compress = Bit(value, 0x04, 0x05);
  const Status = Bit(value, 0x08, 0x09);
  return { type: Type, compress: Compress, status: Status }
}
/**
 * 
 * @param mask 
 * @param start 
 * @param end 
 * @returns 
 */
export const Bit = (mask, start, end) => {
  const target = mask >> start
  let temp = 0
  for (let index = 0; index <= (end - start); index += 1) {
    temp <<= 1
    temp += 1
  }
  return target & temp;
}
/**
 * 
 * @param value 
 * @returns 
 */
export const RGB = (value) => {
  return [
    Bit(value, 0, 7),
    Bit(value, 8, 15),
    Bit(value, 16, 24),
  ]
}

/**
 * Uint8Array -> hex
 * @param buffer 
 * @returns hex code
 */
export const buf2hex = (buffer:Uint8Array | CFB.CFB$Blob) => {
  return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join(' ').toUpperCase();
}