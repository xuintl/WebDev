<?php

$filePath = 'todolist.json';

if (file_exists($filePath)) {
    $jsonList = file_get_contents($filePath);
    if ($jsonList) {
        print $jsonList;
    } else {
        print 'error reading file';
    }
} else {
    // File doesn't exist, which is fine on first load. Client will handle empty list.
    print 'file not found';
}

?>