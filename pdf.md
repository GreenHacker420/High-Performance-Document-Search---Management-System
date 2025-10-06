# Full-Stack Internship Assignment: High-Performance Document Search & Management System

## Objective

Design, implement, and document a robust, highly efficient, and modern web application that centralizes various data types and provides a high-speed, accurate search interface.

---

## Project Concept: Document Search & Indexing System

The goal of this project is to provide end-users with a centralized, instantly searchable repository of institutional knowledge (Web Links, PDFs, and FAQs).
A key design requirement is that the system must be built with efficiency and scalability in mind, especially regarding content indexing and search response time.

---

## Technical Stack (Mandatory)

| Layer         | Technology                   | Usage Focus                                  |
| ------------- | ---------------------------- | -------------------------------------------- |
| Backend       | Node.js                      | API development, data processing, robustness |
| Database      | PostgreSQL (`pg` library)    | Efficient data modeling and search           |
| API Framework | Express.js                   | RESTful services                             |
| Admin UI      | React with Ant Design (AntD) | Rapid prototyping and polished tooling       |
| Public UI     | React (via Vite)             | High-performance, responsive UX              |

---

## Backend & Data Architecture

### 1. Database Schema Design (PostgreSQL)

* Design a normalized SQL schema for the application.
* **Performance**: Use PostgreSQL features (indexes, constraints) for fast lookups and joins.
* **Challenge**: Implement full-text indexing to index content of all data types.

### 2. API Development (Node.js/TypeScript/Express)

* Develop well-typed, robust RESTful endpoints for CRUD operations on **Links, FAQs, PDFs**.
* **Content Processing API**: Handle PDF file uploads, automatically extract plain text content (and web page text) for indexing, and store alongside metadata.

---

## Admin Dashboard (CRUD Operations)

Built using React + AntD to provide a secure interface.

### 3. Data Management Interfaces

* **FAQ Management**: Add, edit, delete FAQs (Title, Content, Tags).
* **Web Link Management**: Add, edit, delete links (URL, Title, Description).
* **PDF Management**: Upload, view metadata, delete PDFs. Show visual feedback during upload & processing.
* **Efficient Display**: Pagination, server-side sorting, and filtering for thousands of records.

---

## Public Search Interface

The most critical component — the search experience must feel instantaneous and accurate.

### 4. High-Performance Search Implementation

* A single search bar queries content across **Links, PDFs, FAQs**.
* Present the most relevant results first, based on **full-text ranking**.

### 5. Efficient Results Display

* Display search results in a clean, responsive layout.
* **Filtering/Faceting**: Allow users to narrow results by data type (Link, FAQ, PDF) — must be fast and update instantly (no full reload).
* **Result Presentation**:

  * FAQs: Show question + truncated answer snippet.
  * Web Links: Show title, short description, and a call-to-action link.
  * PDFs: Show file name + secure/streamed link to access the document (inline viewer is a bonus).

---

## Critical Requirements

The solution will be evaluated on:

1. **Performance**: Search should return results in **<200ms** for typical queries.
2. **Architectural Efficiency & Research**: Use PostgreSQL full-text search as baseline, but explore best tools for search.
3. **Code Quality (TypeScript)**: Strong typing for backend models and request/response structures.
4. **User Experience (UX)**: Public Search Interface must be highly responsive.

---

## Notes

This assignment is designed to evaluate not just coding ability, but also critical thinking in architecture and design to deliver a **fast and accurate product**.
**Good luck!**
