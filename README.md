# 🎊 WebKankotri v2 - Wedding Invitation Platform

**A modern, AI-powered platform for creating beautiful Indian wedding invitations**

[![Tests](https://img.shields.io/badge/tests-558%20passing-success)](./tests)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://react.dev/)

---

## 🌟 Features

### ✨ Core Features
- **AI Template Generation** - Generate templates using v0.dev integration
- **Visual Editor** - Drag-and-drop editor powered by Puck
- **Dynamic Forms** - Auto-generate forms from templates
- **Animation Engine** - GSAP + Framer Motion animations
- **Template Gallery** - Browse and search templates
- **Template Renderer** - Render templates with custom data

### 👤 User Features
- **Authentication** - Secure login/signup with Supabase
- **User Dashboard** - Manage your templates
- **Template Management** - Create, edit, delete, duplicate
- **Search & Filters** - Find templates quickly
- **User Profiles** - Manage account settings

### 📄 Export Features
- **PDF Export** - Export as high-quality PDF (custom size, A4)
- **PNG Export** - Export as PNG with transparency
- **JPEG Export** - Export as compressed JPEG
- **Thumbnail Generation** - Auto-generate preview thumbnails
- **Image Optimization** - Optimize images to target size

### 🎨 UI/UX Features
- **Toast Notifications** - Success/error/warning/info toasts
- **Alert Messages** - Inline semantic alerts
- **Loading States** - Smooth loading overlays
- **Design System** - Consistent colors, typography, spacing
- **Accessibility** - WCAG 2.1 AA compliant
- **Responsive** - Mobile-first design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/webkankotri-v2.git
cd webkankotri-v2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Run database setup (see SUPABASE_FIX.md)
# Execute supabase-setup.sql in your Supabase SQL editor

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Tech Stack

### **Framework & Libraries**
- **Next.js 15.5** - React framework
- **React 19.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand** - State management

### **UI Components**
- **@measured/puck** - Visual editor
- **@dnd-kit/core** - Drag and drop
- **react-konva** - Canvas manipulation
- **framer-motion** - Animations
- **gsap** - Advanced animations

### **Backend & Auth**
- **Supabase** - Database & authentication
- **@supabase/supabase-js** - Supabase client

### **Export**
- **html2canvas** - HTML to canvas conversion
- **jsPDF** - PDF generation

### **Forms & Validation**
- **react-hook-form** - Form management
- **zod** - Schema validation

### **Testing**
- **Vitest** - Unit testing
- **@testing-library/react** - Component testing
- **jsdom** - DOM simulation

---

## 📁 Project Structure

```
webkankotri-v2/
├── src/
│   ├── core/                      # Core systems
│   │   ├── element-system/        # Element types (Text, Image, Gallery)
│   │   ├── template-system/       # Template CRUD, storage, Supabase
│   │   ├── editor-state/          # Undo/redo, selection
│   │   ├── renderer-engine/       # Render template + data
│   │   ├── event-bus/             # Plugin communication
│   │   └── types/                 # TypeScript types
│   │
│   ├── plugins/                   # Feature plugins
│   │   ├── ai-generator/          # AI template generation
│   │   ├── form-builder/          # Dynamic forms
│   │   ├── template-renderer/     # Template rendering
│   │   ├── animation-engine/      # GSAP + Framer animations
│   │   ├── visual-editor/         # Puck editor integration
│   │   └── gallery/               # Template gallery
│   │
│   ├── components/                # React components
│   │   ├── auth/                  # Login, Signup, Profile
│   │   ├── dashboard/             # User dashboard
│   │   ├── export/                # Export buttons
│   │   ├── ui/                    # Toast, Alert, Loading
│   │   └── ...                    # Other UI components
│   │
│   ├── lib/                       # Libraries
│   │   ├── auth/                  # AuthContext, hooks
│   │   └── export/                # PDF, Image export
│   │
│   └── app/                       # Next.js app router
│       ├── page.tsx               # Home page
│       ├── gallery/               # Gallery pages
│       ├── auth/                  # Auth pages
│       └── dashboard/             # Dashboard pages
│
├── tests/                         # Test files
│   ├── core/                      # Core system tests
│   ├── plugins/                   # Plugin tests
│   ├── components/                # Component tests
│   └── lib/                       # Library tests
│
├── webkankotri-v2-blueprint/      # Project documentation
│   ├── 03_ARCHITECTURE.md         # Architecture docs
│   ├── 08_BUILD_PLAN.md           # Build plan
│   └── 09_UI_UX_DESIGN.md         # Design system
│
└── package.json                   # Dependencies & scripts
```

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Status
- **Total Tests:** 558
- **Passing:** 558 (100%)
- **Coverage:** Comprehensive

---

## 🎨 Design System

### Colors
- **Primary (Gold):** `#F5B800` - Buttons, highlights
- **Secondary (Red):** `#C41E3A` - Traditional Indian wedding
- **Success:** `#10B981` - Success states
- **Error:** `#EF4444` - Error states
- **Warning:** `#F59E0B` - Warning states
- **Info:** `#3B82F6` - Info states

### Typography
- **Headings:** Cinzel (serif)
- **Body:** Geist Sans / Inter (sans-serif)
- **Sizes:** 8px base scale

### Spacing
- **Base Unit:** 8px
- **Scale:** 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24

---

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Analytics, Monitoring, etc.
```

---

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL setup script:
   ```bash
   # Copy contents of supabase-setup.sql
   # Paste into Supabase SQL Editor
   # Execute the script
   ```
3. Enable Row Level Security (RLS) policies
4. Copy your project URL and anon key to `.env.local`

See [SUPABASE_FIX.md](./SUPABASE_FIX.md) for detailed instructions.

---

## 📚 Documentation

### Project Documentation
- **[Architecture](./webkankotri-v2-blueprint/03_ARCHITECTURE.md)** - System architecture
- **[Build Plan](./webkankotri-v2-blueprint/08_BUILD_PLAN.md)** - Development plan
- **[Design System](./webkankotri-v2-blueprint/09_UI_UX_DESIGN.md)** - UI/UX guidelines
- **[Project Status](./PROJECT_STATUS.md)** - Current status

### Component Documentation
- **[Auth Components](./src/lib/auth/README.md)** - Authentication system
- **[Dashboard Components](./src/components/dashboard/README.md)** - User dashboard
- **[Export Library](./src/lib/export/README.md)** - PDF & Image export
- **[UI Components](./src/components/ui/README.md)** - Reusable UI components

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Variables (Production)
Set these in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (Turbopack)
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run with coverage

# Linting
npm run lint             # Run ESLint
```

### Code Style
- TypeScript strict mode enabled
- ESLint configuration
- Prettier (if configured)
- Component-first architecture

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Authors

**Your Team**
- Developer: [Your Name]
- Design: [Designer Name]
- Project Manager: [PM Name]

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Vercel** - Hosting and deployment
- **Supabase** - Backend as a service
- **Puck** - Visual editor
- **Tailwind CSS** - Utility-first CSS
- **React Team** - UI library

---

## 📞 Support

- **Documentation:** Check the `/docs` folder
- **Issues:** [GitHub Issues](https://github.com/yourusername/webkankotri-v2/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/webkankotri-v2/discussions)
- **Email:** support@webkankotri.com

---

## 🎯 Roadmap

### ✅ Completed (v1.0)
- AI template generation
- Visual editor
- Authentication
- User dashboard
- Export features (PDF, PNG, JPEG)
- Toast notifications
- Accessibility improvements

### 🔄 In Progress (v1.1)
- Real-time collaboration
- Template versioning
- Social sharing

### 📋 Planned (v2.0)
- Template marketplace
- Analytics dashboard
- Mobile app
- Custom domains
- White-labeling

---

## 📊 Project Stats

- **Lines of Code:** ~15,000+
- **Components:** 50+
- **Tests:** 558 (100% passing)
- **Dependencies:** 30+
- **Development Time:** 4 weeks
- **Production Ready:** ✅ YES

---

<div align="center">

**Made with ❤️ for Indian Weddings**

[Website](https://webkankotri.com) • [Documentation](./docs) • [Demo](https://demo.webkankotri.com)

</div>
