exports.bookingApprovedTemplate =
(booking)=>{

return `

<h2>
Northern Provincial Council
</h2>

<p>
Your booking has been approved.
</p>

<table border="1">

<tr>
<td>Reference</td>
<td>${booking.booking_reference}</td>
</tr>

<tr>
<td>Status</td>
<td>APPROVED</td>
</tr>

<tr>
<td>Check In</td>
<td>${booking.check_in}</td>
</tr>

<tr>
<td>Check Out</td>
<td>${booking.check_out}</td>
</tr>

</table>

`;

};