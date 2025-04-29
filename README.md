# Smart Notes

Smart Notes is an AI-powered note-taking application that helps users create, organize, and search their notes more effectively. The application provides advanced features such as voice recording transcription, PDF attachment support, and semantic search capabilities.

## Project Structure

The project consists of two main components:
- **Frontend**: Mobile app built with Expo/React Native
- **Backend**: FastAPI server with AI capabilities

## Features

- **Note Management**: Create, edit, and delete notes
- **Rich Text Editing**: Markdown-based note editor
- **Voice Recording**: Record and transcribe voice notes
- **Document Support**: Attach and extract content from PDF files
- **AI-powered Search**: Semantic search across notes, voice recordings, and documents
- **Authentication**: Google OAuth integration

## Technologies

### Frontend
- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS (via NativeWind)
- **Navigation**: Expo Router
- **Authentication**: Google Sign-In

### Backend
- **Framework**: FastAPI
- **Database**: SQLModel (SQLAlchemy ORM)
- **Vector Database**: ChromaDB
- **AI Integration**: OpenAI, Google Generative AI
- **Speech Recognition**: AssemblyAI
- **Authentication**: JWT-based with Google OAuth

## Project Structure

### Backend
- `app/main.py`: Main application entry point
- `app/ai.py`: AI-related functionality
- `app/routers/`: API endpoints
- `app/core/`: Core functionality including database models and security
- `app/repositories/`: Data access layer

### Frontend
- `app/src/app/`: Main app screens and navigation
- `app/src/components/`: Reusable UI components
- `app/src/redux/`: State management
- `app/src/services/`: API service clients
- `app/src/hooks/`: Custom React hooks

