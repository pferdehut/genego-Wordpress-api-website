# WordPress Backend Setup

This Next.js application is designed to work with WordPress as a headless CMS using the WordPress REST API.

## Quick Start (Works Without WordPress)

The site works out of the box with fallback content. You can view and test the site immediately without setting up WordPress.

## Connecting WordPress

### Step 1: Set Up WordPress

1. Install WordPress on your server or use a hosting provider
2. Ensure WordPress REST API is enabled (it's enabled by default in WordPress 4.7+)
3. Your WordPress REST API will be available at: `https://your-site.com/wp-json/wp/v2`

### Step 2: Configure Environment Variable

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

### Step 3: Create Content in WordPress

Create the following pages in WordPress with these slugs:

1. **home** - Homepage content (or the system will use your default homepage)
2. **unser-projekt** - Project information page
3. Add any additional pages you want to appear in the navigation

The system will automatically fetch all published pages and display them in the navigation menu.

### Step 4: Optional - Advanced Custom Fields

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

- `GET /wp-json/wp/v2/pages` - Fetch all pages
- `GET /wp-json/wp/v2/pages?slug={slug}` - Fetch page by slug
- `GET /wp-json/wp/v2/posts` - Fetch all posts
- `GET /wp-json/wp/v2/media/{id}` - Fetch media by ID

## CORS Configuration

If you encounter CORS issues when testing locally, add this to your WordPress `functions.php`:

\`\`\`php
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}, 15);
\`\`\`

## Testing the Connection

Visit `/wordpress-test` in your app to test the WordPress connection and see detailed diagnostic information. This page will help you troubleshoot any connection issues.

## Troubleshooting

1. **"fetch failed" error**: Check that your WordPress site is accessible and the REST API is enabled
2. **No content showing**: Verify the WORDPRESS_API_URL is set correctly in the Vars section
3. **CORS errors**: Add the CORS configuration to your WordPress site (see above)
4. **404 errors**: Ensure you've created pages in WordPress with the correct slugs
