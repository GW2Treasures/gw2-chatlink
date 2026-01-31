import { ChatlinkError } from './error.js';
import { ChatlinkType, Profession, type DecodedChatlink, type DyeSelection, type TraitSelection } from './types.js';
import { ItemFlags, toHex } from './utils.js';

/**
 * Decode a Guild Wars 2 chatlink.
 * @param input The chatlink string to decode.
 * @returns The decoded chatlink data.
 * @throws {ChatlinkError} If the chatlink is invalid.
 * @see {@link tryDecodeChatlink `tryDecodeChatlink`} for a version that returns `undefined` for invalid chatlinks.
 * @example
 * ```ts
 * import { decodeChatlink } from '@gw2/chatlink';
 *
 * const chatlink = decodeChatlink('[&AgGqtgCAfQ4AAA==]');
 * console.log(chatlink);
 * // {
 * //   type: ChatlinkType.Item,
 * //   data: { itemId: 46762, quantity: 1, skin: 3709 }
 * // }
 * ```
 */
export function decodeChatlink(input: string): DecodedChatlink;
/**
 * Decode a Guild Wars 2 chatlink.
 * @param input The chatlink string to decode.
 * @param expectedType Expected chatlink type.
 * @returns The decoded chatlink data.
 * @throws {ChatlinkError} If the chatlink is invalid or the type does not match the expected type.
 * @see {@link tryDecodeChatlink `tryDecodeChatlink`} for a version that returns `undefined` for invalid chatlinks.
 * @example
 * ```ts
 * import { decodeChatlink } from '@gw2/chatlink';
 *
 * const chatlink = decodeChatlink('[&AgGqtgCAfQ4AAA==]', ChatlinkType.Item);
 * console.log(chatlink);
 * // {
 * //   type: ChatlinkType.Item,
 * //   data: { itemId: 46762, quantity: 1, skin: 3709 }
 * // }
 * ```
 */
export function decodeChatlink<T extends ChatlinkType>(input: string, expectedType: T): DecodedChatlink<T>;
export function decodeChatlink(input: string, expectedType?: ChatlinkType): DecodedChatlink {
  // input is in the form of `[&<base64>]`
  if (!input.startsWith('[&') || !input.endsWith(']')) {
    throw new ChatlinkError('Invalid chatlink format');
  }

  // convert base64 input to ArrayBuffer
  try {
    const buffer = 'fromBase64' in Uint8Array
      ? Uint8Array.fromBase64(input.slice(2, -1)).buffer
      : Uint8Array.from(atob(input.slice(2, -1)), c => c.charCodeAt(0)).buffer;

    const data = reader(buffer);

    // read type
    const type = data.readUint8();

    // check expected type
    if (expectedType && type !== expectedType) {
      throw new ChatlinkError(`Unexpected chatlink type: expected 0x${toHex(expectedType)}, got 0x${toHex(type)}`);
    }

    switch(type) {
      case ChatlinkType.Coin:
      case ChatlinkType.NpcText:
      case ChatlinkType.Map:
      case ChatlinkType.Skill:
      case ChatlinkType.Trait:
      case ChatlinkType.Recipe:
      case ChatlinkType.Wardrobe:
      case ChatlinkType.Outfit:
      case ChatlinkType.Achievement:
        return { type, data: data.readUint32() };
      case ChatlinkType.Item: {
        const quantity = data.readUint8();
        const itemIdAndFlags = data.readUint32();
        // read first 3 bytes as itemId
        const itemId = (itemIdAndFlags & 0x00FFFFFF);
        const flags = (itemIdAndFlags & 0xFF000000) >>> 24;

        return {
          type,
          data: {
            itemId,
            quantity,
            skin: flags & ItemFlags.HasSkin ? data.readUint32() : undefined,
            upgrade1: flags & ItemFlags.HasUpgrade1 ? data.readUint32() : undefined,
            upgrade2: flags & ItemFlags.HasUpgrade2 ? data.readUint32() : undefined,
            nameDecryptionKey: flags & ItemFlags.HasNameDecryptionKey ? data.readBigUint64() : undefined,
            descriptionDecryptionKey: flags & ItemFlags.HasDescriptionDecryptionKey ? data.readBigUint64() : undefined,
          }
        };
      }
      case ChatlinkType.PvpGame:
        return { type, data: undefined }; // unknown format
      case ChatlinkType.User:
        return { type, data: { accountId: data.readUuid(), characterName: data.readString() }};
      case ChatlinkType.WvWObjective:
        return { type, data: { objectiveId: data.readUint32(), mapId: data.readUint32() }};
      case ChatlinkType.BuildTemplate: {
        const profession = data.readUint8() as Profession;

        const specialization1 = data.readUint8();
        const traitChoices1 = data.readTraitSelection();
        const specialization2 = data.readUint8();
        const traitChoices2 = data.readTraitSelection();
        const specialization3 = data.readUint8();
        const traitChoices3 = data.readTraitSelection();

        const terrestrialHealingSkillPalette = data.readUint16();
        const aquaticHealingSkillPalette = data.readUint16();
        const terrestrialUtilitySkillPalette1 = data.readUint16();
        const aquaticUtilitySkillPalette1 = data.readUint16();
        const terrestrialUtilitySkillPalette2 = data.readUint16();
        const aquaticUtilitySkillPalette2 = data.readUint16();
        const terrestrialUtilitySkillPalette3 = data.readUint16();
        const aquaticUtilitySkillPalette3 = data.readUint16();
        const terrestrialEliteSkillPalette = data.readUint16();
        const aquaticEliteSkillPalette = data.readUint16();

        // Ranger
        let terrestrialPet1;
        let terrestrialPet2;
        let aquaticPet1;
        let aquaticPet2;
        // Revenant
        let activeTerrestrialLegend;
        let inactiveTerrestrialLegend;
        let activeAquaticLegend;
        let inactiveAquaticLegend;
        let inactiveTerrestrialLegendUtilitySkillPalette1;
        let inactiveTerrestrialLegendUtilitySkillPalette2;
        let inactiveTerrestrialLegendUtilitySkillPalette3;
        let inactiveAquaticLegendUtilitySkillPalette1;
        let inactiveAquaticLegendUtilitySkillPalette2;
        let inactiveAquaticLegendUtilitySkillPalette3;

        switch (profession) {
          case Profession.Ranger:
            terrestrialPet1 = data.readUint8();
            terrestrialPet2 = data.readUint8();
            aquaticPet1 = data.readUint8();
            aquaticPet2 = data.readUint8();
            data.skip(12);
            break;
          case Profession.Revenant:
            activeTerrestrialLegend = data.readUint8();
            inactiveTerrestrialLegend = data.readUint8();
            activeAquaticLegend = data.readUint8();
            inactiveAquaticLegend = data.readUint8();
            inactiveTerrestrialLegendUtilitySkillPalette1 = data.readUint16();
            inactiveTerrestrialLegendUtilitySkillPalette2 = data.readUint16();
            inactiveTerrestrialLegendUtilitySkillPalette3 = data.readUint16();
            inactiveAquaticLegendUtilitySkillPalette1 = data.readUint16();
            inactiveAquaticLegendUtilitySkillPalette2 = data.readUint16();
            inactiveAquaticLegendUtilitySkillPalette3 = data.readUint16();
            break;
          default:
            data.skip(16);
            break;
        }

        // check if we are at the end of the buffer
        const isLegacy = data.atEnd();

        const selectedWeapons = isLegacy ? undefined : data.readDynamicArrayUint16()
        const selectedSkillVariants = isLegacy ? undefined : data.readDynamicArrayUint32()

        return {
          type,
          data: {
            profession,

            specialization1,
            traitChoices1,
            specialization2,
            traitChoices2,
            specialization3,
            traitChoices3,

            terrestrialHealingSkillPalette,
            terrestrialUtilitySkillPalette1,
            terrestrialUtilitySkillPalette2,
            terrestrialUtilitySkillPalette3,
            terrestrialEliteSkillPalette,

            aquaticHealingSkillPalette,
            aquaticUtilitySkillPalette1,
            aquaticUtilitySkillPalette2,
            aquaticUtilitySkillPalette3,
            aquaticEliteSkillPalette,

            terrestrialPet1,
            terrestrialPet2,
            aquaticPet1,
            aquaticPet2,

            activeTerrestrialLegend,
            inactiveTerrestrialLegend,
            activeAquaticLegend,
            inactiveAquaticLegend,
            inactiveTerrestrialLegendUtilitySkillPalette1,
            inactiveTerrestrialLegendUtilitySkillPalette2,
            inactiveTerrestrialLegendUtilitySkillPalette3,
            inactiveAquaticLegendUtilitySkillPalette1,
            inactiveAquaticLegendUtilitySkillPalette2,
            inactiveAquaticLegendUtilitySkillPalette3,

            selectedWeapons,
            selectedSkillVariants,
          }
        };
      }
      case ChatlinkType.FashionTemplate:
        const aquabreather = data.readUint16();
        const backpack = data.readUint16();
        const backpackDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const coat = data.readUint16();
        const coatDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const boots = data.readUint16();
        const bootsDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const gloves = data.readUint16();
        const glovesDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const helm = data.readUint16();
        const helmDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const leggings = data.readUint16();
        const leggingsDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const shoulders = data.readUint16();
        const shouldersDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const outfit = data.readUint16();
        const outfitDyes: DyeSelection = [data.readUint16(), data.readUint16(), data.readUint16(), data.readUint16()];
        const weaponAquatic1 = data.readUint16();
        const weaponAquatic2 = data.readUint16();
        const weaponA1 = data.readUint16();
        const weaponA2 = data.readUint16();
        const weaponB1 = data.readUint16();
        const weaponB2 = data.readUint16();
        const visibilityFlags = data.readUint16();

        return {
          type,
          data: {
            aquabreather,
            backpack,
            backpackDyes,
            coat,
            coatDyes,
            boots,
            bootsDyes,
            gloves,
            glovesDyes,
            helm,
            helmDyes,
            leggings,
            leggingsDyes,
            shoulders,
            shouldersDyes,
            outfit,
            outfitDyes,
            weaponAquatic1,
            weaponAquatic2,
            weaponA1,
            weaponA2,
            weaponB1,
            weaponB2,
            visibilityFlags,
          }
        };
      default:
        throw new ChatlinkError(`Unknown chatlink type: 0x${toHex(type)}`);
    }
  } catch (cause) {
    if(cause instanceof ChatlinkError) {
      throw cause;
    }

    throw new ChatlinkError('Invalid chatlink', { cause });
  }
}

function reader(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  let index = 0;

  return {
    skip: (bytes: number) => { index += bytes },
    atEnd: () => index >= buffer.byteLength,

    readUint8: () => view.getUint8(index++),

    readUint16: () => {
      const value = view.getUint16(index, true);
      index += 2;
      return value;
    },

    readUint32: () => {
      const value = view.getUint32(index, true);
      index += 4;
      return value;
    },

    readBigUint64: () => {
      const value = view.getBigUint64(index, true);
      index += 8;
      return value;
    },

    readTraitSelection: (): TraitSelection => {
      const byte = view.getUint8(index++);
      return [
        (byte & 3),
        (byte >> 2) & 3,
        (byte >> 4) & 3,
      ];
    },

    readDynamicArrayUint16: () => {
      const length = view.getUint8(index++);

      if (length === 0) {
        return undefined;
      }

      const values = new Array<number>(length);
      for (let i = 0; i < length; i++) {
        values[i] = view.getUint16(index, true);
        index += 2;
      }

      return values;
    },


    readDynamicArrayUint32: () => {
      const length = view.getUint8(index++);

      if (length === 0) {
        return undefined;
      }

      const values = new Array<number>(length);
      for (let i = 0; i < length; i++) {
        values[i] = view.getUint32(index, true);
        index += 4;
      }

      return values;
    },

    readUuid: () => {
      // read 16 bytes
      const bytes = new Uint8Array(buffer, index, 16);
      index += 16;

      // format as UUID
      return ([3, 2, 1, 0, '-', 5, 4, '-', 7, 6, '-', 8, 9, '-', 10, 11, 12, 13, 14, 15] as const)
        .map(i => i === '-' ? '-' : toHex(bytes[i]!))
        .join('');
    },

    /** Reads a UTF-16LE string */
    readString: () => {
      const start = index;

      while (view.getUint16(index, true) !== 0) {
        index += 2;
      }

      const str = new TextDecoder('utf-16le').decode(buffer.slice(start, index));
      index += 2; // skip null terminator
      return str;
    }
  };
}

/**
 * Try to decode a Guild Wars 2 chatlink.
 * @param input The chatlink string to decode.
 * @returns The decoded chatlink data or undefined if the chatlink is invalid.
 * @see {@link decodeChatlink `decodeChatlink`} for a version that throws on invalid chatlinks.
 * @example
 * ```ts
 * import { tryDecodeChatlink } from '@gw2/chatlink';
 *
 * const chatlink = tryDecodeChatlink('[&AgGqtgCAfQ4AAA==]');
 * console.log(chatlink);
 * // {
 * //   type: ChatlinkType.Item,
 * //   data: { itemId: 46762, quantity: 1, skin: 3709 }
 * // }
 * ```
 */
export function tryDecodeChatlink(input: string): DecodedChatlink | undefined;
/**
 * Decode a Guild Wars 2 chatlink.
 * @param input The chatlink string to decode.
 * @param expectedType Expected chatlink type.
 * @returns The decoded chatlink data or undefined if the chatlink is invalid or the type does not match the expected type.
 * @see {@link decodeChatlink `decodeChatlink`} for a version that throws on invalid chatlinks.
 * @example
 * ```ts
 * import { tryDecodeChatlink } from '@gw2/chatlink';
 *
 * const chatlink = tryDecodeChatlink('[&AgGqtgCAfQ4AAA==]', ChatlinkType.Item);
 * console.log(chatlink);
 * // {
 * //   type: ChatlinkType.Item,
 * //   data: { itemId: 46762, quantity: 1, skin: 3709 }
 * // }
 * ```
 */
export function tryDecodeChatlink<T extends ChatlinkType>(input: string, expectedType: T): DecodedChatlink<T> | undefined;
export function tryDecodeChatlink(input: string, expectedType?: ChatlinkType): DecodedChatlink | undefined {
  try {
    return expectedType ? decodeChatlink(input, expectedType) : decodeChatlink(input);
  } catch {
    return undefined;
  }
}


/**
 * Decoded all chatlinks in a string. Invalid chatlinks are ignored.
 * @param input A string potentially containing one or more chatlinks.
 * @returns A list of all valid chatlinks found in the input string.
 * @example
 * ```ts
 * import { decodeAllChatlinks } from '@gw2/chatlink';
 *
 * const chatlinks = decodeAllChatlinks('Check out these items: [&AgHJjAAA] and [&AgHGjAAA]!');
 * console.log(chatlinks);
 * // [
 * //   {
 * //     type: ChatlinkType.Item,
 * //     data: { itemId: 36041, quantity: 1 }
 * //   },
 * //   {
 * //     type: ChatlinkType.Item,
 * //     data: { itemId: 36038, quantity: 1 }
 * //   }
 * // ]
 * ```
 */
export function decodeAllChatlinks(input: string): DecodedChatlink[];
/**
 * Decoded all chatlinks of a specific type in a string. Invalid chatlinks are ignored.
 * @param input A string potentially containing one or more chatlinks.
 * @returns A list of all valid chatlinks found in the input string.
 * @example
 * ```ts
 * import { decodeAllChatlinks } from '@gw2/chatlink';
 *
 * const chatlinks = decodeAllChatlinks('Check out these items: [&AgHJjAAA] and [&AgHGjAAA]!');
 * console.log(chatlinks);
 * // [
 * //   {
 * //     type: ChatlinkType.Item,
 * //     data: { itemId: 36041, quantity: 1 }
 * //   },
 * //   {
 * //     type: ChatlinkType.Item,
 * //     data: { itemId: 36038, quantity: 1 }
 * //   }
 * // ]
 * ```
 */
export function decodeAllChatlinks<T extends ChatlinkType>(input: string, type: T): DecodedChatlink<T>[];
export function decodeAllChatlinks(input: string, type?: ChatlinkType): DecodedChatlink[] {
  return Array.from(input.matchAll(CHATLINK_REGEX))
    .map(chatlink => type ? tryDecodeChatlink(chatlink[0], type) : tryDecodeChatlink(chatlink[0]))
    .filter(x => x !== undefined);
}

const CHATLINK_REGEX = /\[&[A-Za-z0-9+/]+={0,2}\]/g;
