# 🧠 Second Brain – Semantic Knowledge Management Web App

## 📘 Overview

**Second Brain** is a web application that helps users collect, organize, and retrieve content like notes, videos, tweets, and documents in a smart, taggable, and shareable way. With AI-powered semantic search, users can find information based on meaning, not just keywords.

### 🌟 Core Features

- 📝 Store and manage diverse content types (text, videos, tweets, links, etc.)
- 🏷️ Tag and organize your content
- 🔗 Share your knowledge base via public links
- 🧠 Semantic AI search powered by embeddings

---

## 🛠️ Tech Stack

### Frontend
- **React.js** + **TypeScript**
- **TailwindCSS** or **Chakra UI** for styling
- **Axios** for API calls

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Bcrypt** for password hashing
- **OpenAI** or **sentence-transformers** for AI semantic search

---

## 🗃️ MongoDB Schema Design

### 🧑 User
```ts
{
  _id: ObjectId,
  username: string,
  password: string
}
```

### 🏷️ Tag
```ts
{
  _id: ObjectId,
  title: string
}
```

### 📄 Content
```ts
{
  _id: ObjectId,
  title: string,
  link?: string,
  type: 'text' | 'tweet' | 'video' | 'document',
  tags: ObjectId[],
  userId: ObjectId,
  embedding?: number[] // For AI semantic search
}
```

### 🔗 Link (for public sharing)
```ts
{
  _id: ObjectId,
  hash: string,
  userId: ObjectId
}
```

---

## 🔐 Backend Features

### 🧾 Authentication
- `POST /auth/signup` – Register new user
- `POST /auth/signin` – Authenticate and return JWT

### 📄 Content Management
- `POST /content` – Create content (title, type, tags, link optional)
- `GET /content` – Fetch all content for logged-in user
- `DELETE /content/:id` – Delete content
- `PUT /content/:id` – Update content (optional: regenerate embedding)

### 🏷️ Tags
- `GET /tags` – Get all tags
- `POST /tags` – Add a new tag

### 🔗 Sharing
- `POST /share` – Generate public hash for user’s content
- `GET /share/:hash` – View shared content

### 🔍 AI Semantic Search
- `POST /search/semantic`  
  **Body:** `{ query: string }`  
  **Returns:** Top N semantically similar notes  
  Uses cosine similarity with precomputed embeddings.

---

## ⚙️ AI Embedding Options

### 🔹 Using OpenAI (Recommended)
```ts
const embedding = await openai.createEmbedding({
  model: "text-embedding-3-small",
  input: title + " " + description
});
```

### 🔸 Using sentence-transformers (Alternative)
- Use `all-MiniLM-L6-v2` for local generation
- Store 384-dim or 768-dim vectors in MongoDB

---

## 🖥️ Frontend Features

### 🔐 Pages
- Sign In / Sign Up
- Dashboard with note cards
- Add Note form (title, tags, type, link)
- Smart Search (semantic query input)
- Filter by Tags
- Share Brain – Copy shareable link
- View Shared Brain – Public access to notes

### 🧩 Components
- Smart Search Bar
- Tag Sidebar with filtering
- AI Search Toggle
- Note Cards with type icons
- Share Link Modal

---

## 🧠 Bonus (Stretch Goals)

- 🌗 Light/Dark Mode
- 🔄 Infinite Scroll or Pagination
- 🔗 Rich Embeds (YouTube, Twitter, etc.)
- 📝 Markdown Support
- 👥 Real-time Collaboration
- 🧲 Drag-and-Drop Note Sorting

---

## 🗂️ Suggested Folder Structure

### `client/` (React + TypeScript)
```
components/
  - NoteCard.tsx
  - TagSidebar.tsx
  - ShareModal.tsx

pages/
  - Dashboard.tsx
  - Login.tsx
  - Signup.tsx
  - SharedBrain.tsx

api/
  - content.ts
  - auth.ts
  - share.ts

utils/
  - auth.ts
  - search.ts
```

### `server/` (Express + TypeScript)
```
controllers/
  - auth.ts
  - content.ts
  - share.ts
  - search.ts

models/
  - User.ts
  - Tag.ts
  - Content.ts
  - Link.ts

routes/
  - auth.ts
  - content.ts
  - share.ts
  - search.ts

services/
  - embeddingService.ts
  - authService.ts
```

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/second-brain.git
cd second-brain
```

### 2. Install Dependencies
**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Setup Environment Variables
Create `.env` files for both frontend and backend with appropriate keys (e.g., Mongo URI, JWT secret, OpenAI key).

### 4. Run the App
```bash
# In server/
npm run dev

# In client/
npm run dev
```

---

## 📬 Contributing

Pull requests are welcome! Please open an issue first to discuss any major changes.

---

## 📄 License

MIT License

---

## 📫 Contact

Questions or feedback? Reach out on [aymehta04@gmail.com] or open an issue.
