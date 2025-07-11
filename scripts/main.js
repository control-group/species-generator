// File: scripts/main.js
import { MODULE_NAME, MODULE_TITLE } from './config.js';
import { SpeciesGenerator } from './core/species-generator.js';
import { SpeciesGeneratorDialog } from './ui/species-dialog.js';
import { SpeciesDisplayDialog } from './ui/species-display.js';

/**
 * Smart Species Generator Module
 * Designed for rapid species creation during game sessions
 */
class SmartSpeciesGeneratorModule {
  static generator = null;
  static isInitialized = false;

  /**
   * Initialize the module
   */
  static init() {
    console.log(`${MODULE_NAME} | INIT METHOD CALLED - Starting initialization`);
    console.log(`${MODULE_NAME} | MODULE_NAME value:`, MODULE_NAME);
    console.log(`${MODULE_NAME} | Initializing ${MODULE_TITLE}`);
    
    try {
      // Register module settings
      console.log(`${MODULE_NAME} | Registering settings...`);
      this.registerSettings();
      console.log(`${MODULE_NAME} | Settings registered successfully`);
      
      // Register keybindings (MUST be done during init)
      console.log(`${MODULE_NAME} | Registering keybindings...`);
      this.registerKeybindings();
      console.log(`${MODULE_NAME} | Keybindings registered successfully`);
      
      // Initialize the generator
      console.log(`${MODULE_NAME} | Creating generator instance...`);
      this.generator = new SpeciesGenerator();
      console.log(`${MODULE_NAME} | Generator created successfully`);
      
      // Enhance the generator with additional methods
      console.log(`${MODULE_NAME} | Enhancing generator...`);
      this.enhanceGenerator();
      console.log(`${MODULE_NAME} | Generator enhanced successfully`);
      
      // Add to global game object for external access
      console.log(`${MODULE_NAME} | Creating global game object...`);
      game.speciesGenerator = {
        generate: (seed) => this.generator.generateSpecies(seed),
        openDialog: () => new SpeciesGeneratorDialog(this.generator).render(true),
        version: game.modules.get(MODULE_NAME)?.version || "1.0.0",
        settings: {
          getGenerationSpeed: () => game.settings.get(MODULE_NAME, 'generationSpeed'),
          getDefaultRole: () => game.settings.get(MODULE_NAME, 'defaultRole'),
          getAutoExport: () => game.settings.get(MODULE_NAME, 'autoExportToJournal')
        }
      };
      console.log(`${MODULE_NAME} | Global object created:`, game.speciesGenerator);
      
      this.isInitialized = true;
      console.log(`${MODULE_NAME} | Initialization complete - SUCCESS`);
    } catch (error) {
      console.error(`${MODULE_NAME} | INITIALIZATION FAILED:`, error);
      console.error(`${MODULE_NAME} | Error stack:`, error.stack);
    }
  }

  /**
   * Module ready - set up UI and final integrations
   */
  static ready() {
    console.log(`${MODULE_NAME} | Ready for species generation`);
    
    // Add UI controls
    this.setupUI();
    
    // Force refresh scene controls after a small delay using the correct method
    setTimeout(() => {
      if (ui.controls.rendered && game.user.isGM) {
        console.log(`${MODULE_NAME} | Attempting to refresh scene controls...`);
        try {
          // The correct way to refresh scene controls in Foundry
          ui.controls.initialize();
        } catch (error) {
          console.warn(`${MODULE_NAME} | Could not refresh scene controls:`, error);
        }
      }
    }, 200);
    
    // Hook into chat commands if enabled
    if (game.settings.get(MODULE_NAME, 'enableChatCommands')) {
      this.setupChatCommands();
    }
    
    // Display welcome message if this is the first time
    if (game.settings.get(MODULE_NAME, 'showWelcomeMessage')) {
      this.showWelcomeMessage();
    }
  }

  /**
   * Register module settings
   */
  static registerSettings() {
    // Generation speed preference
    game.settings.register(MODULE_NAME, 'generationSpeed', {
      name: "Default Generation Speed",
      hint: "Choose between fast basic profiles or detailed comprehensive profiles",
      scope: "world",
      config: true,
      type: String,
      choices: {
        "fast": "Fast (2-3 minutes, basic profile)",
        "detailed": "Detailed (5-10 minutes, comprehensive profile)"
      },
      default: "fast"
    });

    // Default narrative role
    game.settings.register(MODULE_NAME, 'defaultRole', {
      name: "Default Narrative Role",
      hint: "The default role assumption for generated species",
      scope: "world",
      config: true,
      type: String,
      choices: {
        "neutral": "Neutral/Background",
        "ally": "Potential Ally",
        "enemy": "Antagonistic",
        "mysterious": "Mysterious/Unknown"
      },
      default: "neutral"
    });

    // Auto-export to journal
    game.settings.register(MODULE_NAME, 'autoExportToJournal', {
      name: "Auto-Export to Journal",
      hint: "Automatically create journal entries for generated species",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    });

    // Enable chat commands
    game.settings.register(MODULE_NAME, 'enableChatCommands', {
      name: "Enable Chat Commands",
      hint: "Allow species generation via chat commands like /species",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    });

    // Welcome message flag
    game.settings.register(MODULE_NAME, 'showWelcomeMessage', {
      name: "Show Welcome Message",
      hint: "Display welcome message on first load",
      scope: "client",
      config: false,
      type: Boolean,
      default: true
    });

    // Generation statistics
    game.settings.register(MODULE_NAME, 'generationStats', {
      name: "Generation Statistics",
      hint: "Track usage statistics",
      scope: "world",
      config: false,
      type: Object,
      default: {
        totalGenerated: 0,
        averageTime: 0,
        favoriteArchetypes: {},
        sessionCount: 0
      }
    });
  }

  /**
   * Enhance the generator with additional methods
   */
  static enhanceGenerator() {
    console.log(`${MODULE_NAME} | Enhancing generator with additional methods...`);
    
    // For now, just log that we're using basic methods
    // The enhanced methods will be added in a future update
    console.log(`${MODULE_NAME} | Using basic generation methods (enhanced methods not yet implemented)`);
    
    console.log(`${MODULE_NAME} | Generator enhanced. Available basic methods:`, {
      generatePhysicalTraitsBasic: typeof this.generator.generatePhysicalTraitsBasic,
      generateCulturalTraitsBasic: typeof this.generator.generateCulturalTraitsBasic,
      generateNarrativeHookBasic: typeof this.generator.generateNarrativeHookBasic,
      generateSWADETraitsBasic: typeof this.generator.generateSWADETraitsBasic
    });
    
    // Add performance tracking
    const originalGenerate = this.generator.generateSpecies.bind(this.generator);
    this.generator.generateSpecies = async (seed) => {
      const startTime = performance.now();
      const result = await originalGenerate(seed);
      const endTime = performance.now();
      
      // Track statistics
      this.updateGenerationStats(result, endTime - startTime);
      
      // Auto-export if enabled
      if (game.settings.get(MODULE_NAME, 'autoExportToJournal')) {
        this.autoExportSpecies(result);
      }
      
      return result;
    };
  }

  /**
   * Set up user interface controls
   */
  static setupUI() {
    console.log(`${MODULE_NAME} | Setting up UI controls`);
    
    // Add CSS for our footer buttons
    const style = $(`
      <style>
        .species-generator-footer {
          flex: none !important;
          flex-grow: 0 !important;
          flex-shrink: 0 !important;
          height: auto !important;
          min-height: 32px !important;
          max-height: 32px !important;
        }
        .species-generator-footer button {
          padding: 2px 4px !important;
          font-size: 10px !important;
          flex: 1 !important;
          margin: 0 !important;
          border-radius: 3px !important;
          cursor: pointer !important;
          transition: all 0.1s ease !important;
        }
      </style>
    `);
    $('head').append(style);
    
    // Add species generator controls to the Journal tab footer
    Hooks.on('renderJournalDirectory', (app, html, data) => {
      if (!game.user.isGM) return;
      
      console.log(`${MODULE_NAME} | Adding species generator controls to Journal tab`);
      
      // Remove any existing species generator footer to avoid duplicates
      html.find('.species-generator-footer').remove();
      
      // Create the compact footer section
      const footer = $(`
        <footer class="species-generator-footer">
          <div class="species-generator-controls" style="display: flex; gap: 2px; margin: 2px 0;">
            <button type="button" class="species-quick-gen" title="Quick Generate Species">
              <i class="fas fa-dice"></i> Quick
            </button>
            <button type="button" class="species-detailed-gen" title="Detailed Species Generation">
              <i class="fas fa-cogs"></i> Detailed
            </button>
            <button type="button" class="species-stats" title="Generation Statistics">
              <i class="fas fa-chart-bar"></i> Stats
            </button>
          </div>
          <div style="text-align: center; font-size: 8px; color: var(--color-text-dark-secondary); line-height: 1; margin: 1px 0;">
            Species Generator
          </div>
        </footer>
      `);
      
      // Add click handlers
      footer.find('.species-quick-gen').click((e) => {
        e.preventDefault();
        console.log(`${MODULE_NAME} | Quick generate clicked from journal footer`);
        SmartSpeciesGeneratorModule.quickGenerate();
      });
      
      footer.find('.species-detailed-gen').click((e) => {
        e.preventDefault();
        console.log(`${MODULE_NAME} | Detailed generate clicked from journal footer`);
        game.speciesGenerator.openDialog();
      });
      
      footer.find('.species-stats').click((e) => {
        e.preventDefault();
        console.log(`${MODULE_NAME} | Statistics clicked from journal footer`);
        SmartSpeciesGeneratorModule.showStatistics();
      });
      
      // Add the footer to the journal directory
      html.append(footer);
      
      console.log(`${MODULE_NAME} | Species generator controls added to journal footer`);
    });

    // Force the journal directory to render if it's already open
    setTimeout(() => {
      if (ui.sidebar.tabs.journal?.rendered) {
        console.log(`${MODULE_NAME} | Forcing journal directory refresh to show controls`);
        ui.sidebar.tabs.journal.render();
      }
    }, 500);

    // Add to macro bar if enabled
    if (game.user.isGM) {
      this.createMacros();
    }
    
    console.log(`${MODULE_NAME} | UI setup complete`);
  }

  /**
   * Quick generation with default settings
   */
  static async quickGenerate() {
    console.log(`${MODULE_NAME} | Quick generate called from scene controls`);
    
    if (!game.user.isGM) {
      ui.notifications.warn("Only GMs can generate species");
      return;
    }
    
    const defaultSpeed = game.settings.get(MODULE_NAME, 'generationSpeed');
    const defaultRole = game.settings.get(MODULE_NAME, 'defaultRole');
    
    ui.notifications.info("Generating species with default settings...");
    
    const seed = {
      role: defaultRole,
      speed: defaultSpeed,
      setting: canvas.scene?.name || "Unknown location"
    };

    try {
      const species = await this.generator.generateSpecies(seed);
      new SpeciesDisplayDialog(species).render(true);
    } catch (error) {
      ui.notifications.error("Failed to generate species");
      console.error(`${MODULE_NAME} | Generation error:`, error);
    }
  }

  /**
   * Show generation statistics
   */
  static showStatistics() {
    console.log(`${MODULE_NAME} | Show statistics called from scene controls`);
    
    const stats = game.settings.get(MODULE_NAME, 'generationStats');
    
    const content = `
      <div class="species-stats">
        <h2>Generation Statistics</h2>
        <p><strong>Total Species Generated:</strong> ${stats.totalGenerated}</p>
        <p><strong>Average Generation Time:</strong> ${(stats.averageTime / 1000).toFixed(2)} seconds</p>
        
        <h3>Favorite Archetypes</h3>
        <ul>
          ${Object.entries(stats.favoriteArchetypes)
            .sort(([,a], [,b]) => b - a)
            .map(([archetype, count]) => `<li>${archetype}: ${count} (${((count/stats.totalGenerated)*100).toFixed(1)}%)</li>`)
            .join('')}
        </ul>
      </div>
    `;

    new Dialog({
      title: "Species Generator Statistics",
      content,
      buttons: {
        reset: {
          icon: '<i class="fas fa-trash"></i>',
          label: "Reset Stats",
          callback: () => {
            game.settings.set(MODULE_NAME, 'generationStats', {
              totalGenerated: 0,
              averageTime: 0,
              favoriteArchetypes: {},
              sessionCount: 0
            });
            ui.notifications.info("Statistics reset");
          }
        },
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close"
        }
      },
      default: "close"
    }).render(true);
  }

  /**
   * Register keyboard shortcuts
   */
  static registerKeybindings() {
    console.log(`${MODULE_NAME} | Registering keybindings`);
    
    game.keybindings.register(MODULE_NAME, 'quickGenerate', {
      name: "Quick Generate Species",
      hint: "Generate a species with default settings",
      editable: [
        {
          key: "KeyG",
          modifiers: ["Control", "Shift"]
        }
      ],
      onDown: () => {
        console.log(`${MODULE_NAME} | Quick generate keybinding triggered`);
        if (game.user.isGM) {
          this.quickGenerate();
        } else {
          ui.notifications.warn("Only GMs can generate species");
        }
      }
    });

    game.keybindings.register(MODULE_NAME, 'openDialog', {
      name: "Open Species Generator Dialog",
      hint: "Open the detailed species generation dialog",
      editable: [
        {
          key: "KeyG",
          modifiers: ["Control", "Alt"]
        }
      ],
      onDown: () => {
        console.log(`${MODULE_NAME} | Open dialog keybinding triggered`);
        if (game.user.isGM) {
          game.speciesGenerator.openDialog();
        } else {
          ui.notifications.warn("Only GMs can generate species");
        }
      }
    });
    
    console.log(`${MODULE_NAME} | Keybindings registered successfully`);
  }

  /**
   * Set up chat commands
   */
  static setupChatCommands() {
    console.log(`${MODULE_NAME} | Setting up chat commands`);
    
    Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
      console.log(`${MODULE_NAME} | Chat message intercepted:`, messageText);
      if (!game.user.isGM) return true;
      
      const command = messageText.toLowerCase().trim();
      
      if (command.startsWith('/species')) {
        console.log(`${MODULE_NAME} | Species command detected:`, command);
        const args = command.split(' ').slice(1);
        this.handleChatCommand(args);
        return false; // Prevent normal chat message
      }
      
      return true;
    });
    
    console.log(`${MODULE_NAME} | Chat commands registered`);
  }

  /**
   * Handle chat commands
   */
  static async handleChatCommand(args) {
    if (args.length === 0) {
      // Simple generation
      await this.quickGenerate();
      return;
    }

    // Parse arguments
    const seed = {};
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      const value = args[i + 1];
      
      switch (key) {
        case 'role':
          if (['neutral', 'ally', 'enemy', 'mysterious'].includes(value)) {
            seed.role = value;
          }
          break;
        case 'setting':
          seed.setting = value;
          break;
        case 'speed':
          if (['fast', 'detailed'].includes(value)) {
            seed.speed = value;
          }
          break;
      }
    }

    ui.notifications.info("Generating species from chat command...");
    
    try {
      const species = await this.generator.generateSpecies(seed);
      new SpeciesDisplayDialog(species).render(true);
    } catch (error) {
      ui.notifications.error("Failed to generate species from command");
      console.error(`${MODULE_NAME} | Chat command error:`, error);
    }
  }

  /**
   * Update generation statistics
   */
  static updateGenerationStats(species, generationTime) {
    const stats = game.settings.get(MODULE_NAME, 'generationStats');
    
    stats.totalGenerated++;
    stats.averageTime = ((stats.averageTime * (stats.totalGenerated - 1)) + generationTime) / stats.totalGenerated;
    
    // Track archetype preferences
    const archetype = species.archetype;
    stats.favoriteArchetypes[archetype] = (stats.favoriteArchetypes[archetype] || 0) + 1;
    
    game.settings.set(MODULE_NAME, 'generationStats', stats);
  }

  /**
   * Auto-export species to journal
   */
  static async autoExportSpecies(species) {
    try {
      const dialog = new SpeciesDisplayDialog(species);
      await dialog.exportToJournal(species);
    } catch (error) {
      console.warn(`${MODULE_NAME} | Auto-export failed:`, error);
    }
  }

  /**
   * Show generation statistics
   */
  static showStatistics() {
    const stats = game.settings.get(MODULE_NAME, 'generationStats');
    
    const content = `
      <div class="species-stats">
        <h2>Generation Statistics</h2>
        <p><strong>Total Species Generated:</strong> ${stats.totalGenerated}</p>
        <p><strong>Average Generation Time:</strong> ${(stats.averageTime / 1000).toFixed(2)} seconds</p>
        
        <h3>Favorite Archetypes</h3>
        <ul>
          ${Object.entries(stats.favoriteArchetypes)
            .sort(([,a], [,b]) => b - a)
            .map(([archetype, count]) => `<li>${archetype}: ${count} (${((count/stats.totalGenerated)*100).toFixed(1)}%)</li>`)
            .join('')}
        </ul>
      </div>
    `;

    new Dialog({
      title: "Species Generator Statistics",
      content,
      buttons: {
        reset: {
          icon: '<i class="fas fa-trash"></i>',
          label: "Reset Stats",
          callback: () => {
            game.settings.set(MODULE_NAME, 'generationStats', {
              totalGenerated: 0,
              averageTime: 0,
              favoriteArchetypes: {},
              sessionCount: 0
            });
            ui.notifications.info("Statistics reset");
          }
        },
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close"
        }
      },
      default: "close"
    }).render(true);
  }

  /**
   * Create helpful macros
   */
  static createMacros() {
    // Only create if no macro exists
    const existingMacro = game.macros.find(m => m.name === "Quick Species Generation");
    
    if (!existingMacro && game.user.isGM) {
      Macro.create({
        name: "Quick Species Generation",
        type: "script",
        command: "game.speciesGenerator.generate();",
        img: "modules/species-generator/images/species-macro-icon.png"
      });
    }
  }

  /**
   * Show welcome message for new users
   */
  static showWelcomeMessage() {
    const content = `
      <div class="species-welcome">
        <h2>Welcome to Smart Species Generator!</h2>
        <p>This module helps you quickly create unique alien species for your science fiction campaigns.</p>
        
        <h3>Quick Start:</h3>
        <ul>
          <li>Use <strong>Ctrl+Shift+G</strong> for quick generation</li>
          <li>Use <strong>Ctrl+Alt+G</strong> for detailed generation</li>
          <li>Type <strong>/species</strong> in chat for command generation</li>
          <li>Find the Species Generator button in scene controls</li>
        </ul>
        
        <h3>Features:</h3>
        <ul>
          <li>SWADE mechanical integration</li>
          <li>Contextual narrative hooks</li>
          <li>Auto-export to journal entries</li>
          <li>15-minute generation target</li>
        </ul>
        
        <p><em>Perfect for those mid-session moments when you need a new species fast!</em></p>
      </div>
    `;

    new Dialog({
      title: "Species Generator - Welcome",
      content,
      buttons: {
        generate: {
          icon: '<i class="fas fa-dice"></i>',
          label: "Generate First Species",
          callback: () => this.quickGenerate()
        },
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close"
        }
      },
      default: "generate"
    }).render(true);

    // Don't show again
    game.settings.set(MODULE_NAME, 'showWelcomeMessage', false);
  }
}

// Module initialization hooks
console.log("Species Generator | Registering init hook...");
Hooks.once('init', () => {
  console.log("Species Generator | Init hook fired!");
  SmartSpeciesGeneratorModule.init();
});

console.log("Species Generator | Registering ready hook...");
Hooks.once('ready', () => {
  console.log("Species Generator | Ready hook fired!");
  SmartSpeciesGeneratorModule.ready();
});

console.log("Species Generator | Hooks registered, module script complete");

// Export for potential external use
export { SmartSpeciesGeneratorModule };