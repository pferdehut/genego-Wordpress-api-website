<?php
/**
 * Plugin Name: Enable REST API
 * Description: Forces the REST API to be enabled and adds CORS headers
 * Version: 1.0
 * Author: GeNeGo
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Remove any filters that might disable REST API
remove_filter('rest_authentication_errors', 'rest_filter_incoming_connections');
remove_filter('rest_pre_dispatch', 'rest_filter_incoming_connections');

// Force enable REST API
add_filter('rest_authentication_errors', function($result) {
    // If there's already an error, clear it
    if (is_wp_error($result)) {
        return null;
    }
    return $result;
});

// Add CORS headers to allow requests from your v0 app
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $allowed_origins = [
            'https://v0.dev',
            'https://genego.vercel.app',
            'http://localhost:3000'
        ];
        
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            header('Access-Control-Allow-Origin: *');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        
        return $value;
    });
}, 15);

// Log REST API requests for debugging
add_action('rest_api_init', function() {
    error_log('[REST API] REST API initialized successfully');
});
