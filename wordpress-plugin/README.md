# GeNeGo v0 Integration Plugin

This WordPress plugin provides REST API endpoints with proper CORS support for your v0 application.

## Installation

### Method 1: Upload via WordPress Admin

1. Download the `genego-v0-integration.php` file
2. Go to your WordPress admin panel
3. Navigate to **Plugins → Add New → Upload Plugin**
4. Choose the `genego-v0-integration.php` file
5. Click **Install Now**
6. Activate the plugin

### Method 2: FTP/SFTP Upload

1. Connect to your WordPress site via FTP/SFTP
2. Navigate to `/wp-content/plugins/`
3. Create a new folder called `genego-v0-integration`
4. Upload `genego-v0-integration.php` to this folder
5. Go to WordPress admin → Plugins
6. Activate "GeNeGo v0 Integration"

### Method 3: Direct File Access

If you have direct server access:

\`\`\`bash
cd /path/to/wordpress/wp-content/plugins/
mkdir genego-v0-integration
cd genego-v0-integration
# Copy the genego-v0-integration.php file here
\`\`\`

Then activate via WordPress admin.

## What This Plugin Does

1. **Adds CORS Headers**: Allows your v0 app to make requests to WordPress REST API
2. **Custom Endpoints**: Provides optimized endpoints for your v0 app:
   - `GET /wp-json/genego/v1/home` - Get home page data
   - `GET /wp-json/genego/v1/pages` - Get all pages for navigation
   - `GET /wp-json/genego/v1/pages/{slug}` - Get specific page by slug

## Allowed Origins

The plugin allows requests from:
- `https://v0.dev`
- `http://localhost:3000`
- `http://localhost:5173`
- Any `*.vercel.app` domain (for deployments)

## Testing the Plugin

After activation, test the endpoints:

1. **Test home endpoint**:
   \`\`\`
   https://wordpress.your-site.ch/wp-json/genego/v1/home
   \`\`\`

2. **Test pages list**:
   \`\`\`
   https://wordpress.your-site.ch/wp-json/genego/v1/pages
   \`\`\`

3. **Test specific page**:
   \`\`\`
   https://wordpress.your-site.ch/wp-json/genego/v1/pages/unser-projekt
   \`\`\`

## Required WordPress Pages

Create these pages in WordPress:
- **home** - Your homepage content
- **unser-projekt** - Project information page
- **kontakt** - Contact page

## Custom Fields (Optional)

For hero image galleries, you can add a custom field:
- Field name: `hero_gallery`
- Field type: Gallery (array of image IDs)

If not set, the plugin will use the featured image as fallback.

## Troubleshooting

### Plugin not working?

1. Check if plugin is activated
2. Go to **Settings → Permalinks** and click "Save Changes" (this refreshes rewrite rules)
3. Test endpoints directly in browser
4. Check WordPress error logs

### Still getting CORS errors?

1. Make sure the plugin is activated
2. Clear your browser cache
3. Check if another plugin is interfering with REST API
4. Verify your WordPress site is accessible

## Security

The plugin only allows GET requests for public content. No authentication is required for reading published pages.

## Support

For issues or questions, visit: https://genego.ch
