import { ChatlinkType, decode } from '../src/index.js';
import { expect, test } from 'vitest';
import { Profession } from '../src/types.js';

test.for([
  // coin
  ['[&AQAAAAA=]', { type: ChatlinkType.Coin, value: 0 }],
  ['[&AQEAAAA=]', { type: ChatlinkType.Coin, value: 1 }],
  ['[&AdsnAAA=]', { type: ChatlinkType.Coin, value: 10203 }],
  // npc text
  ['[&AxcnAAA=]', { type: ChatlinkType.NpcText, id: 10007 }],
  ['[&AxgnAAA=]', { type: ChatlinkType.NpcText, id: 10008 }],
  ['[&AxknAAA=]', { type: ChatlinkType.NpcText, id: 10009 }],
  ['[&AyAnAAA=]', { type: ChatlinkType.NpcText, id: 10016 }],
  // map
  ['[&BDgAAAA=]', { type: ChatlinkType.Map, id: 56 }],
  ['[&BEgAAAA=]', { type: ChatlinkType.Map, id: 72 }],
  ['[&BDkDAAA=]', { type: ChatlinkType.Map, id: 825 }],
  // skill
  ['[&BucCAAA=]', { type: ChatlinkType.Skill, id: 743 }],
  ['[&BnMVAAA=]', { type: ChatlinkType.Skill, id: 5491 }],
  ['[&Bn0VAAA=]', { type: ChatlinkType.Skill, id: 5501 }],
  // trait
  ['[&B/IDAAA=]', { type: ChatlinkType.Trait, id: 1010 }],
  // user
  ['[&CAECAwQFBgcICQoLDA0ODxBFAGEAcwB0AGUAcgAAAA==]', { type: ChatlinkType.User, accountId: '04030201-0605-0807-090A-0B0C0D0E0F10', character: 'Easter' }],
  // recipe
  ['[&CQEAAAA=]', { type: ChatlinkType.Recipe, id: 1 }],
  ['[&CQIAAAA=]', { type: ChatlinkType.Recipe, id: 2 }],
  ['[&CQcAAAA=]', { type: ChatlinkType.Recipe, id: 7 }],
  // wardrobe
  ['[&CwQAAAA=]', { type: ChatlinkType.Outfit, id: 4 }],
  // wvw objective
  ['[&DAYAAAAmAAAA]', { type: ChatlinkType.WvWObjective, mapId: 38, objectiveId: 6 }],
  // achievement
  ['[&DrYAAAA=]', { type: ChatlinkType.Achievement, id: 182 }],
  ['[&DpEGAAA=]', { type: ChatlinkType.Achievement, id: 1681 }],
  ['[&DoQZAAA=]', { type: ChatlinkType.Achievement, id: 6532 }],
  ['[&DuMbAAA=]', { type: ChatlinkType.Achievement, id: 7139 }],
  // items
  ['[&AgGqtgAA]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1 } }],
  ['[&AgGqtgBA/18AAA==]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, upgrade1: 24575 }}],
  ['[&AgGqtgBg/18AACdgAAA=]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, upgrade1: 24575, upgrade2: 24615 }}],
  ['[&AgGqtgCAfQ4AAA==]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, skin: 3709 }}],
  ['[&AgGqtgDAfQ4AAP9fAAA=]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, skin: 3709, upgrade1: 24575 }}],
  ['[&AgGqtgDgfQ4AAP9fAAAnYAAA]', { type: ChatlinkType.Item, data: { itemId: 46762, quantity: 1, skin: 3709, upgrade1: 24575, upgrade2: 24615 }}],
  ['[&AgG3lAEY//dMDMoaAACcKPfjhxoAAA==]', { type: ChatlinkType.Item, data: { itemId: 103607, quantity: 1, descriptionDecryptionKey: 29170947532956n, nameDecryptionKey: 29455092086783n }}],
  ['[&AgEljwEQrQat094aAAA=]', { type: ChatlinkType.Item, data: { itemId: 102181, quantity: 1, nameDecryptionKey: 29544336393901n }}],
  // build template
  ['[&DQYfLSkaOCcXAXQANRfLAL4BjwBOARwBlwCWAAAAAAAAAAAAAAAAAAAAAAA=]', {
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
  }]
] as const)('decode %s', ([input, expected]) => {
  expect(decode(input)).toEqual(expected);

  const test = decode(input);
});
