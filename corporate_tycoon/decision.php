<?php include 'db.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <title>Make Your Business Decisions</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="container">
    <h2>Business Decisions - Round 1</h2>
    <form method="POST" action="result.php">
        <label>Marketing Budget ($):</label>
        <input type="number" name="marketing" required>

        <label>R&D Investment ($):</label>
        <input type="number" name="rnd" required>

        <label>Employee Training ($):</label>
        <input type="number" name="training" required>

        <button type="submit">Submit Decisions</button>
    </form>
</div>
</body>
</html>