// File: scripts/core/enhanced-generation.js
import { SWADEIntegration } from '../systems/swade-integration.js';

/**
 * Enhanced generation methods for the SpeciesGenerator class
 */
export class EnhancedGeneration {
  /**
   * Generate SWADE-specific mechanical traits
   */
  static async generateSWADETraits(coreProfile) {
    return SWADEIntegration.generateSWADETraits(coreProfile);
  }

  /**
   * Generate physical traits based on archetype and context
   */
  static async generatePhysicalTraits(coreProfile) {
    const rollTableManager = game.speciesGenerator?.generator?.rollTableManager;
    if (!rollTableManager) return [];

    const archetypeTraits = await rollTableManager.getTable('traits');
    const traitList = archetypeTraits[coreProfile.archetype] || archetypeTraits.humanoid;
    
    // Select 2-4 random traits
    const numTraits = 2 + Math.floor(Math.random() * 3);
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
   * Generate cultural traits and interaction patterns
   */
  static async generateCulturalTraits(coreProfile) {
    const rollTableManager = game.speciesGenerator?.generator?.rollTableManager;
    if (!rollTableManager) return {};

    const cultureData = await rollTableManager.getTable('culture');
    const cultureEntry = cultureData.entries.find(e => e.key === coreProfile.culture);
    
    if (!cultureEntry) return {};
    
    return {
      values: cultureEntry.values,
      structure: cultureEntry.structure,
      interaction_style: cultureEntry.interaction_style,
      common_roles: cultureEntry.common_roles
    };
  }

  /**
   * Generate narrative hooks with context awareness
   */
  static async generateNarrativeHook(coreProfile, context) {
    const rollTableManager = game.speciesGenerator?.generator?.rollTableManager;
    if (!rollTableManager) return { summary: "Unknown origins", detailed: "This species has mysterious origins." };

    const hooksTable = await rollTableManager.getTable('hooks');
    
    // Choose hook category based on narrative role
    let category = 'political'; // default
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
    
    const hooks = hooksTable[category] || hooksTable.political;
    const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
    
    return {
      summary: selectedHook,
      detailed: this.expandHook(selectedHook, coreProfile),
      category,
      usage_suggestions: this.generateUsageSuggestions(selectedHook, coreProfile)
    };
  }

  /**
   * Expand a basic hook into more detailed narrative text
   */
  static expandHook(hook, profile) {
    // This could be expanded with more sophisticated text generation
    const expansions = {
      "homeworld": `Their homeworld of ${this.generatePlanetName()} `,
      "technology": `Using their ${profile.archetype} abilities, they have developed `,
      "political": `Due to their ${profile.culture} nature, they find themselves `,
      "resource": `The unique resources of their ${profile.status} territory `
    };
    
    // Simple pattern matching and expansion
    let expanded = hook;
    for (const [pattern, replacement] of Object.entries(expansions)) {
      if (hook.toLowerCase().includes(pattern)) {
        expanded = replacement + hook.toLowerCase();
        break;
      }
    }
    
    return expanded.charAt(0).toUpperCase() + expanded.slice(1);
  }

  /**
   * Generate usage suggestions for GMs
   */
  static generateUsageSuggestions(hook, profile) {
    const suggestions = [
      `Ideal for ${profile.culture} encounters`,
      `Can serve as recurring ${profile.status} contacts`,
      `Perfect for introducing ${profile.archetype} elements to the story`
    ];
    
    if (hook.includes('missing') || hook.includes('lost')) {
      suggestions.push("Great for rescue or mystery scenarios");
    }
    
    if (hook.includes('trade') || hook.includes('resource')) {
      suggestions.push("Excellent for economic or exploration plots");
    }
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  /**
   * Generate a quick planet name for expanded hooks
   */
  static generatePlanetName() {
    const prefixes = ['Ker', 'Zep', 'Nox', 'Vel', 'Tor', 'Lyr', 'Dax', 'Rho'];
    const suffixes = ['idos', 'anta', 'eron', 'alis', 'ux', 'ara', 'on', 'eth'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return prefix + suffix;
  }
}