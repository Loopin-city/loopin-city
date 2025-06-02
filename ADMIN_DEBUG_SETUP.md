# 🔧 Admin Debug Interface Setup Guide

## Overview
The Admin Debug Interface is a development-only tool for managing community duplicates, approvals, and other admin tasks. It's completely inaccessible in production for security.

## 🚀 How to Access

### **Step 1: Run Your App Locally**
```bash
npm run dev
# or
yarn dev
```

### **Step 2: Navigate to Admin Debug Page**
Open your browser and go to:
```
http://localhost:5173/admin-debug
```
(Replace `5173` with your actual dev server port)

## 🔒 Security Features

### **Production Protection**
- ✅ **Environment Check**: Only works when `NODE_ENV === 'development'`
- ✅ **Hostname Check**: Only works on `localhost` or `127.0.0.1`
- ✅ **Port Check**: Only works on development ports (`3000`, `5173`)
- ✅ **Access Denied Page**: Shows error message in production

### **What Happens in Production**
If someone tries to access `/admin-debug` in production, they'll see:
```
🚫 Access Denied
This admin interface is only available in development mode.
Run the application locally to access admin features.
```

## 📊 Features Available

### **1. Overview Dashboard**
- System statistics (communities, events, duplicates)
- Quick action buttons
- Real-time status monitoring

### **2. Duplicate Community Manager**
- View all flagged duplicate communities (70-89% similarity)
- Side-by-side community comparison
- Detailed similarity score breakdown
- **Actions Available:**
  - ✅ **Merge Communities** (for confirmed duplicates)
  - ❌ **Keep Separate** (for different communities)
  - 🔍 **Mark for Investigation** (need more info)

### **3. Community Management** (Coming Soon)
- Approve pending communities
- Edit community details
- Manage verification status

### **4. Event Management** (Coming Soon)
- Approve pending events
- Edit event details
- Manage event scheduling

## 🎯 How to Use for Duplicate Management

### **Scenario: Community Gets Flagged**
1. Someone submits an event for "GDG Mumbai"
2. System detects 85% similarity with existing "Google Developer Group Mumbai"
3. Gets logged to `admin_community_duplicates` table
4. You see it in the admin dashboard

### **Your Workflow:**
1. **Access Admin**: Go to `http://localhost:5173/admin-debug`
2. **Review Duplicates**: Click "Duplicate Communities" tab
3. **Compare Details**: Click on a pending duplicate to see:
   - Similarity score breakdown
   - Side-by-side community comparison
   - Event counts for both communities
4. **Take Action**:
   - **Merge**: If it's the same community
   - **Keep Separate**: If they're different
   - **Investigate**: If you need more info

### **Merge Process:**
When you click "Merge Communities":
1. All events transfer from duplicate to original
2. Original community gets best data from both
3. Duplicate community gets deleted
4. Admin record marked as `merge_approved`
5. Future submissions won't trigger this pair again

## 🛡️ Safety Features

### **Confirmation Dialogs**
- Merge action requires confirmation
- "Are you sure?" popup prevents accidents

### **Data Preservation**
- Merging preserves all events
- Keeps best data from both communities
- Maintains event history

### **Audit Trail**
- All actions logged with timestamps
- Admin username recorded
- Detailed notes stored

## 🔧 Development Notes

### **Adding New Admin Features**
To add new admin functionality:
1. Add a new tab in `AdminDebugPage.tsx`
2. Create the corresponding component
3. Ensure it follows the development-only pattern

### **Testing**
- Test the access restriction by trying to access in a production build
- Verify all database operations work correctly
- Test the merge functionality with dummy data

## 🚨 Important Reminders

1. **Never** deploy admin tools to production
2. **Always** test merges with non-critical data first
3. **Review** community details carefully before merging
4. **Document** any complex cases in admin notes

## 📞 Troubleshooting

### **Can't Access Admin Page**
- Ensure you're running in development mode
- Check the URL is correct (`/admin-debug`)
- Verify you're on localhost/127.0.0.1

### **No Duplicates Showing**
- Check if any communities are flagged in database
- Try submitting a test event with similar community name
- Verify the duplicate detection system is working

### **Merge Not Working**
- Check browser console for errors
- Verify database permissions
- Ensure both communities exist in database 