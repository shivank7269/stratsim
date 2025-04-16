<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    // --- Prepare and Execute the Query ---
    $stmt = $conn->prepare("SELECT id, full_name, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        // --- Verify the Password ---
        if (password_verify($password, $user["password"])) {
            // --- Set Session Variables ---
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["full_name"] = $user["full_name"]; //Store user's full name

            $response = array("status" => "success", "message" => "Login successful", "full_name" => $user["full_name"]);
        } else {
            $response = array("status" => "error", "message" => "Invalid password");
        }
    } else {
        $response = array("status" => "error", "message" => "Invalid email");
    }

    $stmt->close();
    echo json_encode($response);
} else {
    $response = array("status" => "error", "message" => "Invalid request method");
    echo json_encode($response);
}

$conn->close();
?>