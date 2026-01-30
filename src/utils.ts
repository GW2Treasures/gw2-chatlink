export function toHex(byte: number): string {
  return byte.toString(16).padStart(2, '0').toUpperCase();
}

export const enum ItemFlags {
  HasSkin = 0x80,
  HasUpgrade1 = 0x40,
  HasUpgrade2 = 0x20,
  HasNameDecryptionKey = 0x10,
  HasDescriptionDecryptionKey = 0x08,
}
