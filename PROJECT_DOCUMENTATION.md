# Gramika News Project Documentation

## 1. System Overview & Architecture

### High-Level Architecture
The system is a Next.js web application integrated with Sanity CMS for content management.

```
┌─────────────────────────────────────────────────────────────────┐
│                         SANITY CMS                              │
│                    (Content Management)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                           │
│                   (/pages/api/sanity/)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                             │
│                   (Frontend Display)                            │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend/CMS**: Sanity.io
- **Authentication**: NextAuth.js (Google OAuth)
- **Language**: TypeScript

### Key Directories
- `/pages`: Next.js pages and API routes
- `/pages/admin`: Custom admin panel pages
- `/pages/components`: Reusable UI components
- `/sanity`: Sanity configuration and schemas
- `/public`: Static assets

---

## 2. Admin Guide

### Access
- **URL**: `/admin/login`
- **Authorized User**: `gramikaweb@gmail.com` (via Google Sign-In)

### Features
1.  **Top Stories**: Manage main news articles (Title, Slug, Author, Excerpt, Category, Featured).
2.  **Local News**: Manage community news with ordering.
3.  **Latest News Widget**: Manage the sidebar "Latest News" ticker.
4.  **Hero Section**: Customize the homepage hero section (Greeting, Messages).
5.  **Doctors**: Manage doctor listings (Name, Specialization, Hospital, Availability).
6.  **Obituaries**: Manage obituary notices (Name, Age, Place, Funeral Details).
7.  **Advertisements**: Manage ads with position targeting (Sidebar Top, Sidebar Middle, Banner) and scheduling.

### Pro Tips
- Use **Sanity Studio** (`/studio`) for advanced content editing (rich text, image uploads).
- Use the **Admin Panel** for quick updates, toggling visibility, and managing structured data like doctors/obituaries.

---

## 3. Setup & Development

### Prerequisites
- Node.js (v18+)
- Sanity Project ID & Dataset

### Environment Variables (`.env.local`)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```

### Deployment
The application is designed to be deployed on Vercel or any Next.js compatible hosting. Ensure environment variables are set in the production environment.

---

## 4. API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sanity/topStories` | GET | Fetch all top stories |
| `/api/sanity/story?slug=...` | GET | Fetch single story by slug |
| `/api/sanity/localNews` | GET | Fetch local news |
| `/api/sanity/doctors` | GET | Fetch active doctors |
| `/api/sanity/obituaries` | GET | Fetch active obituaries |
| `/api/sanity/advertisement` | GET | Fetch ad by position |

---

## 5. Future Roadmap
- [ ] Implement search functionality
- [ ] Add related posts recommendation
- [ ] Enable comments system
- [ ] Add analytics integration
