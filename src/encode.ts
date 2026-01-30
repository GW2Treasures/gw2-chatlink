import { ChatlinkError } from "./error.js";
import { ChatlinkType, Profession, type ChatlinkData, type TraitSelection } from "./types.js";
import { ItemFlags, toHex } from "./utils.js";

// Generate all valid combinations of arguments for encode function
type EncodeChatlinkArgs = {
  [T in ChatlinkType]: [type: T, data: ChatlinkData<T>];
}[ChatlinkType]

/**
 * Encode a Guild Wars 2 chatlink.
 * @param type The type of chatlink to encode
 * @param data The data of the chatlink
 * @returns The encoded chatlink string
 * @example
 * ```ts
 * import { encodeChatlink } from '@gw2/chatlink';
 *
 * const chatlink = encodeChatlink(ChatlinkType.Item, { itemId: 46762, quantity: 1, skin: 3709 });
 *
 * console.log(chatlink); // "[&AgGqtgCAfQ4AAA==]"
 * ```
 */
export function encode<T extends ChatlinkType>(type: T, data: ChatlinkData<T>): `[&${string}]`;
export function encode(...[type, data]: EncodeChatlinkArgs): `[&${string}]` {
  const bytes = writer();

  // write type
  bytes.writeUint8(type);

  switch (type) {
    case ChatlinkType.Coin:
    case ChatlinkType.NpcText:
    case ChatlinkType.Map:
    case ChatlinkType.Skill:
    case ChatlinkType.Trait:
    case ChatlinkType.Recipe:
    case ChatlinkType.Wardrobe:
    case ChatlinkType.Outfit:
    case ChatlinkType.Achievement:
      bytes.writeUint32(data);
      break;
    case ChatlinkType.Item: {
      const item = data as ChatlinkData.Item;

      const flags = (0
        | (item.skin !== undefined ? ItemFlags.HasSkin : 0)
        | (item.upgrade1 !== undefined ? ItemFlags.HasUpgrade1 : 0)
        | (item.upgrade2 !== undefined ? ItemFlags.HasUpgrade2 : 0)
        | (item.nameDecryptionKey !== undefined ? ItemFlags.HasNameDecryptionKey : 0)
        | (item.descriptionDecryptionKey !== undefined ? ItemFlags.HasDescriptionDecryptionKey : 0)
      );

      const itemIdAndFlags = item.itemId & 0x00FFFFFF | (flags << 24);

      bytes.writeUint8(item.quantity ?? 1);
      bytes.writeUint32(itemIdAndFlags);

      if (item.skin !== undefined) {
        bytes.writeUint32(item.skin);
      }
      if (item.upgrade1 !== undefined) {
        bytes.writeUint32(item.upgrade1);
      }
      if (item.upgrade2 !== undefined) {
        bytes.writeUint32(item.upgrade2);
      }
      if (item.nameDecryptionKey !== undefined) {
        bytes.writeBigUint64(item.nameDecryptionKey);
      }
      if (item.descriptionDecryptionKey !== undefined) {
        bytes.writeBigUint64(item.descriptionDecryptionKey);
      }
      break;
    }
    case ChatlinkType.User: {
      const user = data as ChatlinkData.User;
      bytes.writeUuid(user.accountId);
      bytes.writeString(user.characterName);
      break;
    }
    case ChatlinkType.WvWObjective: {
      bytes.writeUint32(data.objectiveId);
      bytes.writeUint32(data.mapId);
      break;
    }
    case ChatlinkType.BuildTemplate: {
      bytes.writeUint8(data.profession);

      bytes.writeUint8(data.specialization1);
      bytes.writeTraitSelection(data.traitChoices1);
      bytes.writeUint8(data.specialization2);
      bytes.writeTraitSelection(data.traitChoices2);
      bytes.writeUint8(data.specialization3);
      bytes.writeTraitSelection(data.traitChoices3);

      bytes.writeUint16(data.terrestrialHealingSkillPalette);
      bytes.writeUint16(data.aquaticHealingSkillPalette);
      bytes.writeUint16(data.terrestrialUtilitySkillPalette1);
      bytes.writeUint16(data.aquaticUtilitySkillPalette1);
      bytes.writeUint16(data.terrestrialUtilitySkillPalette2);
      bytes.writeUint16(data.aquaticUtilitySkillPalette2);
      bytes.writeUint16(data.terrestrialUtilitySkillPalette3);
      bytes.writeUint16(data.aquaticUtilitySkillPalette3);
      bytes.writeUint16(data.terrestrialEliteSkillPalette);
      bytes.writeUint16(data.aquaticEliteSkillPalette);

      if (data.profession === Profession.Ranger) {
        // Ranger
        bytes.writeUint8(data.terrestrialPet1 ?? 0);
        bytes.writeUint8(data.terrestrialPet2 ?? 0);
        bytes.writeUint8(data.aquaticPet1 ?? 0);
        bytes.writeUint8(data.aquaticPet2 ?? 0);

        // Zero out the bytes used for Revenant
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
      } else if (data.profession === Profession.Revenant) {
        // Revenant
        bytes.writeUint8(data.activeTerrestrialLegend ?? 0);
        bytes.writeUint8(data.inactiveTerrestrialLegend ?? 0);
        bytes.writeUint8(data.activeAquaticLegend ?? 0);
        bytes.writeUint8(data.inactiveAquaticLegend ?? 0);
        bytes.writeUint16(data.inactiveTerrestrialLegendUtilitySkillPalette1 ?? 0x00);
        bytes.writeUint16(data.inactiveTerrestrialLegendUtilitySkillPalette2 ?? 0x00);
        bytes.writeUint16(data.inactiveTerrestrialLegendUtilitySkillPalette3 ?? 0x00);
        bytes.writeUint16(data.inactiveAquaticLegendUtilitySkillPalette1 ?? 0x00);
        bytes.writeUint16(data.inactiveAquaticLegendUtilitySkillPalette2 ?? 0x00);
        bytes.writeUint16(data.inactiveAquaticLegendUtilitySkillPalette3 ?? 0x00);
      } else {
        // Zero out the bytes used for Ranger / Revenant
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);

        // Zero out the bytes used for Revenant
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
        bytes.writeUint16(0x00);
      }

      bytes.writeDynamicArrayUint16(data.selectedWeapons ?? []);
      bytes.writeDynamicArrayUint32(data.selectedSkillVariants ?? []);

      break;
    }
    case ChatlinkType.FashionTemplate: {
      bytes.writeUint16(data.aquabreather);
      bytes.writeUint16(data.backpack);
      bytes.writeUint16(data.backpackDyes[0] ?? 1);
      bytes.writeUint16(data.backpackDyes[1] ?? 1);
      bytes.writeUint16(data.backpackDyes[2] ?? 1);
      bytes.writeUint16(data.backpackDyes[3] ?? 1);
      bytes.writeUint16(data.coat);
      bytes.writeUint16(data.coatDyes[0] ?? 1);
      bytes.writeUint16(data.coatDyes[1] ?? 1);
      bytes.writeUint16(data.coatDyes[2] ?? 1);
      bytes.writeUint16(data.coatDyes[3] ?? 1);
      bytes.writeUint16(data.boots);
      bytes.writeUint16(data.bootsDyes[0] ?? 1);
      bytes.writeUint16(data.bootsDyes[1] ?? 1);
      bytes.writeUint16(data.bootsDyes[2] ?? 1);
      bytes.writeUint16(data.bootsDyes[3] ?? 1);
      bytes.writeUint16(data.gloves);
      bytes.writeUint16(data.glovesDyes[0] ?? 1);
      bytes.writeUint16(data.glovesDyes[1] ?? 1);
      bytes.writeUint16(data.glovesDyes[2] ?? 1);
      bytes.writeUint16(data.glovesDyes[3] ?? 1);
      bytes.writeUint16(data.helm);
      bytes.writeUint16(data.helmDyes[0] ?? 1);
      bytes.writeUint16(data.helmDyes[1] ?? 1);
      bytes.writeUint16(data.helmDyes[2] ?? 1);
      bytes.writeUint16(data.helmDyes[3] ?? 1);
      bytes.writeUint16(data.leggings);
      bytes.writeUint16(data.leggingsDyes[0] ?? 1);
      bytes.writeUint16(data.leggingsDyes[1] ?? 1);
      bytes.writeUint16(data.leggingsDyes[2] ?? 1);
      bytes.writeUint16(data.leggingsDyes[3] ?? 1);
      bytes.writeUint16(data.shoulders);
      bytes.writeUint16(data.shouldersDyes[0] ?? 1);
      bytes.writeUint16(data.shouldersDyes[1] ?? 1);
      bytes.writeUint16(data.shouldersDyes[2] ?? 1);
      bytes.writeUint16(data.shouldersDyes[3] ?? 1);
      bytes.writeUint16(data.outfit);
      bytes.writeUint16(data.outfitDyes[0] ?? 1);
      bytes.writeUint16(data.outfitDyes[1] ?? 1);
      bytes.writeUint16(data.outfitDyes[2] ?? 1);
      bytes.writeUint16(data.outfitDyes[3] ?? 1);
      bytes.writeUint16(data.weaponAquatic1);
      bytes.writeUint16(data.weaponAquatic2);
      bytes.writeUint16(data.weaponA1);
      bytes.writeUint16(data.weaponA2);
      bytes.writeUint16(data.weaponB1);
      bytes.writeUint16(data.weaponB2);
      bytes.writeUint16(data.visibilityFlags);

      break;
    }
    case ChatlinkType.PvpGame: // unknown format
    default:
      throw new ChatlinkError(`Unknown chatlink type: 0x${toHex(type)}`);
  }

  const base64 = bytes.toBase64();

  return `[&${base64}]`;
}

function writer() {
  const bytes: number[] = [];

  return {
    writeUint8(value: number) {
      bytes.push(value & 0xFF);
    },

    writeUint16(value: number) {
      bytes.push(value & 0xFF);
      bytes.push((value >> 8) & 0xFF);
    },

    writeUint32(value: number) {
      bytes.push(value & 0xFF);
      bytes.push((value >> 8) & 0xFF);
      bytes.push((value >> 16) & 0xFF);
      bytes.push((value >> 24) & 0xFF);
    },

    writeBigUint64(value: bigint) {
      bytes.push(Number(value & 0xFFn));
      bytes.push(Number((value >> 8n) & 0xFFn));
      bytes.push(Number((value >> 16n) & 0xFFn));
      bytes.push(Number((value >> 24n) & 0xFFn));
      bytes.push(Number((value >> 32n) & 0xFFn));
      bytes.push(Number((value >> 40n) & 0xFFn));
      bytes.push(Number((value >> 48n) & 0xFFn));
      bytes.push(Number((value >> 56n) & 0xFFn));
    },

    writeUuid(uuid: string) {
      const hex = uuid.replaceAll('-', '')
        .match(/../g)!
        .map(byte => parseInt(byte, 16));

      bytes.push(...[3,2,1,0,5,4,7,6,8,9,10,11,12,13,14,15].map(i => hex[i]!));
    },

    writeString(str: string) {
      const buf = new ArrayBuffer(str.length * 2);
      const view = new DataView(buf);

      for (let i = 0; i < str.length; i++) {
        // write bytes as little-endian UTF-16
        // javascript strings are already UTF-16, so no further conversion is needed
        view.setUint16(i * 2, str.charCodeAt(i), true);
      }

      // write string bytes followed by double null-terminator
      bytes.push(...new Uint8Array(buf), 0, 0);
    },

    writeTraitSelection(selection: TraitSelection) {
      const value = ((selection[2] & 3) << 4) | ((selection[1] & 3) << 2) | ((selection[0] & 3) << 0)
      this.writeUint8(value);
    },

    writeDynamicArrayUint16(values: number[]) {
      this.writeUint8(values.length)
      for (const value of values) {
        this.writeUint16(value)
      }
    },

    writeDynamicArrayUint32(values: number[]) {
      this.writeUint8(values.length)
      for (const value of values) {
        this.writeUint32(value)
      }
    },

    getBytes() {
      return Uint8Array.from(bytes);
    },

    toBase64() {
      const uint8Array = Uint8Array.from(bytes);
      return 'toBase64' in uint8Array
        ? uint8Array.toBase64()
        : btoa(String.fromCharCode(...uint8Array));
    }
  }
}

encode(ChatlinkType.Item, { itemId: 12345, quantity: 1 })
