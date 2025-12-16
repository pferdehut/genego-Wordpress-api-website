# GeNeGo - WordPress Integration

This Next.js application connects to a WordPress backend via the REST API.

## Setup Instructions

### 1. WordPress Configuration

Your WordPress site needs to have the REST API enabled (it's enabled by default in WordPress 4.7+).

**Required WordPress Setup:**
- Ensure your WordPress site is accessible
- The REST API should be available at: `https://your-site.com/wp-json/wp/v2`
- Install a contact form plugin like Contact Form 7 or WPForms (optional)

### 2. Environment Variables

Add your WordPress API URL in the **Vars** section of the v0 sidebar:

```bash
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
```

**Important:** Make sure your URL ends with `/wp-json/wp/v2` and is publicly accessible.

### 3. Test Your Connection

Visit `/wordpress-test` to test your WordPress connection and diagnose any issues. This page will:
- Verify your WordPress URL is configured correctly
- Test connectivity to your WordPress site
- Show you what pages are available
- Provide troubleshooting steps if there are issues

### 4. WordPress Content Structure

Create the following pages in WordPress:

**Pages:**
- Homepage (slug: `home`) - Main content
- Unser Projekt (slug: `unser-projekt`) - Project details
- Kontakt (slug: `kontakt`) - Contact information

**Custom Fields (Optional):**
You can use Advanced Custom Fields (ACF) plugin to add:
- Hero carousel images
- Project timeline
- Team members
- Gallery images

### 4. Running the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## WordPress REST API Endpoints Used

- `GET /wp/v2/posts` - Fetch blog posts
- `GET /wp/v2/pages` - Fetch pages
- `GET /wp/v2/media/{id}` - Fetch media files
- `GET /wp/v2/posts?slug={slug}` - Fetch specific post/page

## Features

- ✅ Server-side rendering with Next.js 16
- ✅ WordPress REST API integration
- ✅ Responsive design
- ✅ Image carousel for hero section
- ✅ Contact form
- ✅ SEO-friendly
- ✅ Automatic data revalidation

## Customization

Edit the `lib/wordpress.ts` file to customize how data is fetched from WordPress. You can add custom post types, taxonomies, or ACF fields as needed.
