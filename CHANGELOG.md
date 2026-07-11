# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Initial open-source release of SnapPass AI
- React frontend with Home, Upload, Editor, Print Preview, and Admin pages
- Express backend with authentication, upload, image processing, and print endpoints
- Python AI service with background removal (rembg), face detection (OpenCV), and sheet generation (Pillow)
- Docker Compose setup for local development
- GitHub Actions CI/CD workflows for frontend, backend, and Python service
- CodeQL security analysis integration
- Dependabot configuration for automated dependency updates
- Multi-language support (English, Hindi)
- Dark mode with system preference detection
- Drag-and-drop photo upload with magic byte validation
- Recently used presets with localStorage persistence
- Form attire AI swapping (male suit, female blazer, bowtie)
- Passport requirement comparator across countries
- Testimonials system with seed data
- Real-time photo processing job queue
- Comprehensive file validation and security sanitization

### Changed

- Updated README with accurate project status and tech stack
- Restructured documentation with DEPLOYMENT, CONTRIBUTING, and ARCHITECTURE guides
- Enhanced Python AI processing pipeline with progress callbacks and more presets
- Standardized port configurations across all services (3000 backend, 5173 frontend, 8000 AI)
- Refactored AdminDashboard with 4-tab layout and real analytics integration
- Upgraded ProcessingStatus component with animated progress bar and stage indicators

### Fixed

- Added missing timingMiddleware import in app.js preventing server crash
- Wrapped timing middleware in try-catch for fault-tolerant metrics collection
- Fixed inconsistent port references (5005 → 5000) across frontend configurations
- Fixed port validation with utility function and graceful fallbacks

### Security

- Added Content Security Policy (CSP) headers via helmet configuration
- Created custom security headers middleware (HSTS, COEP, COOP, Permissions-Policy)
- Added frontend security utilities (sanitization, URL validation, CSP monitoring)
- Created SecurityBanner component for non-HTTPS connection warnings
- Enhanced file upload validation with additional security checks

### Infrastructure

- Added comprehensive test-suite.yml workflow with 8 parallel CI/CD jobs
- Created service worker (sw.js) with cache strategies for PWA support
- Added PWA manifest.json with standalone display and shortcuts
- Added OfflineBanner component for network connectivity awareness
- Implemented SSE (Server-Sent Events) for real-time job progress tracking
- Added batch upload support with multi-file drag-and-drop
- Expanded i18n to 6 languages (English, Hindi, French, Spanish, German, Bengali)
