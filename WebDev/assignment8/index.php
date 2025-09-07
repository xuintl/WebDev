<!doctype html>
<html>
<head>
    <title>Assignment 8</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            width: 100%;
        }
    </style>
</head>

<body>
    <h1>Movie Database</h1>

    <!-- Navigation Links -->
    <nav>
        <a href="index.php">Home</a> |
        <a href="add_form.php">Add</a> |
        <a href="search_form.php">Search</a>
    </nav>
    <br>

    <?php
    // connect to database
    $db = new SQLite3('/home/yx2679/databases/movies.db');

    // Handle delete request
    if (isset($_GET['delete'])) {
        $id_to_delete = intval($_GET['delete']);
        
        // Prepare and execute delete statement
        $delete_sql = "DELETE FROM movies WHERE id = :id";
        $delete_stmt = $db->prepare($delete_sql);
        $delete_stmt->bindValue(':id', $id_to_delete, SQLITE3_INTEGER);
        $delete_result = $delete_stmt->execute();
        
        // Check if deletion was successful
        if ($delete_result) {
            echo "<div style='width: 100%; background-color: #d4edda; padding: 5px; margin-bottom: 10px;'>Movie deleted successfully!</div>";
        } else {
            echo "<div style='width: 100%; background-color: #f8d7da; padding: 5px; margin-bottom: 10px;'>Failed to delete movie.</div>";
        }
    if (isset($_GET['success'])) {
        echo "<div style='width: 100%; background-color: #d4edda; padding: 5px; margin-bottom: 10px;'>Movie added successfully!</div>";
    }
    }
    ?>

    <table border="1" width="100%">
        <tr>
            <td>Movie</td>
            <td>Title</td>
            <td>Options</td>
        </tr>

        <?php
        // connect to our database!
        $db = new SQLite3('/home/yx2679/databases/movies.db');

        // use a SQL query to grab all movie records
        $sql = "SELECT id, title, year FROM movies ORDER BY title, year";
        $statement = $db->prepare($sql);
        $result = $statement->execute();

        // render movie records into the table
        while ($row = $result->fetchArray()) {
            $id = $row[0];
            $title = $row[1];
            $year = $row[2];

            print "<tr>";
            print "    <td>$title</td>";
            print "    <td>$year</td>";
            print "    <td><a href='index.php?delete=$id' onclick=\"return confirm('Are you sure you want to delete $title?');\">Delete</a></td>";
            print "</tr>";
        }

        $db->close();
        unset($db);
        ?>
    </table>
</body>
</html>