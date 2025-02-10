# Kids Book Creator

## Overview
Kids Book Creator is an interactive platform that allows users to create personalized children's books.

## Features
- User authentication system
- Book creation and editing
- Character customization
- Real-time book preview
- Multiple visual themes
- Book sharing capabilities
- Multi-language support
- Automatic backup system

## Technical Stack
- Frontend: React Native/Expo with TypeScript
- Backend: Node.js with TypeScript
- Database: MongoDB
- Authentication: JWT-based

## Recent Updates
- Authentication system improvements
  - Implemented Singleton pattern for AuthService
  - Improved token management and persistence
  - Added detailed logging for debugging
  - Fixed token persistence issues

## Development Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run the development servers:
   - Backend: `npm run dev:backend`
   - Frontend: `npm run dev:frontend`

## Project Structure
```
/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── screens/
    │   └── services/
```

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
