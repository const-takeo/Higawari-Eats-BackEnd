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
  - id
  - createdAt
  - updatedAt

> ### User Model extends Core
  - email
  - password
  - role( client | owner | delivery )
  - verified

> ### User CRUD
  - Create Account
  - Log In
  - See Profile
  - Edit Profile
  - Verify Email

> ### Restaurant Model extends Core
  - name
  - category
  - address
  - coverImage

> ### Restaurant CRUD
  - See Categories & Restaurants & Restaurant
  - Create Restaurant
  - Edit Restaurant
  - Delete Restaurant

  - Create Dish
  - Delete Dish
  - Edit Dish

> ### Unit Test
  - UserService
  - JwtService

  - [ ] test
  - [x] test