# Smart Species Generator for Foundry VTT

A Foundry VTT module designed to rapidly generate unique alien species for science fiction tabletop RPGs. Perfect for those mid-session moments when you need a compelling new species in under 15 minutes.

## 🚀 Key Features

- **Rapid Generation**: Target 15-minute creation time for complete species profiles
- **SWADE Integration**: Built-in mechanical suggestions for Savage Worlds Adventure Edition
- **Contextual Intelligence**: Adapts generation based on narrative needs and current scene
- **Rich Narratives**: Comprehensive cultural details and story hooks
- **Journal Integration**: Auto-export to organized journal entries
- **Multiple Interfaces**: Scene controls, keyboard shortcuts, chat commands, and dialogs

## 🎯 Perfect For

- **Mid-session Creation**: Generate species during your 15-minute break
- **Sandbox Campaigns**: Populate unexplored regions with unique inhabitants
- **First Contact Scenarios**: Create memorable alien encounters
- **Trade and Diplomacy**: Generate trading partners and political entities
- **Emergency NPCs**: Quick species creation when players go off-script

## 📋 Installation

### Manual Installation
1. Download the latest release from GitHub
2. Extract to your Foundry `modules` folder
3. Restart Foundry VTT
4. Enable "Smart Species Generator" in your world's module settings

### Module Browser
1. Open Foundry's Module Browser
2. Search for "Smart Species Generator"
3. Click Install and Enable

## 🎮 Quick Start Guide

### Basic Usage
1. **Quick Generation**: Press `Ctrl+Shift+G` or click the species button in scene controls
2. **Detailed Generation**: Press `Ctrl+Alt+G` or use the detailed dialog option
3. **Chat Commands**: Type `/species` in chat for command-line generation

### Generation Options
- **Role-based**: Generate species as allies, enemies, or mysterious unknowns
- **Context-aware**: Uses current scene and campaign context
- **Speed Settings**: Choose between fast (basic) or detailed (comprehensive) profiles

## 🛠️ Advanced Features

### Chat Commands
```
/species                          # Basic generation
/species role ally                # Generate potential ally
/species role enemy setting ship  # Enemy species on a ship
/species speed detailed           # Detailed generation
```

### Settings Configuration
- **Default Generation Speed**: Fast vs Detailed profiles
- **Default Narrative Role**: Neutral, Ally, Enemy, or Mysterious
- **Auto-Export**: Automatically create journal entries
- **Chat Commands**: Enable `/species` command integration

### SWADE Integration
Automatically generates:
- Racial abilities and traits
- Suggested hindrances
- Cultural skill bonuses
- Recommended edges
- Attribute modifications

## 📊 File Structure

```
species-generator/
├── module.json
├── scripts/
│   ├── main.js                    # Core module initialization
│   ├── config.js                  # Configuration constants
│   ├── core/
│   │   ├── species-generator.js   # Main generation engine
│   │   ├── rolltable-manager.js   # Table management
│   │   ├── context-engine.js      # Context analysis
│   │   ├── export-manager.js      # Export functionality
│   │   └── enhanced-generation.js # Advanced generation methods
│   ├── systems/
│   │   └── swade-integration.js   # SWADE mechanical traits
│   └── ui/
│       ├── species-dialog.js      # Generation dialog
│       └── species-display.js     # Results display
├── tables/
│   ├── biology.json              # Biological archetypes
│   ├── culture.json              # Cultural frameworks
│   ├── status.json               # Galactic political status
│   ├── traits.json               # Physical/behavioral traits
│   ├── hooks.json                # Narrative hooks
│   └── naming.json               # Naming patterns
├── styles/
│   └── species-generator.css     # UI styling
└── lang/
    └── en.json                   # Localization
```

## 🎨 Generation Process

### Phase 1: Context Analysis (200ms target)
- Analyzes current scene environment
- Considers intended narrative role
- Weights generation tables appropriately
- Determines cultural and biological biases

### Phase 2: Core Generation (800ms target)
- Rolls biological archetype with weighted probability
- Selects cultural framework based on narrative needs
- Determines galactic political status
- Assigns homeworld and basic characteristics

### Phase 3: Detail Synthesis (1000ms target)
- Generates memorable species name using phonetic patterns
- Creates 2-4 distinctive physical traits
- Develops cultural interaction patterns
- Creates compelling narrative hook
- Generates SWADE mechanical suggestions
- Compiles quick reference summary for GM use

## 📖 Example Output

```
Species: Keptarians
Type: Avian Nomadic Traders
Status: UC Adjacent

Quick Reference:
- Concept: Avian nomadic traders from orbital habitats
- Key Traits: Iridescent feathers, keen eyesight, perching feet
- Story Hook: Their ancestral trade routes are being cut off by UC expansion
- SWADE: Agility +1, Flight 12", Keen Eyes (+2 Notice), Hollow Bones (-1 Toughness vs falls)
- Roleplay: Friendly but wary, value freedom and adaptability

Physical Description:
- Decorative feathered crests with blue-green iridescence
- Strong talons adapted for perching on varied surfaces
- Hollow bone structure making them lightweight but fragile
- Large eyes with exceptional distance vision

Cultural Notes:
- Organized in clan-based family units
- Follow ancient trade routes between systems
- Suspicious of permanent settlements
- Communicate through elaborate visual displays
```

## 🔧 Customization

### Adding New Tables
1. Create JSON files in the `tables/` directory
2. Follow the existing format for entries and weights
3. Reference new tables in the `RollTableManager`

### System Integration
The module is designed to be system-agnostic with SWADE as the primary integration. To add support for other systems:

1. Create a new file in `scripts/systems/`
2. Implement trait generation methods
3. Add system detection to the context engine
4. Include system-specific UI elements

### Custom Archetypes
Add new biological archetypes by:
1. Extending the `SPECIES_ARCHETYPES` in `config.js`
2. Adding entries to `biology.json`
3. Creating trait lists in `traits.json`
4. Adding naming patterns in `naming.json`

## 🎲 Generation Tables

### Biological Archetypes
- **Humanoid**: Familiar bipedal forms with variations
- **Avian**: Bird-like characteristics, potential flight
- **Reptilian**: Cold-blooded, scaled, patient predators
- **Insectoid**: Arthropod features, often collective
- **Aquatic**: Water-world adaptations
- **Energy**: Organized energy beings
- **Synthetic**: Artificial constructs
- **Hybrid**: Mixed characteristics

### Cultural Frameworks
- **Nomadic Traders**: Freedom-loving, mobile societies
- **Corporate Hierarchy**: Business-focused efficiency
- **Tribal Confederation**: Traditional honor-based
- **Academic Collective**: Knowledge and research focused
- **Militant Order**: Strength and discipline oriented
- **Mystic Circles**: Spiritual and metaphysical
- **Anarchist Collective**: Authority-rejecting independents

### Galactic Status Options
- **UC Core Member**: Full galactic citizenship
- **UC Adjacent**: Allied but not full members
- **Independent Systems**: Neutral self-governance
- **Rogue Elements**: Opposition to major powers
- **Extinct/Remnant**: Survivors of destroyed civilizations
- **Emerging Power**: Recently spacefaring

## 🤝 Contributing

### Bug Reports
Use the GitHub issues page to report bugs. Include:
- Foundry VTT version
- Module version  
- Steps to reproduce
- Expected vs actual behavior

### Feature Requests
We welcome suggestions for:
- New biological archetypes
- Additional cultural frameworks
- System integrations beyond SWADE
- UI improvements
- Performance optimizations

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add appropriate documentation
5. Test thoroughly
6. Submit a pull request

## ⚡ Performance Tips

### For Optimal Speed
- Use "Fast" generation mode during sessions
- Pre-generate species for planned encounters
- Use keyboard shortcuts instead of menus
- Enable auto-export to avoid manual journal creation

### Memory Management
- The module caches generation tables in memory
- Large compendium packs may affect performance
- Consider clearing browser cache if generation slows

## 🔍 Troubleshooting

### Common Issues

**Generation taking too long?**
- Switch to "Fast" mode in settings
- Check for conflicting modules affecting dice rolling
- Ensure tables loaded properly (check browser console)

**SWADE traits not appearing?**
- Verify SWADE system is active
- Check that system detection is working
- Confirm system integration modules are enabled

**Export to journal failing?**
- Check journal permissions
- Ensure sufficient storage space
- Verify journal folder structure

**Chat commands not working?**
- Confirm "Enable Chat Commands" is checked in settings
- Verify you're a GM (commands are GM-only)
- Check for conflicting chat modules

## 📝 License

This module is released under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Foundry VTT community for API documentation and support
- SWADE system developers for mechanical inspiration
- Science fiction authors whose works inspire endless creativity
- Playtesters who provided valuable feedback during development

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Community**: Foundry VTT Discord channels
- **Issues**: GitHub repository issues page
- **Updates**: Watch the repository for new releases

---

*Generate amazing alien species in minutes, not hours. Perfect for the GM who needs quick, quality content without the preparation time.*