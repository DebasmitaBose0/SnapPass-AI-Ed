# SnapPass AI Photo Flow Workplan

This plan splits the selfie-to-passport journey into five normal-sized issue/PR slices. Each follow-up branch should be created from `master`.

## 1. Self-serve photo upload and session handoff
- Let a user upload or select a camera photo from the browser.
- Validate file type, size, and orientation before the file enters the pipeline.
- Store the upload result in session state so the editor can open with the chosen file.

## 2. Background removal and face centering pipeline
- Connect the backend image route to the Python AI service for background removal.
- Add face detection and automatic centering so the head stays within passport framing.
- Return a processed preview URL that the frontend can render immediately.

## 3. Passport compliance and size presets
- Apply country-specific passport dimensions and output presets.
- Enforce composition rules such as face ratio, margins, and background color.
- Surface clear rejections when a photo does not meet the required standard.

## 4. Print-ready sheet generation
- Generate A4 print sheets from the processed portrait.
- Support multiple copies per sheet with consistent spacing and crop marks.
- Expose a download/print action that produces a ready-to-print file.

## 5. End-to-end UX, tests, and documentation
- Wire upload, processing, preview, and print into one guided flow in the frontend.
- Add focused tests for the upload, processing, and print path.
- Update docs so contributors understand the full flow and the branch split.

## Suggested branch pattern
- `feature/upload-intake`
- `feature/bg-remove-center`
- `feature/passport-compliance`
- `feature/print-sheet`
- `feature/end-to-end-polish`
