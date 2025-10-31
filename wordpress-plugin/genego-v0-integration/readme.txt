=== GeNeGo v0 Integration ===
Contributors: genego
Tags: rest-api, cors, headless
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Provides CORS-enabled REST API endpoints for the GeNeGo v0 app.

== Description ==

This plugin enables the GeNeGo website to work with the v0 headless frontend by:

* Adding proper CORS headers to allow requests from v0.dev and preview URLs
* Providing custom REST API endpoints optimized for the v0 app
* Handling data transformation for seamless integration

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/genego-v0-integration/`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. The plugin works automatically - no configuration needed

== Custom Endpoints ==

* `/wp-json/genego/v1/home` - Get home page data with hero slides
* `/wp-json/genego/v1/pages` - Get all pages for navigation
* `/wp-json/genego/v1/pages/{slug}` - Get single page by slug

== Changelog ==

= 1.0.0 =
* Initial release
