import { ChatlinkType, Profession } from './types.js';

export function decode(input: string) {
  // input is in the form of `[&<base64>]`
  if (!input.startsWith('[&') || !input.endsWith(']')) {
    throw new Error('Invalid chatlink format');
  }

  // convert base64 input to ArrayBuffer
  const buffer = Uint8Array.from(atob(input.slice(2, -1)), c => c.charCodeAt(0)).buffer;

  const data = reader(buffer);

  // read type
  const type = data.readUint8();

  switch(type) {
    case ChatlinkType.Coin:
      return { type, value: data.readUint32() };
    case ChatlinkType.NpcText:
    case ChatlinkType.Map:
    case ChatlinkType.Skill:
    case ChatlinkType.Trait:
    case ChatlinkType.Recipe:
    case ChatlinkType.Wardrobe:
    case ChatlinkType.Outfit:
    case ChatlinkType.Achievement:
      return { type, id: data.readUint32() };
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
          skin: flags & 0x80 ? data.readUint32() : undefined,
          upgrade1: flags & 0x40 ? data.readUint32() : undefined,
          upgrade2: flags & 0x20 ? data.readUint32() : undefined,
          nameDecryptionKey: flags & 0x10 ? data.readBigUint64() : undefined,
          descriptionDecryptionKey: flags & 0x08 ? data.readBigUint64() : undefined,
        }
      };
    }
    case ChatlinkType.PvpGame:
      return { type }; // unknown format
    case ChatlinkType.User:
      return { type, accountId: data.readUuid(), character: data.readString() };
    case ChatlinkType.WvWObjective:
      return { type, objectiveId: data.readUint32(), mapId: data.readUint32() };
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
    default:
      throw new Error(`Unknown chatlink type: ${type}`);
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

    readTraitSelection: () => {
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

      // convert byte to hex
      const toHex = (num: number) => num.toString(16).padStart(2, '0').toUpperCase();

      // format as UUID
      return (
        toHex(bytes[3]!) + toHex(bytes[2]!) + toHex(bytes[1]!) + toHex(bytes[0]!) + '-' +
        toHex(bytes[5]!) + toHex(bytes[4]!) + '-' +
        toHex(bytes[7]!) + toHex(bytes[6]!) + '-' +
        toHex(bytes[8]!) + toHex(bytes[9]!) + '-' +
        toHex(bytes[10]!) + toHex(bytes[11]!) + toHex(bytes[12]!) + toHex(bytes[13]!) + toHex(bytes[14]!) + toHex(bytes[15]!)
      );
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
