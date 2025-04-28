<?php
session_start();

$title = isset($_GET['title']) ? trim($_GET['title']) : '';
$year = isset($_GET['year']) ? intval($_GET['year']) : null;

if (empty($title) && empty($year) || ($year && ($year <= 1900 || $year > date("Y")))) {
    // Redirect to search form with error message
    $_SESSION['search_error'] = "Invalid input. Please provide a valid title and/or year.";
    header("Location: search_form.php");
    exit;
}

$db = new SQLite3('databases/movies.db');

$query = "SELECT title, year FROM movies WHERE 1=1";
$params = [];

if (!empty($title)) {
    $query .= " AND title LIKE :title";
    $params[':title'] = '%' . $title . '%';
}

if (!empty($year)) {
    $query .= " AND year = :year";
    $params[':year'] = $year;
}

$query .= " ORDER BY title, year";
$stmt = $db->prepare($query);

foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}

$result = $stmt->execute();

$search_results = [];
while ($row = $result->fetchArray()) {
    $search_results[] = $row;
}

$_SESSION['search_results'] = $search_results;

$db->close();
unset($db);
header("Location: search_form.php");
exit;
?>
