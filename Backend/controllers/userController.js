const prisma = require("../config/dbConfig.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        plan: "FREE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        createdAt: true,
      },
    });

    // 5. Return safe response
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
   res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ token });
};


// exports.googleLogin = async (req, res) => {
//   const { idToken } = req.body; // frontend sends Google ID token

//   if (!idToken) {
//     return res.status(400).json({ message: "ID token is required" });
//   }

//   try {
//     // 1️⃣ Verify token with Google
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture, sub: googleId } = payload;

//     // 2️⃣ Find or create user in database
//     let user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           email,
//           name,
//           googleId,
//           avatar: picture,
//           // optional: set a random password since login is via Google
//           passwordHash: Math.random().toString(36).slice(-8),
//         },
//       });
//     }

//     // 3️⃣ Issue JWT for your app
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({ token, user });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ message: "Invalid Google token" });
//   }
// };