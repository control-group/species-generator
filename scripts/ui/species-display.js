// File: scripts/ui/species-display.js
export class SpeciesDisplayDialog extends Dialog {
  constructor(species) {
    const content = `
      <div class="species-display">
        <header class="species-header">
          <h2>${species.name}</h2>
          <div class="species-tags">
            <span class="tag archetype">${species.archetype}</span>
            <span class="tag culture">${species.culture}</span>
            <span class="tag status">${species.status}</span>
          </div>
        </header>
        
        <div class="species-content">
          <div class="quick-reference">
            <h3>Quick Reference</h3>
            <p><strong>Concept:</strong> ${species.quickRef.elevator_pitch}</p>
            <p><strong>Key Traits:</strong> ${species.quickRef.key_traits.join(', ')}</p>
            <p><strong>Story Hook:</strong> ${species.quickRef.story_hook}</p>
          </div>
          
          <div class="swade-mechanics">
            <h3>SWADE Mechanics</h3>
            <p><strong>Summary:</strong> ${species.quickRef.swade_notes}</p>
            <details>
              <summary>Full Mechanical Details</summary>
              <div class="mechanic-details">
                ${this.formatSWADEDetails(species.swadeTraits)}
              </div>
            </details>
          </div>
          
          <div class="roleplay-notes">
            <h3>Roleplay Notes</h3>
            <p><strong>Interaction Style:</strong> ${species.quickRef.roleplay_notes}</p>
            <p><strong>Cultural Values:</strong> ${species.culturalTraits?.values?.join(', ') || 'Unknown'}</p>
          </div>
          
          <div class="physical-description">
            <h3>Physical Description</h3>
            <ul>
              ${species.physicalTraits?.map(trait => `<li>${trait}</li>`).join('') || '<li>Standard for archetype</li>'}
            </ul>
          </div>
          
          <div class="narrative-hook">
            <h3>Narrative Integration</h3>
            <p>${species.narrativeHook?.detailed || species.quickRef.story_hook}</p>
          </div>
        </div>
      </div>
    `;

    super({
      title: `Species Profile: ${species.name}`,
      content,
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
      default: "close"
    });
    
    this.species = species;
  }

  /**
   * Format SWADE trait details for display
   */
  formatSWADEDetails(swadeTraits) {
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
    const journalContent = `
      <h1>${species.name}</h1>
      
      <h2>Overview</h2>
      <p><strong>Type:</strong> ${species.archetype} ${species.culture}</p>
      <p><strong>Status:</strong> ${species.status}</p>
      <p><strong>Concept:</strong> ${species.quickRef.elevator_pitch}</p>
      
      <h2>Physical Characteristics</h2>
      <ul>
        ${species.physicalTraits?.map(trait => `<li>${trait}</li>`).join('') || '<li>Standard for archetype</li>'}
      </ul>
      
      <h2>Cultural Notes</h2>
      <p><strong>Interaction Style:</strong> ${species.quickRef.roleplay_notes}</p>
      <p><strong>Values:</strong> ${species.culturalTraits?.values?.join(', ') || 'Unknown'}</p>
      
      <h2>SWADE Mechanics</h2>
      ${this.formatSWADEDetails(species.swadeTraits)}
      
      <h2>Story Integration</h2>
      <p>${species.narrativeHook?.detailed || species.quickRef.story_hook}</p>
      
      <h2>GM Notes</h2>
      <ul>
        <li><strong>Quick Description:</strong> ${species.quickRef.key_traits.join(', ')}</li>
        <li><strong>Use in Play:</strong> Perfect for ${species.narrativeHook?.usage_suggestions || 'encounters requiring unique species'}</li>
      </ul>
    `;

    try {
      await JournalEntry.create({
        name: `Species: ${species.name}`,
        content: journalContent,
        folder: await this.getOrCreateSpeciesFolder()
      });
      
      ui.notifications.info(`Species "${species.name}" exported to journal`);
    } catch (error) {
      console.error(`${MODULE_NAME} | Failed to export to journal:`, error);
      ui.notifications.error("Failed to export species to journal");
    }
  }

  /**
   * Get or create a folder for generated species
   */
  async getOrCreateSpeciesFolder() {
    let folder = game.folders.find(f => f.name === "Generated Species" && f.type === "JournalEntry");
    
    if (!folder) {
      folder = await Folder.create({
        name: "Generated Species",
        type: "JournalEntry",
        parent: null
      });
    }
    
    return folder.id;
  }
}