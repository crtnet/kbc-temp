# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-02-10

### Added
- Implemented Singleton pattern in AuthService
- Added detailed logging throughout authentication flow
- Added session refresh functionality
- Added automatic token injection in API requests
- Added user data persistence in AsyncStorage

### Changed
- Improved token management and persistence
- Enhanced error handling in authentication processes
- Updated authentication initialization process
- Improved session state management

### Fixed
- Fixed token persistence issues
- Fixed authentication state synchronization
- Fixed token injection in API requests

## [0.3.0] - 2025-02-11

### Added
- Implemented AuthState singleton for centralized state management
- Added token refresh queue for handling concurrent requests
- Added automatic token refresh on 401 errors
- Added server-side logout handling
- Enhanced logging system with detailed error tracking

### Changed
- Refactored AuthService to use new AuthState manager
- Improved interceptors with request queue management
- Enhanced token refresh logic with retry mechanism
- Updated authentication flow with better error handling
- Improved session management with atomic state updates

### Fixed
- Fixed token not being maintained between requests
- Fixed race conditions in token refresh
- Fixed circular dependencies in auth system
- Fixed memory leaks in authentication state
- Fixed concurrent request handling during token refresh

## [Unreleased]

### Added
- Fixed circular dependency in auth system
- Added event-based auth error handling
- Separated API configuration from auth logic
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
- Async initialization in AuthService singleton
- Race condition in AuthContext initialization
- AuthService initialization and state management
- Promise handling in AuthService singleton
- User session persistence
- Error handling in authentication flow

## [0.1.0] - 2025-02-10

### Added
- Initial project setup
- Basic authentication system
- Frontend with React Native/Expo
- Backend with Node.js
- Basic project documentation