const dbConnection = require("../database/dbconfig"); // Import database connection
const bcrypt = require("bcrypt"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For creating and verifying tokens
const { StatusCodes } = require("http-status-codes"); // For standard status codes

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const [existingUser] = await dbConnection.query(
      "SELECT * FROM user WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({ message: "Email or username already in use." });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const [result] = await dbConnection.query(
      "INSERT INTO user (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    // Respond with success
    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully.",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to register user.",
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email and password are required." });
    }

    // Find user by email
    const [user] = await dbConnection.query("SELECT * FROM user WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password." });
    }

    const foundUser = user[0];

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password_hash);

    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: foundUser.id, username: foundUser.username }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Respond with token and user info
    res.status(StatusCodes.OK).json({
      message: "Login successful.",
      token,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to log in.",
      error: error.message,
    });
  }
};

// Check logged-in user (optional)
const checkUser = async (req, res) => {
  try {
    const user = req.user; // Assume `req.user` is populated by authentication middleware

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized." });
    }

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to check user.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  checkUser,
};
