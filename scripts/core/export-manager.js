// File: scripts/core/export-manager.js
import { MODULE_NAME, EXPORT_FORMATS } from '../config.js';

export class ExportManager {
  /**
   * Export species data in various formats
   */
  static async exportSpecies(species, format = EXPORT_FORMATS.JOURNAL) {
    switch (format) {
      case EXPORT_FORMATS.JOURNAL:
        return await this.exportToJournal(species);
      case EXPORT_FORMATS.CSV:
        return await this.exportToCSV(species);
      case EXPORT_FORMATS.JSON:
        return await this.exportToJSON(species);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export species to a journal entry
   */
  static async exportToJournal(species) {
    console.log(`${MODULE_NAME} | Starting journal export for species:`, species);
    
    try {
      const journalContent = this.generateJournalHTML(species);
      console.log(`${MODULE_NAME} | Generated journal content:`, journalContent);
      
      const folderId = await this.getOrCreateSpeciesFolder();
      console.log(`${MODULE_NAME} | Using folder ID:`, folderId);
      
      // Foundry v12 uses pages instead of direct content
      const journalData = {
        name: `Species: ${species.name}`,
        pages: [{
          name: "Species Profile", // Generic name to avoid duplication
          type: "text",
          text: {
            content: journalContent,
            format: 1 // HTML format
          }
        }],
        folder: folderId
      };
      console.log(`${MODULE_NAME} | Creating journal entry with v12 format:`, journalData);
      
      const journalEntry = await JournalEntry.create(journalData);
      console.log(`${MODULE_NAME} | Created journal entry:`, journalEntry);
      
      ui.notifications.info(`Species "${species.name}" exported to journal`);
      return journalEntry;
    } catch (error) {
      console.error(`${MODULE_NAME} | Failed to export to journal:`, error);
      console.error(`${MODULE_NAME} | Error stack:`, error.stack);
      ui.notifications.error("Failed to export species to journal");
      throw error;
    }
  }

  /**
   * Generate HTML content for journal entry
   */
  static generateJournalHTML(species) {
    console.log(`${MODULE_NAME} | Generating journal HTML for species:`, species);
    
    const html = `
      <h1>${species.name}</h1>
      
      <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
        <h2>Quick Reference</h2>
        <p><strong>Type:</strong> ${species.quickRef?.elevator_pitch || 'Unknown'}</p>
        <p><strong>Key Traits:</strong> ${species.quickRef?.key_traits?.join(', ') || 'None listed'}</p>
        <p><strong>Story Hook:</strong> ${species.quickRef?.story_hook || 'No hook available'}</p>
        <p><strong>SWADE Notes:</strong> ${species.quickRef?.swade_notes || 'No mechanical notes'}</p>
      </div>
      
      <h2>Physical Characteristics</h2>
      <ul>
        ${species.physicalTraits?.map(trait => `<li>${trait}</li>`).join('') || '<li>Standard for archetype</li>'}
      </ul>
      
      <h2>Cultural Information</h2>
      <p><strong>Interaction Style:</strong> ${species.culturalTraits?.interaction_style || 'Unknown'}</p>
      <p><strong>Values:</strong> ${species.culturalTraits?.values?.join(', ') || 'Unknown'}</p>
      <p><strong>Social Structure:</strong> ${species.culturalTraits?.structure || 'Unknown'}</p>
      
      <h2>SWADE Mechanics</h2>
      ${this.formatSWADEDetailsHTML(species.swadeTraits)}
      
      <h2>Narrative Integration</h2>
      <p>${species.narrativeHook?.detailed || species.narrativeHook?.summary || 'Unknown background'}</p>
      
      <h2>GM Notes</h2>
      <p><strong>Generation Time:</strong> ${species._metadata?.generationTime?.toFixed(1) || 'Unknown'}ms</p>
      <p><strong>Generated:</strong> ${species._metadata?.timestamp || 'Unknown'}</p>
    `;
    
    console.log(`${MODULE_NAME} | Generated HTML length:`, html.length);
    console.log(`${MODULE_NAME} | HTML preview:`, html.substring(0, 200) + '...');
    
    return html;
  }

  /**
   * Format SWADE traits for HTML display
   */
  static formatSWADEDetailsHTML(swadeTraits) {
    if (!swadeTraits) return '<p>No mechanical traits available.</p>';
    
    let html = '';
    
    if (swadeTraits.racialAbilities?.length > 0) {
      html += `<h3>Racial Abilities</h3><ul>`;
      swadeTraits.racialAbilities.forEach(ability => {
        html += `<li>${ability}</li>`;
      });
      html += `</ul>`;
    }
    
    if (swadeTraits.hindrances?.length > 0) {
      html += `<h3>Typical Hindrances</h3><ul>`;
      swadeTraits.hindrances.forEach(hindrance => {
        html += `<li>${hindrance}</li>`;
      });
      html += `</ul>`;
    }
    
    if (swadeTraits.skills?.length > 0) {
      html += `<h3>Cultural Skills</h3><ul>`;
      swadeTraits.skills.forEach(skill => {
        html += `<li>${skill}</li>`;
      });
      html += `</ul>`;
    }
    
    return html || '<p>No specific mechanical traits.</p>';
  }

  /**
   * Get or create a folder for generated species
   */
  static async getOrCreateSpeciesFolder() {
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

  /**
   * Export to CSV format
   */
  static async exportToCSV(species) {
    const csvData = [
      ['Field', 'Value'],
      ['Name', species.name],
      ['Archetype', species.archetype],
      ['Culture', species.culture],
      ['Status', species.status],
      ['Physical Traits', species.physicalTraits?.join('; ') || ''],
      ['Story Hook', species.narrativeHook?.summary || ''],
      ['SWADE Summary', species.swadeTraits?.mechanical_summary || '']
    ];
    
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    this.downloadFile(`${species.name}_species.csv`, csvContent, 'text/csv');
  }

  /**
   * Export to JSON format
   */
  static async exportToJSON(species) {
    const jsonContent = JSON.stringify(species, null, 2);
    this.downloadFile(`${species.name}_species.json`, jsonContent, 'application/json');
  }

  /**
   * Trigger file download
   */
  static downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    ui.notifications.info(`Downloaded ${filename}`);
  }
}