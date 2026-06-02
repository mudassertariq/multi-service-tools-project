<?php
// -----------------------------------------------
// login.php — User Login (Backend only)
// -----------------------------------------------

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed"]);
    exit();
}

$data     = json_decode(file_get_contents("php://input"), true);
$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');

// Validation
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please enter a valid email address"]);
    exit();
}

$db = getDB();

// User dhundo
$stmt = $db->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    $stmt->close();
    $db->close();
    exit();
}

$user = $result->fetch_assoc();

// Password verify
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    $stmt->close();
    $db->close();
    exit();
}

// Simple token (session-based)
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['name'];

$token = bin2hex(random_bytes(32));

echo json_encode([
    "success" => true,
    "message" => "Login successful!",
    "token"   => $token,
    "user"    => [
        "id"    => $user['id'],
        "name"  => $user['name'],
        "email" => $user['email']
    ]
]);

$stmt->close();
$db->close();
?>