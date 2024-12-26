# Digital Services Hub

A comprehensive suite of free, web-based tools that simplify everyday digital tasks.

## 🎯 Vision

Digital Services Hub provides a modern, accessible platform focused on:
- 🌟 User-friendly and intuitive interfaces
- 🔒 Privacy-first approach with client-side processing
- ♿ Accessibility and inclusive design
- 🚀 Performance and efficiency
- 💻 Cross-platform compatibility
- 🌐 Global availability

## 🛠️ Available Tools

### Audio Tools
- **Text to Speech**: Convert text to natural-sounding speech with multiple voices and languages

### Image Tools
- **Image Resizer**: Resize and optimize images while maintaining quality
- **ASCII Art**: Convert images into creative ASCII art
- **Color Palette**: Generate beautiful color harmonies for designs

### Utility Tools
- **QR Code Generator**: Create customizable QR codes
- **Password Generator**: Generate secure passwords with advanced options
- **URL Shortener**: Create short, trackable links

## 🚀 UI Components

The project includes a comprehensive set of accessible, themeable UI components:

### Core Components
- **Buttons**: Multiple variants, sizes, and states with keyboard navigation
- **Forms**: Fully accessible form controls with validation states
- **Alerts**: Customizable notifications with auto-dismiss
- **Progress**: Interactive progress bars with various states
- **Modal**: Accessible dialog system with keyboard trapping
- **Tooltip**: Customizable tooltips with multiple positions
- **Navigation**: Responsive navigation with mobile support

### Features
- **Dark/Light Theme**: Automatic theme detection with manual override
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Accessibility**: ARIA attributes and keyboard navigation
- **Animations**: Smooth transitions and loading states
- **Error Handling**: Comprehensive error states and feedback

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/TMHDigital/Digital_Services.HUB.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
Digital_Services.HUB/
├── css/                  # Stylesheets
│   ├── base/            # Base styles and reset
│   ├── components/      # Component styles
│   │   ├── alerts.css
│   │   ├── ascii-art.css
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── color-palette.css
│   │   ├── forms.css
│   │   ├── image-resizer.css
│   │   ├── modal.css
│   │   ├── navigation.css
│   │   ├── notifications.css
│   │   ├── password-generator.css
│   │   ├── progress.css
│   │   ├── qr-code.css
│   │   ├── social-share.css
│   │   ├── spinner.css
│   │   ├── text-to-speech.css
│   │   ├── tool-page.css
│   │   ├── tooltip.css
│   │   ├── ui.css
│   │   └── url-shortener.css
│   ├── themes/          # Theme configuration
│   ├── utils/          # Utility styles
│   └── styles.css      # Main stylesheet
├── js/                  # JavaScript files
│   ├── api/            # API integrations
│   │   └── text-to-speech-api.js
│   ├── build/          # Build scripts
│   ├── components/     # UI components
│   ├── config/         # Configuration
│   ├── features/       # Tool implementations
│   │   ├── about.js
│   │   ├── ascii-art.js
│   │   ├── base-tool.js
│   │   ├── color-palette.js
│   │   ├── image-resizer.js
│   │   ├── password-generator.js
│   │   ├── qr-code.js
│   │   ├── text-to-speech.js
│   │   ├── tools-manager.js
│   │   └── url-shortener.js
│   ├── templates/      # HTML templates
│   └── utils/          # Utility functions
├── pages/              # Tool pages
│   ├── ascii-art.html
│   ├── color-palette.html
│   ├── image-resizer.html
│   ├── password-generator.html
│   ├── qr-code.html
│   ├── text-to-speech.html
│   └── url-shortener.html
├── docs/               # Documentation
│   ├── API.md         # API documentation
│   ├── FUTURE-FEATURES.md
│   ├── README.md      # Main documentation
│   └── TECHNICAL.md   # Technical documentation
├── index.html         # Main entry point
├── package.json       # Project dependencies
├── rollup.config.js   # Build configuration
├── .eslintrc.json    # ESLint configuration
├── .gitignore        # Git ignore rules
├── CHANGELOG.md      # Version history
├── CONTRIBUTING.md   # Contribution guidelines
├── LICENSE          # Project license
└── TO-DO.md        # Project tasks
```

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Modern web browser

### Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run tests
- `npm run lint`: Lint code
- `npm run validate`: Validate project structure

### Component Development
1. Follow the established component structure in `js/components/`
2. Ensure accessibility features are implemented
3. Add corresponding styles in `css/components/`
4. Include dark theme support
5. Add tests in `js/components/__tests__/`

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Documentation

- [Technical Documentation](./TECHNICAL.md)
- [API Documentation](./API.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)

## 🗺️ Roadmap

See our [Future Features](./FUTURE-FEATURES.md) document for planned improvements and upcoming tools.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🤝 Support

- Report bugs: [Issue Tracker](https://github.com/TMHDigital/Digital_Services.HUB/issues)
- Request features: [Feature Requests](https://github.com/TMHDigital/Digital_Services.HUB/issues/new)
- Join discussions: [Discussions](https://github.com/TMHDigital/Digital_Services.HUB/discussions)
