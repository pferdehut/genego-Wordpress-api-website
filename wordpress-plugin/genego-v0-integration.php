<?php
/**
 * Plugin Name: GeNeGo v0 Integration
 * Plugin URI: https://wordpress.genego.ch
 * Description: Provides REST API endpoints with CORS support for v0 integration
 * Version: 1.2.0
 * Author: GeNeGo
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class GeNeGo_V0_Integration {
    
    private $allowed_origins = [
        'https://v0.dev',
        'http://localhost:3000',
        'http://localhost:5173',
    ];
    
    public function __construct() {
        // Add CORS headers to REST API
        add_action('rest_api_init', [$this, 'add_cors_headers']);
        
        // Register custom REST API endpoints
        add_action('rest_api_init', [$this, 'register_endpoints']);
        
        add_filter('rest_menu_read_access', '__return_true');
        add_filter('rest_menu_item_read_access', '__return_true');
        add_filter('rest_menu_location_read_access', '__return_true');
    }
    
    /**
     * Add CORS headers to all REST API responses
     */
    public function add_cors_headers() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        
        add_filter('rest_pre_serve_request', function($value) {
            $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
            
            // Check if origin is allowed
            if (in_array($origin, $this->allowed_origins) || $this->is_preview_url($origin)) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
                header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
                header('Access-Control-Allow-Credentials: true');
            }
            
            return $value;
        });
    }
    
    /**
     * Check if origin is a v0 preview URL
     */
    private function is_preview_url($origin) {
        return strpos($origin, '.vercel.app') !== false || 
               strpos($origin, 'v0.dev') !== false;
    }
    
    /**
     * Register custom REST API endpoints
     */
    public function register_endpoints() {
        // Get home page data
        register_rest_route('genego/v1', '/home', [
            'methods' => 'GET',
            'callback' => [$this, 'get_home_data'],
            'permission_callback' => '__return_true',
        ]);
        
        // Get all pages for navigation
        register_rest_route('genego/v1', '/pages', [
            'methods' => 'GET',
            'callback' => [$this, 'get_all_pages'],
            'permission_callback' => '__return_true',
        ]);
        
        // Get page by slug
        register_rest_route('genego/v1', '/pages/(?P<slug>[a-zA-Z0-9-]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_page_by_slug'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('genego/v1', '/menus/(?P<slug>[a-zA-Z0-9-_]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menu_by_slug'],
            'permission_callback' => '__return_true',
            'args' => [
                'slug' => [
                    'required' => true,
                    'type' => 'string',
                ],
            ],
        ]);
    }
    
    /**
     * Get menu by slug
     * Fetches WordPress menu items by menu slug (e.g., "footer", "main")
     */
    public function get_menu_by_slug($request) {
        $slug = $request['slug'];
        
        // Get all menus
        $menus = wp_get_nav_menus();
        $menu = null;
        
        $available_menus = [];
        foreach ($menus as $menu_obj) {
            $available_menus[] = $menu_obj->slug . ' (' . $menu_obj->name . ')';
        }
        
        // Try to find menu by slug or name (case-insensitive)
        foreach ($menus as $menu_obj) {
            if (strtolower($menu_obj->slug) === strtolower($slug) || 
                strtolower($menu_obj->name) === strtolower($slug)) {
                $menu = $menu_obj;
                break;
            }
        }
        
        // Also check menu locations
        if (!$menu) {
            $locations = get_nav_menu_locations();
            if (isset($locations[$slug])) {
                $menu = wp_get_nav_menu_object($locations[$slug]);
            }
        }
        
        if (!$menu) {
            if (empty($menus)) {
                return new WP_Error(
                    'no_menus_exist', 
                    'No menus have been created yet in WordPress. To create a menu: Go to Appearance > Menus in your WordPress admin, create a new menu named "' . ucfirst($slug) . '", add menu items, and save.',
                    ['status' => 404]
                );
            } else {
                return new WP_Error(
                    'menu_not_found', 
                    'Menu "' . $slug . '" not found. Available menus: ' . implode(', ', $available_menus) . '. To create the "' . ucfirst($slug) . '" menu: Go to Appearance > Menus in WordPress admin.',
                    ['status' => 404]
                );
            }
        }
        
        // Get menu items
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        
        if (!$menu_items) {
            return [
                'name' => $menu->name,
                'slug' => $menu->slug,
                'items' => [],
            ];
        }
        
        // Transform menu items to simple format
        $result = [];
        foreach ($menu_items as $item) {
            $result[] = [
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'parent' => $item->menu_item_parent,
                'order' => $item->menu_order,
            ];
        }
        
        return [
            'name' => $menu->name,
            'slug' => $menu->slug,
            'items' => $result,
        ];
    }
    
    /**
     * Get home page data
     */
    public function get_home_data($request) {
        $home_page = get_page_by_path('home');
        
        if (!$home_page) {
            // Try to get the front page
            $home_page = get_post(get_option('page_on_front'));
        }
        
        if (!$home_page) {
            return new WP_Error('no_home', 'Home page not found', ['status' => 404]);
        }
        
        // Get hero images from gallery or featured images
        $hero_slides = $this->get_hero_slides($home_page->ID);
        
        // Parse content into paragraphs
        $content = apply_filters('the_content', $home_page->post_content);
        $paragraphs = $this->extract_paragraphs($content);
        
        return [
            'heroSlides' => $hero_slides,
            'content' => [
                'title' => get_the_title($home_page->ID),
                'paragraphs' => $paragraphs,
            ],
        ];
    }
    
    /**
     * Get all published pages for navigation
     */
    public function get_all_pages($request) {
        $pages = get_pages([
            'post_status' => 'publish',
            'sort_column' => 'menu_order',
            'sort_order' => 'ASC',
        ]);
        
        $result = [];
        foreach ($pages as $page) {
            $result[] = [
                'id' => $page->ID,
                'title' => $page->post_title,
                'slug' => $page->post_name,
                'url' => '/' . $page->post_name,
                'parent' => $page->post_parent,
            ];
        }
        
        return $result;
    }
    
    /**
     * Get page by slug
     */
    public function get_page_by_slug($request) {
        $slug = $request['slug'];
        $page = get_page_by_path($slug);
        
        if (!$page) {
            return new WP_Error('no_page', 'Page not found', ['status' => 404]);
        }
        
        $content = apply_filters('the_content', $page->post_content);
        
        return [
            'id' => $page->ID,
            'title' => $page->post_title,
            'slug' => $page->post_name,
            'content' => $content, // Return HTML string directly
            'featuredImage' => get_the_post_thumbnail_url($page->ID, 'large'),
        ];
    }
    
    /**
     * Get hero slides from page
     */
    private function get_hero_slides($page_id) {
        $slides = [];
        
        // Try to get gallery images from custom field
        $gallery = get_post_meta($page_id, 'hero_gallery', true);
        
        if ($gallery && is_array($gallery)) {
            foreach ($gallery as $image_id) {
                $slides[] = [
                    'image' => wp_get_attachment_url($image_id),
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                ];
            }
        }
        
        // Fallback to featured image
        if (empty($slides)) {
            $featured_image = get_the_post_thumbnail_url($page_id, 'large');
            if ($featured_image) {
                $slides[] = [
                    'image' => $featured_image,
                    'alt' => get_the_title($page_id),
                ];
            }
        }
        
        // Default placeholder if no images
        if (empty($slides)) {
            $slides[] = [
                'image' => '/placeholder.svg?height=600&width=1200',
                'alt' => 'GeNeGo Housing Project',
            ];
        }
        
        return $slides;
    }
    
    /**
     * Extract paragraphs from HTML content
     */
    private function extract_paragraphs($content) {
        // Remove HTML tags but keep structure
        $content = strip_tags($content, '<p><br>');
        
        // Split by paragraph tags
        $paragraphs = preg_split('/<\/?p>/', $content, -1, PREG_SPLIT_NO_EMPTY);
        
        // Clean up and filter empty paragraphs
        $paragraphs = array_map('trim', $paragraphs);
        $paragraphs = array_filter($paragraphs);
        
        // Re-index array
        return array_values($paragraphs);
    }
}

// Initialize the plugin
new GeNeGo_V0_Integration();
