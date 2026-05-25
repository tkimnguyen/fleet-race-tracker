# Fleet Race Tracker

A lightweight, SMS-driven race participation tracking system designed for sailing fleets (e.g., Laser fleets). This system allows race organizers to poll skippers via SMS, track responses, send reminders, and notify the race judge — all with a static frontend hosted on GitHub Pages and a minimal backend.

---

## 🚀 Overview

This project provides:

- SMS polling of skippers (YES / NO + comments)
- Live dashboard for race participation
- Automated reminder system for non-responders
- Race schedule integration via Google Calendar (ICS)
- Multi-race history tracking
- CSV export of responses
- Full audit logging
- Secure admin interface with token-based authentication

---

## 🧱 Architecture

Frontend:
- GitHub Pages (static HTML/JS)

Backend:
- Serverless API
- Twilio SMS integration

Storage:
- JSON files per race

---

## ⚙️ Setup

1. Configure config.json with your calendar and backend URL
2. Deploy to GitHub Pages
3. Deploy backend endpoints
4. Configure Twilio webhook

---

## 🔐 Authentication

Admin access requires a token sent in the Authorization header.

---

## 📊 Features

- Race tracking and participation monitoring
- SMS response parsing
- Reminder engine
- Live dashboard with status indicators
- Audit logging
- Admin controls

---

## ✅ Summary

Low-cost SMS coordination tool with real-time visibility and audit tracking.
