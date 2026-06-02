<?php
// -----------------------------------------------
// register.php — Sirf Backend (API only)
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
$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please enter a valid email address"]);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters"]);
    exit();
}

$db = getDB();

// Duplicate email check
$check = $db->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "This email is already registered"]);
    $check->close();
    $db->close();
    exit();
}
$check->close();

// Secure password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert
$stmt = $db->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed. Please try again."]);
}

$stmt->close();
$db->close();
?>