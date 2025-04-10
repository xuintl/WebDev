<?php
    // grab the incoming data
    $food = $_GET['food'];
    $activity = $_GET['activity'];

    // make sure the user filled everything out
    if ($food == 'empty' || $activity == 'empty') {
        // if not, generate an error message
        header("Location: index.php?error=missingstuff");
        exit();
    }

    // if everything is OK, diagnose the character!
    $bart = 0;
    $homer = 0;
    $lisa = 0;

    if ($food == 'bart') {
        $bart++;
    }
    else if ($food == 'homer') {
        $homer++;
    }
    else if ($food == 'lisa') {
        $lisa++;
    }
    else {
        header("Location: index.php?error=invalidcharacter");
        exit();
    }

    if ($activity == 'bart') {
        $bart++;
    }
    else if ($activity == 'homer') {
        $homer++;
    }
    else if ($activity == 'lisa') {
        $lisa++;
    }
    else {
        header("Location: index.php?error=invalidcharacter");
        exit();
    }


    if ($bart >= $homer && $bart >= $lisa) {
        header("Location: index.php?character=bart");
        exit();
    }
    else if ($homer >= $bart && $homer >= $lisa) {
        header("Location: index.php?character=homer");
        exit();
    }
    else {
        header("Location: index.php?character=lisa");
        exit();
    }
?>