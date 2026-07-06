# ELUSoC 2026 - Issues & Pull Requests

---

## 1. ELUSoC_2026_ThemeContextRefactor

### Issue Body

**Title:** ELUSoC_2026: ThemeContext refactor with OS preference detection and transitions

**Description:**
Currently, theme state is managed via prop drilling (`darkMode`/`toggleTheme`) from `App.jsx` through `AppRoutes` to every page. This branch introduces a centralized `ThemeContext` with:

- `localStorage` persistence for user theme preference
- Automatic system preference detection via `window.matchMedia('(prefers-color-scheme: dark)')`
- Smooth CSS transitions (`0.25s ease`) on all themed properties
- Backward-compatible — existing prop-based usage still works while pages can migrate to `useTheme()`

**Files changed:**

- `frontend/src/context/ThemeContext.jsx` — _created_: Provider + `useTheme` hook
- `frontend/src/App.jsx` — _updated_: wrapped app in `<ThemeProvider>`
- `frontend/src/App.css` — _updated_: added `*, *::before, *::after` transition and `color-scheme` toggle
- `frontend/src/pages/AdminDashboard.jsx` — _updated_: migrated to `useTheme()` hook
- `frontend/src/pages/SettingsPage.jsx` — _updated_: migrated to `useTheme()` hook
- `frontend/src/routes/AppRoutes.jsx` — _updated_: removed redundant props for migrated pages

### PR Body

**Title:** ELUSoC_2026: ThemeContext refactor

**Description:**
Closes issue ELUSoC_2026-1.

This PR refactors theme management into a centralized `ThemeContext` with system preference detection, localStorage persistence, and smooth transitions. All existing pages remain functional; AdminDashboard and SettingsPage now use `useTheme()` directly.

**Checklist:**

- [x] ThemeProvider with system preference detection
- [x] localStorage persistence
- [x] CSS transitions on all themed properties
- [x] Backward compatible with existing prop-based usage
- [x] AdminDashboard and SettingsPage migrated

---

## 2. ELUSoC_2026_FormValidationSystem

### Issue Body

**Title:** ELUSoC_2026: Form validation system with useFormValidation hook and FormField component

**Description:**
SettingsPage currently uses raw `useState` for each field with no validation. This branch introduces a reusable form validation system:

- `useFormValidation` hook with declarative field rules, real-time validation on change/blur, submit handling, and reset
- `FormField` component supporting `text`, `email`, `select`, and `checkbox` types with error states
- Extended `validators.js` with `validatePhone`, `validateUrl`, `validateFullName`, `validatePassportNumber`, and `VALIDATION_MESSAGES` constants
- SettingsPage fully refactored to use the new system

**Files changed:**

- `frontend/src/hooks/useFormValidation.js` — _created_: validation hook with `defaultRules`
- `frontend/src/components/FormField.jsx` — _created_: reusable form field component
- `frontend/src/components/FormField.css` — _created_: field styling with error states
- `frontend/src/utils/validators.js` — _updated_: added phone, URL, name, passport validators
- `frontend/src/pages/SettingsPage.jsx` — _updated_: integrated form validation + FormField

### PR Body

**Title:** ELUSoC_2026: Form validation system

**Description:**
Closes issue ELUSoC_2026-2.

Introduces a complete form validation system: `useFormValidation` hook with field-level rules, real-time validation, and a reusable `FormField` component. Extends `validators.js` with new validators. SettingsPage has been refactored to use these new utilities.

**Checklist:**

- [x] useFormValidation hook with rules engine
- [x] FormField component (text, email, select, checkbox)
- [x] Error state styling with ARIA attributes
- [x] Extended validators.js
- [x] SettingsPage integration

---

## 3. ELUSoC_2026_AdminAnalyticsAPI

### Issue Body

**Title:** ELUSoC_2026: Admin analytics API with real-time dashboard

**Description:**
AdminDashboard currently shows static placeholder data. This branch creates a backend analytics endpoint and updates the dashboard to fetch and display live statistics:

- `analytics.controller.js` aggregates total uploads, today's uploads, total users, sheets, processed images, and recent uploads
- `analytics.routes.js` exposes two endpoints: `/api/analytics/stats` and `/api/analytics/trend`
- AdminDashboard now fetches real data on mount, with loading/error/live indicator badges
- CSS additions for badge variants and error state styling

**Files changed:**

- `backend/src/controllers/analytics.controller.js` — _created_: stats aggregation controller
- `backend/src/routes/analytics.routes.js` — _created_: analytics route definitions
- `backend/src/routes/index.js` — _updated_: register analytics routes
- `frontend/src/pages/AdminDashboard.jsx` — _updated_: live data fetching + display
- `frontend/src/pages/AdminDashboard.css` — _updated_: badge and error styles

### PR Body

**Title:** ELUSoC_2026: Admin analytics API

**Description:**
Closes issue ELUSoC_2026-3.

Adds a backend analytics API with aggregated statistics from Upload, User, PrintSheet, and ProcessedImage models. The AdminDashboard now shows live data with loading and error states.

**Checklist:**

- [x] GET /api/analytics/stats endpoint
- [x] GET /api/analytics/trend endpoint
- [x] Live data fetching in AdminDashboard
- [x] Loading, error, and live indicator badges
- [x] CSS for new UI states

---

## 4. ELUSoC_2026_ImageProcessingPipeline

### Issue Body

**Title:** ELUSoC_2026: Image processing pipeline with progress tracking

**Description:**
The existing async job processing system lacks progress feedback. This branch adds granular progress tracking:

- `processJobStore` extended with `progress` (0-100) and `stage` (textual status) fields
- `image.controller.js` updated with progress updates at each stage (validating → quality check → AI processing → saving → complete)
- `useProcessImage` hook with polling, error handling, and reset
- PhotoStudio integration with AI Process button and progress bar
- CSS for progress bar (processing, done, error states)

**Files changed:**

- `frontend/src/hooks/useProcessImage.js` — _created_: polling hook with progress tracking
- `backend/src/utils/processJobStore.js` — _updated_: added progress and stage fields
- `backend/src/controllers/image.controller.js` — _updated_: granular progress updates
- `frontend/src/pages/PhotoStudio.jsx` — _updated_: AI Process button + progress bar
- `frontend/src/pages/PhotoStudio.css` — _updated_: progress bar styling

### PR Body

**Title:** ELUSoC_2026: Image processing pipeline

**Description:**
Closes issue ELUSoC_2026-4.

Adds granular progress tracking to the image processing pipeline. The job store now tracks `progress` and `stage` fields. A `useProcessImage` hook polls the backend and updates a progress bar in PhotoStudio in real-time.

**Checklist:**

- [x] Job store extended with progress/stage fields
- [x] Controller emits stage updates during processing
- [x] useProcessImage hook with polling
- [x] PhotoStudio AI Process button
- [x] Progress bar CSS (processing, error, done)

---

## 5. ELUSoC_2026_BatchExportSystem

### Issue Body

**Title:** ELUSoC_2026: Batch ZIP export system for processed photos

**Description:**
Users currently download processed photos one at a time. This branch adds batch ZIP export:

- `batch.controller.js` uses `archiver` to create ZIP files from processed images
- `batch.routes.js` with `POST /api/batch/export` (max 50 files, path traversal protection)
- `useBatchExport` hook for frontend ZIP download
- PrintPreviewPage now has an "Export All as ZIP" button
- Routes registered in the main router

**Files changed:**

- `backend/src/controllers/batch.controller.js` — _created_: ZIP generation controller
- `backend/src/routes/batch.routes.js` — _created_: batch export route
- `backend/src/routes/index.js` — _updated_: register batch routes
- `frontend/src/hooks/useBatchExport.js` — _created_: download hook with blob handling
- `frontend/src/pages/PrintPreviewPage.jsx` — _updated_: batch export button

### PR Body

**Title:** ELUSoC_2026: Batch export system

**Description:**
Closes issue ELUSoC_2026-5.

Adds batch ZIP export for processed photos. Backend uses `archiver` to stream a ZIP file. Frontend hook triggers download with a single click.

**Checklist:**

- [x] POST /api/batch/export endpoint
- [x] Archiver-based ZIP generation
- [x] Path traversal protection
- [x] useBatchExport hook
- [x] PrintPreviewPage export button

---

## 6. ELUSoC_2026_UploadQueueSystem

### Issue Body

**Title:** ELUSoC_2026: Upload queue system with XHR progress tracking

**Description:**
UploadBox currently handles single-file uploads only. This branch adds a complete upload queue system:

- `useUploadQueue` hook with queue management, XHR progress tracking, retry, cancel, and batch upload support
- `UploadBox` updated to accept multiple files via drag-and-drop or file dialog
- Queue UI showing file names with status (queued/uploading/done/failed/cancelled)
- Backend `batchUpload` controller for multi-file uploads
- `/api/upload/batch` route with multer's `upload.array()` middleware

**Files changed:**

- `frontend/src/hooks/useUploadQueue.js` — _created_: queue management hook
- `frontend/src/components/UploadBox.jsx` — _updated_: multi-file + queue display
- `frontend/src/components/UploadBox.css` — _updated_: queue item styles
- `backend/src/controllers/upload.controller.js` — _updated_: added batchUpload
- `backend/src/routes/upload.routes.js` — _updated_: added /batch route with multer

### PR Body

**Title:** ELUSoC_2026: Upload queue system

**Description:**
Closes issue ELUSoC_2026-6.

Adds a full upload queue system with progress tracking via XHR. Supports drag-and-drop of multiple files, per-item status display, retry, and cancel. Backend batch endpoint handles up to 20 files per request.

**Checklist:**

- [x] useUploadQueue hook with XHR progress
- [x] Multi-file drag-and-drop support
- [x] Queue UI with status indicators
- [x] Backend batch upload endpoint
- [x] Retry/cancel/clear functionality

---

## 7. ELUSoC_2026_PhotoComparisonZoom

### Issue Body

**Title:** ELUSoC_2026: Photo comparison slider with zoom and pan

**Description:**
PhotoStudio's "Show Original" toggle currently switches between images without a proper comparison view. This branch adds:

- `useZoomPan` hook with mouse wheel zoom, click-drag pan, zoom level controls, and reset
- `ComparisonSlider` component with draggable before/after slider, zoom toolbar, and accessibility attributes
- Integration into PhotoStudio — clicking "Show Original" now opens the comparison view
- Full CSS for slider handle, zoom controls, and dark mode

**Files changed:**

- `frontend/src/hooks/useZoomPan.js` — _created_: zoom/pan hook
- `frontend/src/components/ComparisonSlider.jsx` — _created_: before/after slider
- `frontend/src/components/ComparisonSlider.css` — _created_: slider styling
- `frontend/src/pages/PhotoStudio.jsx` — _updated_: comparison view integration
- `frontend/src/pages/PhotoStudio.css` — _updated_: comparison section layout

### PR Body

**Title:** ELUSoC_2026: Photo comparison slider

**Description:**
Closes issue ELUSoC_2026-7.

Replaces the simple image toggle with an interactive before/after comparison slider. Supports zoom (wheel + buttons), pan (click-drag), and preset zoom levels. Fully accessible with ARIA slider role.

**Checklist:**

- [x] useZoomPan hook (wheel zoom, pan, reset)
- [x] ComparisonSlider component
- [x] Draggable comparison handle
- [x] Zoom controls (buttons + select + wheel)
- [x] PhotoStudio integration

---

## 8. ELUSoC_2026_RoleBasedAccess

### Issue Body

**Title:** ELUSoC_2026: Role-based access control with admin user management

**Description:**
The user model already has a `role` field (`user`/`admin`), but there's no middleware to enforce it. This branch adds:

- `role.middleware.js` with `authorize(...roles)` and `isAdmin` guards
- `admin.routes.js` with admin-only endpoints: list users, update roles, delete users
- `updateRole` controller and `PATCH /api/auth/role` endpoint
- All admin routes protected by `authMiddleware` + `isAdmin`

**Files changed:**

- `backend/src/middleware/role.middleware.js` — _created_: authorize() and isAdmin()
- `backend/src/routes/admin.routes.js` — _created_: admin CRUD routes
- `backend/src/routes/index.js` — _updated_: register admin routes
- `backend/src/controllers/auth.controller.js` — _updated_: added updateRole
- `backend/src/routes/auth.routes.js` — _updated_: added PATCH /role route

### PR Body

**Title:** ELUSoC_2026: Role-based access control

**Description:**
Closes issue ELUSoC_2026-8.

Implements role-based access control. The `authorize()` middleware checks `req.user.role` against allowed roles. Admin routes for user listing, role updates, and deletion are protected behind both auth and admin middleware.

**Checklist:**

- [x] authorize() and isAdmin() middleware
- [x] Admin routes: GET /api/admin/users
- [x] Admin routes: PATCH /api/admin/users/:id/role
- [x] Admin routes: DELETE /api/admin/users/:id
- [x] PATCH /api/auth/role endpoint

---

## 9. ELUSoC_2026_PerformanceMonitoring

### Issue Body

**Title:** ELUSoC_2026: Performance monitoring with request timing middleware

**Description:**
There's currently no way to monitor server performance. This branch adds:

- `timing.middleware.js` that tracks per-request duration, method counts, route counts, status codes, and computes latency percentiles (p50, p95, p99)
- `metrics.controller.js` exposing the collected metrics
- `metrics.routes.js` at `GET /api/metrics` (view) and `DELETE /api/metrics` (reset)
- Timing middleware registered in `app.js` to measure all API requests

**Files changed:**

- `backend/src/middleware/timing.middleware.js` — _created_: timing + metrics collection
- `backend/src/controllers/metrics.controller.js` — _created_: metrics API endpoints
- `backend/src/routes/metrics.routes.js` — _created_: metrics route definitions
- `backend/src/routes/index.js` — _updated_: register metrics routes
- `backend/src/app.js` — _updated_: added timing middleware

### PR Body

**Title:** ELUSoC_2026: Performance monitoring

**Description:**
Closes issue ELUSoC_2026-9.

Adds a timing middleware that measures all API request durations and exposes performance metrics via `/api/metrics`. Includes method/route/status counts and latency percentiles.

**Checklist:**

- [x] Timing middleware with per-request tracking
- [x] Latency percentiles (avg, p50, p95, p99)
- [x] Method, route, and status code counters
- [x] GET /api/metrics and DELETE /api/metrics
- [x] Middleware registered in app.js

---

## 10. ELUSoC_2026_ApiDocumentation

### Issue Body

**Title:** ELUSoC_2026: Self-documenting API endpoint and frontend docs page

**Description:**
New contributors currently have to read route files to understand the API. This branch adds:

- `docs.controller.js` with a curated list of all 30+ API endpoints, their HTTP methods, paths, and descriptions
- `GET /api/docs` returns structured JSON documentation
- `ApiDocsPage` frontend page that fetches and displays the docs with color-coded HTTP methods
- Route added to `AppRoutes` at `/api-docs`

**Files changed:**

- `backend/src/controllers/docs.controller.js` — _created_: endpoint documentation data
- `backend/src/routes/docs.routes.js` — _created_: docs route at GET /api/docs
- `backend/src/routes/index.js` — _updated_: register docs routes
- `frontend/src/pages/ApiDocsPage.jsx` — _created_: documentation viewer page
- `frontend/src/pages/ApiDocsPage.css` — _created_: docs page styling
- `frontend/src/routes/AppRoutes.jsx` — _updated_: added /api-docs route

### PR Body

**Title:** ELUSoC_2026: API documentation

**Description:**
Closes issue ELUSoC_2026-10.

Adds a self-documenting API endpoint (`GET /api/docs`) that returns all 30+ routes with their methods, paths, and descriptions. A frontend page at `/api-docs` renders the documentation with color-coded HTTP methods and endpoint details.

**Checklist:**

- [x] GET /api/docs endpoint with full route catalog
- [x] ApiDocsPage frontend with method colors
- [x] Loading and error states
- [x] Dark mode support
- [x] Route registered in AppRoutes
