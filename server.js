const express = require("express");
const mongoose = require("mongoose");

// DB Schemas
const User = require("./models/userModel");
const Todo = require("./models/todoModel");

// Middleware
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const app = express();
// Port and environment variables
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const mongoUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.static("public"));

// Home page render
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

// regiser page render
app.get("/register", (req, res) => {
  console.log("hit the register get route");
  return res.render("register", {
    title: "Register Page",
    message: "",
    errMessage: "",
  });
});

// register user
app.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.render("register", {
        title: "Register Page",
        message: "",
        errMessage: "Passwords do not match.",
      });
    }

    const user = await User.findOne({
      username,
    });

    if (user) {
      return res.render("register", {
        title: "Register Page",
        errMessage: "User already exists.",
        message: "",
      });
    }

    // used for hashing the password and set in a session cookie for verification
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    return res.render("login", {
      title: "Login Page",
      message: "User created successfully. Please login.",
      errMessage: "",
    });
  } catch (err) {
    return res.render("register", {
      title: "Register Page",
      message: "",
      errMessage: "An error occurred. Please try again.",
    });
  }
});

// login page render
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login Page",
    message: "",
    errMessage: "",
  });
});

// login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username,
    });

    if (!user) {
      console.log("user not found");
      return res.render("login", {
        title: "Login Page",
        message: "",
        errMessage: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        title: "Login Page",
        message: "",
        errMessage: "Invalid credentials.",
      });
    }

    res.cookie("user_name", username, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("user_login", user.password, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    console.log("cookies set, redirecting to dashboard");

    const todos = await Todo.find({ user: user._id });

    return res.render("dashboard", {
      title: "Dashboard Page",
      userName: user.username,
      todos: todos,
      message: "",
      errMessage: "",
    });
  } catch (err) {
    return res.render("login", {
      title: "Login Page",
      message: "",
      errMessage: "An error occurred. Please try again.",
    });
  }
});

// logout user
app.get("/logout", (req, res) => {
  console.log("hit the logout route");
  res.clearCookie("user_name");
  res.clearCookie("user_login");
  return res.render("login", {
    title: "Login Page",
    message: "Logged out successfully.",
    errMessage: "",
  });
});

// dashboard page render
app.get("/dashboard", async (req, res) => {
  const username = req.cookies.user_name;
  const password = req.cookies.user_login;

  try {
    if (!username || !password) {
      console.log("username and password not found in cookies");
      return res.render("login", {
        title: "Login Page",
        errMessage: "Please login to view the dashboard.",
        message: "",
      });
    }

    const user = await User.findOne({
      username,
    });

    const isMatch = password === user.password ? true : false;
    if (!isMatch) {
      console.log("password does not match the user password");
      return res.render("login", {
        title: "Login Page",
        errMessage: "Please login to view the dashboard.",
        message: "",
      });
    }

    const todos = await Todo.find({ user: user._id });

    return res.render("dashboard", {
      title: "Dashboard Page",
      userName: user.username,
      todos: todos,
      message: "",
      errMessage: "",
    });
  } catch (err) {
    res.render("login", {
      title: "Login Page",
      errMessage: "An error occurred. Please try again.",
      message: "",
    });
  }
});

// dashboard post route
app.post("/dashboard", async (req, res) => {
  console.log("hit the dashboard post route");
  const { todo } = req.body;
  const username = req.cookies.user_name;

  try {
    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.render("login", {
        title: "Login Page",
        message: "",
        errMessage: "User not found.",
      });
    }

    const newTodo = new Todo({
      task: todo,
      user: user._id,
    });

    await newTodo.save();

    user.todos.push(newTodo);

    await user.save();

    return res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    return res.render("login", {
      title: "Login Page",
      message: "",
      errMessage: "An error occurred. Please try again.",
    });
  }
});

// dashboard update route
app.put("/dashboard/:id", async (req, res) => {
  console.log("hit the dashboard update route");
  console.log("Request Todo ID: " + req.params.id);
  console.log("Request Body: " + req.body.task);
});

// dashboard delete route
app.delete("/dashboard/:id", async (req, res) => {
  console.log("hit the dashboard delete route");
  console.log("Request Todo ID: " + req.params.id);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
