<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION["user_id"])) {
    header("location: login.php");  // Redirect to login page
    exit;
}

// Get the game ID from the query string
if (isset($_GET["game"])) {
    $gameId = htmlspecialchars($_GET["game"]); // Sanitize the input
} else {
    // If no game ID is provided, redirect to the home page or display an error
    header("location: index.php"); // Redirect to the home page
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Game: <?php echo htmlspecialchars($gameId); ?></title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        body { font: 14px sans-serif; text-align: center; }
    </style>
</head>
<body>
    <h1 class="my-5">Welcome to the Game: <?php echo htmlspecialchars($gameId); ?></h1>
    <p>
        This is where the <?php echo htmlspecialchars($gameId); ?> game will be loaded.
    </p>
    <p>
        <a href="../stratsim/logout.php" class="btn btn-danger ml-3">Sign Out of Your Account</a>  <!-- Added logout link -->
    </p>
</body>
</html>