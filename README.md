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

> ### User Model extends Core
- [x] email
- [x] password
- [x] role( client | owner | delivery )
- [x] verified

> ### User CRUD
- [x] Create Account
- [x] Log In
- [x] See Profile
- [x] Edit Profile
- [x] Verify Email

> ### Restaurant Model extends Core
- [x] name
- [x] category
- [x] address
- [x] coverImage

> ### Restaurant CRUD
- [ ] See Categories & Restaurants & Restaurant
- [x] Create Restaurant
- [x] Edit Restaurant
- [x] Delete Restaurant

- [ ] Create Dish
- [ ] Delete Dish
- [ ] Edit Dish

> ### Unit Test
- [x] UserService
- [x] JwtService

  