<?php
    // Grab the incoming data
    $food = $_GET['food'];
    $activity = $_GET['activity'];

    // Make sure the user filled everything out
    if ($food == 'empty' || $activity == 'empty') {
        // Redirect back with an error message
        header("Location: index.php?error=incomplete");
        exit();
    }

    // Initialize scores
    $bart = 0;
    $homer = 0;
    $lisa = 0;

    // Assign points based on food
    if ($food == 'bart') {
        $bart++;
    } else if ($food == 'homer') {
        $homer++;
    } else if ($food == 'lisa') {
        $lisa++;
    }

    // Assign points based on activity
    if ($activity == 'bart') {
        $bart++;
    } else if ($activity == 'homer') {
        $homer++;
    } else if ($activity == 'lisa') {
        $lisa++;
    }

    // Determine the character with the most points
    $result = '';
    if ($bart >= $homer && $bart >= $lisa) {
        $result = 'bart';
    } else if ($homer >= $bart && $homer >= $lisa) {
        $result = 'homer';
    } else {
        $result = 'lisa';
    }

    // Save the result to a text file
    $txt = "results.txt";
    $current_results = file_exists($txt) ? file_get_contents($txt) : '';
    $current_results .= $result . "\n";
    file_put_contents($txt, $current_results);

    // Set a cookie to store the user's result
    setcookie("quiz_result", $result, time() + (86400 * 30), "/"); // Expires in 30 days

    // Redirect to the results page
    header("Location: results.php?character=$result");
    exit();
?>