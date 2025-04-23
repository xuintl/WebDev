<!doctype html>
<html>
<head>
    <title>Assignment 8</title>
    <style>
        table {
            width: 100%;
        }
    </style>
</head>

<body>
    <h1>Movie Database</h1>

    <table border="1" width="100%">
        <tr>
            <td>Movie</td>
            <td>Title</td>
            <td>Options</td>
        </tr>

        <?php
            // connect to our database!
            $db = new SQlite3('/home/databases/movies.db');

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
                print "    <td>DELETE</td>";
                print "</tr>";
            }

            $db->close();
            unset($db);
        ?>
    </table>
</body>
</html>