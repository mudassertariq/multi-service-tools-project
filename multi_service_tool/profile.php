<?php
// -----------------------------------------------
// profile.php — Protected Route Example
// -----------------------------------------------
// Yeh file sirf logged-in users access kar sakte hain

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'auth_middleware.php'; // Yeh line token check karti hai

// Agar yahan tak pahunche matlab token sahi tha
echo json_encode([
    "success" => true,
    "message" => "Yeh protected data hai!",
    "user"    => [
        "id"    => $currentUser['user_id'],
        "name"  => $currentUser['name'],
        "email" => $currentUser['email']
    ]
]);
?>