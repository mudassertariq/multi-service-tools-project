<?php
// -----------------------------------------------
// contact.php — Contact Form Data Save
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

$data    = json_decode(file_get_contents("php://input"), true);
$name    = trim($data['name']    ?? '');
$email   = trim($data['email']   ?? '');
$message = trim($data['message'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please enter a valid email address"]);
    exit();
}

if (strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Message must be at least 10 characters"]);
    exit();
}

$db = getDB();

$stmt = $db->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $message);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Message sent successfully! We will get back to you soon."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Message could not be saved. Please try again."]);
}

$stmt->close();
$db->close();
?>