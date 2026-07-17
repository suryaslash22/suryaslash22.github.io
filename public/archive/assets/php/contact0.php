<?php

 use PHPMailer\PHPMailer\PHPMailer;
 use PHPMailer\PHPMailer\Exception;
 require $_SERVER['DOCUMENT_ROOT'] . '/mail/Exception.php';
 require $_SERVER['DOCUMENT_ROOT'] . '/mail/PHPMailer.php';
 require $_SERVER['DOCUMENT_ROOT'] . '/mail/SMTP.php';

 $recaptcha_secret = "6Lec1_8ZAAAAANlSO0tIdzNuZaFo6nEt3CrBHSoZ";
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$recaptcha_secret."&response=".$_POST['g-recaptcha-response']);
        $response = json_decode($response, true);
        if($response["success"] === true)
		{			
			/* Create a new PHPMailer object. */
			$mail = new PHPMailer;

			$mail->isSMTP();
			$mail->Host = 'smtp.gmail.com';
			$mail->Port = 587;
			$mail->SMTPAuth = true;
			$mail->SMTPSecure = 'tls';
			$mail->SMTPAutoTLS = false;

			/* Username (email address). */
			$mail->Username = 'contactsudharsansurya@gmail.com';

			/* Google account password. */
			$mail->Password = 'looczayrus';

			// Name
			$name =$_POST['name'];

			// Message
			$message =$_POST['message'];

			//Mail of Sender
			$email =$_POST['email'];

			//Subject
			$subject ="Contact Form Submission";

			/* Set the mail sender. */
			$mail->From = $email;
			$mail->FromName = $name;

			/* Add a recipient. */
			$my_email = 'contactsudharsansurya@gmai.com';
			$mail->addAddress($my_email, 'Surya');

			/* Set the subject. */
			$mail->Subject = $subject;

			/* Set the mail message body. */
			$mail->Body = $message;

			/* Finally send the mail. */
			if (!$mail->send())
			{
			   /* PHPMailer error. */
			   echo $mail->ErrorInfo;
			}

			// //Subject
			// $subject ="Contact Form Submission";

			// // Name
			// $name =$_POST['name'];

			// // Message
			// $message =$_POST['message'];

			// //Mail of Sender
			// $email =$_POST['email'];

			// //From
			// $header = "From:$name<$email>";

			// $send_contact=mail('contactsudharsansurya@gmail.com',$subject,$message,$header);

			//Check if mail was sent
			// if(!$send_contact){
			// echo "Error!";
			// }
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<!--<meta http-equiv="refresh" content="3;url=http://www.sudharsansurya.com/" />-->
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Thank you!</title>
</head>
<body>
<br><br><br><br><br><br><br>
<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
<tr>
<td align="center">
<h1 style="margin:0;padding:0;font-family: trebuchet ms;">Thank you for your message!
<br><small style="color: #888;" align="center">If you're expecting a reply, I usually get back within 24 hours.</small>
</h1>
<br><h4 style="color:blue"><u><a href="http://surya22.me">Click here to go back to my homepage</a></u></h4>
</td>
</tr>
</table>
</body>
</html>

<?php
}
else {
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<!--<meta http-equiv="refresh" content="3;url=http://www.sudharsansurya.com/" />-->
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Verification failed</title>
</head>
<body>
<br><br><br><br><br><br><br>
<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
<tr>
<td align="center">
<h1 style="margin:0;padding:0;font-family: trebuchet ms;">Please verify that you're not a robot.</h1>
<br><h4 style="color:blue"><u><a href="http://surya22.me">Click here to go back to my homepage</a></u></h4>
</td>
</tr>
</table>
</body>
</html>

<?php

}

?>