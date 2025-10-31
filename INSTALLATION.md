# Installation Guide

## Step 1: Install WordPress Plugin

1. Download the `genego-v0-integration.php` file from the `wordpress-plugin` folder
2. Install it on your WordPress site (see `wordpress-plugin/README.md` for detailed instructions)
3. Activate the plugin in WordPress admin

## Step 2: Configure Environment Variable

In your v0 project, add the environment variable:

\`\`\`
WORDPRESS_API_URL=https://wordpress.genego.ch
\`\`\`

**Note**: Just use your WordPress base URL. The plugin handles the rest.

## Step 3: Create WordPress Pages

Create these pages in your WordPress admin:

1. **Home** (slug: `home`)
   - Add your homepage content
   - Set a featured image for the hero section
   
2. **Unser Projekt** (slug: `unser-projekt`)
   - Add project information
   - Add images and content
   
3. **Kontakt** (slug: `kontakt`)
   - This page is handled by the v0 app's contact form

## Step 4: Test the Connection

1. Visit `/wordpress-test` in your v0 app
2. Click "Test WordPress Connection"
3. You should see success messages and your WordPress content

## How It Works

The WordPress plugin:
- ✅ Adds proper CORS headers automatically
- ✅ Provides custom API endpoints optimized for v0
- ✅ Handles data transformation from WordPress to v0 format
- ✅ No authentication needed for public content

The v0 app:
- ✅ Fetches content from the custom plugin endpoints
- ✅ Falls back to placeholder content if WordPress is unavailable
- ✅ Dynamically builds navigation from WordPress pages

## Troubleshooting

### Plugin installed but still not working?

1. Go to **Settings → Permalinks** in WordPress admin
2. Click "Save Changes" (this refreshes rewrite rules)
3. Test the endpoint directly: `https://wordpress.genego.ch/wp-json/genego/v1/home`

### Getting 404 errors?

- Make sure the plugin is activated
- Refresh permalinks (see above)
- Check if WordPress REST API is enabled

### Still seeing placeholder content?

- Check browser console for error messages
- Visit `/wordpress-test` to diagnose the issue
- Verify the WORDPRESS_API_URL environment variable is set correctly

## Next Steps

Once everything is working:
1. Add more pages in WordPress
2. Customize the content
3. Add featured images to pages
4. The navigation will automatically update based on your WordPress pages
