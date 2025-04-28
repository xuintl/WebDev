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
    <h1>Add New Movie</h1>

    <!-- Navigation Links -->
    <nav>
        <a href="index.php">Home</a> |
        <a href="add_form.php">Add</a> |
        <a href="search_form.php">Search</a>
    </nav>
    <br>

    <?php 
    if (isset($_GET['error'])) {
        echo "<div style='width: 100%; background-color: #f8d7da; padding: 5px; margin-bottom: 10px;'>Error: " . htmlspecialchars($_GET['error']) . "</div><br>";
    }
    ?>

    <form action="add_save.php" method="post">
        <label for="title">Title:</label>
        <input type="text" id="title" name="title" required>
        <br>
        <label for="year">Year:</label>
        <input type="number" id="year" name="year" required>
        <br>
        <input type="submit" value="Add Movie">
    </form>
</body>
</html>