<!doctype html>
<html>
<head>
    <title>Add Movie</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
        }
        input{
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    </style>
</head>
<body>

    <?php
    $active_table_name_for_crud_operations = 'movies';
    $url_to_redirect_after_successful_insertion = 'index.php';
    $url_to_redirect_after_failed_insertion = 'add_form.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $title = trim($_POST['title']);
        $year = intval($_POST['year']);

        if (empty($title) || $year <= 1900 || $year > date("Y")) {
            header("Location: $url_to_redirect_after_failed_insertion?error=Invalid%20input");
            exit;
        }

        $db = new SQLite3('/home/yx2679/databases/movies.db');

        $stmt = $db->prepare("INSERT INTO $active_table_name_for_crud_operations (title, year) VALUES (:title, :year)");
        $stmt->bindValue(':title', $title, SQLITE3_TEXT);
        $stmt->bindValue(':year', $year, SQLITE3_INTEGER);

        $db->close();
        unset($db);

        if ($stmt->execute()) {
            header("Location: $url_to_redirect_after_successful_insertion?success=1");
            exit;
        } else {
            header("Location: $url_to_redirect_after_failed_insertion?error=Insert%20failed");
            exit;
        }
    }
    ?>

</body>
</html>