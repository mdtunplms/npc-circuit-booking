# npc-circuit-booking
npc circuit booking

## create admin user
UPDATE Users
SET role='SUPER_ADMIN'
WHERE email='admin@test.com';

## test apis in postman

### register  
api - 'http://localhost:5000/api/auth/register'
body : 
{
  "full_name":"Admin User",
  "email":"admin@test.com",
  "password":"123456"
}

### login  
api - 'http://localhost:5000/api/auth/login'
body: 
{
  "email":"admin@test.com",
  "password":"123456"
}

### create banglow  
run: 'node seeders/seedBungalows.js'

### create room under a Banglow  
update the user role to 'super_admin'
sql:
UPDATE Users
SET role='SUPER_ADMIN'
WHERE email='admin@test.com';

login again
copy the new jwt token
api - 'http://localhost:5000/api/rooms'
Authorization: bearer token & paste new token
body: 
{
  "bungalowId": 1,
  "room_number": "K101",
  "room_type": "AC",
  "max_guests": 2,
  "price": 5000
}

### view rooms  
api - 'http://localhost:5000/api/rooms'

### check room availability  
api - 'http://localhost:5000/api/bookings/check-availability'
body: 
{
  "roomId":1,
  "check_in":"2026-06-10",
  "check_out":"2026-06-12"
}

### create room booking  
api - 'http://localhost:5000/api/bookings/create'
body(form-data):
bungalowId=1
roomIds=1
check_in=2026-06-10
check_out=2026-06-12
purpose=Official Visit
guests_count=2
form=application.pdf
