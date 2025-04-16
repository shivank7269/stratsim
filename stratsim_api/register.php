<?php
require_once 'db_connect.php';

header('Content-Type: application/json'); // Set response type

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = $_POST["full_name"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    // --- IMPORTANT: Password Hashing ---
    $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Use bcrypt

    // --- Prepare and Execute the Query ---
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $full_name, $email, $hashed_password);  // "sss" = three strings

    if ($stmt->execute()) {
        $response = array("status" => "success", "message" => "Registration successful");
    } else {
        $response = array("status" => "error", "message" => "Registration failed: " . $stmt->error);
    }

    $stmt->close();
    echo json_encode($response); // Send JSON response
} else {
    $response = array("status" => "error", "message" => "Invalid request method");
    echo json_encode($response);
}

$conn->close();
?>