# Insider

**Insider** is a modern, data-driven  platform built with **Next.js**, designed to provide startups and businesses with actionable insights derived from structured interviews. It offers an intuitive onboarding experience, real-time analytics, and dynamic visualization of interview data — all in one seamless dashboard.

---

## Demo Video

## 🎥 Demo Video

<p align="center">
  <a href="https://youtu.be/-Cl7urpgD2E" target="_blank">
    <img src="https://img.youtube.com/vi/-Cl7urpgD2E/maxresdefault.jpg" 
         alt="Watch the Demo Video" 
         width="80%" 
         style="border-radius:12px;">
  </a>
</p>


## Overview

The platform serves as an **interactive dashboard** that connects **startups**, **businesses**, and **interviewees** through a streamlined insight-gathering workflow.

### User Flow

#### **1. Landing Page**
Upon visiting the site, users are greeted with two primary options:
- **For Startups / Businesses:** Access the insight generation dashboard.
- **For Interviewees:** Join or complete an assigned interview.

#### **2. Startup / Business Flow**
1. **OAuth Authentication** – The user logs in using their preferred provider (Google, GitHub, etc.).
2. **Onboarding** – A guided onboarding process collects essential startup/business information.
3. **Interview Link Generation** – A shareable link is created, allowing the startup to invite participants for interviews.
4. **Interview Session** – Interviewees complete the structured interview via the provided link.
5. **Insight Dashboard** – Once interviews are completed, the dashboard automatically updates with detailed insights, visualized using:
   - Dynamic charts and graphs  
   - Sentiment and keyword analysis  
   - Interview performance breakdowns  

---


---

## Installation & Setup

### 1. **Clone the repository**
```bash
git clone https://github.com/aliciacilmora/TF25
cd TF-25
```

### Docker command to run
```
docker run --name postgres_insight_ai \
  -e POSTGRES_USER=username \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=insight_ai \
  -p 5432:5432 \
  -d postgres:15
```


### Prisma commands to run
```
npx prisma generate && npx prisma db push
```
### Install dependencies
```
npm install
```

### Run frontend
```
npm run build && npm start
```
