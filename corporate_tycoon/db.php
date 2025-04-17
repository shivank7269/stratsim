<?php
$host = 'localhost';
$db   = 'stratsim';
$user = 'root';
$pass = '';  // Change this to your DB password

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>