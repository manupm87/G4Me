<?php
// Create connection
$con=mysqli_connect("127.0.0.1","root","","web");

// Check connection
if (mysqli_connect_errno())
{
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
 
$result = mysqli_query($con,"SELECT * FROM users");

echo "<table border='1'>
<tr>
<th>ID</th>
<th>USER_NAME</th>
<th>USER_PASS</th>
<th>GAME</th>
<th>POINTS</th>
<th>CLAN</th>
</tr>";

while($row = mysqli_fetch_array($result))
{
	echo "<tr>";
	echo "<td>" . $row['ID'] . "</td>";
	echo "<td>" . $row['USER_NAME'] . "</td>";
	echo "<td>" . $row['USER_PASS'] . "</td>";
	echo "<td>" . $row['GAME'] . "</td>";
	echo "<td>" . $row['POINTS'] . "</td>";
	echo "<td>" . $row['CLAN'] . "</td>";
	echo "</tr>";
	//echo $row['ID'] . " " . $row['USER_NAME']. " " . $row['USER_PASS']. " " . $row['GAME']. " " . $row['POINTS']. " " . $row['CLAN'];
	//echo "<br>";
}

echo "</table>";

mysqli_close($con);

?>