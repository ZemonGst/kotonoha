# DESIGN_PRODUCT.md — Kotonoha Dashboard & All Pages
> Version 1.0 · Follows DESIGN_AUTH.md design language exactly
> Dark navy + red accent. No 3D. No parchment. No letter theme in UI chrome.
> Read DESIGN_AUTH.md first — this document extends it.

---

## 0. CRITICAL RULES

- DO NOT touch any backend, tRPC, or API logic
- DO NOT modify any existing hooks
- This document covers ONLY the visual/UI layer
- Every page follows the same design system as auth pages
- Backend is handled separately — frontend only consumes hooks

---

## 1. Design System (Same as DESIGN_AUTH.md)

```css
:root {
  /* Backgrounds */
  --bg-page:          #080910;
  --bg-sidebar:       #0C0D18;
  --bg-card:          #0E0F1A;
  --bg-card-hover:    #121320;
  --bg-input:         rgba(255,255,255,0.04);
  --bg-input-hover:   rgba(255,255,255,0.07);

  /* Borders */
  --border:           rgba(255,255,255,0.07);
  --border-hover:     rgba(255,255,255,0.12);
  --border-active:    rgba(217,48,37,0.4);

  /* Text */
  --text-primary:     #FFFFFF;
  --text-secondary:   #8B8FA8;
  --text-muted:       #4A4D65;

  /* Red Accent */
  --red:              #D93025;
  --red-hover:        #E8352A;
  --red-glow:         rgba(217,48,37,0.25);
  --red-subtle:       rgba(217,48,37,0.08);

  /* Status */
  --success:          #22C55E;
  --success-subtle:   rgba(34,197,94,0.1);
  --warning:          #F59E0B;
  --warning-subtle:   rgba(245,158,11,0.1);
  --info:             #3B82F6;
  --info-subtle:      rgba(59,130,246,0.1);
}
```

**Font:** Inter only. Same as auth.

---

## 2. Dashboard Shell Layout

Every page after login shares this shell.

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px fixed)  │  TOPBAR (60px, full width)        │
│                         │                                   │
│  Logo                   │  Page title    Search   Avatar    │
│  ─────────────          ├───────────────────────────────────┤
│  Nav items              │                                   │
│                         │  PAGE CONTENT                     │
│                         │  padding: 32px                    │
│                         │                                   │
│  ─────────────          │                                   │
│  User profile           │                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Sidebar

```css
.sidebar {
  position: fixed;
  left: 0; top: 0; bottom: 0;
  width: 240px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 40;
}
```

### Logo Area
```css
.sidebar-logo {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
}
.sidebar-logo-icon {
  width: 28px; height: 28px;
  background: var(--red);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
}
.sidebar-logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
```

### Nav Items
```tsx
const navItems = [
  { label: 'Form Creation',   href: '/dashboard/create',    icon: PlusIcon },
  { label: 'Drafts',          href: '/dashboard/drafts',    icon: FileIcon,   count: true },
  { label: 'Published Forms', href: '/dashboard/published', icon: SendIcon,   count: true },
  { label: 'Responses',       href: '/dashboard/responses', icon: InboxIcon },
  { label: 'Analytics',       href: '/dashboard/analytics', icon: ChartIcon },
  { label: 'Archived Forms',  href: '/dashboard/archived',  icon: ArchiveIcon,count: true },
  { label: 'Templates',       href: '/dashboard/templates', icon: LayoutIcon },
  { label: 'Explore',         href: '/dashboard/explore',   icon: SearchIcon },
  { label: 'Settings',        href: '/dashboard/settings',  icon: SettingsIcon },
]
```

```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 40px;
  border-radius: 6px;
  margin: 2px 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
  text-decoration: none;
  transition: background 150ms, color 150ms;
  position: relative;
}
.nav-item:hover {
  background: rgba(255,255,255,0.04);
  color: var(--text-primary);
}
.nav-item.active {
  background: var(--red-subtle);
  color: var(--text-primary);
  font-weight: 500;
}
/* Red left border on active */
.nav-item.active::before {
  content: '';
  position: absolute;
  left: -8px; top: 6px; bottom: 6px;
  width: 3px;
  background: var(--red);
  border-radius: 0 2px 2px 0;
}
.nav-item-icon {
  width: 16px; height: 16px;
  opacity: 0.7;
}
.nav-item.active .nav-item-icon { opacity: 1; }

/* Count badge */
.nav-item-count {
  margin-left: auto;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  background: rgba(255,255,255,0.06);
  padding: 1px 7px;
  border-radius: 10px;
}
```

### User Profile (bottom of sidebar)
```css
.sidebar-user {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 150ms;
}
.sidebar-user:hover { background: rgba(255,255,255,0.04); }
.sidebar-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--red);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; color: #fff;
  flex-shrink: 0;
}
.sidebar-user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}
.sidebar-user-email {
  font-size: 11px;
  color: var(--text-muted);
}
```

---

## 4. Topbar

```css
.topbar {
  position: fixed;
  top: 0;
  left: 240px; right: 0;
  height: 60px;
  background: rgba(8,9,16,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 16px;
  z-index: 30;
}
.topbar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.topbar-search {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 12px;
  height: 36px;
  width: 220px;
  transition: border-color 150ms, width 200ms;
}
.topbar-search:focus-within {
  border-color: var(--border-hover);
  width: 280px;
}
.topbar-search input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--text-primary);
  width: 100%;
}
.topbar-search input::placeholder { color: var(--text-muted); }

/* Notification bell */
.topbar-bell {
  width: 36px; height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: border-color 150ms, color 150ms;
  position: relative;
}
.topbar-bell:hover { border-color: var(--border-hover); color: var(--text-primary); }
.topbar-bell-dot {
  position: absolute;
  top: 8px; right: 8px;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--red);
}
```

---

## 5. Page Content Wrapper

```css
.page-content {
  margin-left: 240px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  padding: 32px;
  background: var(--bg-page);
}
```

---

## 6. Shared Components

### Stat Card
```css
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 150ms;
}
.stat-card:hover { border-color: var(--border-hover); }
.stat-card-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.stat-card-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1;
}
.stat-card-change {
  font-size: 12px;
  color: var(--success);
  display: flex; align-items: center; gap: 4px;
}
.stat-card-change.negative { color: var(--red); }
```

### Data Table Row
```css
.table-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  transition: background 150ms;
  gap: 16px;
}
.table-row:hover { background: rgba(255,255,255,0.02); }
.table-row:last-child { border-bottom: none; }
```

### Badge
```css
.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.03em;
}
.badge-public    { background: var(--success-subtle); color: var(--success); }
.badge-unlisted  { background: var(--warning-subtle); color: var(--warning); }
.badge-protected { background: var(--info-subtle);    color: var(--info); }
.badge-draft     { background: rgba(255,255,255,0.06); color: var(--text-secondary); }
.badge-archived  { background: rgba(255,255,255,0.04); color: var(--text-muted); }
```

### Primary Button
```css
.btn-primary {
  height: 38px;
  padding: 0 16px;
  background: var(--red);
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; gap: 7px;
  transition: background 150ms, transform 80ms;
  white-space: nowrap;
}
.btn-primary:hover { background: var(--red-hover); }
.btn-primary:active { transform: scale(0.98); }

.btn-secondary {
  height: 38px;
  padding: 0 16px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex; align-items: center; gap: 7px;
  transition: border-color 150ms, color 150ms;
}
.btn-secondary:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
}
```

### Page Header
```css
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}
.page-header-left h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}
.page-header-left p {
  font-size: 14px;
  color: var(--text-secondary);
}
```

### Empty State
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}
.empty-state-icon {
  width: 48px; height: 48px;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.empty-state h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}
```

---

## 7. PAGE: Main Dashboard (`/dashboard`)

### Layout
```
[Page Header: "Welcome back, {name}"]

[4 Stat Cards row]

[Create New Form section]     [Quick Stats right panel]

[Recent Drafts]  [Published Forms]    [Response Trend chart]

[Quick Actions bar]
```

### Stat Cards Row (4 cards)
```
Published Forms | Drafts | Total Responses | Total Views
```

### Create New Form Section
```css
.create-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}
.create-options {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}
.create-option {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 150ms, background 150ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.create-option:hover {
  border-color: var(--red);
  background: var(--red-subtle);
}
.create-option-icon {
  width: 44px; height: 44px;
  background: rgba(217,48,37,0.12);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: var(--red);
}
.create-option h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.create-option p {
  font-size: 12px;
  color: var(--text-secondary);
}
```

### Recent Drafts + Published Forms (side by side)
Two cards side by side, each showing last 4 items as table rows.
Each row:
```
[Form icon]  [Form name]  [Updated X ago / X responses]  [Status badge]  [⋮ menu]
```

### Quick Actions Bar
```css
.quick-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.quick-action {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: border-color 150ms;
  text-align: center;
}
.quick-action:hover { border-color: var(--border-hover); }
.quick-action-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--bg-input);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary);
}
.quick-action span {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}
```

Quick actions: Create Form, Browse Templates, View Responses, View Analytics, Explore Forms.

---

## 8. PAGE: Form Creation (`/dashboard/create`)

This is the form builder. Three panel layout.

```
┌─────────────────────────────────────────────────────────┐
│  BUILDER TOPBAR: [← Back] [Form title] [Save] [Publish] │
├──────────────┬──────────────────────────┬───────────────┤
│  LEFT PANEL  │  CANVAS (center)         │  RIGHT PANEL  │
│  260px       │  flex-1                  │  280px        │
│              │                          │               │
│  Field types │  Dropped fields          │  Field config │
│  (draggable) │  (sortable)              │  (when selected)│
└──────────────┴──────────────────────────┴───────────────┘
```

### Builder Topbar
```css
.builder-topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 56px;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  z-index: 50;
}
.builder-form-title {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}
.builder-form-title::placeholder { color: var(--text-muted); }
```

### Left Panel — Field Palette
```css
.field-palette {
  position: fixed;
  top: 56px; left: 240px; bottom: 0;
  width: 260px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  padding: 20px 12px;
  overflow-y: auto;
}
.palette-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 8px;
  margin-bottom: 8px;
  margin-top: 16px;
}
.palette-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 7px;
  cursor: grab;
  font-size: 13px;
  color: var(--text-secondary);
  border: 1px solid transparent;
  transition: background 150ms, border-color 150ms, color 150ms;
  margin-bottom: 4px;
}
.palette-item:hover {
  background: var(--bg-input);
  border-color: var(--border);
  color: var(--text-primary);
}
.palette-item:active { cursor: grabbing; }
.palette-item-icon {
  width: 16px; height: 16px;
  color: var(--text-muted);
}
```

Field types in palette:
**Pre-made:** Name, Email, Phone, Address, Date, Rating
**Generic:** Short Text, Long Text, Number, Single Select, Multi Select, Checkbox, Dropdown, File Upload

### Canvas — Center
```css
.builder-canvas {
  margin-left: calc(240px + 260px);
  margin-right: 280px;
  margin-top: 56px;
  min-height: calc(100vh - 56px);
  background: var(--bg-page);
  padding: 40px 60px;
  overflow-y: auto;
}
.canvas-empty {
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 80px 40px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}
```

### Field Card (on canvas)
```css
.field-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 150ms;
  position: relative;
}
.field-card:hover { border-color: var(--border-hover); }
.field-card.selected { border-color: var(--red); }
.field-card-drag-handle {
  position: absolute;
  left: 8px; top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  cursor: grab;
}
.field-card-type {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.field-card-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.field-card-preview {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  height: 36px;
  padding: 0 12px;
  display: flex; align-items: center;
  font-size: 13px;
  color: var(--text-muted);
  pointer-events: none;
}
```

### Right Panel — Field Settings
```css
.field-settings {
  position: fixed;
  top: 56px; right: 0; bottom: 0;
  width: 280px;
  background: var(--bg-sidebar);
  border-left: 1px solid var(--border);
  padding: 20px 16px;
  overflow-y: auto;
}
.settings-section {
  margin-bottom: 24px;
}
.settings-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}
.settings-field {
  margin-bottom: 14px;
}
.settings-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
  display: block;
}
.settings-input {
  width: 100%;
  height: 36px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0 10px;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 150ms;
}
.settings-input:focus { border-color: var(--border-hover); }

/* Toggle switch */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.toggle-label {
  font-size: 13px;
  color: var(--text-secondary);
}
.toggle {
  width: 36px; height: 20px;
  background: var(--border);
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: background 200ms;
}
.toggle.on { background: var(--red); }
.toggle::after {
  content: '';
  position: absolute;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #fff;
  top: 2px; left: 2px;
  transition: transform 200ms;
}
.toggle.on::after { transform: translateX(16px); }
```

### Step Indicator (top of canvas)
```
[1 Theme] → [2 Build] → [3 Configure] → [4 Logic] → [5 Preview] → [6 Publish]
```
```css
.builder-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 32px;
}
.builder-step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 20px;
  transition: color 150ms;
}
.builder-step.active { color: var(--text-primary); }
.builder-step.done { color: var(--success); }
.builder-step-num {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px;
}
.builder-step.active .builder-step-num {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.builder-step.done .builder-step-num {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}
.builder-step-divider {
  width: 24px; height: 1px;
  background: var(--border);
}
```

### Publish Settings Panel
Slides in from the right or shown as a modal when user clicks Publish.

```
Visibility:
  ○ Public
  ● Unlisted
  ○ Password Protected  [password input]

Response Limit:  [number input]  (empty = unlimited)
Expiry Date:     [date input]
Custom Slug:     kotonoha.app/f/ [slug input]
                 ✓ Available / ✗ Taken

[Save as Draft]    [Publish Now]
```

---

## 9. PAGE: Drafts (`/dashboard/drafts`)

```
[Page Header: "Drafts"  subtitle: "Your unfinished and saved forms"]
[Tab row: "My Drafts" | "Templates"]

[Search bar]   [Sort dropdown]   [New Form button]

[Grid or list of draft cards]
```

### Draft Card
```css
.draft-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  transition: border-color 150ms, transform 150ms;
  cursor: pointer;
  position: relative;
}
.draft-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-1px);
}
.draft-card-icon {
  width: 40px; height: 40px;
  background: var(--bg-input);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.draft-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.draft-card-meta {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.draft-card-actions {
  display: flex;
  gap: 8px;
}

/* Three dot menu */
.draft-card-menu {
  position: absolute;
  top: 16px; right: 16px;
}
```

Card actions (shown on hover or via menu): Edit, Preview, Publish, Delete.

---

## 10. PAGE: Published Forms (`/dashboard/published`)

```
[Page Header: "Published Forms"  subtitle: "All your live forms"]

[Filter tabs: All | Public | Unlisted | Password Protected]
[Sort: Newest | Most Responses | Most Views]

[Table of published forms]
```

### Table Structure
```
Columns: Form Name | Status | Views | Responses | Created | Actions
```

```css
.published-table {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 80px 100px 120px 140px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.table-body-row {
  display: grid;
  grid-template-columns: 2fr 1fr 80px 100px 120px 140px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  transition: background 150ms;
}
.table-body-row:hover { background: rgba(255,255,255,0.02); }
.table-body-row:last-child { border-bottom: none; }
```

### Row Actions (inline)
Copy Link, QR Code, Edit, Clone, Archive, Unpublish — shown as icon buttons.

```css
.row-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 150ms;
}
.table-body-row:hover .row-actions { opacity: 1; }
.row-action-btn {
  width: 28px; height: 28px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 150ms, border-color 150ms, color 150ms;
}
.row-action-btn:hover {
  background: var(--bg-input);
  border-color: var(--border);
  color: var(--text-primary);
}
.row-action-btn.danger:hover {
  background: rgba(217,48,37,0.1);
  border-color: var(--border-active);
  color: var(--red);
}
```

### QR Code Modal
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px;
  width: 360px;
  position: relative;
}
.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
}
.modal-close {
  position: absolute;
  top: 16px; right: 16px;
  width: 28px; height: 28px;
  border-radius: 6px;
  background: var(--bg-input);
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
```

---

## 11. PAGE: Responses (`/dashboard/responses`)

### Level 1 — Form List View
```
[Page Header: "Responses"]

[Grid of form cards — one per form that has responses]
```

Each card shows:
```
Form name
X responses · Last received Y ago
[View Responses →]
```

```css
.response-form-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 150ms;
}
.response-form-card:hover { border-color: var(--border-hover); }
.response-count {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.archived-tag {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-input);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
}
```

### Level 2 — Response Viewer (`/dashboard/responses/[formId]`)
```
[Back button]  [Form name — X responses]

[Search]  [Filter by date]  [Export CSV button]

[Response card — single response]

[← Previous]   Response 12 / 100   [Next →]

[Delete this response]
```

```css
.response-viewer-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  max-width: 680px;
  margin: 0 auto;
}
.response-meta {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
}
.response-field {
  margin-bottom: 20px;
}
.response-field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.response-field-value {
  font-size: 15px;
  color: var(--text-primary);
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 10px 14px;
  min-height: 40px;
}

/* Navigation */
.response-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}
.response-nav-btn {
  height: 36px;
  padding: 0 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 150ms, color 150ms;
}
.response-nav-btn:hover {
  border-color: var(--border-hover);
  color: var(--text-primary);
}
.response-nav-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

/* Export CSV button */
.export-btn {
  height: 36px;
  padding: 0 14px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 7px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex; align-items: center; gap: 7px;
  transition: border-color 150ms, color 150ms;
}
.export-btn:hover {
  border-color: var(--success);
  color: var(--success);
}
```

---

## 12. PAGE: Analytics (`/dashboard/analytics`)

```
[Page Header: "Analytics"]

[5 Stat Cards: Total Forms | Published | Drafts | Total Responses | Completion Rate]

[Response Trend chart]  [Views Trend chart]

[Top Performing Forms table]
```

### Chart Card
```css
.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}
.chart-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.chart-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.chart-period-select {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  outline: none;
  cursor: pointer;
}
```

### Chart Styling (Recharts)
```tsx
// Chart colors — use these in your Recharts config
const chartConfig = {
  stroke: '#D93025',           // red line
  fill: 'rgba(217,48,37,0.08)', // area fill
  grid: 'rgba(255,255,255,0.05)',
  axis: '#4A4D65',
  dot: '#D93025',
  activeDot: '#E8352A',
  tooltip: {
    background: '#0E0F1A',
    border: 'rgba(255,255,255,0.07)',
    text: '#FFFFFF',
  }
}
```

### Top Forms Table
Same table structure as Published Forms but with:
```
Columns: Form Name | Theme | Responses | Views | Completion Rate
```

---

## 13. PAGE: Archived Forms (`/dashboard/archived`)

```
[Page Header: "Archived Forms"  subtitle: "Inactive forms — restore or delete"]

[Table of archived forms]
```

Same table as Published Forms but with:
- All badges show `archived`
- Actions change to: Restore, Republish, Delete Permanently

### Delete Permanently Confirmation Modal
```
Title:    "Delete permanently?"
Body:     "This form and all its responses will be deleted forever.
           This cannot be undone."
Actions:  [Cancel]  [Delete Forever]  ← red, destructive
```

---

## 14. PAGE: Templates (`/dashboard/templates`)

```
[Page Header: "Templates"  subtitle: "Start with a pre-built form"]

[Category filter: All | Feedback | Registration | Survey | Poll | Event]

[Grid of template cards]
```

### Template Card
```css
.template-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 150ms, transform 150ms;
}
.template-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}
.template-card-preview {
  height: 140px;
  background: var(--bg-input);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  /* Shows a mini preview of form fields */
}
.template-card-body {
  padding: 16px;
}
.template-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.template-card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 14px;
}
.template-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.template-field-count {
  font-size: 11px;
  color: var(--text-muted);
}
```

Click on template → modal previewing the form → "Use Template" button → clones into drafts → opens builder.

---

## 15. PAGE: Explore (`/dashboard/explore`)

**Only PUBLIC forms appear here. Unlisted forms NEVER appear.**

```
[Page Header: "Explore"  subtitle: "Discover public forms from the community"]

[Search bar — full width]

[Featured Forms — horizontal scroll row]

[Popular Forms — grid]

[Community Forms — grid with pagination]
```

### Explore Form Card
```css
.explore-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 150ms;
}
.explore-card:hover { border-color: var(--border-hover); }
.explore-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.explore-card-creator {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.explore-card-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}
```

---

## 16. PAGE: Settings (`/dashboard/settings`)

```
[Page Header: "Settings"]

[Tab row: Profile | Account | Notifications | Danger Zone]

[Settings sections below]
```

### Settings Section
```css
.settings-group {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}
.settings-group-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.settings-group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.settings-group-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}
.settings-row {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.settings-row:last-child { border-bottom: none; }
.settings-row-label {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}
.settings-row-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}
```

### Danger Zone
```css
.danger-zone {
  background: rgba(217,48,37,0.04);
  border: 1px solid rgba(217,48,37,0.2);
  border-radius: 12px;
  padding: 24px;
}
.danger-zone-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--red);
  margin-bottom: 16px;
}
```

---

## 17. Public Form Page (`/f/[slug]`)

This page has NO sidebar, NO topbar. Standalone page.

```
[Kotonoha logo — top center, small]

[Form card — centered, max-width 600px]

[Form title]
[Form description]
[Fields]
[Submit button]

[Powered by Kotonoha — bottom, small]
```

```css
.public-form-page {
  min-height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 16px;
}
.public-form-card {
  width: 100%;
  max-width: 600px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 40px;
}
.public-form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.public-form-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
```

### Form Field on Public Page
Same input style as auth inputs — consistent design system.

### Thank You Page (after submit)
```
[Checkmark icon — green, large, centered]
"Your response has been submitted."
"Thank you for your time."
[Optional: Return to home]
```

```css
.thankyou-icon {
  width: 56px; height: 56px;
  background: var(--success-subtle);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--success);
  margin: 0 auto 20px;
}
```

### Password Protected Form
```
[Lock icon]
"This form is password protected."
[Password input]
[Unlock Form button]
```

### Closed Form (expired or limit reached)
```
[X icon]
"This form is no longer accepting responses."
```

---

## 18. Toast / Notification System

```css
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  min-width: 300px;
  max-width: 420px;
  font-size: 13px;
  color: var(--text-primary);
  animation: toastIn 0.25s ease;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.toast-success { border-left: 3px solid var(--success); }
.toast-error   { border-left: 3px solid var(--red); }
.toast-info    { border-left: 3px solid var(--info); }
```

---

## 19. File Structure

```
apps/web/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Sidebar + Topbar shell
│   │   ├── dashboard/page.tsx      ← Main overview
│   │   ├── create/page.tsx         ← Form builder
│   │   ├── drafts/page.tsx
│   │   ├── published/page.tsx
│   │   ├── responses/
│   │   │   ├── page.tsx            ← Form list
│   │   │   └── [formId]/page.tsx   ← Response viewer
│   │   ├── analytics/page.tsx
│   │   ├── archived/page.tsx
│   │   ├── templates/page.tsx
│   │   ├── explore/page.tsx
│   │   └── settings/page.tsx
│   └── f/
│       └── [slug]/page.tsx         ← Public form (no shell)
│
├── components/
│   ├── shell/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── NavItem.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── CreateSection.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentList.tsx
│   ├── builder/
│   │   ├── BuilderLayout.tsx
│   │   ├── FieldPalette.tsx
│   │   ├── BuilderCanvas.tsx
│   │   ├── FieldCard.tsx
│   │   ├── FieldSettings.tsx
│   │   ├── StepIndicator.tsx
│   │   └── PublishPanel.tsx
│   ├── responses/
│   │   ├── ResponseFormCard.tsx
│   │   └── ResponseViewer.tsx
│   ├── analytics/
│   │   ├── ChartCard.tsx
│   │   └── TopFormsTable.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── EmptyState.tsx
│       └── ConfirmDialog.tsx
│
└── styles/
    └── dashboard.css               ← All CSS variables + component styles
```

---

## 20. DO NOT

- Do NOT use white or light backgrounds anywhere
- Do NOT use any color other than red as the primary accent
- Do NOT use serif fonts or display fonts — Inter only
- Do NOT show unlisted forms on the Explore page
- Do NOT show responses inside Archived section
- Do NOT add any 3D elements, canvas, or WebGL
- Do NOT modify any backend, tRPC, hook, or validation logic
- Do NOT use `border-radius > 14px` on any element
