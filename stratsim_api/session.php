<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

if (isset($_SESSION["user_id"])) {
    $response = array("status" => "success", "loggedIn" => true, "user_id" => $_SESSION["user_id"], "full_name" => $_SESSION["full_name"]);
} else {
    $response = array("status" => "success", "loggedIn" => false);
}

echo json_encode($response);
?>