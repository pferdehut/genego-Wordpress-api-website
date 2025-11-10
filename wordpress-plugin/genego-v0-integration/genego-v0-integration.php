<?php
/**
 * Plugin Name: GeNeGo v0 Integration
 * Plugin URI: https://genego.ch
 * Description: Provides CORS-enabled REST API endpoints for the GeNeGo v0 app
 * Version: 1.0.0
 * Author: GeNeGo
 * Author URI: https://genego.ch
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: genego-v0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add CORS headers to REST API responses
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        // Allow requests from v0.dev, v0.app, and genego.vercel.app
        $allowed_origins = [
            'https://v0.dev',
            'https://v0.app',
            'https://genego.vercel.app', // Your production domain
        ];
        
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        // Allow v0 preview URLs (they follow pattern: https://[random].v0-preview.app)
        if (preg_match('/^https:\/\/.*\.v0-preview\.app$/', $origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } elseif (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
        
        return $value;
    });
}, 15);

/**
 * Register custom REST API endpoints
 */
add_action('rest_api_init', function() {
    // Home page endpoint
    register_rest_route('genego/v1', '/home', [
        'methods' => 'GET',
        'callback' => 'genego_get_home_data',
        'permission_callback' => '__return_true'
    ]);
    
    // All pages endpoint
    register_rest_route('genego/v1', '/pages', [
        'methods' => 'GET',
        'callback' => 'genego_get_all_pages',
        'permission_callback' => '__return_true'
    ]);
    
    // Single page by slug endpoint
    register_rest_route('genego/v1', '/pages/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => 'genego_get_page_by_slug',
        'permission_callback' => '__return_true'
    ]);
    
    // Posts by category endpoint
    register_rest_route('genego/v1', '/posts', [
        'methods' => 'GET',
        'callback' => 'genego_get_posts_by_category',
        'permission_callback' => '__return_true'
    ]);
    
    // Single post by slug endpoint
    register_rest_route('genego/v1', '/posts/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => 'genego_get_post_by_slug',
        'permission_callback' => '__return_true'
    ]);
});

/**
 * Get home page data
 */
function genego_get_home_data($request) {
    // Get the home page
    $home_page = get_page_by_path('home');
    
    if (!$home_page) {
        // Try to get the front page
        $home_page = get_post(get_option('page_on_front'));
    }
    
    if (!$home_page) {
        return new WP_Error('no_home', 'Home page not found', ['status' => 404]);
    }
    
    // Get hero images from gallery or featured image
    $hero_slides = [];
    $gallery_images = get_post_meta($home_page->ID, '_gallery_images', true);
    
    if ($gallery_images && is_array($gallery_images)) {
        foreach ($gallery_images as $image_id) {
            $image_url = wp_get_attachment_image_url($image_id, 'full');
            if ($image_url) {
                $hero_slides[] = [
                    'image' => $image_url,
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true)
                ];
            }
        }
    }
    
    // Fallback to featured image
    if (empty($hero_slides) && has_post_thumbnail($home_page->ID)) {
        $hero_slides[] = [
            'image' => get_the_post_thumbnail_url($home_page->ID, 'full'),
            'alt' => get_post_meta(get_post_thumbnail_id($home_page->ID), '_wp_attachment_image_alt', true)
        ];
    }
    
    // Parse content into paragraphs
    $content = apply_filters('the_content', $home_page->post_content);
    $content = strip_tags($content, '<p><br><strong><em><a>');
    $paragraphs = array_filter(explode('</p>', $content));
    $paragraphs = array_map(function($p) {
        return trim(strip_tags($p));
    }, $paragraphs);
    $paragraphs = array_values(array_filter($paragraphs));
    
    return [
        'heroSlides' => $hero_slides,
        'content' => [
            'title' => $home_page->post_title,
            'paragraphs' => $paragraphs
        ]
    ];
}

/**
 * Get all pages for navigation
 */
function genego_get_all_pages($request) {
    $pages = get_pages([
        'sort_column' => 'menu_order',
        'sort_order' => 'ASC'
    ]);
    
    $result = [];
    foreach ($pages as $page) {
        $url = ($page->post_name === 'home') ? '/' : '/' . $page->post_name;
        
        $result[] = [
            'id' => $page->ID,
            'title' => $page->post_title,
            'slug' => $page->post_name,
            'url' => $url
        ];
    }
    
    return $result;
}

/**
 * Get single page by slug
 */
function genego_get_page_by_slug($request) {
    $slug = $request['slug'];
    $page = get_page_by_path($slug);
    
    if (!$page) {
        return new WP_Error('no_page', 'Page not found', ['status' => 404]);
    }
    
    // Parse content into paragraphs
    $content = apply_filters('the_content', $page->post_content);
    $content = strip_tags($content, '<p><br><strong><em><a>');
    $paragraphs = array_filter(explode('</p>', $content));
    $paragraphs = array_map(function($p) {
        return trim(strip_tags($p));
    }, $paragraphs);
    $paragraphs = array_values(array_filter($paragraphs));
    
    // Get featured image
    $featured_image = null;
    if (has_post_thumbnail($page->ID)) {
        $featured_image = get_the_post_thumbnail_url($page->ID, 'full');
    }
    
    return [
        'title' => $page->post_title,
        'content' => $paragraphs,
        'featuredImage' => $featured_image
    ];
}

/**
 * Get posts by category slug
 */
function genego_get_posts_by_category($request) {
    $category_slug = $request->get_param('category');
    
    if (!$category_slug) {
        return new WP_Error('no_category', 'Category parameter is required', ['status' => 400]);
    }
    
    // Get category by slug
    $category = get_category_by_slug($category_slug);
    
    if (!$category) {
        return new WP_Error('category_not_found', 'Category not found', ['status' => 404]);
    }
    
    // Get posts in this category
    $posts = get_posts([
        'category' => $category->term_id,
        'posts_per_page' => 100,
        'orderby' => 'date',
        'order' => 'DESC'
    ]);
    
    $result = [];
    foreach ($posts as $post) {
        // Get featured image
        $featured_image = null;
        $featured_image_alt = '';
        if (has_post_thumbnail($post->ID)) {
            $featured_image = get_the_post_thumbnail_url($post->ID, 'full');
            $featured_image_alt = get_post_meta(get_post_thumbnail_id($post->ID), '_wp_attachment_image_alt', true);
        }
        
        // Get excerpt
        $excerpt = $post->post_excerpt;
        if (empty($excerpt)) {
            $excerpt = wp_trim_words($post->post_content, 30, '...');
        }
        
        $result[] = [
            'id' => $post->ID,
            'title' => $post->post_title,
            'excerpt' => $excerpt,
            'content' => apply_filters('the_content', $post->post_content),
            'date' => $post->post_date,
            'slug' => $post->post_name,
            'link' => get_permalink($post->ID),
            'featuredImage' => $featured_image,
            'featuredImageAlt' => $featured_image_alt
        ];
    }
    
    return $result;
}

/**
 * Get single post by slug
 */
function genego_get_post_by_slug($request) {
    $slug = $request['slug'];
    
    // Get post by slug
    $posts = get_posts([
        'name' => $slug,
        'post_type' => 'post',
        'posts_per_page' => 1
    ]);
    
    if (empty($posts)) {
        return new WP_Error('no_post', 'Post not found', ['status' => 404]);
    }
    
    $post = $posts[0];
    
    // Get featured image
    $featured_image = null;
    $featured_image_alt = '';
    if (has_post_thumbnail($post->ID)) {
        $featured_image = get_the_post_thumbnail_url($post->ID, 'full');
        $featured_image_alt = get_post_meta(get_post_thumbnail_id($post->ID), '_wp_attachment_image_alt', true);
    }
    
    // Get excerpt
    $excerpt = $post->post_excerpt;
    if (empty($excerpt)) {
        $excerpt = wp_trim_words($post->post_content, 30, '...');
    }
    
    return [
        'id' => $post->ID,
        'title' => $post->post_title,
        'excerpt' => $excerpt,
        'content' => apply_filters('the_content', $post->post_content),
        'date' => $post->post_date,
        'slug' => $post->post_name,
        'link' => get_permalink($post->ID),
        'featuredImage' => $featured_image,
        'featuredImageAlt' => $featured_image_alt
    ];
}
