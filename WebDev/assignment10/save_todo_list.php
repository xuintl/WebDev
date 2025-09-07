<?php

if (isset($_POST['list'])) {
    $jsonList = $_POST['list'];
    $filePath = 'todolist.json'; 

    if (json_decode($jsonList) !== null) {
        if (file_put_contents($filePath, $jsonList)) {
            print 'save success';
        } else {
            print 'save error';
        }
    } else {
        print 'invalid JSON received';
    }
} else {
    print 'No data received';
}

?>