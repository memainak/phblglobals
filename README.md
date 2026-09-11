# Purusottam Homoeo Bikash Laboratory (Bonded) — Web Platform & Batch Traceability System

A modern, clinical-grade corporate website and regulatory batch verification platform for **PHBL (Bonded)**, an ISO 9001:2015, GMP (Schedule M-I), and HACCP certified pharmaceutical manufacturer established in 2003 in Paschim Medinipur, West Bengal (Drug Mfg Lic: `HL-792 M`).

---

## 1. Key Features

- **Public Batch Traceability Portal (`/batches` & `/batches/[batchNo]`)**:
  - Implements the full statutory 11-point regulatory monograph (Unique Product Code, API Name, SSCC, Batch Size, Mfg/Exp Date, Authority).
  - Dynamic vector QR code generation linking to the public certificate for printing on outer cartons.
  - Print-ready Certificate of Analysis and PDF download stylesheet.
  - Auto-computed expiry analysis (Valid / Expiring Soon within 90 days / Expired).
- **Standardised Pharmacopoeial Formulary (`/products`)**:
  - Multi-facet client filtering by category (Homoeopathy, Cosmetics, Homoeo Vet), dosage form / sub-category, and pack size.
  - Clinical monographs with composition active tables, posology, storage, and pre-filled inquiry modal.
  - Statutory compliance wording strictly adhering to the *Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954*.
- **Quality Architecture Hub (`/quality`)**:
  - Dedicated pages for all 7 quality pillars (Authentic Feedstock, ENA, Cleanrooms, Laboratories, Water, SS-316, Certifications).
  - Interactive certificate viewer with automated expiration check.
- **Commercial & Trade Inquiries**:
  - Direct inquiry form with honeypot anti-spam protection and DPDP Act 2023 legal consent.
  - Dedicated Distributor Onboarding application capturing GSTIN and Drug License numbers (Form 20B/21B).
  - Floating WhatsApp B2B contact button.
  - Complimentary Therapeutic Index hard copy request modal.
- **Admin Management Portal (`/admin`)**:
  - Operations dashboard tracking new inquiries, pending distributor applications, and 90-day expiring batches.
  - **Bulk Batch CSV Importer** with client-side Zod validation and row-by-row error reporting before database commit.
  - Instant "Publish Changes Now" button executing on-demand Next.js ISR cache revalidation (`/api/revalidate`).

---

## 2. Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components default)
- **Language**: TypeScript (strict mode, zero `any`)
- **Styling**: Tailwind CSS v4 + Custom Hairline Design Tokens
- **Icons & UI**: Lucide React + Radix UI primitives
- **Database & Storage**: Firebase Firestore & Firebase Storage
- **Validation**: Zod + React Hook Form
- **Utilities**: `qrcode` (vector SVG QR), `papaparse` (CSV processing)

---

## 3. Local Development Setup

### 3.1 Prerequisites
- Node.js (v18.17+ or v20+)
- npm (v9+)

### 3.2 Installation
```bash
# Clone or navigate to the project directory
cd "PHBL WEBSITE"

# Install all dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:3000` in your browser. The site immediately renders with pre-loaded pharmaceutical seed data out-of-the-box, allowing you to preview all 25+ pages, batch records, and product monographs without requiring cloud credentials during local review.

---

## 4. Connecting Live Firebase (Production)

### 4.1 Firebase Console Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (e.g. `phbl-global`).
2. Enable **Firestore Database** in production mode.
3. Enable **Firebase Storage** for media uploads.
4. Deploy the provided security rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```
5. Go to **Project Settings > Service Accounts**, click **Generate new private key**, and download the JSON service account key.

### 4.2 Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the values from your Firebase Project and downloaded service account JSON:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_REVALIDATE_SECRET=choose_a_secure_secret_token
```

### 4.3 Database Seeding
To populate your live Firestore database with initial products, batches, quality pillars, and site settings, run:
```bash
npx ts-node scripts/seed.ts
```

---

## 5. Non-Technical Admin Guide

### 5.1 Accessing the Operations Console
Navigate to `/admin` in your web browser.

### 5.2 Importing Production Batches in Bulk (CSV)
1. Navigate to `/admin/batches`.
2. Click **"Download Sample CSV Template"** to download `phbl_batch_import_template.csv`.
3. Open the CSV in Microsoft Excel or Google Sheets.
4. Fill in the batch rows with your manufacturing details:
   - `batchNo`: Unique identifier (e.g. `BL-2024-0501`)
   - `apiName`: Active ingredient (e.g. `Arnica Montana Ø`)
   - `brandName`: Product name on bottle label
   - `batchSize`: e.g. `450 Litres`
   - `mfgDate`: Date in `YYYY-MM-DD` format
   - `expDate`: Expiration date or leave blank if indefinite
   - `authority`: Regulatory drug authority (e.g. `GNCT DELHI`, `WB AYUSH`)
5. Save the file as `.csv` and drag it into the **Bulk Regulatory Batch CSV Importer** box.
6. The system will inspect every row. If any field has a formatting error, it displays a row-by-row report. If all rows are valid, click **"Validate & Commit All Rows"**.
7. Your batches are instantly live and verifiable at `/batches/[batchNo]`.

### 5.3 Publishing Updates to the Live Website
Whenever you add a batch or update products in the admin console, click the green button **"Publish Changes Now"** in the top right header. This will immediately purge cached pages on Vercel so visitors see the latest records within seconds.

---

## 6. Regulatory & Statutory Compliance

This codebase complies with:
- **Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954**: Restricts medical claims to recognized pharmacopoeial "Indications" and prohibits curative guarantees.
- **Drugs & Cosmetics Act, 1940 (Schedule M-I)**: Standardizes manufacturing disclosures under License `HL-792 M`.
- **Digital Personal Data Protection (DPDP) Act, 2023**: Incorporates explicit consent checkboxes and grievance officer disclosures.

---

## 7. Build & Production Verification

```bash
# Type-check and generate production build
npm run build

# Start production server
npm run start
```
