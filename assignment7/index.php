<!DOCTYPE html>
<html>
    <head>
        <title>Assignment 07</title>
        <style>
            .error {
                background-color: red;
                color: white;
                padding: 10px;
                width: 100%;
                height: 50px;
            }
        </style>
    </head>
    <body>
        <h1>Assignment 07</h1>

        <?php
            $error = $_GET['error'];
            if ($error) {
        ?>
        <div class="error">Fill out the form!</div>
        <?php
            }
        ?>
        <?php
            $character = $_GET['character'];
            $filename = "";

            if ($character == 'bart') {
                $filename = 'Bart.png';
            }
            else if ($character == 'lisa') {
                $filename = 'Lisa.png';
            }
            else if ($character == 'homer') {
                $filename = 'Homer.png';
            }

            if ($filename) {
                print "<img src=images/$filename>";
            }
        ?>

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