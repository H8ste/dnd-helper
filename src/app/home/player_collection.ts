interface Player_Collection {
    ability_scores: Ability_Scores,
    saving_throw: Saving_Throw,
    skills: Skill[],
    level: number,
    equipment: Equipment,
    attributes: Attributes,
    status: Status,
    racial_features: RacialFeatures,
    spellbook: SpellBook,
    spells_prepared: string[]
}

interface Ability_Scores {
    cha: number,
    con: number,
    dex: number,
    int: number,
    str: number,
    wis: number,
}

interface Saving_Throw {
    cha: number,
    con: number,
    dex: number,
    int: number,
    str: number,
    wis: number,
}

interface Skill {
    ability: string,
    label: string,
    prof: number,
}

interface Equipment {
    armor: Armor,
}

interface Armor {
    name: string,
    ac: number,
}

interface Attributes {
    speed: number,
    extraInitiative: number,
    hitpoints_dice: number,
}

interface Status {
    current_hitpoints: number,
    max_hitpoints: number,
    temp_hitpoints: number,
}

interface RacialFeatures {
    "01_first": RacialFeature,
    "02_second": RacialFeature,
    "03_third": RacialFeature,
    "04_fourth": RacialFeature,
    "05_fifth": RacialFeature,
}

interface RacialFeature {
    label: string,
    content: string,
}

interface SpellBook {
    cantrips: Spell[],
    "1": Spell[],
}

interface Spell {
    casting_time: string,
    classes: string[],
    components: Components,
    description: string,
    duration: string,
    higher_levels?: string
    level: string,
    name: string,
    range: string,
    ritual: boolean,
    school: string,
    tags: string[],
    type: string,
}

interface Components {
    material: boolean,
    materials_needed?: string[],
    raw: string,
    somatic: boolean,
    verbal: boolean,
}

export { Player_Collection as PlayerCollection, Spell as Spell };