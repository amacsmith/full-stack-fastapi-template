# Digital Human CEO Avatar

A real-time AI-powered digital avatar system capable of live interaction during conferences, trained on executive content to deliver natural, high-quality responses.

## 🎯 Project Overview

This project creates a highly realistic digital avatar of our CEO that can interact in real-time during conferences and events. The avatar uses advanced AI and rendering technologies to provide authentic responses based on extensive training from internal media (podcasts, documents, videos).

**Target Launch**: August 21st Conference Demo

## ✨ Key Features

- **Real-time Interaction**: Sub-second latency for natural conversations
- **AI-Powered Responses**: LLaMA 3 fine-tuned on company-specific content
- **Voice Synthesis**: NVIDIA RIVA for natural speech generation
- **3D Avatar Rendering**: NVIDIA Omniverse/Unreal Engine integration
- **WebRTC Streaming**: Real-time audio input/output
- **Content Management**: Upload and process training materials (videos, docs, podcasts)
- **Developer Dashboard**: Monitor performance and manage training data

## 🛠️ Tech Stack

### Frontend
- **Framework**: React TypeScript
- **Styling**: TailwindCSS with dark theme
- **Real-time**: WebRTC for audio streaming
- **Testing**: Jest, React Testing Library, Playwright

### Backend
- **Framework**: FastAPI with Pydantic
- **Database**: PostgreSQL with SQLModel
- **ML Pipeline**: NVIDIA NeMo, RIVA, Omniverse
- **LLM**: LLaMA 3 (8B) with RAG
- **Testing**: Pytest with full coverage

### Infrastructure
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Deployment**: GPU-enabled compute (RTX)
- **Storage**: MinIO/S3 for media assets

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- NVIDIA GPU with CUDA support
- Node.js 18+ and Python 3.11+
- UV or pip for Python package management

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/looptech-ai/digital-human.git
   cd digital-human
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   uv venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Start development servers**
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d
   
   # Or run individually
   # Backend: uvicorn app.main:app --reload
   # Frontend: npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
digital-human/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configuration
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── ml/           # ML pipelines
│   └── tests/            # Backend tests
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── views/        # Page views
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   └── tests/            # Frontend tests
├── dev-workflow/         # Development docs
│   ├── PRD.md           # Product requirements
│   └── rules.md         # Development rules
├── docker-compose.yml    # Docker configuration
└── docs/                # MkDocs documentation
```

## 🧪 Testing

```bash
# Backend tests
cd backend && pytest --cov=app

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

## 📚 Documentation

Comprehensive documentation is available at:
- Development: Run `mkdocs serve` and visit http://localhost:8001
- API Reference: http://localhost:8000/docs

## 🤝 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) and follow the development rules in `dev-workflow/rules.md`.

## 📄 License

This project is proprietary software. All rights reserved. No license is granted for use, modification, or distribution.

## 🔒 Security

For security concerns, please refer to [SECURITY.md](SECURITY.md) or contact the security team directly.

## 👥 Team

- **Project Lead**: [Your Name]
- **ML Engineers**: [Team Members]
- **Frontend Engineers**: [Team Members]
- **Backend Engineers**: [Team Members]

## 📞 Support

For questions or support:
- Internal Slack: #digital-human-project
- Email: digital-human@company.com
