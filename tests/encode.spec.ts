import { ChatlinkType, encodeChatlink } from '../src/index.js';
import { describe, expect, test } from 'vitest';
import { DecodedChatlink, Profession } from '../src/types.js';

describe('encode', () => {
  test.for([
    // coin
    ['[&AQAAAAA=]', { type: ChatlinkType.Coin, data: 0 }],
    ['[&AQEAAAA=]', { type: ChatlinkType.Coin, data: 1 }],
    ['[&AdsnAAA=]', { type: ChatlinkType.Coin, data: 10203 }],
    // npc text
    ['[&AxcnAAA=]', { type: ChatlinkType.NpcText, data: 10007 }],
    ['[&AxgnAAA=]', { type: ChatlinkType.NpcText, data: 10008 }],
    ['[&AxknAAA=]', { type: ChatlinkType.NpcText, data: 10009 }],
    ['[&AyAnAAA=]', { type: ChatlinkType.NpcText, data: 10016 }],
    // map
    ['[&BDgAAAA=]', { type: ChatlinkType.Map, data: 56 }],
    ['[&BEgAAAA=]', { type: ChatlinkType.Map, data: 72 }],
    ['[&BDkDAAA=]', { type: ChatlinkType.Map, data: 825 }],
    // skill
    ['[&BucCAAA=]', { type: ChatlinkType.Skill, data: 743 }],
    ['[&BnMVAAA=]', { type: ChatlinkType.Skill, data: 5491 }],
    ['[&Bn0VAAA=]', { type: ChatlinkType.Skill, data: 5501 }],
    // trait
    ['[&B/IDAAA=]', { type: ChatlinkType.Trait, data: 1010 }],
    // user
    ['[&CAECAwQFBgcICQoLDA0ODxBFAGEAcwB0AGUAcgAAAA==]', { type: ChatlinkType.User, data: { accountId: '04030201-0605-0807-090A-0B0C0D0E0F10', characterName: 'Easter' } }],
    // recipe
    ['[&CQEAAAA=]', { type: ChatlinkType.Recipe, data: 1 }],
    ['[&CQIAAAA=]', { type: ChatlinkType.Recipe, data: 2 }],
    ['[&CQcAAAA=]', { type: ChatlinkType.Recipe, data: 7 }],
    // wardrobe
    ['[&CwQAAAA=]', { type: ChatlinkType.Outfit, data: 4 }],
    // wvw objective
    ['[&DAYAAAAmAAAA]', { type: ChatlinkType.WvWObjective, data: { mapId: 38, objectiveId: 6 } }],
    // achievement
    ['[&DrYAAAA=]', { type: ChatlinkType.Achievement, data: 182 }],
    ['[&DpEGAAA=]', { type: ChatlinkType.Achievement, data: 1681 }],
    ['[&DoQZAAA=]', { type: ChatlinkType.Achievement, data: 6532 }],
    ['[&DuMbAAA=]', { type: ChatlinkType.Achievement, data: 7139 }],
    // items
    ['[&AgGqtgAA]', { type: ChatlinkType.Item, data: 46762 }],
    ['[&AgGqtgAA]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1 } }],
    ['[&AgGqtgBA/18AAA==]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, upgrade1: 24575 }}],
    ['[&AgGqtgBg/18AACdgAAA=]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, upgrade1: 24575, upgrade2: 24615 }}],
    ['[&AgGqtgCAfQ4AAA==]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, skin: 3709 }}],
    ['[&AgGqtgDAfQ4AAP9fAAA=]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, skin: 3709, upgrade1: 24575 }}],
    ['[&AgGqtgDgfQ4AAP9fAAAnYAAA]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, skin: 3709, upgrade1: 24575, upgrade2: 24615 }}],
    ['[&AgG3lAEY//dMDMoaAACcKPfjhxoAAA==]', { type: ChatlinkType.Item, data: { itemId: 103607, quantity: 1, descriptionDecryptionKey: 29170947532956n, nameDecryptionKey: 29455092086783n }}],
    ['[&AgEljwEQrQat094aAAA=]', { type: ChatlinkType.Item, data: { itemId: 102181, quantity: 1, nameDecryptionKey: 29544336393901n }}],
    // build template
    ['[&DQYfLSkaOCcXAXQANRfLAL4BjwBOARwBlwCWAAAAAAAAAAAAAAAAAAAAAAAAAA==]', {
      type: ChatlinkType.BuildTemplate,
      data: {
        profession: 6, // Elementalist

        specialization1: 31, // Fire
        traitChoices1: [1, 3, 2],
        specialization2: 41, // Air
        traitChoices2: [2, 2, 1],
        specialization3: 56, // Weaver
        traitChoices3: [3, 1, 2],

        terrestrialHealingSkillPalette: 279, // Glyph of Elemental Harmony
        terrestrialUtilitySkillPalette1: 5941, // Primordial Stance
        terrestrialUtilitySkillPalette2: 446, // Glyph of Storms
        terrestrialUtilitySkillPalette3: 334, // Arcane Wave
        terrestrialEliteSkillPalette: 151, // Conjure Fiery Greatsword

        aquaticHealingSkillPalette: 116, // Signet of Restoration
        aquaticUtilitySkillPalette1: 203, // Signet of Fire
        aquaticUtilitySkillPalette2: 143, // Signet of Water
        aquaticUtilitySkillPalette3: 284, // Signet of Air
        aquaticEliteSkillPalette: 150, // Tornado
      }
    }],
    ['[&DQQhNx4XNy4uFyUPvgC9ALoAvADpFpYBLhaXAQEECxMAAAAAAAAAAAAAAAAAAA==]', {
      type: ChatlinkType.BuildTemplate,
      data: {
        profession: 4, // Ranger

        specialization1: 33, // Wilderness Survival
        traitChoices1: [3, 1, 3],
        specialization2: 30, // Skirmishing
        traitChoices2: [3, 1, 1],
        specialization3: 55, // Soulbeast
        traitChoices3: [2, 3, 2],

        terrestrialHealingSkillPalette: 5934, // Bear Stance
        terrestrialUtilitySkillPalette1: 190, // Flame Trap
        terrestrialUtilitySkillPalette2: 186, // Viper's Nest
        terrestrialUtilitySkillPalette3: 5865, // Vulture Stance
        terrestrialEliteSkillPalette: 5678, // One Wolf pack

        aquaticHealingSkillPalette: 3877, // Aqua Surge
        aquaticUtilitySkillPalette1: 189, // Solar Flare
        aquaticUtilitySkillPalette2: 188, // Cold Snap
        aquaticUtilitySkillPalette3: 406, // Quickening Zephyr
        aquaticEliteSkillPalette: 407, // Nature's Renewal

        terrestrialPet1: 1, // Juvenile Jungle Stalker
        terrestrialPet2: 4, // Juvenile Krytan Drakehound
        aquaticPet1: 11, // Juvenile Jaguar
        aquaticPet2: 19, // Juvenile River Drake
      }
    }],
    ['[&DQkPFQMqND/cEdwRKxIrEgYSBhLUEdQRyhHKEQ4NDxAAAAAAAAAAAAAAAAAAAA==]', {
      type: ChatlinkType.BuildTemplate,
      data: {
        profession: 9, // Revenant

        specialization1: 15, // Devastation
        traitChoices1: [1, 1, 1],
        specialization2: 3, // Invocation
        traitChoices2: [2, 2, 2],
        specialization3: 52, // Herald
        traitChoices3: [3, 3, 3],

        terrestrialHealingSkillPalette: 4572, // Enchanted Daggers
        terrestrialUtilitySkillPalette1: 4651, // Phase Traversal
        terrestrialUtilitySkillPalette2: 4614, // Riposting Shadows
        terrestrialUtilitySkillPalette3: 4564, // Impossible Odds
        terrestrialEliteSkillPalette: 4554, // Jade Winds

        aquaticHealingSkillPalette: 4572, // Soothing Stone
        aquaticUtilitySkillPalette1: 4651, // Forced Engagement
        aquaticUtilitySkillPalette2: 4614, // Inspiring Reinforcement
        aquaticUtilitySkillPalette3: 4564, // Vengeful Hammers
        aquaticEliteSkillPalette: 4554, // Rite of the Great Dwarf

        activeTerrestrialLegend: 14, // Dragon
        inactiveTerrestrialLegend: 13, // Assassin
        activeAquaticLegend: 15, // Demon
        inactiveAquaticLegend: 16, // Dwarf

        inactiveAquaticLegendUtilitySkillPalette1: 0,
        inactiveAquaticLegendUtilitySkillPalette2: 0,
        inactiveAquaticLegendUtilitySkillPalette3: 0,
        inactiveTerrestrialLegendUtilitySkillPalette1: 0,
        inactiveTerrestrialLegendUtilitySkillPalette2: 0,
        inactiveTerrestrialLegendUtilitySkillPalette3: 0,
      }
    }],
    ['[&DQQZGggqHiYlD3kAvQAAALkAAAC8AAAAlwEAABYAAAAAAAAAAAAAAAAAAAACMwAjAARn9wAA3fYAAJv2AADo9gAA]', {
      type: ChatlinkType.BuildTemplate,
      data: {
        profession: 4,

        specialization1: 25,
        traitChoices1: [2, 2, 1],
        specialization2: 8,
        traitChoices2: [2, 2, 2],
        specialization3: 30,
        traitChoices3: [2, 1, 2],

        terrestrialHealingSkillPalette: 3877,
        terrestrialUtilitySkillPalette1: 189,
        terrestrialUtilitySkillPalette2: 185,
        terrestrialUtilitySkillPalette3: 188,
        terrestrialEliteSkillPalette: 407,

        terrestrialPet1: 22,
        terrestrialPet2: 0,

        aquaticHealingSkillPalette: 121,
        aquaticUtilitySkillPalette1: 0,
        aquaticUtilitySkillPalette2: 0,
        aquaticUtilitySkillPalette3: 0,
        aquaticEliteSkillPalette: 0,

        aquaticPet1: 0,
        aquaticPet2: 0,

        selectedWeapons: [51, 35],
        selectedSkillVariants: [63335, 63197, 63131, 63208],
      }
    }],
    ['[&DQMGJyY5SyYqDwAAhgAAAFodAACTAQAAex0AAAAAAAAAAAAAAAAAAAAAAAACCQE2AAA=]', {
      type: ChatlinkType.BuildTemplate,
      data: {
        profession: Profession.Engineer,

        specialization1: 6,
        traitChoices1: [3, 1, 2],
        specialization2: 38,
        traitChoices2: [1, 2, 3],
        specialization3: 75,
        traitChoices3: [2, 1, 2],

        terrestrialHealingSkillPalette: 3882,
        terrestrialUtilitySkillPalette1: 134,
        terrestrialUtilitySkillPalette2: 7514,
        terrestrialUtilitySkillPalette3: 403,
        terrestrialEliteSkillPalette: 7547,

        aquaticHealingSkillPalette: 0,
        aquaticUtilitySkillPalette1: 0,
        aquaticUtilitySkillPalette2: 0,
        aquaticUtilitySkillPalette3: 0,
        aquaticEliteSkillPalette: 0,

        selectedWeapons: [265, 54],
      }
    }],
    ['[&DwAAAAABAAEAAQABAAAAAQABAAEAAQAAAAEAAQABAAEAAAABAAEAAQABAAAAAQABAAEAAQAAAAEAAQABAAEAAAABAAEAAQABAAAAAQABAAEAAQAAAAAAAAAAAAAAAAD/fw==]', {
      type: ChatlinkType.FashionTemplate,
      data: {
        aquabreather: 0,
        backpack: 0,
        backpackDyes: [
          1,
          1,
          1,
          1,
        ],
        boots: 0,
        bootsDyes: [
          1,
          1,
          1,
          1,
        ],
        coat: 0,
        coatDyes: [
          1,
          1,
          1,
          1,
        ],
        gloves: 0,
        glovesDyes: [
          1,
          1,
          1,
          1,
        ],
        helm: 0,
        helmDyes: [
          1,
          1,
          1,
          1,
        ],
        leggings: 0,
        leggingsDyes: [
          1,
          1,
          1,
          1,
        ],
        outfit: 0,
        outfitDyes: [
          1,
          1,
          1,
          1,
        ],
        shoulders: 0,
        shouldersDyes: [
          1,
          1,
          1,
          1,
        ],
        visibilityFlags: 32767,
        weaponA1: 0,
        weaponA2: 0,
        weaponAquatic1: 0,
        weaponAquatic2: 0,
        weaponB1: 0,
        weaponB2: 0,
      }
    }],
    ['[&D1cDGAQBAAEAAQABAAQAAQABAAEAAQAQAAEAAQABAAEAGQABAAEAAQABAFUAAQABAAEAAQADAAEAAQABAAEAHQABAAEAAQABACwAAQABAAEAAQASDIUNdQ1zDZYNkw3/fw==]', {
      type: ChatlinkType.FashionTemplate,
      data: {
        aquabreather: 855,
        backpack: 1048,
        backpackDyes: [
          1,
          1,
          1,
          1,
        ],
        boots: 16,
        bootsDyes: [
          1,
          1,
          1,
          1,
        ],
        coat: 4,
        coatDyes: [
          1,
          1,
          1,
          1,
        ],
        gloves: 25,
        glovesDyes: [
          1,
          1,
          1,
          1,
        ],
        helm: 85,
        helmDyes: [
          1,
          1,
          1,
          1,
        ],
        leggings: 3,
        leggingsDyes: [
          1,
          1,
          1,
          1,
        ],
        outfit: 44,
        outfitDyes: [
          1,
          1,
          1,
          1,
        ],
        shoulders: 29,
        shouldersDyes: [
          1,
          1,
          1,
          1,
        ],
        visibilityFlags: 32767,
        weaponA1: 3445,
        weaponA2: 3443,
        weaponAquaticA: 3090,
        weaponAquaticB: 3461,
        weaponB1: 3478,
        weaponB2: 3475,
      }
    }],
    ['[&D1oDNycOAHkBZwJ5AW8vDgB5AWcCAQCTBQ4AeQEBAAEANwUOAHkBZwIBAEwhDgB5AWcCeQHmBA4AeQFnAgEAdyYOAHkBZwJ5ASwAqAJqAXUAvAISMr8OITGfLlMm2TL/fw==]', {
      type: ChatlinkType.FashionTemplate,
      data: {
        aquabreather: 858,
        backpack: 10039,
        backpackDyes: [
          14,
          377,
          615,
          377,
        ],
        boots: 1427,
        bootsDyes: [
          14,
          377,
          1,
          1,
        ],
        coat: 12143,
        coatDyes: [
          14,
          377,
          615,
          1,
        ],
        gloves: 1335,
        glovesDyes: [
          14,
          377,
          615,
          1,
        ],
        helm: 8524,
        helmDyes: [
          14,
          377,
          615,
          377,
        ],
        leggings: 1254,
        leggingsDyes: [
          14,
          377,
          615,
          1,
        ],
        outfit: 44,
        outfitDyes: [
          680,
          362,
          117,
          700,
        ],
        shoulders: 9847,
        shouldersDyes: [
          14,
          377,
          615,
          377,
        ],
        visibilityFlags: 32767,
        weaponA1: 12577,
        weaponA2: 11935,
        weaponAquaticA: 12818,
        weaponAquaticB: 3775,
        weaponB1: 9811,
        weaponB2: 13017,
      }
    }],
  ] as [string, DecodedChatlink][])('encode %s', ([expected, { type, data }]) => {
    expect(encodeChatlink(type, data)).toEqual(expected);
  });
});

// test('invalid chatlink', () => {
//   // invalid base64
//   expect(() => decode('[&INVALID!]')).toThrowError('Invalid chatlink');
//   // missing data
//   expect(() => decode('[&AQ==]')).toThrowError('Invalid chatlink');
//   // invalid format
//   expect(() => decode('invalid')).toThrowError('Invalid chatlink');
// });

// test('unexpected type', () => {
//   expect(() => decode('[&AQAAAAA=]', ChatlinkType.Achievement)).toThrowError('Unexpected chatlink type: expected 0x0E, got 0x01');
// });
// test('expected type', () => {
//   expect(() => decode('[&AQAAAAA=]', ChatlinkType.Coin)).not.toThrowError();
// });
