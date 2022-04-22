# Backend part of the CanteenHub

Technologies, that are used:
- TypeScript
- Express.js
- TypeORM
- MySQL

Routes:
1. Admin
- Admin login (requires email & password)
- Admin login verification (requires email, password & 6-digit code sent to email)
- Admin update menu for the particular day (body & token)
- Admin update/delete food (body & token)
- Admin add food (body & token)

2. Frontend
- Get menu for the day
- Get particular food according to the category
- Get partfuclar info about food
- Order food
- Verify order