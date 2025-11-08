# Fix WordPress REST API "Not Found" Error

## The Problem
You're getting "Not Found" when accessing `https://wordpress.genego.ch/wp-json/`

This means the REST API endpoint doesn't exist, which is usually caused by **incorrect permalink settings**.

## Solution: Fix Permalinks (Most Common Fix)

### Step 1: Check Your Permalinks
1. Log into WordPress admin at `https://wordpress.genego.ch/wp-admin/`
2. Go to **Settings → Permalinks**
3. Check what's selected

### Step 2: Change Permalink Structure
If "Plain" is selected, the REST API won't work. Change it to any other option:

**Recommended:** Select **"Post name"** (most common and SEO-friendly)
- This creates URLs like: `https://wordpress.genego.ch/sample-page/`

**Or select:** "Day and name", "Month and name", or "Custom Structure"

### Step 3: Save Changes
1. Click **"Save Changes"** at the bottom
2. WordPress will automatically update your `.htaccess` file

### Step 4: Test the REST API
Visit: `https://wordpress.genego.ch/wp-json/`

You should now see JSON data instead of "Not Found"

---

## If Permalinks Don't Fix It

### Check 1: Is WordPress Installed Correctly?
Visit: `https://wordpress.genego.ch/wp-admin/`
- If this works, WordPress is installed
- If this doesn't work, WordPress might not be properly installed

### Check 2: .htaccess File
The `.htaccess` file might be missing or incorrect.

**Create/Update .htaccess** in your WordPress root directory:

\`\`\`apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
