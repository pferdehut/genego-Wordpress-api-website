# WordPress Content Setup Guide

## Your WordPress Site: wordpress.genego.ch

Follow these steps to prepare your WordPress site to work with the v0 app.

## Step 1: Verify WordPress REST API is Working

First, test if your WordPress REST API is accessible:

1. Open your browser and visit: `https://wordpress.genego.ch/wp-json/wp/v2/pages`
2. You should see JSON data with your pages
3. If you see an error or "REST API disabled", you need to enable it

### Enable REST API (if disabled)

If the REST API is disabled, add this to your `wp-config.php`:
```php
// Enable REST API
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    return true;
});
```

## Step 2: Install the GeNeGo Plugin (Recommended)

The plugin handles CORS automatically and provides optimized endpoints.

1. Download the project ZIP from v0
2. Extract and find the `wordpress-plugin/genego-v0-integration` folder
3. ZIP just that folder (right-click → Compress/Create Archive)
4. In WordPress admin: **Plugins → Add New → Upload Plugin**
5. Upload the ZIP file and click **Install Now**
6. Click **Activate Plugin**

## Step 3: Create Required Pages in WordPress

Create these pages in WordPress with **exact slugs**:

### Homepage Content
1. Go to **Pages → Add New**
2. Title: "Home" (or any title you want)
3. **Important**: Set the slug to `home`
   - Click "Edit" next to the permalink
   - Change slug to exactly: `home`
4. Add your content
5. Publish the page

### Project Page
1. Go to **Pages → Add New**
2. Title: "Unser Projekt"
3. **Important**: Set the slug to `unser-projekt`
4. Add your project information
5. Publish the page

### Additional Pages (Optional)
Create any other pages you want in the navigation. They will automatically appear in the menu.

## Step 4: Configure Environment Variable in v0

1. In v0, click the sidebar menu (left side)
2. Go to **Vars** section
3. Add or verify: `WORDPRESS_API_URL` = `https://wordpress.genego.ch`
4. Save

## Step 5: Test the Connection

1. Visit `/wordpress-test` in your v0 app
2. You should see: "Successfully connected to WordPress"
3. It will show how many pages were found

## Troubleshooting

### "fetch failed" or "Load failed"

**Check 1: Is WordPress accessible?**
- Visit `https://wordpress.genego.ch` in your browser
- Make sure the site loads

**Check 2: Is REST API enabled?**
- Visit `https://wordpress.genego.ch/wp-json/wp/v2/pages`
- You should see JSON data, not an error

**Check 3: CORS Issue?**
- If the plugin is installed and activated, CORS should work
- If not using the plugin, add CORS headers manually (see WORDPRESS_CORS_SETUP.md)

### "No content showing"

**Check 1: Pages exist with correct slugs?**
- In WordPress admin, go to **Pages**
- Verify you have pages with slugs: `home` and `unser-projekt`
- Check the slug by clicking "Quick Edit" on each page

**Check 2: Pages are published?**
- Make sure pages are **Published**, not Draft

**Check 3: Environment variable set?**
- In v0 sidebar → Vars
- Verify `WORDPRESS_API_URL` is set to `https://wordpress.genego.ch`

### Still not working?

1. Check browser console for errors (F12 → Console tab)
2. Visit `/wordpress-test` to see detailed diagnostics
3. Look for `[v0]` prefixed messages in the console
4. Verify the plugin is activated in WordPress (Plugins page)

## Content Structure

### For Homepage (slug: `home`)
The app looks for these fields in your page content:
- **Title**: Main heading
- **Content**: Main text content (will be split into paragraphs)
- **Featured Image**: Used in the hero carousel

### For Project Page (slug: `unser-projekt`)
- **Title**: Project title
- **Content**: Project description and details

## Advanced: Custom Fields (Optional)

If you want more control over the homepage layout, install **Advanced Custom Fields (ACF)** plugin and add these fields to the "home" page:

- `hero_title` - Text field for hero title
- `hero_subtitle` - Text field for subtitle
- `hero_images` - Gallery field for carousel images
- `cta_text` - Text field for button text
- `cta_link` - URL field for button link

The app will automatically use these if they exist.
