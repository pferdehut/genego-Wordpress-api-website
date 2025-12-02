# How to Install the GeNeGo v0 Integration Plugin

## Step 1: Create the ZIP file

You have two options:

### Option A: Download from v0
1. In v0, click the three dots (⋯) in the top right
2. Select "Download ZIP"
3. Extract the downloaded ZIP file
4. Navigate to the `wordpress-plugin` folder
5. ZIP only the `genego-v0-integration` folder (not the parent `wordpress-plugin` folder)

### Option B: Manual ZIP creation
1. Download the `genego-v0-integration` folder
2. On **Windows**: Right-click the folder → "Send to" → "Compressed (zipped) folder"
3. On **Mac**: Right-click the folder → "Compress genego-v0-integration"
4. On **Linux**: `zip -r genego-v0-integration.zip genego-v0-integration/`

**Important**: The ZIP file should contain the `genego-v0-integration` folder directly, not nested in another folder.

## Step 2: Upload to WordPress

1. Log in to your WordPress admin panel (https://your-site.ch/wp-admin)
2. Go to **Plugins** → **Add New**
3. Click **Upload Plugin** at the top
4. Click **Choose File** and select your `genego-v0-integration.zip` file
5. Click **Install Now**
6. After installation, click **Activate Plugin**

## Step 3: Verify Installation

1. Visit: `https://your-site.ch/wp-json/genego/v1/pages`
2. You should see a JSON response with your WordPress pages
3. If you see data, the plugin is working correctly!

## Step 4: Test in v0

1. Go back to your v0 app
2. Refresh the page
3. Your WordPress content should now load automatically

## Troubleshooting

**If you see "The package could not be installed":**
- Make sure the ZIP contains the `genego-v0-integration` folder directly
- The folder should contain `genego-v0-integration.php` and `readme.txt`

**If the plugin activates but content doesn't load:**
- Check that you have pages in WordPress with slugs like `home`, `unser-projekt`, etc.
- Visit the `/wordpress-test` page in your v0 app for diagnostics

**If you see CORS errors:**
- Make sure the plugin is activated
- Clear your browser cache
- Check browser console for specific error messages
