const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const app = express();
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
  res.render("register", {
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
    });
  } catch (err) {
    return res.render("register", {
      title: "Register Page",
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
      return res.render("login", {
        title: "Login Page",
        errMessage: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        title: "Login Page",
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

    return res.render("dashboard", {
      title: "Dashboard Page",
      userName: user.username,
    });
  } catch (err) {
    return res.render("login", {
      title: "Login Page",
      errMessage: "An error occurred. Please try again.",
    });
  }
});

// dashboard page render
app.get("/dashboard", async (req, res) => {
  const username = req.cookies.user_name;
  const password = req.cookies.user_login;

  if (!username || !password) {
    return res.render("login", {
      title: "Login Page",
      errMessage: "Please login to view the dashboard.",
      message: "",
    });
  }

  const user = await User.findOne({
    username,
  });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("login", {
      title: "Login Page",
      errMessage: "Please login to view the dashboard.",
      message: "",
    });
  }

  res.render("dashboard", {
    title: "Dashboard Page",
    userName: username,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
