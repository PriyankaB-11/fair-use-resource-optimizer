# 🏢 Fair-Use Resource Optimizer

**Intelligent room and lab scheduling system for fair, equitable resource allocation.**

---

## 📋 Project Overview

Fair-Use Resource Optimizer is a full-stack application designed to **prevent resource monopolization** and ensure **equitable access** to rooms, labs, and meeting spaces. Unlike traditional booking systems, it calculates **fairness scores** and visualizes usage patterns to **maximize fairness** across all resources.

---

## 🎯 Problem Statement

Organizations often face:

- **Overused rooms:** Certain labs or rooms get booked repeatedly by the same groups.  
- **Underutilized spaces:** Some rooms remain empty while others are overcrowded.  
- **Lack of transparency:** Users don’t understand why rooms are unavailable.  
- **Manual conflict resolution:** Admins spend hours balancing schedules.  

---

## 💡 Solution

- **Fairness Scores:** AI-powered calculations based on historical usage, recent bookings, and utilization rates.  
- **Visual Heatmaps:** Green = fair, Red = overused.  
- **What-If Simulator:** Test booking reassignments before committing.  
- **Explainable AI:** See detailed breakdown of how scores are calculated.  
- **Auto-Optimization:** Suggestions to improve fairness across all rooms automatically.

---

## 🏗️ Architecture & Tech Stack

### **Frontend**
- React 18 + Vite
- Tailwind CSS
- Recharts (charts & graphs)
- Lucide React (icons)

### **Backend & Cloud (Google Technologies)**
- Firebase Firestore (real-time NoSQL database)
- Firebase Cloud Functions (serverless logic)
- Google Charts & Looker Studio (analytics & reporting)
- Optional: Google Sheets API (bulk data import)

---

## 🔥 Key Features

### **1. Fairness Heatmap Dashboard**
- Color-coded rooms by fairness score  
- Hover tooltips with score breakdown  
- Real-time updates on booking changes  

### **2. What-If Simulator**
- Select any booking and move it to another room  
- Instant recalculation of fairness scores  
- Explainable AI shows factor contributions  

### **3. Auto-Optimize Feature**
- One-click AI suggestions for reassigning bookings  
- Balances overused and underused rooms  
- Respects room capacity and constraints  

### **4. Statistics & Trend Visualization**
- Line charts for fairness over time  
- Bar charts for room comparison  
- Pie charts for room type distribution  
- KPI cards: total bookings, average fairness, utilization  

---

## 🧮 Fairness Algorithm

**Three-Factor Model**:

```text
Fairness Score = (Historical × 0.4) + (Booking × 0.3) + (Utilization × 0.3)

Historical Score: 100 - (historicalUsage × 0.4)
Booking Score: 100 - (recentBookings × 3)
Utilization Score: 40 (overcrowded) | 70 (moderate) | 90 (underutilized)
