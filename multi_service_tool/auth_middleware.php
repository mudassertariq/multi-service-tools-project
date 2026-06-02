<?php
// -----------------------------------------------
// auth_middleware.php — For Protected Routes
// -----------------------------------------------
// Include this at the top of any protected file:
// require_once 'auth_middleware.php';
// Then use $currentUser to get user info

require_once 'jwt.php';

function authenticate() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token not found. Please login first."]);
        exit();
    }

    $token = substr($authHeader, 7); // Remove "Bearer "
    $decoded = verifyJWT($token);

    if (!$decoded) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid or expired token."]);
        exit();
    }

    return $decoded;
}

// Authenticate and save user data
$currentUser = authenticate();
?>