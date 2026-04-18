# Implementation Plan: RentFlow Full Feature Completion

## 1. Data Layer & Mocking
- **Types (`src/types/index.ts`)**: Add `MaintenanceRequest`, `UtilityReading`, `UnitLayout`.
- **Mock Data (`src/lib/mockData.ts`)**: Add mock data for maintenance requests and update units with layout images.
- **API (`src/lib/api.ts`)**: Implement CRUD for Maintenance, Security Deposits, and Utility Readings.

## 2. Maintenance Module
- **New Page (`src/pages/MaintenancePage.tsx`)**: 
    - Dashboard for landlords to view/manage requests.
    - Tenant view to submit new requests.
    - Status management (Pending -> Scheduled -> In Progress -> Completed).
    - Link to Expenses for tracking repair costs.

## 3. Tenant & Notice Management
- **Enhance `TenantsPage.tsx`**:
    - Notice Approval: Add buttons for landlords to approve/reject move-out notices.
    - Security Deposits: Detailed management modal for refunds and deductions (e.g., painting, repairs).

## 4. Marketplace & Booking
- **Enhance `MarketplacePage.tsx`**:
    - Visual Unit Layout: Integrate the generated floor plan images into the unit detail view.
    - Booking Status: Show current booking availability.

## 5. Utility Billing System
- **Enhance `UtilitiesPage.tsx`**:
    - Usage-based Reading: Modal to enter "Previous" and "Current" meter readings.
    - Automated Splitting: Logic to split shared costs (Garbage, Security) among all active units.

## 6. Authentication & RBAC
- **Enhance `App.tsx`**:
    - Implement navigation guards based on user roles (LANDLORD vs TENANT).
    - Refine JWT simulation in `api.ts`.

## 7. Notifications System
- **Enhance Notifications Panel**:
    - Group notifications by channel (Email, SMS).
    - Mark as read functionality.
