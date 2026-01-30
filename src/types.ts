export enum ChatlinkType {
  Coin = 0x01,
  Item = 0x02,
  NpcText = 0x03,
  Map = 0x04,
  PvpGame = 0x05,
  Skill = 0x06,
  Trait = 0x07,
  User = 0x08,
  Recipe = 0x09,
  Wardrobe = 0x0A,
  Outfit = 0x0B,
  WvWObjective = 0x0C,
  BuildTemplate = 0x0D,
  Achievement = 0x0E,
  FashionTemplate = 0x0F,
}

export type DecodedChatlink<Type extends ChatlinkType = ChatlinkType> = {
  [T in Type]: {
    type: T;
    data: ChatlinkData<T>;
  };
}[Type];

export type ChatlinkData<Type extends ChatlinkType = ChatlinkType> = {
  [T in Type]:
    T extends ChatlinkType.Coin ? ChatlinkData.Coin :
    T extends
      | ChatlinkType.NpcText
      | ChatlinkType.Map
      | ChatlinkType.Skill
      | ChatlinkType.Trait
      | ChatlinkType.Recipe
      | ChatlinkType.Wardrobe
      | ChatlinkType.Outfit
      | ChatlinkType.Achievement ? ChatlinkData.Id :
    T extends ChatlinkType.Item ? ChatlinkData.Item :
    T extends ChatlinkType.User ? ChatlinkData.User :
    T extends ChatlinkType.PvpGame ? undefined :
    T extends ChatlinkType.WvWObjective ? ChatlinkData.WvWObjective :
    T extends ChatlinkType.BuildTemplate ? ChatlinkData.BuildTemplate :
    T extends ChatlinkType.FashionTemplate ? ChatlinkData.FashionTemplate :
    never;
}[Type];

export namespace ChatlinkData {
  export type Coin = number;

  export type Id = number;

  export type Item = {
    itemId: number;
    quantity: number;
    skin?: number | undefined;
    upgrade1?: number | undefined;
    upgrade2?: number | undefined;
    nameDecryptionKey?: bigint | undefined;
    descriptionDecryptionKey?: bigint | undefined;
  }

  export type User = {
    accountId: string;
    characterName: string;
  }

  export type WvWObjective = {
    objectiveId: number;
    mapId: number;
  }

  export type BuildTemplate = {
    profession: Profession;

    specialization1: number;
    traitChoices1: TraitSelection;
    specialization2: number;
    traitChoices2: TraitSelection;
    specialization3: number;
    traitChoices3: TraitSelection;

    terrestrialHealingSkillPalette: number;
    terrestrialUtilitySkillPalette1: number;
    terrestrialUtilitySkillPalette2: number;
    terrestrialUtilitySkillPalette3: number;
    terrestrialEliteSkillPalette: number;

    aquaticHealingSkillPalette: number;
    aquaticUtilitySkillPalette1: number;
    aquaticUtilitySkillPalette2: number;
    aquaticUtilitySkillPalette3: number;
    aquaticEliteSkillPalette: number;

    terrestrialPet1?: number | undefined;
    terrestrialPet2?: number | undefined;
    aquaticPet1?: number | undefined;
    aquaticPet2?: number | undefined;

    activeTerrestrialLegend?: number | undefined;
    inactiveTerrestrialLegend?: number | undefined;
    activeAquaticLegend?: number | undefined;
    inactiveAquaticLegend?: number | undefined;
    inactiveTerrestrialLegendUtilitySkillPalette1?: number | undefined;
    inactiveTerrestrialLegendUtilitySkillPalette2?: number | undefined;
    inactiveTerrestrialLegendUtilitySkillPalette3?: number | undefined;
    inactiveAquaticLegendUtilitySkillPalette1?: number | undefined;
    inactiveAquaticLegendUtilitySkillPalette2?: number | undefined;
    inactiveAquaticLegendUtilitySkillPalette3?: number | undefined;

    selectedWeapons: number[] | undefined;
    selectedSkillVariants: number[] | undefined;
  }

  export type FashionTemplate = {
    aquabreather: number;
    backpack: number;
    backpackDyes: DyeSelection;
    coat: number;
    coatDyes: DyeSelection;
    boots: number;
    bootsDyes: DyeSelection;
    gloves: number;
    glovesDyes: DyeSelection;
    helm: number;
    helmDyes: DyeSelection;
    leggings: number;
    leggingsDyes: DyeSelection;
    shoulders: number;
    shouldersDyes: DyeSelection;
    outfit: number;
    outfitDyes: DyeSelection;
    weaponAquatic1: number;
    weaponAquatic2: number;
    weaponA1: number;
    weaponA2: number;
    weaponB1: number;
    weaponB2: number;
    visibilityFlags: number;
  }
}

export enum Profession {
  Guardian = 1,
  Warrior = 2,
  Engineer = 3,
  Ranger = 4,
  Thief = 5,
  Elementalist = 6,
  Mesmer = 7,
  Necromancer = 8,
  Revenant = 9,
}

export type TraitSelection = [SelectedTrait, SelectedTrait, SelectedTrait];

export enum SelectedTrait {
  None = 0,
  Top = 1,
  Middle = 2,
  Bottom = 3,
}

export type DyeSelection =
  | [number, number, number, number]
  | [number, number, number]
  | [number, number]
  | [number];

export enum VisibilityFlags {
  Aquabreather = 1,
  Backpack = 2,
  // = 4, // coat?
  // = 8, // shoes?
  Gloves = 16,
  Helmet = 32,
  // = 32, // pants?
  // = 64, // ???
  Shoulders = 128,
  Outfit = 256,
  AquaticWeapon = 512,
  AquaticWeapon2 = 1024,
  Weapon1 = 2048,
  Weapon1Offhand = 4096,
  Weapon2 = 8192,
  Weapon2Offhand = 16384,
}
