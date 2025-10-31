=== Enable REST API ===
Contributors: genego
Tags: rest-api, cors, api
Requires at least: 4.7
Tested up to: 6.4
Stable tag: 1.0
License: GPLv2 or later

Forces the WordPress REST API to be enabled and adds CORS headers for cross-origin requests.

== Description ==

This plugin ensures the WordPress REST API is enabled and accessible, even if other plugins or settings have disabled it. It also adds proper CORS headers to allow requests from your v0 app.

Use this plugin if:
* Your REST API is not working
* You're getting CORS errors
* Security plugins are blocking the REST API

== Installation ==

1. Download the plugin ZIP file
2. Go to Plugins → Add New → Upload Plugin
3. Upload the ZIP file
4. Activate the plugin
5. Test by visiting: https://your-site.com/wp-json/

== Frequently Asked Questions ==

= How do I know if it's working? =

Visit https://your-site.com/wp-json/ in your browser. You should see JSON data about your site.

= Is this secure? =

Yes, this plugin only enables READ access to public content. It doesn't expose private data or allow modifications without authentication.

== Changelog ==

= 1.0 =
* Initial release
* Force enable REST API
* Add CORS headers
