// File: scripts/ui/species-dialog.js
import { MODULE_NAME, NARRATIVE_ROLES, GENERATION_SPEEDS, UI_CONFIG } from '../config.js';
import { SpeciesDisplayDialog } from './species-display.js';

export class SpeciesGeneratorDialog extends Dialog {
  constructor(generator) {
    const content = `
      <form class="species-generator-form">
        <div class="form-group">
          <label for="narrative-role">Narrative Role:</label>
          <select name="role" id="narrative-role">
            <option value="${NARRATIVE_ROLES.NEUTRAL}">Neutral/Background</option>
            <option value="${NARRATIVE_ROLES.ALLY}">Potential Ally</option>
            <option value="${NARRATIVE_ROLES.ENEMY}">Antagonistic</option>
            <option value="${NARRATIVE_ROLES.MYSTERIOUS}">Mysterious/Unknown</option>
          </select>
          <small>How should this species fit into the story?</small>
        </div>
        
        <div class="form-group">
          <label for="setting-context">Setting Context:</label>
          <input type="text" name="setting" id="setting-context" placeholder="e.g., 'corporate space station', 'frontier world'" />
          <small>Optional: Describe the current environment or situation</small>
        </div>
        
        <div class="form-group">
          <label for="generation-speed">Generation Detail:</label>
          <select name="speed" id="generation-speed">
            <option value="${GENERATION_SPEEDS.FAST}">Fast (Basic profile, ~2 seconds)</option>
            <option value="${GENERATION_SPEEDS.DETAILED}">Detailed (Full profile, ~5 seconds)</option>
          </select>
          <small>Fast for mid-session use, detailed for preparation</small>
        </div>
        
        <div class="form-group">
          <label for="additional-notes">Additional Notes:</label>
          <textarea name="notes" id="additional-notes" rows="3" placeholder="Any specific requirements or ideas..."></textarea>
          <small>Optional: Special requests or constraints for generation</small>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" name="autoExport" id="auto-export" checked>
            Auto-export to journal entry
          </label>
          <small>Automatically create a journal entry for this species</small>
        </div>
      </form>
    `;

    const dialogData = {
      title: "Smart Species Generator",
      content,
      buttons: {
        generate: {
          icon: '<i class="fas fa-dice"></i>',
          label: "Generate Species",
          callback: html => this.generateSpecies(html)
        },
        quick: {
          icon: '<i class="fas fa-bolt"></i>',
          label: "Quick Generate",
          callback: html => this.quickGenerate(html)
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "generate",
      close: () => {},
      resizable: true
    };

    const dialogOptions = {
      width: UI_CONFIG.DIALOG_WIDTH,
      height: UI_CONFIG.DIALOG_HEIGHT,
      classes: ['species-generator-dialog']
    };

    // Call super constructor FIRST
    super(dialogData, dialogOptions);
    
    // THEN set instance properties
    this.generator = generator;
  }

  /**
   * Activate listeners for the dialog
   */
  activateListeners(html) {
    super.activateListeners(html);
    
    // Set default values from settings
    const defaultRole = game.settings.get(MODULE_NAME, 'defaultRole');
    const defaultSpeed = game.settings.get(MODULE_NAME, 'generationSpeed');
    const autoExport = game.settings.get(MODULE_NAME, 'autoExportToJournal');
    
    html.find('[name="role"]').val(defaultRole);
    html.find('[name="speed"]').val(defaultSpeed);
    html.find('[name="autoExport"]').prop('checked', autoExport);
    
    // Auto-fill setting context from current scene
    if (canvas.scene) {
      html.find('[name="setting"]').attr('placeholder', `Current scene: ${canvas.scene.name}`);
    }
    
    // Add helpful tooltips
    this.addTooltips(html);
    
    // Add keyboard shortcuts
    this.addKeyboardShortcuts(html);
  }

  /**
   * Add helpful tooltips to form elements
   */
  addTooltips(html) {
    // Role tooltips
    const roleSelect = html.find('[name="role"]');
    roleSelect.on('change', (e) => {
      const role = e.target.value;
      let tooltip = '';
      
      switch (role) {
        case NARRATIVE_ROLES.ALLY:
          tooltip = 'Species likely to be helpful, trading partners, or information sources';
          break;
        case NARRATIVE_ROLES.ENEMY:
          tooltip = 'Species with conflicting goals, territorial disputes, or aggressive tendencies';
          break;
        case NARRATIVE_ROLES.MYSTERIOUS:
          tooltip = 'Species with unknown motivations, strange abilities, or hidden agendas';
          break;
        default:
          tooltip = 'Species suitable for background encounters or neutral interactions';
      }
      
      roleSelect.attr('title', tooltip);
    });
    
    // Speed tooltips
    const speedSelect = html.find('[name="speed"]');
    speedSelect.attr('title', 'Fast: Basic traits for immediate use. Detailed: Full profile with extensive background.');
  }

  /**
   * Add keyboard shortcuts within the dialog
   */
  addKeyboardShortcuts(html) {
    html.on('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        this.quickGenerate(html);
      } else if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.generateSpecies(html);
      }
    });
  }

  /**
   * Generate species with full options
   */
  async generateSpecies(html) {
    const seed = this.extractFormData(html);
    
    // Validate input
    if (!this.validateSeed(seed)) {
      return;
    }
    
    // Show loading state
    this.showLoadingState(html);
    
    try {
      ui.notifications.info("Generating species with detailed options...");
      
      const species = await this.generator.generateSpecies(seed);
      
      // Close this dialog
      this.close();
      
      // Show results
      new SpeciesDisplayDialog(species).render(true);
      
      // Auto-export if requested
      if (seed.autoExport) {
        await this.autoExportSpecies(species);
      }
      
    } catch (error) {
      console.error(`${MODULE_NAME} | Dialog generation error:`, error);
      ui.notifications.error("Failed to generate species. Check console for details.");
      this.hideLoadingState(html);
    }
  }

  /**
   * Quick generation with minimal options
   */
  async quickGenerate(html) {
    const seed = this.extractFormData(html);
    
    // Override with quick settings
    seed.speed = GENERATION_SPEEDS.FAST;
    seed.autoExport = true;
    
    // Show loading state
    this.showLoadingState(html);
    
    try {
      ui.notifications.info("Quick generating species...");
      
      const species = await this.generator.generateSpecies(seed);
      
      // Close this dialog
      this.close();
      
      // Show results immediately
      new SpeciesDisplayDialog(species).render(true);
      
      // Auto-export
      await this.autoExportSpecies(species);
      
    } catch (error) {
      console.error(`${MODULE_NAME} | Quick generation error:`, error);
      ui.notifications.error("Quick generation failed. Check console for details.");
      this.hideLoadingState(html);
    }
  }

  /**
   * Extract form data into seed object
   */
  extractFormData(html) {
    const formData = new FormData(html[0].querySelector('form'));
    
    const seed = {
      role: formData.get('role') || NARRATIVE_ROLES.NEUTRAL,
      setting: formData.get('setting') || canvas.scene?.name || 'Unknown location',
      speed: formData.get('speed') || GENERATION_SPEEDS.FAST,
      notes: formData.get('notes') || '',
      autoExport: html.find('[name="autoExport"]').is(':checked')
    };
    
    // Add timestamp for uniqueness
    seed.timestamp = Date.now();
    
    return seed;
  }

  /**
   * Validate seed data
   */
  validateSeed(seed) {
    // Check for valid role
    if (!Object.values(NARRATIVE_ROLES).includes(seed.role)) {
      ui.notifications.warn("Invalid narrative role selected");
      return false;
    }
    
    // Check for valid speed
    if (!Object.values(GENERATION_SPEEDS).includes(seed.speed)) {
      ui.notifications.warn("Invalid generation speed selected");
      return false;
    }
    
    // Setting can be empty, that's fine
    
    return true;
  }

  /**
   * Show loading state in the dialog
   */
  showLoadingState(html) {
    const buttons = html.closest('.dialog').find('.dialog-button');
    buttons.prop('disabled', true);
    
    const generateBtn = buttons.filter('[data-button="generate"]');
    const quickBtn = buttons.filter('[data-button="quick"]');
    
    generateBtn.html('<i class="fas fa-spinner fa-spin"></i> Generating...');
    quickBtn.html('<i class="fas fa-spinner fa-spin"></i> Quick Gen...');
    
    // Disable form inputs
    html.find('input, select, textarea').prop('disabled', true);
  }

  /**
   * Hide loading state in the dialog
   */
  hideLoadingState(html) {
    const buttons = html.closest('.dialog').find('.dialog-button');
    buttons.prop('disabled', false);
    
    const generateBtn = buttons.filter('[data-button="generate"]');
    const quickBtn = buttons.filter('[data-button="quick"]');
    
    generateBtn.html('<i class="fas fa-dice"></i> Generate Species');
    quickBtn.html('<i class="fas fa-bolt"></i> Quick Generate');
    
    // Re-enable form inputs
    html.find('input, select, textarea').prop('disabled', false);
  }

  /**
   * Auto-export species to journal
   */
  async autoExportSpecies(species) {
    try {
      const { ExportManager } = await import('../core/export-manager.js');
      await ExportManager.exportToJournal(species);
    } catch (error) {
      console.warn(`${MODULE_NAME} | Auto-export failed:`, error);
      ui.notifications.warn("Species generated but auto-export failed");
    }
  }

  /**
   * Static method to show a simple quick dialog
   */
  static showQuickDialog(generator) {
    const content = `
      <div class="quick-generator">
        <p>Generate a species with default settings for immediate use?</p>
        <div class="form-group">
          <label for="quick-role">Role:</label>
          <select name="role" id="quick-role">
            <option value="${NARRATIVE_ROLES.NEUTRAL}">Neutral</option>
            <option value="${NARRATIVE_ROLES.ALLY}">Ally</option>
            <option value="${NARRATIVE_ROLES.ENEMY}">Enemy</option>
            <option value="${NARRATIVE_ROLES.MYSTERIOUS}">Mysterious</option>
          </select>
        </div>
      </div>
    `;

    return new Dialog({
      title: "Quick Species Generation",
      content,
      buttons: {
        generate: {
          icon: '<i class="fas fa-bolt"></i>',
          label: "Generate Now",
          callback: async (html) => {
            const role = html.find('[name="role"]').val();
            const seed = {
              role,
              setting: canvas.scene?.name || 'Current location',
              speed: GENERATION_SPEEDS.FAST,
              autoExport: true
            };
            
            try {
              ui.notifications.info("Quick generating species...");
              const species = await generator.generateSpecies(seed);
              new SpeciesDisplayDialog(species).render(true);
              
              // Auto-export
              const { ExportManager } = await import('../core/export-manager.js');
              await ExportManager.exportToJournal(species);
              
            } catch (error) {
              console.error(`${MODULE_NAME} | Quick dialog error:`, error);
              ui.notifications.error("Quick generation failed");
            }
          }
        },
        detailed: {
          icon: '<i class="fas fa-cogs"></i>',
          label: "Detailed Options",
          callback: () => {
            new SpeciesGeneratorDialog(generator).render(true);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "generate"
    }, {
      width: 400,
      height: 200
    });
  }
}
