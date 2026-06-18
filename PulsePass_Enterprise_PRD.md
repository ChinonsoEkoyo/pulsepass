# PulsePass — Enterprise Product Requirements Document (PRD)

## Document Information

- Product: PulsePass
- Version: 3.0
- Status: MVP Definition
- Author: Design Engineering Capstone Project
- Last Updated: June 2026

---

# Executive Summary

PulsePass is a modern event infrastructure platform that enables organizers to create, manage, market, and monetize events while providing attendees with a seamless ticket purchasing and check-in experience.

Unlike traditional event workflows that rely on WhatsApp, spreadsheets, and manual payment verification, PulsePass centralizes the entire event lifecycle in one platform.

Core capabilities include:

- Event creation and publishing
- Online ticket sales
- RSVP management
- QR-code ticket validation
- Payment processing
- Revenue reporting
- Attendee management
- Event analytics

---

# Product Vision

Become the leading event operating system for African creators, communities, churches, educational institutions, brands, and entertainment organizers.

---

# Product Strategy

## North Star Metric

Total Successful Event Attendees

This metric measures:

- Organizer success
- Ticket conversion
- Event attendance
- Platform growth

## Strategic Pillars

1. Event Creation Simplicity
2. Frictionless Ticket Purchasing
3. Reliable Check-In Experience
4. Actionable Organizer Insights
5. Mobile-First African Experience

---

# Problem Analysis

## Current Workflow

Organizer
→ Creates Flyer
→ Shares on WhatsApp
→ Receives Transfers
→ Manually Verifies Payments
→ Tracks Attendees in Spreadsheet

Problems:

- Fraud
- Human error
- Lost records
- No analytics
- Poor attendee experience

---

# Competitive Analysis

| Feature          | Eventbrite | Resident Advisor | PulsePass |
| ---------------- | ---------- | ---------------- | --------- |
| Online Payments  | Yes        | Yes              | Yes       |
| RSVP             | Yes        | Limited          | Yes       |
| QR Check-In      | Yes        | Yes              | Yes       |
| Mobile First     | Moderate   | Moderate         | High      |
| African Payments | Weak       | Weak             | Strong    |
| Community Events | Moderate   | Low              | Strong    |

---

# Target Users

## Organizer

Responsibilities:

- Create events
- Manage attendees
- Monitor sales
- Validate entry

Goals:

- Sell tickets
- Increase attendance
- Reduce fraud

## Attendee

Goals:

- Discover events
- Purchase tickets quickly
- Receive instant confirmation

## Administrator

Goals:

- Maintain platform health
- Resolve disputes
- Monitor payments

---

# User Personas

## Sarah - Community Organizer

Age: 32

Pain Points:

- Payment verification
- Spreadsheet management
- Attendee tracking

Goals:

- Professional event operations

---

## Daniel - Event Attendee

Age: 24

Pain Points:

- Slow checkout
- Lost tickets

Goals:

- Easy discovery
- Fast booking

---

# User Journey Maps

## Attendee Journey

Discover Event
→ View Details
→ Select Ticket
→ Checkout
→ Payment
→ Ticket Delivery
→ Event Attendance
→ QR Validation

## Organizer Journey

Sign Up
→ Create Event
→ Publish Event
→ Track Sales
→ Scan Tickets
→ Review Analytics

---

# Information Architecture

Public

- Home
- Events
- Event Details
- Checkout
- Login
- Register

Organizer Dashboard

- Overview
- Events
- Create Event
- Attendees
- Analytics
- Revenue
- Scanner
- Settings

Admin Dashboard

- Users
- Events
- Transactions
- Reports
- Moderation

---

# Feature Requirements

## Epic 1: Authentication

### User Story

As a user
I want to register and login
So that I can access platform features.

### Acceptance Criteria

- Email registration works
- Google login works
- Password reset works
- Email verification required

---

## Epic 2: Event Creation

### User Story

As an organizer
I want to create events
So that attendees can discover them.

### Required Fields

- Event Name
- Description
- Banner
- Venue
- Date
- Time
- Category
- Ticket Types

### Acceptance Criteria

- Save draft
- Publish event
- Edit event
- Delete event

---

## Epic 3: Event Discovery

### Requirements

- Search
- Filters
- Categories
- Trending Events
- Featured Events

### Acceptance Criteria

- Results load under 2 seconds
- Filters update correctly

---

## Epic 4: Ticket Purchase

### Flow

Event
→ Select Ticket
→ Checkout
→ Flutterwave
→ Verification
→ Ticket Creation

### Acceptance Criteria

- Successful payment creates ticket
- Failed payment creates no ticket

---

## Epic 5: RSVP

### Requirements

- RSVP registration
- Capacity tracking
- Confirmation email

---

## Epic 6: QR Validation

### Validation States

- Valid
- Invalid
- Already Used

### Acceptance Criteria

- Single-use tickets
- Validation under 2 seconds

---

# Detailed Screen Inventory

## Public Screens

1. Landing Page
2. Event Listing
3. Event Details
4. Checkout
5. Login
6. Register
7. Ticket Confirmation

## Organizer Screens

1. Dashboard
2. Event Management
3. Create Event
4. Attendee Management
5. Analytics
6. Revenue Dashboard
7. Scanner

## Admin Screens

1. User Management
2. Event Moderation
3. Transaction Monitoring
4. Reports

---

# Database Design

## Users

- id
- name
- email
- role
- avatar_url
- created_at

## Events

- id
- organizer_id
- title
- description
- category
- location
- banner_url
- status
- date_time

## Tickets

- id
- event_id
- name
- price
- quantity

## Orders

- id
- user_id
- event_id
- amount
- payment_status

## TicketInstances

- id
- order_id
- qr_code
- validation_status

## RSVPs

- id
- event_id
- user_id

---

# Analytics Framework

## Events To Track

Authentication

- Sign Up
- Login

Organizer

- Event Created
- Event Published
- Event Updated

Attendee

- Ticket Purchased
- RSVP Submitted
- Ticket Viewed

Operations

- Ticket Scanned
- Payment Failed

---

# Security Requirements

## Authentication

- JWT
- Refresh Tokens

## Infrastructure

- HTTPS
- Encryption At Rest
- Secure Cookies

## Database

- Row Level Security
- Role Permissions

## Abuse Prevention

- Rate Limiting
- CAPTCHA
- Input Validation

---

# Accessibility Requirements

Target: WCAG 2.2 AA

Requirements:

- Keyboard Navigation
- Focus States
- Screen Reader Support
- Semantic HTML
- Contrast Compliance

---

# Design System Requirements

## Typography

- Inter
- Satoshi
- General Sans

## Components

- Buttons
- Forms
- Inputs
- Cards
- Tables
- Charts
- Dialogs
- Drawers
- Tabs

## Design Principles

- Clarity
- Trust
- Speed
- Delight

---

# Technical Architecture

Frontend:

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

Backend:

- Supabase
- Edge Functions

Payments:

- Flutterwave

Storage:

- Supabase Storage

Hosting:

- Vercel

---

# MVP Definition

Must Have:

- Authentication
- Event Creation
- Event Discovery
- Payments
- RSVP
- QR Tickets
- Analytics

Should Have:

- Email Notifications
- CSV Export

Could Have:

- Promo Codes
- Referral Links

Won't Have:

- Mobile Apps
- Seat Reservations

---

# Release Plan

Phase 1

- Design System
- Authentication
- Database

Phase 2

- Event Creation
- Event Discovery

Phase 3

- Payments
- Ticketing

Phase 4

- Analytics
- QR Scanner

Phase 5

- Optimization & Launch

---

# Portfolio Outcomes

This project demonstrates:

- Product Thinking
- UX Strategy
- Design Systems
- Full Stack Development
- Payment Integration
- Analytics Design
- Database Architecture
- Dashboard Design
- Scalable System Design

---

# Product Pitch

PulsePass is a modern event operating system that helps organizers create, manage, and monetize events while providing attendees with a seamless ticket purchasing and check-in experience.
