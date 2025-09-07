<!DOCTYPE html>
<html>
<head>
  <title>Results</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }

    .result-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }

    img {
      width: 150px;
      height: auto;
      margin: 20px 0;
    }

    .result-bar {
      width: 100%;
      height: 40px;
      margin: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: bold;
      border-radius: 5px;
    }

    .bart {
      background-color: #FFCE54; /* Yellow */
    }

    .lisa {
      background-color: #A0D16E; /* Green */
    }

    .homer {
      background-color: #EC576B; /* Red */
    }

    .take-again-button {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: black;
      color: white;
      padding: 10px 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <h1>Assignment 07 - Your Results</h1>

  <div class="result-container">

    <?php
      $character = $_GET['character'];
      $filename = "";

      // Display the character image and result
      if ($character == 'bart') {
        $filename = 'Bart.png';
        echo '<div class="result-bar bart">You are Bart!</div>';
      } else if ($character == 'lisa') {
        $filename = 'Lisa.png';
        echo '<div class="result-bar lisa">You are Lisa!</div>';
      } else if ($character == 'homer') {
        $filename = 'Homer.png';
        echo '<div class="result-bar homer">You are Homer!</div>';
      }

      if ($filename) {
        print "<img src=images/$filename>";
      }

      // Read results from the file
      $txt = "results.txt";
      $results = file_exists($txt) ? file($txt, FILE_IGNORE_NEW_LINES) : [];

      // Count and display total submissions
      $total_submissions = count($results);
      echo "<p>Total Submissions: $total_submissions</p>";

      // Count votes for each character
      $counts = array_count_values($results);
      $bart_percentage = isset($counts['bart']) ? ($counts['bart'] / $total_submissions) * 100 : 0;
      $homer_percentage = isset($counts['homer']) ? ($counts['homer'] / $total_submissions) * 100 : 0;
      $lisa_percentage = isset($counts['lisa']) ? ($counts['lisa'] / $total_submissions) * 100 : 0;

      // Display bar chart
      echo "<div class='result-bar bart' style='width: " . ($bart_percentage > 0 ? round($bart_percentage) : 10) . "%'>Bart: " . round($bart_percentage) . "%</div>";
      echo "<div class='result-bar homer' style='width: " . ($homer_percentage > 0 ? round($homer_percentage) : 10) . "%'>Homer: " . round($homer_percentage) . "%</div>";
      echo "<div class='result-bar lisa' style='width: " . ($lisa_percentage > 0 ? round($lisa_percentage) : 10) . "%'>Lisa: " . round($lisa_percentage) . "%</div>";
    ?>
  </div>

  <a href="index.php" class="take-again-button" onclick="document.cookie=''">Take Again?</a>
</body>
</html>