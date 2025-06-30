// File: scripts/config.js
/**
 * Configuration constants for the Smart Species Generator module
 */

export const MODULE_NAME = 'species-generator';
export const MODULE_TITLE = 'Smart Species Generator';

/**
 * Species biological archetypes
 */
export const SPECIES_ARCHETYPES = {
  HUMANOID: 'humanoid',
  AVIAN: 'avian',
  REPTILIAN: 'reptilian',
  INSECTOID: 'insectoid',
  AQUATIC: 'aquatic',
  ENERGY: 'energy',
  SYNTHETIC: 'synthetic',
  HYBRID: 'hybrid'
};

/**
 * Cultural frameworks that define social organization
 */
export const CULTURAL_FRAMEWORKS = {
  NOMADIC: 'nomadic',
  CORPORATE: 'corporate',
  TRIBAL: 'tribal',
  ACADEMIC: 'academic',
  MILITANT: 'militant',
  MYSTIC: 'mystic',
  ANARCHIST: 'anarchist'
};

/**
 * Galactic political status options
 */
export const GALACTIC_STATUS = {
  UC_CORE: 'uc_core',
  UC_ADJACENT: 'uc_adjacent',
  INDEPENDENT: 'independent',
  ROGUE: 'rogue',
  EXTINCT: 'extinct',
  EMERGING: 'emerging'
};

/**
 * Narrative roles for context-aware generation
 */
export const NARRATIVE_ROLES = {
  NEUTRAL: 'neutral',
  ALLY: 'ally',
  ENEMY: 'enemy',
  MYSTERIOUS: 'mysterious'
};

/**
 * Generation speed options
 */
export const GENERATION_SPEEDS = {
  FAST: 'fast',
  DETAILED: 'detailed'
};

/**
 * Default module settings
 */
export const DEFAULT_SETTINGS = {
  generationSpeed: GENERATION_SPEEDS.FAST,
  defaultRole: NARRATIVE_ROLES.NEUTRAL,
  autoExportToJournal: true,
  enableChatCommands: true,
  showWelcomeMessage: true,
  trackStatistics: true
};

/**
 * Performance targets (in milliseconds)
 */
export const PERFORMANCE_TARGETS = {
  CONTEXT_ANALYSIS: 200,
  CORE_GENERATION: 800,
  DETAIL_SYNTHESIS: 1000,
  TOTAL_TARGET: 2000
};

/**
 * Table file names for the RollTableManager
 */
export const TABLE_FILES = [
  'biology.json',
  'culture.json',
  'status.json',
  'traits.json',
  'hooks.json',
  'naming.json'
];

/**
 * Hook categories for narrative generation
 */
export const HOOK_CATEGORIES = {
  POLITICAL: 'political',
  MYSTERIOUS: 'mysterious',
  PERSONAL: 'personal',
  RESOURCE: 'resource',
  TEMPORAL: 'temporal'
};

/**
 * Weighting factors for context-based generation
 */
export const CONTEXT_WEIGHTS = {
  ROLE_MULTIPLIERS: {
    [NARRATIVE_ROLES.ENEMY]: {
      [CULTURAL_FRAMEWORKS.MILITANT]: 2.0,
      [GALACTIC_STATUS.ROGUE]: 1.5
    },
    [NARRATIVE_ROLES.ALLY]: {
      [CULTURAL_FRAMEWORKS.ACADEMIC]: 1.5,
      [GALACTIC_STATUS.UC_ADJACENT]: 1.5
    },
    [NARRATIVE_ROLES.MYSTERIOUS]: {
      [SPECIES_ARCHETYPES.ENERGY]: 2.0,
      [CULTURAL_FRAMEWORKS.MYSTIC]: 2.0
    }
  },
  
  ENVIRONMENT_MULTIPLIERS: {
    'space': {
      [SPECIES_ARCHETYPES.ENERGY]: 1.5,
      [CULTURAL_FRAMEWORKS.NOMADIC]: 1.3
    },
    'urban': {
      [CULTURAL_FRAMEWORKS.CORPORATE]: 1.5,
      [GALACTIC_STATUS.UC_CORE]: 1.3
    },
    'planetary': {
      [SPECIES_ARCHETYPES.HUMANOID]: 1.2,
      [CULTURAL_FRAMEWORKS.TRIBAL]: 1.3
    }
  }
};

/**
 * UI configuration
 */
export const UI_CONFIG = {
  DIALOG_WIDTH: 600,
  DIALOG_HEIGHT: 500,
  DISPLAY_WIDTH: 800,
  DISPLAY_HEIGHT: 700,
  
  SCENE_CONTROL_ICON: 'fas fa-user-alien',
  QUICK_GENERATE_ICON: 'fas fa-dice',
  DETAILED_GENERATE_ICON: 'fas fa-cogs',
  STATS_ICON: 'fas fa-chart-bar',
  EXPORT_ICON: 'fas fa-file-export'
};

/**
 * Keyboard shortcuts configuration
 */
export const KEYBINDINGS = {
  QUICK_GENERATE: {
    key: 'KeyG',
    modifiers: ['Control', 'Shift']
  },
  OPEN_DIALOG: {
    key: 'KeyG',
    modifiers: ['Control', 'Alt']
  }
};

/**
 * Chat command configuration
 */
export const CHAT_COMMANDS = {
  PRIMARY: '/species',
  ALIASES: ['/sp', '/alien', '/generate']
};

/**
 * SWADE system integration constants
 */
export const SWADE_CONFIG = {
  SYSTEM_ID: 'swade',
  
  ATTRIBUTE_NAMES: {
    AGILITY: 'agility',
    SMARTS: 'smarts',
    SPIRIT: 'spirit',
    STRENGTH: 'strength',
    VIGOR: 'vigor'
  },
  
  SKILL_CATEGORIES: {
    COMBAT: ['fighting', 'shooting'],
    SOCIAL: ['persuasion', 'intimidation'],
    KNOWLEDGE: ['research', 'science'],
    SURVIVAL: ['survival', 'stealth'],
    TECHNICAL: ['hacking', 'piloting']
  }
};

/**
 * Export formats available
 */
export const EXPORT_FORMATS = {
  JOURNAL: 'journal',
  CSV: 'csv',
  JSON: 'json',
  HANDOUT: 'handout'
};

/**
 * Statistics tracking configuration
 */
export const STATS_CONFIG = {
  TRACK_GENERATION_TIME: true,
  TRACK_ARCHETYPE_USAGE: true,
  TRACK_CULTURE_USAGE: true,
  TRACK_EXPORT_COUNT: true,
  MAX_RECENT_SPECIES: 10
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERATION_FAILED: 'Species generation failed',
  TABLE_LOAD_FAILED: 'Failed to load generation tables',
  EXPORT_FAILED: 'Failed to export species',
  INVALID_SEED: 'Invalid generation parameters',
  PERFORMANCE_WARNING: 'Generation taking longer than expected'
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  GENERATION_COMPLETE: 'Species generated successfully',
  EXPORTED_TO_JOURNAL: 'Species exported to journal',
  SETTINGS_SAVED: 'Settings saved successfully',
  STATS_RESET: 'Statistics reset'
};

/**
 * Development and debugging flags
 */
export const DEBUG_CONFIG = {
  ENABLE_CONSOLE_LOGGING: true,
  ENABLE_PERFORMANCE_TRACKING: true,
  ENABLE_TABLE_VALIDATION: true,
  LOG_GENERATION_STEPS: false,
  MOCK_SLOW_GENERATION: false // For testing UI loading states
};

/**
 * Module compatibility information
 */
export const COMPATIBILITY = {
  MINIMUM_FOUNDRY: '12',
  VERIFIED_FOUNDRY: '12',
  RECOMMENDED_SYSTEMS: ['swade'],
  COMPATIBLE_MODULES: [
    'dice-so-nice',
    'compendium-folders',
    'journal-enhanced'
  ]
};

/**
 * File paths for module assets
 */
export const ASSET_PATHS = {
  TABLES: `modules/${MODULE_NAME}/tables/`,
  STYLES: `modules/${MODULE_NAME}/styles/`,
  TEMPLATES: `modules/${MODULE_NAME}/templates/`,
  IMAGES: `modules/${MODULE_NAME}/images/`,
  LANG: `modules/${MODULE_NAME}/lang/`
};