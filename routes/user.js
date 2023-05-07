const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sib = require("sib-api-v3-sdk");

const auth = require("../middleware/auth");
const userSchema = require("../model/user_schema");

router.post(
  "/signup",
  [
    check("username", "Please enter a valid username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await userSchema.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User already exists",
        });
      }

      user = new userSchema({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await userSchema.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User doesn't exists",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect password",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error while fetching user" });
  }
});

router.post(
  "/reset-password",
  [check("email", "Please enter a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email } = req.body;
    try {
      let user = await userSchema.findOne({
        email,
      });
      if (user) {
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.API_KEY;
        const transacEmailApi = new Sib.TransactionalEmailsApi();

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const senderEmail = process.env.SENDER_EMAIL;
        const senderName = "SaaS app";
        const receiverEmail = user?.email;
        const subject = `${OTP} is your SaaS app recovery code`;
        const textContent = "From SaaS app";
        const htmlContent = "This code is only valid for the next 15 minutes";
        const params = { role: "Frontend" };

        const sender = {
          email: senderEmail,
          name: senderName,
        };

        const receivers = [
          {
            email: receiverEmail,
          },
        ];

        transacEmailApi
          .sendTransacEmail({
            sender,
            to: receivers,
            subject,
            textContent,
            htmlContent,
            params,
          })
          .then(console.log)
          .catch(console.log);

        return res.status(200).json({
          userExists: true,
          otp: `${OTP}`,
        });
      } else {
        return res.status(400).json({
          userExists: false,
        });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

module.exports = router;
