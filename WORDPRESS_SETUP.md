# WordPress Backend Setup

This Next.js application is designed to work with WordPress as a headless CMS using the WordPress REST API.

## Quick Start (Works Without WordPress)

The site works out of the box with fallback content. You can view and test the site immediately without setting up WordPress.

## Connecting WordPress

### Step 1: Set Up WordPress

1. Install WordPress on your server or use a hosting provider
2. Ensure WordPress REST API is enabled (it's enabled by default in WordPress 4.7+)
3. Your WordPress REST API will be available at: `https://your-site.com/wp-json/wp/v2`

### Step 2: Install the GeNeGo v0 Integration Plugin

**This plugin is REQUIRED for menu support and improved CORS handling.**

1. Download the plugin file from `wordpress-plugin/genego-v0-integration.php`
2. Upload it to your WordPress site:
   - Go to WordPress Admin → Plugins → Add New → Upload Plugin
   - Choose the `genego-v0-integration.php` file
   - Click "Install Now"
3. Activate the plugin
4. **Important:** After activating, go to Settings → Permalinks and click "Save Changes" to flush the rewrite rules

The plugin provides:
- Custom REST API endpoints with better performance
- CORS support for v0 and Vercel preview URLs
- Menu endpoints for Footer and Main navigation
- Optimized data structure for the frontend

### Step 3: Configure Environment Variable

Add the following environment variable to your project:

\`\`\`bash
WORDPRESS_API_URL=https://your-wordpress-site.com
\`\`\`

**Important:** You can provide just the base URL (e.g., `https://wordpress.genego.ch`) and the system will automatically append `/wp-json/wp/v2` to construct the proper REST API endpoint.

**In v0:**
1. Click the sidebar menu on the left
2. Navigate to "Vars" section
3. Add `WORDPRESS_API_URL` with your WordPress base URL (e.g., `https://wordpress.genego.ch`)

**In Vercel:**
1. Go to your project settings
2. Navigate to Environment Variables
3. Add `WORDPRESS_API_URL` with your WordPress base URL

**For local development:**
Create a `.env.local` file in the root directory:
\`\`\`
WORDPRESS_API_URL=https://your-wordpress-site.com
\`\`\`

### Step 4: Create Menus in WordPress

The application uses WordPress menus for navigation:

1. Go to WordPress Admin → Appearance → Menus
2. Create a menu called "Footer" (case-insensitive)
3. Create a menu called "Main" (case-insensitive) if needed
4. Add menu items (pages, custom links, etc.)
5. Save the menus

The footer will automatically display items from the "Footer" menu.

### Step 5: Create Content in WordPress

Create the following pages in WordPress with these slugs:

1. **home** - Homepage content (or the system will use your default homepage)
2. **unser-projekt** - Project information page
3. Add any additional pages you want to appear in the navigation

The system will automatically fetch all published pages and display them in the navigation menu.

### Step 6: Optional - Advanced Custom Fields

For more complex content structures, install the Advanced Custom Fields (ACF) plugin:

1. Install ACF plugin in WordPress
2. Create custom fields for your content
3. The app supports these ACF fields for the home page:
   - `hero_images` - Array of images for the carousel
   - `hero_title` - Main hero title
   - `hero_subtitle` - Hero subtitle
   - `main_content` - Main content text
   - `cta_text` - Call-to-action button text
   - `cta_link` - Call-to-action button link

## Authentication

**No API key is required** for self-hosted WordPress. The WordPress REST API is public by default for reading posts and pages. Authentication is only needed if you want to create, update, or delete content, or if you've restricted the REST API.

## API Endpoints Used

### Plugin Endpoints (Recommended)
- `GET /wp-json/genego/v1/home` - Fetch home page data
- `GET /wp-json/genego/v1/pages` - Fetch all pages
- `GET /wp-json/genego/v1/pages/{slug}` - Fetch page by slug
- `GET /wp-json/genego/v1/menus/{slug}` - Fetch menu by slug (e.g., "footer", "main")

### Standard WordPress Endpoints (Fallback)
- `GET /wp-json/wp/v2/pages` - Fetch all pages
- `GET /wp-json/wp/v2/pages?slug={slug}` - Fetch page by slug
- `GET /wp-json/wp/v2/posts` - Fetch all posts
- `GET /wp-json/wp/v2/media/{id}` - Fetch media by ID

## Troubleshooting

### Menu Not Loading (404 Error)

If you get a 404 error when fetching menus:

1. **Verify the plugin is installed and activated**
   - Go to WordPress Admin → Plugins
   - Look for "GeNeGo v0 Integration"
   - Make sure it's activated

2. **Flush permalinks**
   - Go to Settings → Permalinks
   - Click "Save Changes" (you don't need to change anything)
   - This refreshes WordPress's URL rewrite rules

3. **Check menu names**
   - Go to Appearance → Menus
   - Verify you have a menu named "Footer" or "Main"
   - Menu names are case-insensitive

4. **Test the endpoint directly**
   - Visit: `https://your-site.com/wp-json/genego/v1/menus/footer`
   - You should see JSON data with menu items
   - If you get a 404, the plugin isn't properly registered

5. **Re-upload the plugin**
   - If the above steps don't work, deactivate and delete the plugin
   - Re-upload the latest version from `wordpress-plugin/genego-v0-integration.php`
   - Activate it again

### Other Common Issues

1. **"fetch failed" error**: Check that your WordPress site is accessible and the REST API is enabled
2. **No content showing**: Verify the WORDPRESS_API_URL is set correctly in the Vars section
3. **CORS errors**: The plugin handles CORS automatically, but if you still have issues, check your server configuration
4. **404 errors for pages**: Ensure you've created pages in WordPress with the correct slugs

## Testing the Connection

Visit `/wordpress-test` in your app to test the WordPress connection and see detailed diagnostic information. This page will help you troubleshoot any connection issues.
