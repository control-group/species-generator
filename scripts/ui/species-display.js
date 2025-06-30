
// File: scripts/ui/species-display.js (if not already created)
import { MODULE_NAME, UI_CONFIG, EXPORT_FORMATS } from '../config.js';

export class SpeciesDisplayDialog extends Dialog {
  constructor(species) {
    // Call super constructor FIRST with minimal content
    const dialogData = {
      title: `Species Profile: ${species.name}`,
      content: '<div>Loading species data...</div>',
      buttons: {
        export: {
          icon: '<i class="fas fa-file-export"></i>',
          label: "Export to Journal",
          callback: () => this.exportToJournal(species)
        },
        regenerate: {
          icon: '<i class="fas fa-dice"></i>',
          label: "Generate Another",
          callback: () => {
            this.close();
            game.speciesGenerator.openDialog();
          }
        },
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close"
        }
      },
      default: "close",
      resizable: true
    };

    const dialogOptions = {
      width: UI_CONFIG.DISPLAY_WIDTH,
      height: UI_CONFIG.DISPLAY_HEIGHT,
      classes: ['species-display-dialog']
    };

    super(dialogData, dialogOptions);
    
    // THEN set instance properties
    this.species = species;
  }

  /**
   * Override getData to provide the real content
   */
  getData() {
    const data = super.getData();
    
    // Generate the real content now that 'this' is available
    data.content = `
      <div class="species-display">
        <header class="species-header">
          <h2>${this.species.name}</h2>
          <div class="species-tags">
            <span class="tag archetype">${this.species.archetype}</span>
            <span class="tag culture">${this.species.culture}</span>
            <span class="tag status">${this.species.status}</span>
          </div>
        </header>
        
        <div class="species-content">
          <div class="quick-reference">
            <h3>Quick Reference</h3>
            <p><strong>Concept:</strong> ${this.species.quickRef.elevator_pitch}</p>
            <p><strong>Key Traits:</strong> ${this.species.quickRef.key_traits.join(', ')}</p>
            <p><strong>Story Hook:</strong> ${this.species.quickRef.story_hook}</p>
          </div>
          
          <div class="swade-mechanics">
            <h3>SWADE Mechanics</h3>
            <p><strong>Summary:</strong> ${this.species.quickRef.swade_notes}</p>
            <details>
              <summary>Full Mechanical Details</summary>
              <div class="mechanic-details">
                ${SpeciesDisplayDialog.formatSWADEDetails(this.species.swadeTraits)}
              </div>
            </details>
          </div>
          
          <div class="roleplay-notes">
            <h3>Roleplay Notes</h3>
            <p><strong>Interaction Style:</strong> ${this.species.quickRef.roleplay_notes}</p>
            <p><strong>Cultural Values:</strong> ${this.species.culturalTraits?.values?.join(', ') || 'Unknown'}</p>
          </div>
          
          <div class="physical-description">
            <h3>Physical Description</h3>
            <ul>
              ${this.species.physicalTraits?.map(trait => `<li>${trait}</li>`).join('') || '<li>Standard for archetype</li>'}
            </ul>
          </div>
          
          <div class="narrative-hook">
            <h3>Narrative Integration</h3>
            <p>${this.species.narrativeHook?.detailed || this.species.quickRef.story_hook}</p>
          </div>
        </div>
      </div>
    `;
    
    return data;
  }

  /**
   * Format SWADE trait details for display (static method)
   */
  static formatSWADEDetails(swadeTraits) {
    if (!swadeTraits) return '<p>No mechanical traits available.</p>';
    
    let html = '';
    
    if (swadeTraits.racialAbilities?.length > 0) {
      html += `<h4>Racial Abilities</h4><ul>`;
      swadeTraits.racialAbilities.forEach(ability => {
        html += `<li>${ability}</li>`;
      });
      html += `</ul>`;
    }
    
    if (swadeTraits.hindrances?.length > 0) {
      html += `<h4>Typical Hindrances</h4><ul>`;
      swadeTraits.hindrances.forEach(hindrance => {
        html += `<li>${hindrance}</li>`;
      });
      html += `</ul>`;
    }
    
    if (swadeTraits.skills?.length > 0) {
      html += `<h4>Cultural Skills</h4><ul>`;
      swadeTraits.skills.forEach(skill => {
        html += `<li>${skill}</li>`;
      });
      html += `</ul>`;
    }
    
    if (swadeTraits.edges?.length > 0) {
      html += `<h4>Suggested Edges</h4><ul>`;
      swadeTraits.edges.forEach(edge => {
        html += `<li>${edge}</li>`;
      });
      html += `</ul>`;
    }
    
    return html || '<p>No specific mechanical traits.</p>';
  }

  /**
   * Export species to a journal entry
   */
  async exportToJournal(species) {
    try {
      const { ExportManager } = await import('../core/export-manager.js');
      await ExportManager.exportToJournal(species);
    } catch (error) {
      console.error(`${MODULE_NAME} | Export failed:`, error);
      ui.notifications.error("Failed to export species to journal");
    }
  }
}