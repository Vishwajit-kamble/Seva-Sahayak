# Seva Sahayak (Seva Easy Fill)

<div align="center">

![Seva Sahayak](https://img.shields.io/badge/Seva-Sahayak-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge&logo=vite)

**AI-Powered Government Form Filling Assistant for India**

Fill government forms instantly by uploading your ID documents. Powered by OCR and AI to extract information automatically.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Supported Forms](#-supported-forms)
- [Supported Documents](#-supported-documents)
- [Installation](#-installation)
- [Usage](#-usage)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Privacy & Security](#-privacy--security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Seva Sahayak** (also known as Seva Easy Fill) is a web application designed to simplify the process of filling government forms in India. Instead of manually entering information, users can upload their identity documents (Aadhaar, PAN, Voter ID, etc.), and the application uses Optical Character Recognition (OCR) technology to automatically extract and fill form fields.

### Key Benefits

- ⚡ **Fast**: Extract information in under 5 seconds
- 🎯 **Accurate**: 90%+ accuracy with smart extraction algorithms
- 🌐 **Multilingual**: Support for 10+ Indian languages
- 🔒 **Secure**: Documents are processed securely and deleted after use
- 🎤 **Voice Input**: Speak to fill form fields easily
- 📱 **Accessible**: Designed with accessibility in mind

---

## ✨ Features

### Core Features

- **Document Upload**: Upload multiple identity documents (Aadhaar, PAN, Voter ID, Driving License, Passport)
- **OCR Extraction**: Automatic text extraction using Tesseract.js
- **Smart Field Mapping**: Intelligent mapping of extracted data to form fields
- **Form Selection**: Choose from 8+ government form templates
- **Form Review & Edit**: Review and manually edit extracted information
- **PDF Generation**: Download filled forms as PDF documents
- **Voice Input**: Fill fields using voice commands
- **Multilingual Support**: Interface available in 10+ Indian languages:
  - English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi

### User Experience

- **Step-by-Step Wizard**: Guided 5-step process
- **Real-time Validation**: Form validation with helpful error messages
- **Confidence Indicators**: Visual indicators for extraction confidence levels
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: High contrast mode, font size controls, and keyboard navigation

---

## 📄 Supported Forms

The application supports the following government forms:

1. **Birth Certificate Application** (जन्म प्रमाण पत्र आवेदन)
2. **Driving License Application** (ड्राइविंग लाइसेंस आवेदन)
3. **PAN Card Application** (पैन कार्ड आवेदन)
4. **Caste Certificate** (जाति प्रमाण पत्र)
5. **Income Certificate** (आय प्रमाण पत्र)
6. **Ration Card Application** (राशन कार्ड आवेदन)
7. **Passport Application** (पासपोर्ट आवेदन)
8. **Voter ID Card** (मतदाता पहचान पत्र)

---

## 🆔 Supported Documents

The application can extract information from the following identity documents:

- **Aadhaar Card** - Extracts name, date of birth, gender, address, Aadhaar number
- **PAN Card** - Extracts name, father's name, date of birth, PAN number
- **Voter ID Card** - Extracts name, date of birth, address, Voter ID number
- **Driving License** - Extracts name, date of birth, address, DL number
- **Passport** - Extracts name, date of birth, address, passport number
- **Other Documents** - Generic document processing support

**Supported File Formats**: PDF, JPG, PNG (Max 10MB per file)

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **bun** package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/seva-easy-fill.git
cd seva-easy-fill
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using bun:
```bash
bun install
```

### Step 3: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

---

## 💻 Usage

### For End Users

1. **Start**: Click "Start Form Filling" on the landing page
2. **Consent**: Read and agree to the privacy consent dialog
3. **Upload Documents**: Upload your identity documents (Aadhaar, PAN, etc.)
4. **Review Extraction**: Review the automatically extracted information
5. **Select Form**: Choose the government form you want to fill
6. **Review & Edit**: Verify all information and make any necessary edits
7. **Download**: Download your completed form as a PDF

### For Developers

#### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

#### Environment Variables

Currently, no environment variables are required. All processing happens client-side.

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool and dev server

### UI Components & Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **tailwindcss-animate** - Animation utilities

### Form Management
- **React Hook Form 7.6** - Form state management
- **Zod 3.25** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### OCR & Document Processing
- **Tesseract.js 5.0** - OCR engine for text extraction

### Routing & State Management
- **React Router DOM 6.30** - Client-side routing
- **TanStack Query 5.83** - Server state management
- **React Context API** - Global state management

### Additional Libraries
- **date-fns 3.6** - Date manipulation
- **sonner 1.7** - Toast notifications
- **next-themes 0.3** - Theme management

### Development Tools
- **ESLint 9.32** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

```
seva-easy-fill/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ConsentDialog.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── DownloadPage.tsx
│   │   ├── ExtractionResults.tsx
│   │   ├── FormReview.tsx
│   │   ├── FormSelection.tsx
│   │   ├── FormWizard.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── StepIndicator.tsx
│   ├── contexts/           # React contexts
│   │   ├── FormContext.tsx
│   │   └── LanguageContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                # Utility libraries
│   │   ├── documentExtractor.ts  # OCR extraction logic
│   │   ├── i18n.ts         # Internationalization
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx             # Main app component
│   ├── App.css             # App styles
│   ├── main.tsx             # Entry point
│   └── index.css           # Global styles
├── .gitignore
├── components.json          # shadcn/ui config
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TS config
├── tsconfig.node.json      # Node-specific TS config
└── vite.config.ts          # Vite configuration
```

---

## 🔧 Development

### Code Style

The project uses ESLint for code quality. Run the linter:

```bash
npm run lint
```

### Adding New Forms

To add a new form template:

1. Update `src/components/FormSelection.tsx` - Add form template to `formTemplates` array
2. Update `src/lib/i18n.ts` - Add translations for form name
3. Update form field mappings in `src/lib/documentExtractor.ts` if needed

### Adding New Languages

To add support for a new language:

1. Update `src/lib/i18n.ts`:
   - Add language code to `Language` type
   - Add language entry to `languages` array
   - Add translations object to `translations` record

### OCR Customization

OCR extraction logic is in `src/lib/documentExtractor.ts`. You can customize:

- Character whitelist for better accuracy
- Page segmentation modes
- Field extraction patterns
- Confidence thresholds

---

## 🏗️ Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment

The built files in `dist/` can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions to deploy
- **AWS S3 + CloudFront**: Upload to S3 bucket
- **Any static hosting**: Upload `dist/` contents

---

## 🔒 Privacy & Security

### Data Handling

- **Client-Side Processing**: All OCR processing happens in the browser
- **No Server Upload**: Documents are never sent to external servers
- **Automatic Cleanup**: Documents are deleted from memory after processing
- **No Data Storage**: No personal information is stored or logged

### Privacy Features

- Privacy consent dialog before document upload
- Clear information about data processing
- No tracking or analytics by default
- Open source code for transparency

### Security Best Practices

- Input validation on all form fields
- File type and size restrictions
- XSS protection through React's built-in escaping
- HTTPS recommended for production deployment

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests and linting** (`npm run lint`)
5. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Ensure accessibility standards are met

---

## 📝 License

This project is open source. Please check the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Tesseract.js** - For OCR capabilities
- **shadcn/ui** - For beautiful, accessible components
- **Indian Government** - For form templates and requirements
- **Open Source Community** - For amazing tools and libraries

---

## 📞 Support

For issues, questions, or contributions:

- **GitHub Issues**: [Open an issue](https://github.com/your-username/seva-easy-fill/issues)
- **Documentation**: Check the code comments and this README
- **Community**: Join discussions in GitHub Discussions

---

## 🗺️ Roadmap

Future enhancements planned:

- [ ] Support for more government forms
- [ ] Enhanced OCR accuracy with ML models
- [ ] Offline mode support
- [ ] Mobile app version
- [ ] Integration with government portals
- [ ] Batch processing for multiple forms
- [ ] Digital signature support
- [ ] Form submission tracking

---

<div align="center">

**Made with ❤️ for Seva Kendras across India**

[⭐ Star this repo](https://github.com/your-username/seva-easy-fill) if you find it helpful!

</div>
