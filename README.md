# npc-circuit-booking
npc circuit booking

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
update the user role to 'super-admin'
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

