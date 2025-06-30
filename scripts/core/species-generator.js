// File: scripts/core/species-generator.js
import { MODULE_NAME, SPECIES_ARCHETYPES, CULTURAL_FRAMEWORKS, GALACTIC_STATUS, PERFORMANCE_TARGETS } from '../config.js';
import { RollTableManager } from './rolltable-manager.js';
import { ContextEngine } from './context-engine.js';

export class SpeciesGenerator {
  constructor() {
    this.rollTableManager = new RollTableManager();
    this.contextEngine = new ContextEngine();
    this.generationCache = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize the generator (async setup)
   */
  async initialize() {
    if (this.isInitialized) return;
    
    console.log(`${MODULE_NAME} | Initializing SpeciesGenerator`);
    
    try {
      await this.rollTableManager.loadTables();
      this.isInitialized = true;
      console.log(`${MODULE_NAME} | SpeciesGenerator initialized successfully`);
    } catch (error) {
      console.error(`${MODULE_NAME} | Failed to initialize SpeciesGenerator:`, error);
      throw error;
    }
  }

  /**
   * Generate a complete species in under 2 minutes
   * @param {Object} seed - Context hints for generation
   * @param {string} seed.setting - Current narrative setting
   * @param {string} seed.role - Intended story role (ally, enemy, neutral)
   * @param {string} seed.speed - Generation speed (fast/detailed)
   * @returns {Object} Complete species profile
   */
  async generateSpecies(seed = {}) {
    console.log(`${MODULE_NAME} | Generating species with seed:`, seed);
    
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const startTime = performance.now();
    
    try {
      // Phase 1: Context Analysis (target: 200ms)
      const contextStart = performance.now();
      const context = await this.contextEngine.analyzeContext(seed);
      const contextTime = performance.now() - contextStart;
      
      // Phase 2: Core Generation (target: 800ms)
      const coreStart = performance.now();
      const coreProfile = await this.generateCoreProfile(context);
      const coreTime = performance.now() - coreStart;
      
      // Phase 3: Detail Synthesis (target: 1000ms)
      const detailStart = performance.now();
      const detailedSpecies = await this.synthesizeDetails(coreProfile, context);
      const detailTime = performance.now() - detailStart;
      
      const totalTime = performance.now() - startTime;
      
      // Log performance
      console.log(`${MODULE_NAME} | Generation timing:`, {
        context: `${contextTime.toFixed(1)}ms`,
        core: `${coreTime.toFixed(1)}ms`,
        details: `${detailTime.toFixed(1)}ms`,
        total: `${totalTime.toFixed(1)}ms`
      });
      
      // Add metadata
      detailedSpecies._metadata = {
        generationTime: totalTime,
        seed,
        timestamp: new Date().toISOString()
      };
      
      return detailedSpecies;
      
    } catch (error) {
      console.error(`${MODULE_NAME} | Generation failed:`, error);
      return this.getFallbackSpecies();
    }
  }

  /**
   * Generate the core species profile using weighted tables
   */
  async generateCoreProfile(context) {
    const profile = {};
    
    // Biology determination - influenced by context
    const biologyResult = await this.rollTableManager.rollWeighted('biology', context.biologyWeights);
    profile.archetype = biologyResult.key;
    profile.biologicalData = biologyResult;
    
    // Primary traits based on archetype
    profile.primaryTraits = await this.rollTableManager.rollMultiple('traits', 2, { archetype: profile.archetype });
    
    // Cultural framework - influenced by narrative role
    const cultureResult = await this.rollTableManager.rollWeighted('culture', context.cultureWeights);
    profile.culture = cultureResult.key;
    profile.culturalData = cultureResult;
    
    // Galactic positioning
    const statusResult = await this.rollTableManager.rollWeighted('status', context.statusWeights);
    profile.status = statusResult.key;
    profile.statusData = statusResult;
    
    return profile;
  }

  /**
   * Add rich details and narrative hooks
   */
  async synthesizeDetails(coreProfile, context) {
    const species = { ...coreProfile };
    
    // Generate name using phonetic patterns
    species.name = await this.generateSpeciesName(coreProfile);
    
    // Physical characteristics (these methods will be enhanced)
    species.physicalTraits = await this.generatePhysicalTraits(coreProfile);
    
    // Cultural details
    species.culturalTraits = await this.generateCulturalTraits(coreProfile);
    
    // Narrative hook - this is crucial for quick integration
    species.narrativeHook = await this.generateNarrativeHook(coreProfile, context);
    
    // SWADE mechanical suggestions
    species.swadeTraits = await this.generateSWADETraits(coreProfile);
    
    // Quick reference summary for GM
    species.quickRef = this.generateQuickReference(species);
    
    return species;
  }

  /**
   * Generate a memorable species name using linguistic patterns
   */
  async generateSpeciesName(profile) {
    const namingTable = await this.rollTableManager.getTable('naming');
    if (!namingTable || !namingTable.patterns) {
      return `${profile.archetype}${Math.floor(Math.random() * 1000)}`;
    }
    
    const pattern = namingTable.patterns[profile.archetype] || namingTable.patterns.default;
    
    // Simple phonetic combination
    const prefix = pattern.prefixes[Math.floor(Math.random() * pattern.prefixes.length)];
    const suffix = pattern.suffixes[Math.floor(Math.random() * pattern.suffixes.length)];
    
    return prefix + suffix;
  }

  /**
   * Generate physical traits (basic implementation - will be enhanced)
   */
  async generatePhysicalTraits(coreProfile) {
    const traitsTable = await this.rollTableManager.getTable('traits');
    if (!traitsTable || !traitsTable[coreProfile.archetype]) {
      return [`Standard ${coreProfile.archetype} appearance`];
    }
    
    const traitList = traitsTable[coreProfile.archetype];
    const numTraits = 2 + Math.floor(Math.random() * 3); // 2-4 traits
    const selectedTraits = [];
    
    for (let i = 0; i < numTraits && selectedTraits.length < traitList.length; i++) {
      const randomTrait = traitList[Math.floor(Math.random() * traitList.length)];
      if (!selectedTraits.includes(randomTrait)) {
        selectedTraits.push(randomTrait);
      }
    }
    
    return selectedTraits;
  }

  /**
   * Generate cultural traits (basic implementation - will be enhanced)
   */
  async generateCulturalTraits(coreProfile) {
    const cultureData = coreProfile.culturalData;
    if (!cultureData) {
      return { interaction_style: "Unknown cultural patterns" };
    }
    
    return {
      values: cultureData.values || ['Unknown values'],
      structure: cultureData.structure || 'Unknown structure',
      interaction_style: cultureData.interaction_style || 'Unknown interaction style',
      common_roles: cultureData.common_roles || ['Unknown roles']
    };
  }

  /**
   * Generate narrative hooks (basic implementation - will be enhanced)
   */
  async generateNarrativeHook(coreProfile, context) {
    const hooksTable = await this.rollTableManager.getTable('hooks');
    if (!hooksTable) {
      return {
        summary: "Mysterious origins",
        detailed: "This species has unknown origins and unclear motivations."
      };
    }
    
    // Choose appropriate hook category
    let category = 'political';
    switch (context.narrativeRole) {
      case 'enemy':
        category = Math.random() > 0.5 ? 'political' : 'resource';
        break;
      case 'ally':
        category = Math.random() > 0.5 ? 'personal' : 'resource';
        break;
      case 'mysterious':
        category = Math.random() > 0.5 ? 'mysterious' : 'temporal';
        break;
    }
    
    const hooks = hooksTable[category] || hooksTable.political || ['Unknown motivations'];
    const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
    
    return {
      summary: selectedHook,
      detailed: selectedHook,
      category
    };
  }

  /**
   * Generate SWADE traits (basic implementation - will be enhanced)
   */
  async generateSWADETraits(coreProfile) {
    // Basic SWADE traits based on archetype
    const traits = {
      racialAbilities: [],
      hindrances: [],
      attributes: {},
      skills: [],
      edges: [],
      mechanical_summary: ""
    };

    // Simple archetype-based traits
    switch (coreProfile.archetype) {
      case SPECIES_ARCHETYPES.HUMANOID:
        traits.racialAbilities.push("Adaptable (+2 to one attribute during creation)");
        break;
      case SPECIES_ARCHETYPES.AVIAN:
        traits.racialAbilities.push("Flight (12\" flying pace)");
        traits.attributes.agility = "+1";
        break;
      case SPECIES_ARCHETYPES.REPTILIAN:
        traits.racialAbilities.push("Armor +2 (Natural scales)");
        traits.attributes.vigor = "+1";
        break;
      default:
        traits.racialAbilities.push("Standard racial traits");
    }

    traits.mechanical_summary = traits.racialAbilities.join(', ');
    return traits;
  }

  /**
   * Generate quick reference for mid-session use
   */
  generateQuickReference(species) {
    return {
      elevator_pitch: `${species.archetype} ${species.culture} from ${species.statusData?.name || species.status}`,
      key_traits: species.physicalTraits.slice(0, 3),
      story_hook: species.narrativeHook.summary,
      swade_notes: species.swadeTraits.mechanical_summary,
      roleplay_notes: species.culturalTraits.interaction_style
    };
  }

  /**
   * Fallback species for emergency use
   */
  getFallbackSpecies() {
    return {
      name: "Voidborn",
      archetype: SPECIES_ARCHETYPES.HUMANOID,
      culture: CULTURAL_FRAMEWORKS.NOMADIC,
      status: GALACTIC_STATUS.INDEPENDENT,
      physicalTraits: ["Pale skin adapted to low light", "Large eyes for void navigation", "Silent movement"],
      culturalTraits: {
        values: ["Freedom", "Knowledge", "Survival"],
        interaction_style: "Speak softly, avoid crowds, obsessed with star charts"
      },
      narrativeHook: {
        summary: "They know something about the void between stars",
        detailed: "The Voidborn possess knowledge of navigation routes and phenomena that exist in the empty spaces between star systems."
      },
      swadeTraits: {
        racialAbilities: ["Low Light Vision", "Space Adaptation"],
        hindrances: ["Outsider (Strange mannerisms)"],
        mechanical_summary: "Low Light Vision, Space Adaptation, Outsider hindrance"
      },
      quickRef: {
        elevator_pitch: "Space-adapted humans with mysterious origins",
        key_traits: ["Pale skin", "Large eyes", "Silent movement"],
        story_hook: "They know something about the void between stars",
        swade_notes: "Low Light Vision, Space Adaptation, Outsider hindrance",
        roleplay_notes: "Speak softly, avoid crowds, obsessed with star charts"
      }
    };
  }
}
