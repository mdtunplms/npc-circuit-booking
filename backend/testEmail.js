const sendEmail = require("./services/emailService");

sendEmail(
  "mdtunp.lms@gmail.com",
  "SMTP Test",
  "<h2>Email Working Successfully</h2>"
);