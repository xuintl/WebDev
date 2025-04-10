<!DOCTYPE html>
<html>
<head>
  <title>Assignment 07</title>
  <style>
  </style>
</head>

<body>
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
</body>
</html>