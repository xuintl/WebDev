<?php

// connect to our database
$path = '/home/yx2679/databases';
$db = new SQLite3($path.'/accounts.db');

if ($_GET['command'] == 'login') {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $sql = "SELECT COUNT(*) FROM users WHERE username = :username";
        $statement = $db->prepare($sql);
        $statement->bindValue(':username', $username);
        $result = $statement->execute();
        $row = $result->fetchArray();

        // username exists???
        if ($row[0] > 0) {
            // username exists, verify password
            $sql = "SELECT password FROM users WHERE username = :username";
            $statement = $db->prepare($sql);
            $statement->bindValue(':username', $username);
            $result = $statement->execute();
            $user = $result->fetchArray();

            if ($password === $user['password']) {
                // correct password -> login
                $_SESSION["user"] = $username;
                echo json_encode(array("success" => true));
            } else {
                // wrong password
                echo json_encode(array("success" => false, "error" => "Incorrect password"));
            }
        } else {
            // username does not exist, create user
            $sql = "INSERT INTO users (username, password) VALUES (:username, :password)";
            $statement = $db->prepare($sql);
            $statement->bindValue(':username', $username);
            $statement->bindValue(':password', $password);
            $result = $statement->execute();

            if ($result) {
                // user created -> login
                $_SESSION["user"] = $username;
                echo json_encode(array("success" => true));
            } else {
                // user not created
                echo json_encode(array("success" => false, "error" => "Error creating user"));
            }
        }
    } else {
        echo json_encode(array("success" => false, "error" => "Missing username or password"));
    }
} else {
    echo json_encode(array("success" => false, "error" => "Invalid command"));
}

?>