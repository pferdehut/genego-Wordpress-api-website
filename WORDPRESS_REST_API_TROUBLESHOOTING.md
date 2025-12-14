# WordPress REST API Troubleshooting Guide

Your WordPress REST API at `https://wordpress.genego.ch/wp-json/wp/v2/pages` is not working. Let's fix it.

## Step 1: Check if REST API is Completely Disabled

Visit this URL in your browser:
\`\`\`
https://wordpress.genego.ch/wp-json/
\`\`\`

**What you should see:**
- A JSON response with information about your WordPress site
- Something like: `{"name":"GeNeGo","description":"...","url":"...","routes":{...}}`

**If you see an error or blank page**, the REST API is disabled or blocked.

## Step 2: Common Causes and Fixes

### A. Security Plugins Blocking REST API

Many security plugins disable the REST API by default. Check these plugins:

**Wordfence:**
1. Go to: Wordfence → All Options
2. Find: "Disable REST API"
3. Make sure it's set to "Allow REST API"

**iThemes Security:**
1. Go to: Security → Settings → WordPress Tweaks
2. Find: "REST API"
3. Uncheck "Disable REST API for non-authenticated users"

**All In One WP Security:**
1. Go to: WP Security → Miscellaneous
2. Find: "Disable REST API"
3. Uncheck this option

**Other security plugins:**
- Look for any setting mentioning "REST API" or "JSON API"
- Make sure it's enabled or not blocked

### B. Permalink Settings

The REST API requires pretty permalinks to work:

1. Go to: Settings → Permalinks
2. Make sure it's NOT set to "Plain"
3. Choose any other option (Post name is recommended)
4. Click "Save Changes"

### C. .htaccess File Issues

If you have a custom `.htaccess` file, it might be blocking the REST API.

**Check your .htaccess file** (in your WordPress root directory):
- Look for any rules that might block `/wp-json/`
- Temporarily rename `.htaccess` to `.htaccess.backup` and test if REST API works
- If it works, you need to fix the .htaccess rules

### D. Server Configuration

Some hosting providers block the REST API by default.

**Contact your hosting provider** and ask:
- "Is the WordPress REST API enabled on my account?"
- "Are there any firewall rules blocking /wp-json/ requests?"

### E. Check WordPress Version

The REST API was added in WordPress 4.7. Make sure you're running at least that version:

1. Go to: Dashboard → Updates
2. Check your WordPress version
3. Update if you're below 4.7

## Step 3: Test with a Simple Plugin

If nothing above works, install this test plugin to force-enable the REST API:

**Create a file called `enable-rest-api.php`:**

\`\`\`php
<?php
/**
 * Plugin Name: Enable REST API
 * Description: Forces the REST API to be enabled
 * Version: 1.0
 */

// Remove any filters that might disable REST API
remove_filter('rest_authentication_errors', 'rest_filter_incoming_connections');
remove_filter('rest_pre_dispatch', 'rest_filter_incoming_connections');

// Force enable REST API
add_filter('rest_authentication_errors', function($result) {
    if (is_wp_error($result)) {
        return null;
    }
    return $result;
});

// Add CORS headers
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
}, 15);
\`\`\`

**Install it:**
1. Save this as `enable-rest-api.php`
2. ZIP it
3. Upload to WordPress: Plugins → Add New → Upload Plugin
4. Activate it

## Step 4: Test Again

After trying the fixes above, test these URLs in your browser:

1. `https://wordpress.genego.ch/wp-json/`
   - Should show JSON with site info

2. `https://wordpress.genego.ch/wp-json/wp/v2/pages`
   - Should show JSON array of your pages

3. `https://wordpress.genego.ch/wp-json/wp/v2/posts`
   - Should show JSON array of your posts

## Step 5: If Still Not Working

If the REST API still doesn't work after all these steps:

1. **Check server error logs** - Your hosting provider can help with this
2. **Try a different WordPress installation** - Test on a fresh WordPress install to see if it's a site-specific issue
3. **Contact your hosting provider** - They might have server-level restrictions

## Quick Diagnostic Commands

If you have SSH access to your server, run these commands:

\`\`\`bash
# Test if wp-json is accessible
curl https://wordpress.genego.ch/wp-json/

# Test with verbose output to see what's happening
curl -v https://wordpress.genego.ch/wp-json/wp/v2/pages
\`\`\`

## What to Report Back

Please let me know:
1. What do you see when you visit `https://wordpress.genego.ch/wp-json/` in your browser?
2. Do you have any security plugins installed? Which ones?
3. What are your permalink settings?
4. What WordPress version are you running?

This information will help me provide more specific guidance.
