import CFB from "cfb";
import { HwpBlob } from "./type"
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
export const buf2hex = (buffer: HwpBlob) => {
  return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join(' ').toUpperCase();
}
export const HwpHeader = (content: HwpBlob) => {
  return {
    signature: new TextDecoder("utf8").decode(new Uint8Array(content.slice(0, 32))),
    version: parseInt(new Uint8Array(content.slice(32, 36)).reverse().join("")),
    attribute: new Uint8Array(content.slice(36, 40)),
    license: new Uint8Array(content.slice(40, 44)),
    hwpversion: buf2hex(new Uint8Array(content.slice(44, 48))),
    kogl: buf2hex(content.slice(48, 49)),
    reservation: buf2hex(content.slice(49, 256)),
  }
}

export const HwpReader = (cfb:CFB.CFB$Entry[]) => {
  return {
    DocOptions : cfb.find((entry) => entry.name === "DocOptions"),
    DocInfo : cfb.find((entry) => entry.name === "DocInfo"),
    FileHeader : cfb.find((entry) => entry.name === "FileHeader"),
  }
}