# Digital Services Hub

A modern web-based platform offering various digital tools and services, built with a focus on modularity, accessibility, and user experience.

## Features

1. **Text to Speech**
   - Convert text to natural-sounding speech
   - Multiple voices and languages
   - Adjustable speed, pitch, and volume
   - Save and load history
   - Export audio files

2. **Image Resizer**
   - Resize images with aspect ratio preservation
   - Multiple output formats
   - Quality control
   - Drag and drop support
   - Preview functionality

3. **Color Palette**
   - Generate color harmonies
   - Save and load palettes
   - Export in multiple formats (HEX, RGB, CSS)
   - Color picker with gradient
   - Real-time preview

4. **ASCII Art**
   - Convert images to ASCII art
   - Multiple character sets
   - Color support
   - Size customization
   - Export functionality

5. **QR Code**
   - Generate customizable QR codes
   - Error correction levels
   - Custom colors and size
   - Real-time preview
   - Download as PNG

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digital-services-hub.git
   ```

2. Open index.html in your browser or set up a local server:
   ```bash
   python -m http.server 8000
   ```

3. Visit http://localhost:8000 in your browser

## Architecture

### Base Tool Class
All tools extend the BaseTool class which provides:
- Theme management
- File handling
- Notifications
- Keyboard shortcuts
- Error handling

### Utility Modules
- **constants.js**: Configuration values
- **helpers.js**: Common functions
- **validation.js**: Input validation
- **ui.js**: UI components

### Features
Each tool is implemented as a module with:
- Consistent interface
- Error handling
- Accessibility support
- Keyboard navigation
- Theme support

## Keyboard Shortcuts

### Global
- `Alt + 1-5`: Navigate to tools
- `Ctrl + T`: Toggle theme

### Text to Speech
- `Ctrl + Enter`: Start/Stop speech
- `Ctrl + S`: Save text

### Image Resizer
- `Ctrl + S`: Download image
- `Ctrl + L`: Toggle aspect ratio lock

### Color Palette
- `Ctrl + S`: Save palette
- `Ctrl + E`: Export colors
- `Ctrl + G`: Generate harmony

### ASCII Art
- `Ctrl + G`: Generate art
- `Ctrl + C`: Copy to clipboard
- `Ctrl + S`: Download result

### QR Code
- `Ctrl + G`: Generate code
- `Ctrl + S`: Download QR code

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Prerequisites
- Modern web browser
- Text editor
- Basic understanding of HTML, CSS, and JavaScript

### Project Structure
```
digital-services-hub/
├── css/
│   ├── components/
│   ├── themes/
│   └── utils/
├── js/
│   ├── features/
│   └── utils/
├── pages/
└── index.html
```

### Adding New Features
1. Create feature files:
   - `js/features/your-feature.js`
   - `css/components/your-feature.css`
   - `pages/your-feature.html`
2. Extend BaseTool class
3. Add to navigation
4. Update documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
