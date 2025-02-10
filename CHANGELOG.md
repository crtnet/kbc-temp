# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Improved state management in AuthService
- User data persistence with auth state
- New signOut method in AuthService
- Enhanced error handling and logging
- Singleton pattern for AuthService
- Token verification endpoint
- Detailed logging for authentication flow
- Type definitions for authentication system

### Changed
- Refactored token management to use centralized AuthService
- Updated API interceptors to handle auth errors consistently
- Improved token persistence logic
- Consolidated auth storage keys

### Fixed
- Token persistence between app restarts
- Authentication state management
- Token validation on app initialization
- Inconsistent storage key names

## [0.1.0] - 2025-02-10

### Added
- Initial project setup
- Basic authentication system
- Frontend with React Native/Expo
- Backend with Node.js
- Basic project documentation