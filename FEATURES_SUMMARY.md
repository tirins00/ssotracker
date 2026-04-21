# SSO Tracker - Features Summary

## Implemented Features

### 1. ✅ Filter by Date and Status (Track Requests Page)
**Location**: `src/pages/TrackRequestsPage.jsx`

#### Status Filtering
- Tabs for filtering by status: All Requests, Pending, In Review, Processing, Completed, Rejected
- Click any tab to filter requests by status
- CSS: `.filter-tabs`, `.filter-tab`, `.filter-tab.active`

#### Date Range Filtering
- "From" date input: filters requests created on or after this date
- "To" date input: filters requests created on or before this date
- "Clear dates" button to reset date filters
- CSS: `.track-filters`, `.track-filter`

#### How It Works
```javascript
// Filters by active tab status
const filtered = requests.filter((r) => {
  if (activeTab === 'All Requests') return true;
  return r.status === activeTab;
})

// Then filters by date range
.filter((r) => {
  const createdAt = r?.createdAt ? new Date(r.createdAt) : null;
  if (!createdAt || Number.isNaN(createdAt.getTime())) return true;
  
  const ymd = toYMD(createdAt);
  if (fromDate && ymd < fromDate) return false;
  if (toDate && ymd > toDate) return false;
  return true;
})
```

---

### 2. ✅ Ping Admin When Request Processing Exceeds SLA Time
**Location**: `src/pages/TrackRequestsPage.jsx` and `src/App.jsx`

#### How It Works
1. Each document type has a processing time (e.g., "3 days processing")
2. The system calculates due date: `createdAt + processingDays`
3. When current time exceeds due date, request is marked overdue
4. For overdue requests not yet pinged, a "Ping Admin" button appears
5. Clicking "Ping Admin":
   - Sets `adminPingedAt` timestamp on the request
   - Button becomes disabled showing "Pinged [date]"
   - Notification is created: "Admin has been notified about your overdue request..."
   - Toast message: "Admin has been notified about your overdue request."

#### Related Functions
- `getDueDate(request)` - Calculates when request should be completed
- `isRequestOverdue(request, now)` - Checks if past due date
- `pingAdmin(req)` - Handles ping action and notifications

#### Visual Indicators
- Overdue requests show "Overdue" badge in red
- Due date appears below submission date
- CSS: `.ping-btn`, `.ping-btn:hover`, `.ping-btn:disabled`, `.overdue-badge`

---

### 3. ✅ Notification After Submitting Request
**Location**: `src/App.jsx`

#### How It Works
When a request is submitted:
1. **Toast notification** appears at bottom of screen (3 seconds)
   - Message: "Request submitted successfully!"
   - Auto-dismisses after 3 seconds
   
2. **Notification entry** is added to notifications list
   - Type: 'submit'
   - Title: "Request submitted"
   - Message: "Your request for '[document title]' has been submitted."
   - Timestamp: CreatedAt
   - Visible in Notifications Page

#### Code Flow
```javascript
const addRequest = (req) => {
  setRequests((prev) => [req, ...prev]);
  addNotification({
    id: newId(),
    createdAt: new Date().toISOString(),
    type: 'submit',
    title: 'Request submitted',
    message: `Your request for "${req?.document?.title || 'Document'}" has been submitted.`,
  });
}
```

#### Toast Component
- `src/components/Toast.jsx`
- Shows message with checkmark icon
- Auto-dismisses after 3 seconds
- Can be triggered via `showToast(message)` function

---

## Additional Automatic Notifications

The app also includes:
- **Overdue Notification**: When a request exceeds SLA time, an automatic notification is created
- **Admin Ping Notification**: When admin is pinged, notification shows completion of action

---

## Storage
- Requests are persisted in localStorage with key `ssotracker.requests.v1`
- Notifications are persisted in localStorage with key `ssotracker.notifications.v1`
- All data survives page refreshes

---

## Testing the Features

### Test Filter by Date and Status
1. Go to "Track Requests" page
2. Submit a few requests with different document types
3. Click status tabs to filter (e.g., "Pending", "Completed")
4. Use date range inputs to filter by submission date
5. Click "Clear dates" to reset

### Test Ping Admin on Overdue
1. Submit a request for a document with short processing time (e.g., 1 day)
2. Wait for request to become overdue (or manually adjust system time)
3. Go to Track Requests page
4. Overdue requests will show "Overdue" badge and "Ping Admin" button
5. Click "Ping Admin" button
6. Button becomes disabled and shows ping timestamp
7. Check Notifications page for confirmation notification

### Test Submit Notification
1. Go to "Submit Request" page
2. Complete the form and submit
3. Toast notification appears with success message
4. Notification entry appears in "Notifications" page with request details
