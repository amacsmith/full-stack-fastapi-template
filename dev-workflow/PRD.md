# Product Requirements Document (PRD)

## Product Title

### **Digital Human CEO Avatar — Real-Time AI-Powered Experience**

## Purpose

To create a highly realistic, real-time digital avatar of our CEO capable of interacting live on stage during conferences. This avatar will be trained using extensive internal media (e.g., podcasts, documents, videos) and deliver natural, high-quality responses to audience and interviewer questions. Launch target is a live demonstration at a key event on **August 21st**.

---

## Problem Statement

Executive leaders cannot be everywhere at once. Conferences and events often require their presence or input. We aim to replicate the presence of our CEO using a digital human avatar that can deliver highly accurate, real-time, personalized dialogue while preserving brand tone and leadership presence.

---

## GitHub Repository

- **Repository Name**: [looptech-ai/digital-human](https://github.com/looptech-ai/digital-human)
- **Template Used**: [looptech-ai/full-stack-fastapi-template](https://github.com/looptech-ai/full-stack-fastapi-template)
- **Reason**: This template provides a production-ready baseline for full-stack applications with FastAPI + React + Docker, aligning with our architecture.

The repo will be structured with clear README documentation, starter CI pipelines, and Cursor IDE rule configurations. Development will follow GitHub Actions CI/CD workflows defined by the template, and contributions will be made through structured pull requests with rule-enforced quality standards.

---

## Goals & Success Criteria

**Primary Launch Goal:**

- Full demo at conference on August 21st

**Success Metrics:**

- Real-time interaction latency under 1 second
- 90%+ question response accuracy (truthful, coherent)
- CEO satisfaction with performance and likeness
- Stable operation through at least 30 minutes of live interaction

---

## Target Users

1. **Live Audience**  
   - Conference participants watching on-screen
   - Passive viewers receiving responses vocally from avatar

2. **Interviewers (2 people)**  
   - On-stage humans using voice to ask questions
   - Can retry or pause interactions via simple local controls

3. **Internal Developers**  
   - Train/test avatar responses
   - Upload training data (podcasts, videos, docs)
   - Monitor and improve model performance

---

## MVP Features

### Core Functionality

- ✅ Real-time, high-accuracy Q&A based on enterprise-specific knowledge
- ✅ Live, human-like 3D or 2D avatar using synthesized CEO-like voice
- ✅ Audio ingestion from WebRTC stream
- ✅ Voice-based interaction with low latency
- ✅ Model training pipeline using company content (video, docs, audio)
- ✅ Developer admin panel for ingestion, fine-tuning, feedback loop
- ✅ Secure user auth, registration, and management (best practices)
- ✅ NVIDIA pipeline adoption (Omniverse, RIVA, NeMo, etc.)

### Content Upload

- Upload and manage internal podcasts, PDFs, videos
- Use UI for tagging, ingestion progress, and sync status

### Tech Stack

- **Frontend**: React (TypeScript) with dark theme UI, TailwindCSS
- **Backend**: FastAPI using Pydantic models for data validation and serialization
- **Realtime Media**: WebRTC (audio streaming in and out)
- **Database**: PostgreSQL with SQLModel (for structured relational data and extensibility)
- **Rendering**: NVIDIA Omniverse / Unreal Engine for digital avatar animation
- **Voice AI**: RIVA ASR/TTS for transcription and speech synthesis
- **Model**: LLaMA 3 (fine-tuned with NeMo + vector store retrieval)

---

## Development & Engineering Standards

### CursorRules & Cursor IDE Agent Integration

- Use Cursor's **Background Agent** to automatically lint, generate docstrings, enforce TDD structure, and monitor dev workflow
- Define **nested CursorRules** (<https://docs.cursor.com/context/rules>) for agents based on:
  - Module type (API, UI, Model, Agent)
  - Developer role (frontend, backend, ML)
  - Phase (drafting, refactoring, testing)
- Agent directives:
  - Enforce `test-first` structure in all pull requests
  - Propose code refactorings via inline comments
  - Suggest rule violations and highlight in diff views
  - Collect rule usage stats for internal best practice improvements

### Code Quality & Engineering Practices

- Enforce PEP8 (Python) and ESLint + Prettier (TypeScript)
- 100% type coverage (Python with Pydantic, TypeScript with strict mode)
- CI/CD via GitHub Actions: format, lint, test, deploy
- Git branching model: GitFlow or trunk-based depending on contributor count
- Repository initialization with commit hooks, `.cursor` config, and protected branches

### Documentation

- Full internal documentation via **MkDocs**, auto-generated from docstrings
- Developer onboarding with README + API reference site
- Diagram and data flow visualizations using Mermaid
- Cursor IDE integration with mkdocs.yaml generation and schema explorer indexing

---

## Implementation Workflow

### Frontend (React + TypeScript)

- Component architecture using Atomic Design
- Voice input UI for interviewers (WebRTC mic capture)
- Live transcript and avatar feedback display
- Upload dashboard for devs to ingest podcasts/videos/docs
- Auth + RBAC for secure access
- Cursor IDE nested rule: enforce testing and accessibility checks for every component

### Backend (FastAPI + Pydantic)

- REST API endpoints for:
  - Audio upload + streaming
  - Data ingestion
  - Avatar control
  - Auth + session mgmt
- Dependency Injection for modular logic
- Background tasks via Celery
- Cursor Background Agent watches for:
  - Data model validation rules
  - Async exception handling hygiene
  - Test coverage regression

### Database (PostgreSQL + SQLModel)

- Tables for:
  - Users, sessions, uploads, embeddings
  - Conversation history
  - Model config + metadata
- Indexed search over conversation and document embeddings
- Role-based permissions and extensibility for multi-event support

### Deployment

- Dockerized services with individual health checks
- Dev/stage/prod environments via GitHub Actions
- FastAPI + React served behind NGINX
- GPU-enabled compute (bare-metal PC or EC2 RTX) for inference/rendering
- Object storage (e.g., MinIO or AWS S3) for ingestion archive

### QA and Testing

- Pytest + Unittest for FastAPI
- Playwright for end-to-end frontend tests
- WebRTC bench for media streaming validation
- Test matrix: browser, latency, load, and fallback scenarios
- Cursor IDE tests view shows pass/fail across nested rules

---

## Enhancements (Post-MVP)

- 😄 Humor/joke detection and storytelling
- 🧠 Emotion-rich avatar animation (beyond mouth movements)
- 🧍 Ultra-human realism in facial gestures and responsiveness
- 🌍 Multi-language support and cultural adaptation
- 📜 Compliance, privacy, licensing enforcement
- 📎 Cursor background agent metrics dashboard for rule adoption

---

## Architecture Overview (Ref: NVIDIA Diagram)

Key modules:

- Audio Ingestion via WebRTC
- RIVA ASR → NeMo RAG System (trained on internal docs)
- Text-to-Speech (RIVA TTS)
- Animation Pipeline (3D/2D via Audio2Face + Omniverse)
- Chain Server & Retrieval-Augmented Generation (Llama3 + VectorDB)
- Developer Feedback + Model Evaluation Loop

---

## Timeline

**Now → Aug 1**  

- Finalize UI, pipeline integration, avatar rendering
- Complete training data ingestion tools

**Aug 1–15**  

- Full-stack QA, latency benchmarking, CEO review

**Aug 16–20**  

- Final dress rehearsal with stage/interviewers

**Aug 21**  

- 🎤 **Live debut at conference**

---

## Appendix

- NVIDIA architecture reference (attached image)
- Training sources: Podcast list, wiki export, video archive
- Model: Llama3 8B fine-tuned via NeMo Framework
- CursorRules: <https://github.com/PatrickJS/awesome-cursorrules>
- Cursor Agent Docs: <https://docs.cursor.com/background-agent>
- Cursor Context Rules: <https://docs.cursor.com/context/rules>
- Template Repository: <https://github.com/looptech-ai/full-stack-fastapi-template>
- Target Project Repo: <https://github.com/looptech-ai/digital-human>
