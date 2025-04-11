<!DOCTYPE html>
<html>
<head>
    <title>Survey</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        select {
            width: 200px;
            padding: 5px;
            margin: 10px 0;
        }
        input[type="submit"] {
            padding: 10px 20px;
            background-color:rgb(95, 175, 225);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        img {
            width: 300px;
            height: auto;
            margin: 20px 0;
        }
        .error {
            background-color: red;
            color: white;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            width: 100%;
            /* height: 50px; */
        }
    </style>
</head>

<body>
    <h1>Assignment 07</h1>

    <?php
        $error = $_GET['error'];
        if ($error) {
    ?>
    <div class="error">Please fill out the form! Error code: <?php echo $error; ?></div>
    <?php
        }
    ?>

    <!-- Form action to process.php -->
    <form action="process.php" method="GET">
        <div>
            Favorite food:
            <select id="food" name="food">
                <option value="empty">Select an option</option>
                <option value="bart">Pizza</option>
                <option value="homer">Cake</option>
                <option value="lisa">Apples</option>
            </select>
        </div>
        <div>
            Favorite activity:
            <select id="activity" name="activity">
                <option value="empty">Select an option</option>
                <option value="bart">Skateboard</option>
                <option value="homer">Sleep</option>
                <option value="lisa">Study</option>
            </select>
        </div>
        <input type="submit">
    </form>
</body>
</html>