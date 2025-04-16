<?php
$host = "localhost";
$username = "root";  // Change if you set a MySQL user
$password = "";      // Change if you set a MySQL password
$database = "stratsim";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//Enable sessions if not already enabled
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

?>