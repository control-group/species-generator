// File: scripts/systems/swade-integration.js
import { MODULE_NAME, SPECIES_ARCHETYPES, CULTURAL_FRAMEWORKS } from '../config.js';

export class SWADEIntegration {
  /**
   * Generate SWADE-specific mechanical traits for a species
   * @param {Object} coreProfile - The core species profile
   * @returns {Object} SWADE mechanical suggestions
   */
  static generateSWADETraits(coreProfile) {
    const traits = {
      racialAbilities: [],
      hindrances: [],
      attributes: {},
      skills: [],
      edges: [],
      mechanical_summary: ""
    };

    // Biology-based traits
    this.applyBiologyTraits(traits, coreProfile.archetype);
    
    // Culture-based traits
    this.applyCultureTraits(traits, coreProfile.culture);
    
    // Status-based traits
    this.applyStatusTraits(traits, coreProfile.status);
    
    // Generate summary
    traits.mechanical_summary = this.generateMechanicalSummary(traits);
    
    return traits;
  }

  /**
   * Apply biology-based SWADE traits
   */
  static applyBiologyTraits(traits, archetype) {
    switch (archetype) {
      case SPECIES_ARCHETYPES.HUMANOID:
        traits.racialAbilities.push("Adaptable (+2 to one attribute during character creation)");
        traits.skills.push("Free d4 in any skill during creation");
        break;
        
      case SPECIES_ARCHETYPES.AVIAN:
        traits.racialAbilities.push("Flight (12\" flying pace, requires room to maneuver)");
        traits.racialAbilities.push("Keen Eyes (+2 to Notice rolls involving sight)");
        traits.hindrances.push("Hollow Bones (-1 Toughness vs. fall damage)");
        traits.attributes.agility = "+1";
        break;
        
      case SPECIES_ARCHETYPES.REPTILIAN:
        traits.racialAbilities.push("Armor +2 (Natural scales)");
        traits.racialAbilities.push("Infrared Vision (Halve penalties for bad lighting vs. heat sources)");
        traits.hindrances.push("Cold Blooded (-2 to resist cold, sluggish in cold environments)");
        traits.attributes.vigor = "+1";
        break;
        
      case SPECIES_ARCHETYPES.INSECTOID:
        traits.racialAbilities.push("Extra Limbs (Additional actions with limbs, +2 to climbing)");
        traits.racialAbilities.push("Hive Mind (Shared knowledge within community)");
        traits.hindrances.push("Outsider (-2 Charisma when dealing with non-insectoids)");
        traits.attributes.vigor = "+1";
        break;
        
      case SPECIES_ARCHETYPES.AQUATIC:
        traits.racialAbilities.push("Aquatic (Swimming pace equal to land pace, can breathe underwater)");
        traits.racialAbilities.push("Pressure Resistance (Immune to pressure effects)");
        traits.hindrances.push("Dependency (Must immerse in water at least once per day)");
        traits.attributes.vigor = "+1";
        break;
        
      case SPECIES_ARCHETYPES.ENERGY:
        traits.racialAbilities.push("Energy Being (Immune to disease, poison, suffocation)");
        traits.racialAbilities.push("Phase (Can become incorporeal for one round, 1/day)");
        traits.hindrances.push("Electromagnetic Sensitivity (-2 vs. EMP and electrical attacks)");
        traits.attributes.spirit = "+2";
        break;
        
      case SPECIES_ARCHETYPES.SYNTHETIC:
        traits.racialAbilities.push("Construct (Immune to disease, poison, suffocation)");
        traits.racialAbilities.push("Interface (Can directly connect to compatible technology)");
        traits.hindrances.push("Dependency (Requires power source, daily maintenance)");
        traits.attributes.smarts = "+1";
        break;
        
      case SPECIES_ARCHETYPES.HYBRID:
        traits.racialAbilities.push("Adaptive Evolution (Can temporarily gain minor abilities)");
        traits.racialAbilities.push("Versatile (Extra skill points during creation)");
        traits.hindrances.push("Genetic Instability (Occasional random mutations)");
        break;
    }
  }

  /**
   * Apply culture-based SWADE traits
   */
  static applyCultureTraits(traits, culture) {
    switch (culture) {
      case CULTURAL_FRAMEWORKS.NOMADIC:
        traits.skills.push("Piloting d6", "Survival d6");
        traits.edges.push("Suggested: Ace, Steady Hands");
        break;
        
      case CULTURAL_FRAMEWORKS.CORPORATE:
        traits.skills.push("Persuasion d6", "Common Knowledge d6");
        traits.edges.push("Suggested: Connections, Rich");
        break;
        
      case CULTURAL_FRAMEWORKS.TRIBAL:
        traits.skills.push("Fighting d6", "Survival d6");
        traits.edges.push("Suggested: Warrior, Brave");
        break;
        
      case CULTURAL_FRAMEWORKS.ACADEMIC:
        traits.skills.push("Research d6", "Science d6");
        traits.edges.push("Suggested: Scholar, Investigator");
        break;
        
      case CULTURAL_FRAMEWORKS.MILITANT:
        traits.skills.push("Fighting d6", "Shooting d6");
        traits.edges.push("Suggested: Soldier, Combat Reflexes");
        break;
        
      case CULTURAL_FRAMEWORKS.MYSTIC:
        traits.skills.push("Psionics d6", "Healing d6");
        traits.edges.push("Suggested: Mentalist, Mystic");
        break;
        
      case CULTURAL_FRAMEWORKS.ANARCHIST:
        traits.skills.push("Stealth d6", "Hacking d6");
        traits.edges.push("Suggested: Thief, Free Runner");
        break;
    }
  }

  /**
   * Apply galactic status traits
   */
  static applyStatusTraits(traits, status) {
    switch (status) {
      case 'uc_core':
        traits.edges.push("Suggested: Rich, Connections (UC)");
        traits.racialAbilities.push("Galactic Citizenship (Access to UC facilities)");
        break;
        
      case 'uc_adjacent':
        traits.edges.push("Suggested: Connections (Regional)");
        break;
        
      case 'independent':
        traits.edges.push("Suggested: Independent, Self-Reliant");
        break;
        
      case 'rogue':
        traits.hindrances.push("Wanted (By major authorities)");
        traits.edges.push("Suggested: Streetwise, Danger Sense");
        break;
        
      case 'extinct':
        traits.racialAbilities.push("Ancient Knowledge (Access to lost technologies)");
        traits.hindrances.push("Outsider (Last of their kind)");
        break;
        
      case 'emerging':
        traits.hindrances.push("Clueless (Unfamiliar with galactic customs)");
        traits.edges.push("Suggested: Luck, Quick");
        break;
    }
  }

  /**
   * Generate a concise mechanical summary
   */
  static generateMechanicalSummary(traits) {
    const parts = [];
    
    if (Object.keys(traits.attributes).length > 0) {
      const attrStrings = Object.entries(traits.attributes).map(([attr, mod]) => `${attr.charAt(0).toUpperCase()}${attr.slice(1)} ${mod}`);
      parts.push(`Attributes: ${attrStrings.join(', ')}`);
    }
    
    if (traits.racialAbilities.length > 0) {
      parts.push(`Abilities: ${traits.racialAbilities.slice(0, 2).join('; ')}`);
    }
    
    if (traits.hindrances.length > 0) {
      parts.push(`Hindrances: ${traits.hindrances[0]}`);
    }
    
    return parts.join(' | ');
  }
}