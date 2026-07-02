# Feature: AI Background Removal & Face Centering Pipeline

This document tracks the tasks and specifications for the backend background removal and face centering microservice integration.

## Tasks
- [ ] Update backend controller in `image.controller.js` to route images to the Python AI service.
- [ ] Implement background removal in the Python service using `rembg`.
- [ ] Implement OpenCV face detection and cropping with bounding boxes to center the face with proper margin padding.
- [ ] Serve the processed image preview URL/stream back to the frontend page.
