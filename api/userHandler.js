const { Router } = require("express");
const User = require("../models/user");
const Board = require("../models/board");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware");
const router = Router();

// register a new user
router.post("/register", async (req, res, next) => {
  const {
    password,
    passwordCheck,
    username,
    userRole,
    role,
    avatar,
    name,
    position,
    notification,
    pinned,
    company,
  } = req.body;
  try {
    if (!password || !passwordCheck || !username || !userRole || !role)
      return res
        .status(400)
        .json({ msg: "Don't be lazy 🦥, enter all fields value" });

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "Password is too small, try harder 🤪" });
    }
    if (password != passwordCheck)
      return res.status(400).json({ msg: "Password don't match 👿" });
    if (userRole !== "ADMIN")
      return res.status(400).json({ msg: "You're not authorized" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "Username exists, think of something unique 🦄" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      password: passwordHash,
      role,
      avatar,
      name,
      position,
      notification,
      pinned,
      company,
    });
    const response = await newUser.save();
    res.send({
      username: response.username,
      _id: response._id,
      role: response.role,
      avatar: response.avatar,
      name: response.name,
      position: response.position,
      notification: response.notification,
      pinned: response.pinned,
      company: response.company,
    });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(422);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res
        .status(400)
        .json({ msg: "Don't be lazy 🦥, enter all fields value" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User doesn't exist 🙈" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid Credentials 🤕" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        position: user.position,
        avatar: user.avatar,
        notification: user.notification,
        pinned: user.pinned,
        company: user.company,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/tokenIsValid", async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (error) {
    next(error);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user, { avatar: 0 });
    if (!user) return res.status(404).send();
    res.json({
      username: user.username,
      id: user._id,
      role: user.role,
      avatar: user.avatar,
      name: user.name,
      position: user.position,
      pinned: user.pinned,
      company: user.company,
    });
  } catch (error) {
    next(error);
  }
});

//get all users
router.get("/list", auth, async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    // console.log('req.body:', req)
    const user = await User.find({}, { avatar: 0 });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.patch("/update", async (req, res, next) => {
  const {
    username,
    newPassword,
    newPasswordCheck,
    role,
    name,
    position,
    avatar,
    notification,
    pinned,
  } = req.body;
  try {
    // if (!username || !newPassword || !newPasswordCheck)
    //   return res
    //     .status(400)
    //     .json({ msg: "Don't be lazy 🦥, enter all fields value" });

    if (newPassword != newPasswordCheck)
      return res.status(400).json({ msg: "New Password don't match 👿" });
    const salt = await bcrypt.genSalt();
    if (newPassword && newPasswordCheck) {
      const passwordHash = await bcrypt.hash(newPassword, salt);
      const updatedUser = await User.findOneAndUpdate(
        { username },
        {
          password: passwordHash,
          role,
          name,
          position,
          avatar,
          notification,
          pinned,
        },
        { new: true, runValidators: true }
      );

      res.send(updatedUser);
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { role, name, position, avatar, notification, pinned },
        { new: true, runValidators: true }
      );

      res.send(updatedUser);
    }
  } catch (error) {
    next(error);
  }
});

// update notification
router.patch("/update-notification", async (req, res, next) => {
  const { username, role, name, position, avatar, notification, pinned } =
    req.body;
  try {
    // const updatedUser = await User.findOneAndUpdate(
    await User.findOneAndUpdate(
      { username },
      { role, name, position, avatar, notification, pinned },
      { new: true, runValidators: true }
    );

    // res.send(updatedUser);
    const users = await User.find({}, { avatar: 0 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// mark notification as read
router.patch("/update-notification-status", async (req, res, next) => {
  const { userId, id } = req.body;
  try {
    const user = await User.findById(userId);
    console.log("notif user", user);
    console.log("notif user id", id);
    let oldNotifications = user.notification;
    const manipulatedNotifications = await oldNotifications.map((d) => {
      if (d.id === id) {
        const result = { ...d, read: true };
        return result;
      } else return d;
    });
    console.log("manipulatedNotifications", manipulatedNotifications);
    user.notification = manipulatedNotifications;
    await user.save();

    // res.send(updatedUser);
    const users = await User.find({}, { avatar: 0 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// delete user based on id
router.delete("/:id", auth, async (req, res, next) => {
  const _id = req.params.id;
  console.log("deleted user id: ", _id);
  try {
    const user = await User.findOneAndDelete({ _id }, { avatar: 0 });
    if (!user) return res.status(404).send();
    Board.findOneAndUpdate({ pic: _id }, { $pullAll: { pic: [_id] } });
    const userList = await User.find({});
    console.log("deleted user list: ", userList);
    res.send(userList);
  } catch (error) {
    next(error);
  }
});

// upload avatar
// router.post("/upload", uploadFile);
router.post(
  "/upload",
  // upload.single("upload"),
  async (req, res) => {
    try {
      console.log("upload:", req.body);
      const user = await User.findById(req.body.id);
      // const buffer = await sharp(req.file.buffer)
      // // .resize({ width: 500, height: 500 })
      // .png()
      // .toBuffer();
      user.avatar = req.body.avatar;
      await user.save();
      res.send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  },
  (error, req, res) => {
    res.status(400).send({ error: `${error.message}, maximum 1MB` });
  }
);

// delete avatar
router.delete("/:id/image", async (req, res) => {
  try {
    console.log("user id delete avatar:", req.params.id);
    const user = await User.findById({ _id: req.params.id });
    user.avatar = undefined;
    user.save();
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

// get avatar
router.get("/:id/image", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    //response header, use set
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
module.exports = router;
