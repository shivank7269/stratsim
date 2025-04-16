<?php
session_start();
session_destroy();
header('Content-Type: application/json');
echo json_encode(array('status' => 'success', 'message' => 'Logged out successfully'));
?>