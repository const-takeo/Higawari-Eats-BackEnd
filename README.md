<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Higawari Eats BackEnd

## Description
```
히가와리 이츠의 백엔드입니다. 
日替わりイーツのバックエンドです。
The BackEnd of Higawari Eats.
```
## Constructure
> ### Core Model
- [x] id
- [x] createdAt
- [x] updatedAt
<br></br>

> ### User Model extends Core
- [x] email
- [x] password
- [x] role( client | owner | delivery )
- [x] verified
<br></br>

> ### User CRUD
- [x] Create Account
- [x] Log In
- [x] See Profile
- [x] Edit Profile
- [x] Verify Email
<br></br>

> ### Restaurant Model extends Core
- [x] name
- [x] category
- [x] pagination
- [x] address
- [x] coverImage

<br></br>

> ### Restaurant CRUD
- [x] See Categories & Restaurants & Restaurant
- [x] Create Restaurant
- [x] Edit Restaurant
- [x] Delete Restaurant

- [x] Create Dish
- [x] Delete Dish
- [x] Edit Dish

> ### OrderEntity
- [x] customer
- [x] restaurant
- [x] driver
- [x] dishes
- [x] total
- [x] status

> ### OrderCRUD
- [x] createOrder
- [x] getOrder

> ### OrderSubscriptions

> ### Payment
<br></br>

> ### Unit Test
- [x] UserService
- [x] JwtService

  