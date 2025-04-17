<?php
include 'db.php';

$marketing = $_POST['marketing'];
$rnd = $_POST['rnd'];
$training = $_POST['training'];

$growth = ($marketing * 0.3 + $rnd * 0.4 + $training * 0.3) / 1000;
$morale = min(100, $training / 10);
$innovation = min(100, $rnd / 10);

?>
<!DOCTYPE html>
<html>
<head>
    <title>Results</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="container">
    <h2>Business Results</h2>

    <div class="feedback">
        <strong>Growth Rate:</strong> <?php echo round($growth, 2); ?>%<br>
        <strong>Employee Morale:</strong> <?php echo round($morale); ?>/100<br>
        <strong>Innovation Score:</strong> <?php echo round($innovation); ?>/100
    </div>

    <div class="progress-bar">
        <div class="progress-bar-inner morale" style="width: <?php echo $morale; ?>%"></div>
    </div>
    <div class="progress-bar">
        <div class="progress-bar-inner rnd" style="width: <?php echo $innovation; ?>%"></div>
    </div>

    <a href="metrics.html"><button>View Metrics</button></a>
</div>
</body>
</html>