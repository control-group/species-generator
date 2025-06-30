// File: scripts/core/context-engine.js
import { MODULE_NAME, NARRATIVE_ROLES, CONTEXT_WEIGHTS, CULTURAL_FRAMEWORKS, GALACTIC_STATUS, SPECIES_ARCHETYPES } from '../config.js';

export class ContextEngine {
  /**
   * Analyze the current game context to weight generation appropriately
   */
  async analyzeContext(seed) {
    console.log(`${MODULE_NAME} | Analyzing context for seed:`, seed);
    
    const context = {
      biologyWeights: {},
      cultureWeights: {},
      statusWeights: {},
      narrativeRole: seed.role || NARRATIVE_ROLES.NEUTRAL,
      environment: null,
      sceneContext: null
    };

    // Analyze current scene/setting
    if (game.scenes?.active) {
      context.sceneContext = this.analyzeSceneEnvironment(game.scenes.active);
      context.environment = context.sceneContext.type;
    }

    // Apply role-based weights
    this.applyRoleWeights(context, seed.role);
    
    // Apply environment-based weights
    if (context.environment) {
      this.applyEnvironmentWeights(context, context.environment);
    }
    
    // Apply campaign-specific weights
    this.applyCampaignWeights(context);
    
    console.log(`${MODULE_NAME} | Context analysis complete:`, context);
    return context;
  }

  /**
   * Apply weighting based on intended narrative role
   */
  applyRoleWeights(context, role) {
    if (!role || !CONTEXT_WEIGHTS.ROLE_MULTIPLIERS[role]) {
      return;
    }

    const roleWeights = CONTEXT_WEIGHTS.ROLE_MULTIPLIERS[role];
    
    Object.entries(roleWeights).forEach(([key, weight]) => {
      if (Object.values(CULTURAL_FRAMEWORKS).includes(key)) {
        context.cultureWeights[key] = weight;
      } else if (Object.values(GALACTIC_STATUS).includes(key)) {
        context.statusWeights[key] = weight;
      } else if (Object.values(SPECIES_ARCHETYPES).includes(key)) {
        context.biologyWeights[key] = weight;
      }
    });
  }

  /**
   * Apply environment-based weights
   */
  applyEnvironmentWeights(context, environment) {
    const envWeights = CONTEXT_WEIGHTS.ENVIRONMENT_MULTIPLIERS[environment];
    if (!envWeights) return;

    Object.entries(envWeights).forEach(([key, weight]) => {
      if (Object.values(CULTURAL_FRAMEWORKS).includes(key)) {
        context.cultureWeights[key] = (context.cultureWeights[key] || 1) * weight;
      } else if (Object.values(GALACTIC_STATUS).includes(key)) {
        context.statusWeights[key] = (context.statusWeights[key] || 1) * weight;
      } else if (Object.values(SPECIES_ARCHETYPES).includes(key)) {
        context.biologyWeights[key] = (context.biologyWeights[key] || 1) * weight;
      }
    });
  }

  /**
   * Apply campaign-specific weights
   */
  applyCampaignWeights(context) {
    // Could analyze journal entries, world settings, etc.
    // For now, just add basic Known Galaxy weights
    
    // Slightly favor UC-adjacent status (fits the setting)
    context.statusWeights[GALACTIC_STATUS.UC_ADJACENT] = (context.statusWeights[GALACTIC_STATUS.UC_ADJACENT] || 1) * 1.2;
    
    // Slightly favor nomadic cultures (post-apocalyptic feel)
    context.cultureWeights[CULTURAL_FRAMEWORKS.NOMADIC] = (context.cultureWeights[CULTURAL_FRAMEWORKS.NOMADIC] || 1) * 1.1;
  }

  /**
   * Analyze current scene for environmental context
   */
  analyzeSceneEnvironment(scene) {
    const environment = {
      type: 'unknown',
      tags: [],
      implications: []
    };
    
    if (!scene) return environment;
    
    // Simple heuristics based on scene name/notes
    const sceneName = (scene.name || '').toLowerCase();
    const sceneNotes = (scene.notes || '').toLowerCase();
    const combinedText = `${sceneName} ${sceneNotes}`;
    
    // Determine environment type
    if (this.matchesKeywords(combinedText, ['space', 'void', 'vacuum', 'orbit'])) {
      environment.type = 'space';
      environment.tags.push('zero-g', 'vacuum', 'artificial');
    } else if (this.matchesKeywords(combinedText, ['city', 'station', 'urban', 'colony'])) {
      environment.type = 'urban';
      environment.tags.push('civilized', 'crowded', 'technological');
    } else if (this.matchesKeywords(combinedText, ['planet', 'surface', 'world', 'ground'])) {
      environment.type = 'planetary';
      environment.tags.push('natural', 'varied', 'territorial');
    } else if (this.matchesKeywords(combinedText, ['ship', 'vessel', 'craft', 'bridge'])) {
      environment.type = 'vessel';
      environment.tags.push('confined', 'mobile', 'crew-based');
    }
    
    return environment;
  }

  /**
   * Check if text matches any of the provided keywords
   */
  matchesKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }
}