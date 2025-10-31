# WordPress Menu Setup Guide

## Creating Menus for Your Site

Your v0 app is looking for WordPress menus to display navigation links. Here's how to create them:

### Step 1: Access WordPress Menu Manager

1. Log in to your WordPress admin panel at `https://wordpress.genego.ch/wp-admin`
2. Navigate to **Appearance → Menus**

### Step 2: Create the Footer Menu

1. Click **"Create a new menu"**
2. Enter the menu name: **Footer** (exactly as shown)
3. Click **"Create Menu"**

### Step 3: Add Menu Items

You can add different types of items to your menu:

- **Pages**: Select from your existing WordPress pages
- **Custom Links**: Add any URL with custom text
- **Categories**: Link to post categories
- **Posts**: Link to specific blog posts

Example footer menu items:
- Privacy Policy
- Terms of Service
- Contact
- About Us

### Step 4: Save the Menu

After adding items, click **"Save Menu"** at the bottom right.

### Step 5: Create Additional Menus (Optional)

You can create a **Main** menu for your header navigation following the same steps.

## Current Menu Status

The error message you're seeing indicates:
- ✅ The WordPress plugin is installed and working
- ❌ No menus have been created yet in WordPress

## Troubleshooting

If menus still don't appear after creating them:

1. **Flush Permalinks**: Go to Settings → Permalinks and click "Save Changes"
2. **Check Menu Names**: Ensure the menu is named exactly "Footer" or "Main" (case-insensitive)
3. **Verify Plugin**: Ensure the GeNeGo v0 Integration plugin is activated
4. **Clear Cache**: If using a caching plugin, clear the cache

## Menu Structure

The app expects menus in this format:
- **Footer**: Links displayed in the footer (Privacy, Terms, Contact, etc.)
- **Main**: Links displayed in the header navigation (optional)

Once you create these menus in WordPress, they will automatically appear in your v0 app.
