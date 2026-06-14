# LEEA Codebase Overview

This document provides a high-level overview of the Leo's Elite Education Academy (LEEA) repository for developers. LEEA is an educational platform designed to support English (and eventually Math/Science) learning, following the National Geographic "Our World" curriculum.

## 1. High-Level Architecture

LEEA is built as a **Modern Monolith** using **Next.js 15** and **React 19**.

*   **Framework**: Next.js (App Router) for routing and SSR.
*   **Language**: TypeScript for type safety.
*   **State & Persistence**: Currently follows a **Local-First** model using `localStorage` for cross-tab communication and data persistence (progress, assignments, "I Know" states). Integration with **Supabase** is planned for future backend synchronization.
*   **Content Model**: "Reference-First". Learning content is derived from a shared reference layer of vocabulary and grammar points.
*   **Lesson Delivery**: Lessons are hosted as standalone **HTML/CSS/JS slides** in the `public/` directory and embedded via `iframes`.

## 2. Codebase Entry Points

*   **Root Layout (`src/app/layout.tsx`)**: The global entry point that sets up the HTML document.
*   **App Shell (`src/components/AppShell.tsx`)**: The primary UI wrapper. It manages the sidebar, navigation, global Japanese translation toggle, and listens for `localStorage` changes to update badges (e.g., assignment counts).
*   **Home Dashboard (`src/app/page.tsx`)**: The initial view for all users, providing a high-level overview of subjects and academy-wide stats.
*   **Learner Dashboard (`src/app/leo/page.tsx`)**: The primary entry point for the student (Leo) to see and start assignments.
*   **Teacher Dashboard (`src/app/teacher/page.tsx`)**: The management view for the teacher (Neritan) to assign lessons and review progress.
*   **Lesson Viewer (`src/app/lessons/[lessonId]/page.tsx`)**: The dynamic route that renders specific lessons by embedding their HTML source into a `LessonPage` component.

## 3. Module & Component Relationships

The project is organized into four main pillars:

*   **`content/`**: The **Source of Truth**. Contains JSON data for vocabulary, grammar, and lesson metadata. It also holds the registry of subjects and courses.
*   **`src/data/`**: The **Data Access Layer**. These modules (e.g., `reference.ts`, `lessons.ts`) import the raw JSON from `content/` and export typed objects, filter logic, and lookup helpers.
*   **`src/components/`**: The **UI Layer**. React components that consume data from `src/data/` and provide interactivity. Notable components include `AppShell`, `LessonPage`, and `VocabularyCardPage`.
*   **`public/lessons/`**: The **Content Payload**. Contains the interactive HTML/JS slide decks that actually deliver the curriculum.

## 4. Key Data Flows

### A. The Assignment & Progress Loop
1.  **Assign**: The Teacher (`TeacherDashboard`) updates an assignment status in `localStorage`.
2.  **Notify**: The `AppShell` and dashboards listen for the `storage` event and update their state.
3.  **Perform**: The Learner (`LeoDashboard`) opens a lesson. The iframe lesson script writes progress (e.g., `m1-done: true`) directly to `localStorage` using a unit-specific prefix.
4.  **Reflect**: The dashboards call `getLearnerAppProgress` (`src/data/learnerProgress.ts`) to read these keys and update progress bars and scores in real-time.

### B. Reference Data Flow
1.  **Definition**: A word is added to a unit's `vocabulary.json` file.
2.  **Aggregation**: `src/data/reference.ts` merges words across all units into a single global vocabulary list.
3.  **Consumption**: The `/reference/vocabulary/[wordId]` route uses `getVocabularyById` to display the card.
4.  **Confidence Tracking**: Users mark a word as "I Know". This updates `leea.referenceConfidence.v1` in `localStorage` via the `useKnownWordIds` hook.

## 5. Technical Debt & Improvements

### Immediate Areas for Improvement
*   **Registry Hardcoding**: Academy stats in `src/data/registry.ts` are currently static numbers. These should be dynamically calculated from the `content/` and `localStorage` state.
*   **Manual Lesson Registration**: Adding a lesson requires creating a JSON file in `content/` AND manually importing/adding it to the array in `src/data/lessons.ts`.
*   **Iframe Communication**: Lessons currently talk directly to `localStorage`. Moving to `postMessage` would allow for better security and native React state integration.
*   **Japanese Translation Redundancy**: Translation strings are sometimes duplicated between the `japanese` object and top-level `jp_` keys in the vocabulary JSON.

### Technical Debt
*   **Static Imports**: As the academy grows to hundreds of units, importing all JSON files into a single bundle will become a bottleneck. Move toward dynamic imports or an API.
*   **Validation Overhead**: The `validate:content` script is powerful but requires manual runs. It should be integrated into the CI/CD pipeline.
*   **CSS Isolation**: While global styles are kept in `globals.css`, complex component styling would benefit from CSS Modules or Tailwind to prevent collisions.

---
*Created by Jules, Principal Software Engineer.*
