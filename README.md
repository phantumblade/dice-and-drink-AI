<div align="center">
  <img width="1200" height="475" alt="Dice & Drink Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # Dice & Drink Modern
  
  **A Next-Generation Management Platform for Gaming Pubs**

  [![GitHub stars](https://img.shields.io/github/stars/phantumblade/dice-and-drink-AI?style=social)](https://github.com/phantumblade/dice-and-drink-AI/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/phantumblade/dice-and-drink-AI?style=social)](https://github.com/phantumblade/dice-and-drink-AI/network/members)
  [![GitHub issues](https://img.shields.io/github/issues/phantumblade/dice-and-drink-AI)](https://github.com/phantumblade/dice-and-drink-AI/issues)
  [![License](https://img.shields.io/github/license/phantumblade/dice-and-drink-AI)](https://github.com/phantumblade/dice-and-drink-AI/blob/main/LICENSE)
  [![Last Commit](https://img.shields.io/github/last-commit/phantumblade/dice-and-drink-AI)](https://github.com/phantumblade/dice-and-drink-AI/commits/main)

</div>

---

## 📖 About The Project

**Dice & Drink Modern** is a comprehensive web application designed to modernize the experience of managing and visiting a gaming pub. It bridges the gap between physical social gaming and digital convenience, offering a seamless interface for customers to book tables, join tournaments, and manage their Dungeons & Dragons campaigns, while providing staff with powerful tools for administration.

Built with a focus on aesthetics and user experience, the platform features a "Neo-Modern" design language, utilizing vibrant colors, glassmorphism, and smooth animations to create an immersive digital environment.

## 🛠️ Tech Stack

This project leverages a modern, robust technology stack to ensure performance, scalability, and developer experience.

### Frontend
*   ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React 19** - The library for web and native user interfaces.
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript** - Strongly typed JavaScript for better tooling and error prevention.
*   ![Vite](https://img.shields.io/badge/Vite-B73C9D?style=for-the-badge&logo=vite&logoColor=white) **Vite** - Next Generation Frontend Tooling.
*   ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS** - A utility-first CSS framework for rapid UI development.
*   ![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=for-the-badge&logo=react&logoColor=white) **Recharts** - Redefined chart library built with React and D3.

### Backend
*   ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** - JavaScript runtime built on Chrome's V8 engine.
*   ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) **Express** - Fast, unopinionated, minimalist web framework for Node.js.
*   ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) **Prisma** - Next-generation Node.js and TypeScript ORM.
*   ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white) **SQLite** - C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.

### AI Integration
*   ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white) **Google Gemini API** - Powering the intelligent in-app assistant.

## ✨ Key Features

### 🔐 Advanced Authentication
Secure user management with role-based access control (RBAC).
- **Roles**: Guest, Customer, Staff, Admin.
- **Profile**: Customizable user profiles with avatars and stats.

### 🏆 Tournament System
A complete ecosystem for competitive play.
- **Browse & Join**: Filter tournaments by type (Standard, D&D, Party, Blitz).
- **Management**: Admins can create, update, and manage tournament slots.
- **Visuals**: Rich cards with dynamic status indicators.

### 🐉 D&D Campaign Tracker
Specialized tools for Dungeon Masters and adventurers.
- **Campaigns**: Create and manage campaigns with lore, notes, and session logs.
- **Characters**: Track character stats, status (Alive/Dead), and progression.
- **Sessions**: Schedule and summarize game sessions.

### 🛍️ Digital Catalog & Booking
Streamlined ordering and reservation system.
- **Products**: Browse games, drinks, and snacks with filtering options.
- **Booking**: Reserve tables for specific dates and times.
- **Cart**: Manage selected items and bookings before checkout.

### 📊 Admin Dashboard
Powerful analytics for business owners.
- **Stats**: Visual charts for revenue, user growth, and popular items.
- **Management**: Quick access to user and content management.

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/phantumblade/dice-and-drink-AI.git
    cd dice-and-drink-AI
    ```

2.  **Install Frontend Dependencies**
    ```sh
    npm install
    ```

3.  **Install Backend Dependencies**
    ```sh
    cd server
    npm install
    ```

4.  **Environment Setup**
    *   Create a `.env.local` file in the root directory for frontend keys (e.g., `VITE_GEMINI_API_KEY`).
    *   Create a `.env` file in the `server` directory for backend keys (e.g., `DATABASE_URL`, `JWT_SECRET`).

5.  **Database Setup**
    ```sh
    # Inside /server directory
    npx prisma migrate dev --name init
    npm run seed # Optional: Seed with initial data
    ```

6.  **Run the Application**
    *   **Backend**: `npm run dev` (inside `/server`)
    *   **Frontend**: `npm run dev` (inside root)

## 📂 Project Structure

```
dice-and-drink-AI/
├── src/
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React Context for state management
│   ├── pages/        # Main application pages (Home, Catalog, etc.)
│   ├── services/     # API integration services
│   └── types.ts      # TypeScript definitions
├── server/
│   ├── prisma/       # Database schema and seeds
│   ├── src/
│   │   ├── routes/   # Express API routes
│   │   └── app.ts    # Server entry point
│   └── package.json
├── public/           # Static assets
└── package.json      # Frontend dependencies
```

## 🤝 Acknowledgements

*   [Lucide React](https://lucide.dev/) for the beautiful icons.
*   [Recharts](https://recharts.org/) for the data visualization.
*   [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities.
*   [Vite](https://vitejs.dev/) for the lightning-fast build tool.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/phantumblade">PhantumBlade</a>
</div>
