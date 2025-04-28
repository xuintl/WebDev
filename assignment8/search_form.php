<?php
session_start();
?>

<!doctype html>
<html>
<head>
    <title>Search Movies</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        input {
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
    </style>
</head>
<body>
    <h1>Search Movies</h1>

    <!-- Navigation Links -->
    <nav>
        <a href="index.php">Home</a> |
        <a href="add_form.php">Add</a> |
        <a href="search_form.php">Search</a>
    </nav>
    <br>

    <form action="search_results.php" method="get">
        <label for="title">Title:</label>
        <input type="text" id="title" name="title">
        <br>
        <label for="year">Year:</label>
        <input type="number" id="year" name="year">
        <br>
        <input type="submit" value="Search">
    </form>

    <?php
    if (isset($_SESSION['search_error'])) {
        echo "<br><div style='width: 100%; background-color: #f8d7da; padding: 5px; margin-bottom: 10px;'>" . htmlspecialchars($_SESSION['search_error']) . "</div>";
        unset($_SESSION['search_error']);
    }

    if (isset($_SESSION['search_results'])) {
        echo "<br><table border='1'>";
        echo "<tr><td>Title</td><td>Year</td></tr>";

        foreach ($_SESSION['search_results'] as $result) {
            echo "<tr> <td>{$result['title']}</td> <td>{$result['year']}</td> </tr>";
        }

        echo "</table>";
        unset($_SESSION['search_results']);
    }
    ?>
</body>
</html>
