<?php

// Use print_r() to debug the $_GET array if needed
if (!isset($_GET['command'])) {
    print "error";
    exit();
}

// connect to our database
$path = 'databases';
$db = new SQLite3($path.'/chat.db');

// API call to save a message to the 'messages' table
// requirements:
//                  command = "savemessage"
//                  $_POST['username'] (string)
//                  $_POST['message'] (string)
function save_message($db, $username, $message) {
    // construct a SQL statement to save this message to our database
    $sql = "INSERT INTO messages (username, message) VALUES (:username, :message)";
    $statement = $db->prepare($sql);
    $statement->bindValue(':username', $username);
    $statement->bindValue(':message', $message);
    return $statement->execute();
}

if ($_GET['command'] == 'savemessage' && isset($_POST['username']) && isset($_POST['message'])) {
    $result = save_message($db, $_POST['username'], $_POST['message']);
    if ($result) {
        print "success sending message";
    } else {
        print "error sending message";
    }
}

// API call to retrieve all messages from the 'messages' table after a given id
// requirements:
//                  command = "getmessages"
//                  $_POST['id'] (integer)
else if ($_GET['command'] == 'getmessages' && isset($_POST['id'])) {
    // construct a SQL statement to retrieve all messages greater than the supplied id
    $sql = "SELECT id, username, message, date FROM messages WHERE id > :id ORDER BY id";
    $statement = $db->prepare($sql);
    $statement->bindValue(':id', $_POST['id']);
    $result = $statement->execute();

    // construct an object to send back to the client
    // this object will have two properties:
    // - messages: an array of messages, ordered by id
    // - id: an integer representing the last id included in the messages array
    $send_back = [];
    $send_back['messages'] = [];
    $send_back['id'] = $_POST['id'];

    // iterate over the result set
    while ($row = $result->fetchArray()) {
        // store the result in an object
        $record = [];
        $record['id'] = $row[0];
        $record['username'] = $row[1];
        $record['message'] = $row[2];
        $record['date'] = $row[3];
        // push the object onto the 'messages' array
        array_push($send_back['messages'], $record);
        // update the 'id' variable to keep track of the largest id
        $send_back['id'] = $record['id'];
    }

    // encode the object as a JSON string and send it to the client
    print json_encode($send_back);
}

else if ($_GET['command'] == 'coinflip' && isset($_POST['username'])) {
    $coinflip_result = (rand(0, 1) == 0) ? 'Heads' : 'Tails';

    $sql = "INSERT INTO coin_flips (username, result) VALUES (:username, :result)";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':username', $_POST['username']);
    $stmt->bindValue(':result', $coinflip_result);
    $sql_result = $stmt->execute();
    
    if ($sql_result) {
        $chat_message = $_POST['username'] . " flipped a coin - " . $coinflip_result . "!";
        $msg_result = save_message($db, $_POST['username'], $chat_message);
        if ($msg_result) {
            print "success sending coin flip message";
        } else {
            print "error sending coin flip message";
        }
    } else {
        print "error saving coin flip result";
    }
}

else if ($_GET['command'] == 'coinfliphistory' && isset($_POST['username']) && isset($_POST['limit'])) {
    $limit = intval($_POST['limit']);
    if ($limit <= 0) {
        print "error: limit must be a positive integer";
        exit();
    }
    
    $sql = "SELECT result FROM coin_flips ORDER BY id DESC LIMIT :limit";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $results = $stmt->execute();

    $heads_count = 0;
    $tails_count = 0;
    $total_count = 0;

    while ($row = $results->fetchArray()) {
        if ($row['result'] == 'Heads') {
            $heads_count++;
        } else if ($row['result'] == 'Tails') {
            $tails_count++;
        }
        $total_count++;
    }

    $display_limit = ($total_count < $limit && $total_count > 0) ? $total_count : $limit;
    if ($total_count == 0) {
        $chat_message = $_POST['username'] . " requested coin flip history. No flips recorded yet!";
    } else if ($display_limit < $limit) {
        $chat_message = $_POST['username'] . " requested the coin flip history for last " . $limit . " flips.\nHowever, only " . $display_limit . " flips were recorded:\nHeads: " . $heads_count . "\nTails: " . $tails_count;
    } else {
        $chat_message = $_POST['username'] . " requested the coin flip history for last " . $display_limit . " flips:\nHeads: " . $heads_count . "\nTails: " . $tails_count;
    }

    $msg_result = save_message($db, $_POST['username'], $chat_message);
    if ($msg_result) {
        print "success sending history message";
    } else {
        print "error sending history message";
    }
}

else { // invalid command
    print "API command error: " . $_GET['command'];
}

// close the database and release it for the next request
$db->close();
unset($db);

?>