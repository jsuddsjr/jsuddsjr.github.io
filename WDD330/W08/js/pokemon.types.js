/**
 * @typedef {Object} LinkEntry
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {Object} GameIndex
 * @property {number} game_index
 * @property {LinkEntry} version
 */

/**
 * @typedef {Object} VersionGroupDetail
 * @property {Number} level_learned_at
 * @property {LinkEntry} move_learn_method
 * @property {LinkEntry} version_group
 */
/**
 * @typedef {Object} Move
 * @property {LinkEntry} move
 * @property {VersionGroupDetail[]} version_group_details
 */

/**
 * @typedef {Object} Stats
 * @property {Number} base_stat
 * @property {Number} effort
 * @property {LinkEntry} stat
 */

/**
 * @typedef {Object} Type
 * @property {Number} slot
 * @property {LinkEntry} type
 */

/**
 * @typedef {Object} Ability
 * @property {object} ability
 * @property {string} ability.name
 * @property {string} ability.url
 * @property {boolean} is_hidden
 * @property {number} slot
 */

/**
 * @typedef {Object} SpriteBase
 * @property {String} back_default
 * @property {String?} back_female
 * @property {String?} back_shiny
 * @property {String?} back_gray
 * @property {String?} back_shiny_female
 * @property {String} front_default
 * @property {String?} front_female
 * @property {String?} front_shiny
 * @property {String?} front_gray
 * @property {String?} front_shiny_female
 */

/**
 * @typedef {Object} PokemonData
 * @property {Ability[]} abilities
 * @property {number} base_experience
 * @property {LinkEntry[]} forms
 * @property {GameIndex[]} game_indices
 * @property {number} height
 * @property {*[]} held_items
 * @property {number} id
 * @property {boolean} is_default
 * @property {string} location_area_encounters
 * @property {Move[]} moves
 * @property {string} name
 * @property {number} order
 * @property {*[]} past_types
 * @property {LinkEntry} species
 * @property {object} sprites
 * @property {string} sprites.back_default
 * @property {?*} sprites.back_female
 * @property {string} sprites.back_shiny
 * @property {?*} sprites.back_shiny_female
 * @property {string} sprites.front_default
 * @property {?*} sprites.front_female
 * @property {string} sprites.front_shiny
 * @property {?*} sprites.front_shiny_female
 * @property {object} sprites.other
 * @property {object} sprites.other.dream_world
 * @property {string} sprites.other.dream_world.front_default
 * @property {?*} sprites.other.dream_world.front_female
 * @property {object} sprites.other.official-artwork
 * @property {string} sprites.other.official-artwork.front_default
 * @property {object} sprites.versions
 * @property {object} sprites.versions.generation-i
 * @property {object} sprites.versions.generation-i.red-blue
 * @property {string} sprites.versions.generation-i.red-blue.back_default
 * @property {string} sprites.versions.generation-i.red-blue.back_gray
 * @property {string} sprites.versions.generation-i.red-blue.front_default
 * @property {string} sprites.versions.generation-i.red-blue.front_gray
 * @property {object} sprites.versions.generation-i.yellow
 * @property {string} sprites.versions.generation-i.yellow.back_default
 * @property {string} sprites.versions.generation-i.yellow.back_gray
 * @property {string} sprites.versions.generation-i.yellow.front_default
 * @property {string} sprites.versions.generation-i.yellow.front_gray
 * @property {object} sprites.versions.generation-ii
 * @property {object} sprites.versions.generation-ii.crystal
 * @property {string} sprites.versions.generation-ii.crystal.back_default
 * @property {string} sprites.versions.generation-ii.crystal.back_shiny
 * @property {string} sprites.versions.generation-ii.crystal.front_default
 * @property {string} sprites.versions.generation-ii.crystal.front_shiny
 * @property {object} sprites.versions.generation-ii.gold
 * @property {string} sprites.versions.generation-ii.gold.back_default
 * @property {string} sprites.versions.generation-ii.gold.back_shiny
 * @property {string} sprites.versions.generation-ii.gold.front_default
 * @property {string} sprites.versions.generation-ii.gold.front_shiny
 * @property {object} sprites.versions.generation-ii.silver
 * @property {string} sprites.versions.generation-ii.silver.back_default
 * @property {string} sprites.versions.generation-ii.silver.back_shiny
 * @property {string} sprites.versions.generation-ii.silver.front_default
 * @property {string} sprites.versions.generation-ii.silver.front_shiny
 * @property {object} sprites.versions.generation-iii
 * @property {object} sprites.versions.generation-iii.emerald
 * @property {string} sprites.versions.generation-iii.emerald.front_default
 * @property {string} sprites.versions.generation-iii.emerald.front_shiny
 * @property {object} sprites.versions.generation-iii.firered-leafgreen
 * @property {string} sprites.versions.generation-iii.firered-leafgreen.back_default
 * @property {string} sprites.versions.generation-iii.firered-leafgreen.back_shiny
 * @property {string} sprites.versions.generation-iii.firered-leafgreen.front_default
 * @property {string} sprites.versions.generation-iii.firered-leafgreen.front_shiny
 * @property {object} sprites.versions.generation-iii.ruby-sapphire
 * @property {string} sprites.versions.generation-iii.ruby-sapphire.back_default
 * @property {string} sprites.versions.generation-iii.ruby-sapphire.back_shiny
 * @property {string} sprites.versions.generation-iii.ruby-sapphire.front_default
 * @property {string} sprites.versions.generation-iii.ruby-sapphire.front_shiny
 * @property {object} sprites.versions.generation-iv
 * @property {object} sprites.versions.generation-iv.diamond-pearl
 * @property {string} sprites.versions.generation-iv.diamond-pearl.back_default
 * @property {?*} sprites.versions.generation-iv.diamond-pearl.back_female
 * @property {string} sprites.versions.generation-iv.diamond-pearl.back_shiny
 * @property {?*} sprites.versions.generation-iv.diamond-pearl.back_shiny_female
 * @property {string} sprites.versions.generation-iv.diamond-pearl.front_default
 * @property {?*} sprites.versions.generation-iv.diamond-pearl.front_female
 * @property {string} sprites.versions.generation-iv.diamond-pearl.front_shiny
 * @property {?*} sprites.versions.generation-iv.diamond-pearl.front_shiny_female
 * @property {object} sprites.versions.generation-iv.heartgold-soulsilver
 * @property {string} sprites.versions.generation-iv.heartgold-soulsilver.back_default
 * @property {?*} sprites.versions.generation-iv.heartgold-soulsilver.back_female
 * @property {string} sprites.versions.generation-iv.heartgold-soulsilver.back_shiny
 * @property {?*} sprites.versions.generation-iv.heartgold-soulsilver.back_shiny_female
 * @property {string} sprites.versions.generation-iv.heartgold-soulsilver.front_default
 * @property {?*} sprites.versions.generation-iv.heartgold-soulsilver.front_female
 * @property {string} sprites.versions.generation-iv.heartgold-soulsilver.front_shiny
 * @property {?*} sprites.versions.generation-iv.heartgold-soulsilver.front_shiny_female
 * @property {object} sprites.versions.generation-iv.platinum
 * @property {string} sprites.versions.generation-iv.platinum.back_default
 * @property {?*} sprites.versions.generation-iv.platinum.back_female
 * @property {string} sprites.versions.generation-iv.platinum.back_shiny
 * @property {?*} sprites.versions.generation-iv.platinum.back_shiny_female
 * @property {string} sprites.versions.generation-iv.platinum.front_default
 * @property {?*} sprites.versions.generation-iv.platinum.front_female
 * @property {string} sprites.versions.generation-iv.platinum.front_shiny
 * @property {?*} sprites.versions.generation-iv.platinum.front_shiny_female
 * @property {object} sprites.versions.generation-v
 * @property {object} sprites.versions.generation-v.black-white
 * @property {object} sprites.versions.generation-v.black-white.animated
 * @property {string} sprites.versions.generation-v.black-white.animated.back_default
 * @property {?*} sprites.versions.generation-v.black-white.animated.back_female
 * @property {string} sprites.versions.generation-v.black-white.animated.back_shiny
 * @property {?*} sprites.versions.generation-v.black-white.animated.back_shiny_female
 * @property {string} sprites.versions.generation-v.black-white.animated.front_default
 * @property {?*} sprites.versions.generation-v.black-white.animated.front_female
 * @property {string} sprites.versions.generation-v.black-white.animated.front_shiny
 * @property {?*} sprites.versions.generation-v.black-white.animated.front_shiny_female
 * @property {string} sprites.versions.generation-v.black-white.back_default
 * @property {?*} sprites.versions.generation-v.black-white.back_female
 * @property {string} sprites.versions.generation-v.black-white.back_shiny
 * @property {?*} sprites.versions.generation-v.black-white.back_shiny_female
 * @property {string} sprites.versions.generation-v.black-white.front_default
 * @property {?*} sprites.versions.generation-v.black-white.front_female
 * @property {string} sprites.versions.generation-v.black-white.front_shiny
 * @property {?*} sprites.versions.generation-v.black-white.front_shiny_female
 * @property {object} sprites.versions.generation-vi
 * @property {object} sprites.versions.generation-vi.omegaruby-alphasapphire
 * @property {string} sprites.versions.generation-vi.omegaruby-alphasapphire.front_default
 * @property {?*} sprites.versions.generation-vi.omegaruby-alphasapphire.front_female
 * @property {string} sprites.versions.generation-vi.omegaruby-alphasapphire.front_shiny
 * @property {?*} sprites.versions.generation-vi.omegaruby-alphasapphire.front_shiny_female
 * @property {object} sprites.versions.generation-vi.x-y
 * @property {string} sprites.versions.generation-vi.x-y.front_default
 * @property {?*} sprites.versions.generation-vi.x-y.front_female
 * @property {string} sprites.versions.generation-vi.x-y.front_shiny
 * @property {?*} sprites.versions.generation-vi.x-y.front_shiny_female
 * @property {object} sprites.versions.generation-vii
 * @property {object} sprites.versions.generation-vii.icons
 * @property {string} sprites.versions.generation-vii.icons.front_default
 * @property {?*} sprites.versions.generation-vii.icons.front_female
 * @property {object} sprites.versions.generation-vii.ultra-sun-ultra-moon
 * @property {string} sprites.versions.generation-vii.ultra-sun-ultra-moon.front_default
 * @property {?*} sprites.versions.generation-vii.ultra-sun-ultra-moon.front_female
 * @property {string} sprites.versions.generation-vii.ultra-sun-ultra-moon.front_shiny
 * @property {?*} sprites.versions.generation-vii.ultra-sun-ultra-moon.front_shiny_female
 * @property {object} sprites.versions.generation-viii
 * @property {object} sprites.versions.generation-viii.icons
 * @property {string} sprites.versions.generation-viii.icons.front_default
 * @property {?*} sprites.versions.generation-viii.icons.front_female
 * @property {Stat[]} stats
 * @property {Type[]} types
 * @property {number} weight
 */

/**
 * @typedef {Object} PokemonResponse
 * @property {String} next
 * @property {String} previous
 * @property {LinkEntry[]} results
 */

module.exports = {};
