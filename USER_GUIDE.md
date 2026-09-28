# Vasavi Events — Official User Guide & Operating Manual

> **Platform**: Vasavi Events (Haute-Couture Digital Memory Delivery)  
> **Production URLs**:
> - **Client Gallery**: [https://vasavievents.vercel.app](https://vasavievents.vercel.app)
> - **Admin Studio**: [https://vasavievents-admin.vercel.app](https://vasavievents-admin.vercel.app)

---

## 📖 Table of Contents
1. [Platform Architecture & URLs](#1-platform-architecture--urls)
2. [Admin & Photographer Guide (Studio Operations)](#2-admin--photographer-guide-studio-operations)
   - [Signing In to the Studio](#step-1-signing-in-to-the-studio)
   - [Creating a New Celebration Gallery](#step-2-creating-a-new-celebration-gallery)
   - [Managing Ceremonial Folders](#step-3-managing-ceremonial-folders)
   - [Batch Uploading Photos](#step-4-batch-uploading-photos)
   - [Bulk Organizing & Photo Actions](#step-5-bulk-organizing--photo-actions)
   - [Delivering to Clients (WhatsApp & Hall QR)](#step-6-delivering-to-clients-whatsapp--hall-qr)
   - [Monitoring Analytics & Guest Engagement](#step-7-monitoring-analytics--guest-engagement)
3. [Client & Guest Guide (Zero-Login Experience)](#3-client--guest-guide-zero-login-experience)
   - [Accessing the Gallery](#accessing-the-gallery)
   - [Ceremony Folder Switching](#ceremony-folder-switching)
   - [Fullscreen Darkroom Lightbox](#fullscreen-darkroom-lightbox)
   - [Ambient Autoplay Slideshow](#ambient-autoplay-slideshow)
   - [Downloading Original Memories](#downloading-original-memories)
4. [Hall Manager Best Practices (Printing & Display)](#4-hall-manager-best-practices-printing--display)
5. [Keyboard & Touch Gesture Cheatsheet](#5-keyboard--touch-gesture-cheatsheet)

---

## 1. Platform Architecture & URLs

| Portal | URL | Audience | Authentication |
| :--- | :--- | :--- | :--- |
| **Admin Management Studio** | [https://vasavievents-admin.vercel.app](https://vasavievents-admin.vercel.app) | Hall Owners, Photographers, Admins | Email & Password |
| **Client Gallery** | `https://vasavievents.vercel.app/gallery/[slug]` | Bride, Groom, Families, Guests | **Zero Login (Public/Instant)** |
| **Public Showcase** | [https://vasavievents.vercel.app](https://vasavievents.vercel.app) | Public Visitors | Public (Zero Admin Buttons) |

---

## 2. Admin & Photographer Guide (Studio Operations)

### Step 1: Signing In to the Studio
1. Open [https://vasavievents-admin.vercel.app](https://vasavievents-admin.vercel.app) in your desktop or mobile browser.
2. Enter your master credentials:
   - **Email**: `admin@vasavievents.com`
   - **Password**: `admin123`
3. Click **"Sign In to Dashboard"**.
4. You are greeted by the **Executive Studio Dashboard**, displaying real-time counters for **Total Events**, **Total Folders**, **Photos Uploaded**, and **Public Gallery Views**.

*(Tip: You can also click "Just testing? Enter Studio in Demo Mode →" at the bottom to test instantly without credentials).*

---

### Step 2: Creating a New Celebration Gallery
1. From the top navigation or dashboard header, click **"+ Create New Event"**.
2. Fill in the event parameters:
   - **Event Title**: e.g., *Siddharth Weds Ananya* or *The Royal Reception*
   - **Client Names**: e.g., *Siddharth & Ananya*
   - **Category**: Select *Wedding*, *Engagement*, *Haldi*, *Reception*, *Couple Shoot*, or *Birthday Shoot*
   - **Ceremony Date**: Pick the primary date
   - **Description**: Add a welcoming greeting for guests (e.g. *"Welcome to our wedding memories. Tap any photo to expand and download."*)
   - **Cover Photo**: Select one of the high-fashion presets or paste a custom photography URL.
   - **Custom URL Slug**: The system generates a clean link (e.g. `siddharth-weds-ananya`). You can customize this.
   - **Expiration Policy**:
     - **Never Expires**: Permanent lifetime memory link for the family.
     - **Custom Expiry**: Set a specific date/time for the link to gracefully close.
3. Click **"Create & Launch Studio"**.
4. The system initializes the gallery and creates default ceremonial folders (*Wedding Highlights, Couple Shoot, Engagement, Haldhi, Reception*).

---

### Step 3: Managing Ceremonial Folders
Inside the **Event Studio** (`/admin/events/[id]`):
* **Switch Active Folder**: Click any ceremony capsule pill (*Wedding Highlights*, *Haldhi*, *Couple Shoot*, etc.) to view or upload photos for that ceremony.
* **Add a Ceremony**: Click **"+ Add Folder"**, type the ceremony name (*e.g. "Mehendi Night", "Sangeet Party", "Pellikuthuru"*), and press Enter.
* **Rename Folder**: Hover over any folder tab and click the **Pencil icon** to edit its title.
* **Delete Folder**: Click the **Trash icon** to remove an empty or unneeded folder.

---

### Step 4: Batch Uploading Photos
The photo uploader is optimized for high-volume wedding photography:
1. Select the destination ceremony folder (e.g., *Wedding Highlights*).
2. **Drag & drop** 50 to 100+ photos into the upload area, or click **"Browse Files"** to select from your computer.
3. **Supported Formats**: JPEG, PNG, WebP, AVIF, HEIC.
4. Real-time progress bars show each file uploading to the Supabase global CDN bucket (`event-media`).
5. Uploaded photos are automatically registered in PostgreSQL and display immediately in the studio grid.

---

### Step 5: Bulk Organizing & Photo Actions
* **Multi-Select**: Click the checkmark circle on the top-left of any photo card to select it.
* **Select All**: Use the batch selector to highlight all photos in the current folder.
* **Move Ceremony**: Choose a new folder from the dropdown and click **"Move"** to transfer photos between ceremonies instantly.
* **Set Cover Photo**: Click the star icon on any photo to set it as the primary album cover image.
* **Delete Photos**: Click **"Delete Selected"** to remove photos from cloud storage and the database in one click.

---

### Step 6: Delivering to Clients (WhatsApp & Hall QR)
Inside the Event Studio, click the **Share** button in the top action bar:

#### 1. WhatsApp & Direct Link
* Click **"Copy Link"**.
* Paste the link into WhatsApp:
  ```text
  Dear Family & Friends! 🌸
  Here are our wedding memories from Vasavi Events:
  https://vasavievents.vercel.app/gallery/siddharth-weds-ananya
  (No login required - tap to view and download original photos!)
  ```

#### 2. Hall Entrance QR Standee
* In the Share Modal, click **"Download QR Code"**.
* A crisp, vector-rendered PNG file downloads to your computer.
* Send this image to your banner printer to place on welcome easels or guest table standees at the hall entrance!

---

### Step 7: Monitoring Analytics & Guest Engagement
Click **Analytics** in the top navigation:
* **Total Views Counter**: Track cumulative gallery visits across all celebrations.
* **Acquisition Breakdown**: See what percentage of visitors arrived via **WhatsApp Share** vs. **Hall Entrance QR Scan**.
* **Timeline Velocity**: View the 7-day engagement curve to see when families are actively viewing and downloading photos.

---

## 3. Client & Guest Guide (Zero-Login Experience)

### Accessing the Gallery
* **No Email Required. No Password. No App Download.**
* When guests scan the venue QR code or tap the WhatsApp link, the gallery loads immediately in under 1 second.
* Works smoothly across iPhone, Android, iPad, Mac, and Windows.

### Ceremony Folder Switching
* A **Floating Capsule Dock** stays pinned as guests scroll.
* Tapping any ceremony (*Wedding Highlights*, *Haldi*, *Couple Shoot*, *Reception*) dynamically filters the masonry gallery without refreshing the page.

### Fullscreen Darkroom Lightbox
* Tapping any photo expands it into an immersive fullscreen darkroom view.
* High-definition zoom and pan for viewing fine wedding jewellery and bridal details.
* Quick filmstrip thumbnail bar along the bottom to jump directly to any photo.

### Ambient Autoplay Slideshow
* Tap the **Play icon** in the top right of the lightbox.
* Photos automatically transition every 4 seconds with cinematic dissolves—perfect for connecting a laptop or tablet to an ambient TV display at the venue!

### Downloading Original Memories
* Tap the **Download icon** on any photo to save the high-resolution original file directly to your smartphone's camera roll or desktop hard drive.

---

## 4. Hall Manager Best Practices (Printing & Display)

| Display Format | Recommended Dimensions | Location | Pro Tip |
| :--- | :--- | :--- | :--- |
| **Floral Welcome Easel** | 24" × 36" (Foam Board) | Hall Entrance / Mandap Entrance | Place with the text: *"Scan to view & download our wedding photos live!"* |
| **Dining Table Cards** | 4" × 6" (Tent Cards) | Buffet Tables & Guest Seating | Keeps guests engaged during dinner while browsing ceremony highlights. |
| **Thank You Cards** | 3.5" × 2" (Business Card) | Given with wedding favors | Allows out-of-town guests to revisit memories after returning home. |
| **LED Screen Slideshow** | 1920 × 1080 (16:9) | Hall Reception Stage | Open the gallery on a connected laptop and tap **Slideshow** mode. |

---

## 5. Keyboard & Touch Gesture Cheatsheet

### On Touchscreens (Smartphones & Tablets):
* **Swipe Left / Right**: Next / Previous photo in the Lightbox.
* **Pinch to Zoom**: Inspect photo details.
* **Tap Screen**: Toggle photo info and action controls.
* **Swipe Down**: Dismiss the Lightbox.

### On Desktop & Laptops:
* **`→` (Right Arrow)**: Next photo.
* **`←` (Left Arrow)**: Previous photo.
* **`Spacebar`**: Toggle autoplay slideshow.
* **`Esc`**: Exit fullscreen darkroom view.
