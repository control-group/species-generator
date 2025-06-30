// File: scripts/core/rolltable-manager.js
import { MODULE_NAME, TABLE_FILES, ASSET_PATHS } from '../config.js';

export class RollTableManager {
  constructor() {
    this.tables = new Map();
    this.loadPromise = null;
  }

  /**
   * Load all generation tables
   */
  async loadTables() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._loadTablesInternal();
    return this.loadPromise;
  }

  async _loadTablesInternal() {
    console.log(`${MODULE_NAME} | Loading generation tables...`);
    
    const loadPromises = TABLE_FILES.map(async (file) => {
      try {
        const response = await fetch(`${ASSET_PATHS.TABLES}${file}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const tableData = await response.json();
        const tableName = file.replace('.json', '');
        this.tables.set(tableName, tableData);
        console.log(`${MODULE_NAME} | Loaded table: ${tableName}`);
      } catch (error) {
        console.error(`${MODULE_NAME} | Failed to load table ${file}:`, error);
        // Create fallback table
        this.tables.set(file.replace('.json', ''), this.createFallbackTable(file));
      }
    });

    await Promise.all(loadPromises);
    console.log(`${MODULE_NAME} | All tables loaded`);
  }

  /**
   * Create fallback table data
   */
  createFallbackTable(filename) {
    const name = filename.replace('.json', '');
    console.warn(`${MODULE_NAME} | Creating fallback table for ${name}`);
    
    switch (name) {
      case 'biology':
        return {
          name: "Biology Fallback",
          entries: [
            { key: 'humanoid', name: 'Humanoid', weight: 1, description: 'Basic humanoid form' }
          ]
        };
      case 'culture':
        return {
          name: "Culture Fallback",
          entries: [
            { key: 'nomadic', name: 'Nomadic', weight: 1, values: ['freedom'], interaction_style: 'friendly' }
          ]
        };
      case 'status':
        return {
          name: "Status Fallback",
          entries: [
            { key: 'independent', name: 'Independent', weight: 1, description: 'Self-governing' }
          ]
        };
      case 'traits':
        return {
          humanoid: ['Standard appearance', 'Typical proportions'],
          avian: ['Feathered', 'Sharp eyes'],
          reptilian: ['Scaled skin', 'Cold-blooded']
        };
      case 'hooks':
        return {
          political: ['Unknown political situation'],
          mysterious: ['Mysterious origins'],
          personal: ['Unknown personal motivations']
        };
      case 'naming':
        return {
          patterns: {
            default: {
              prefixes: ['Gen', 'Neo', 'Zet'],
              suffixes: ['ari', 'ons', 'ids']
            }
          }
        };
      default:
        return { entries: [] };
    }
  }

  /**
   * Roll on a weighted table based on context
   */
  async rollWeighted(tableName, weights = {}) {
    const table = this.tables.get(tableName);
    if (!table || !table.entries) {
      console.warn(`${MODULE_NAME} | Table ${tableName} not found or invalid`);
      return { key: 'unknown', name: 'Unknown', weight: 1 };
    }

    // Apply weights to table entries
    const weightedEntries = table.entries.map(entry => ({
      ...entry,
      weight: (entry.weight || 1) * (weights[entry.key] || 1)
    }));

    // Roll based on weighted probability
    const totalWeight = weightedEntries.reduce((sum, entry) => sum + entry.weight, 0);
    const roll = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (const entry of weightedEntries) {
      currentWeight += entry.weight;
      if (roll <= currentWeight) {
        return entry;
      }
    }
    
    return weightedEntries[weightedEntries.length - 1];
  }

  /**
   * Roll multiple entries from a table
   */
  async rollMultiple(tableName, count, filters = {}) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const result = await this.rollWeighted(tableName, filters);
      if (result && !results.find(r => r.key === result.key)) {
        results.push(result);
      }
    }
    return results;
  }

  /**
   * Roll a single entry from a table
   */
  async rollSingle(tableName, filters = {}) {
    return await this.rollWeighted(tableName, filters);
  }

  /**
   * Get a specific table for direct access
   */
  async getTable(tableName) {
    if (!this.tables.has(tableName)) {
      await this.loadTables();
    }
    return this.tables.get(tableName);
  }
}