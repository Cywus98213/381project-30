# 381Project - Group 30

## Project Info

## Project name:

### Todo List

## Group Info

```
Group Number : 30
Members: Cheng Yui Wang s13845359,
         Kenny ,
         Iltaf Shier Bano 12757510
```

## Project file intro:

### server.js

```server.js

```

### package.json

```package.json
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "cookie-parser": "^1.4.7",
    "dotenv": "^16.4.5",
    "ejs": "^3.1.10",
    "express": "^4.21.1",
    "mongodb": "^6.10.0",
    "mongoose": "^8.7.3",
    "node": "^22.11.0",
    "nodemon": "^3.1.7"
```

### views

```views
    dashboard.ejs
    home.ejs
    login.ejs
    register.ejs
```

### models

```models
    todoModel.js
    userModel.js
```

## Cloud URL

The cloud URL for this project will be provided once the application is deployed.

## Operation guides

```Login
    username: test123
    password: test123
```

```logout
    After login , there will be a logout on the top right corner
```

### Restful CRUD

```GET
    The user Todos will be fetch when in the dashboard page
```

```POST
    User can add a new todo when they login,
    and the input box would on the top of the dashboard page,
    then just put the task you want
    and click AddTodo
```

```DELETE

```

```PUT

```

### use of Restful GRUD

```GET

```

```POST

```

```DELETE

```

```PUT

```

## Installation Instructions

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Cywus98213/381project-30.git
   cd 381Project-30
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up a enironment variables**:

   ```bash
   MONGODB_URL=mongodb_link
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```
