const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
const ALLOWED_ROLES = ["customer", "admin"];

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    //Registration Logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    const sanitizedRole = ALLOWED_ROLES.includes(role) ? role : "customer";

    user = new User({ name, email, password, role: sanitizedRole });
    await user.save();

    // Create JWT Payload
    const payload = { userId: user._id, role: user.role };

    // Sign and return token with along data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        // Send the User and token response
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //Find the user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    // Create JWT Payload
    const payload = { userId: user._id, role: user.role };

    // Sign and return token with along data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        // Send the User and token response
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route GET /api/users/profile
//@desc Get logged-in user's profile (Protected Route)
//@access Private

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

// @route GET /api/users
// @desc Get all users (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/users
// @desc Register a new user (Admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const sanitizedRole = ALLOWED_ROLES.includes(role) ? role : "customer";

    user = new User({ name, email, password, role: sanitizedRole });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/users/:id
// @desc Update user role (Admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.role && ALLOWED_ROLES.includes(req.body.role)) {
              user.role = req.body.role;
            }
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            })
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
})

// @route DELETE /api/users/:id
// @desc Delete user (Admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
