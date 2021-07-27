const { Router } = require("express");
const Board = require("../models/board");
const Timeline = require("../models/timeline");
const { auth } = require("../middleware");
const router = Router();

// // fetch all the timeline entries from db /api/timeline
// router.get('/', async (req, res, next) => {
//     try {
//         const timelineEntries = await Timeline.find()
//         res.json(timelineEntries)
//     } catch (error) {
//         next(error)
//     }
// })

// create new timeline entry
router.post("/", auth, async (req, res, next) => {
  try {
    const boardId = req.body.boardId;
    const board = await Board.findOne({ _id: boardId, userId: req.user });
    if (!board) return res.status(404).send();
    const timeline = new Timeline(req.body);
    const respData = await timeline.save();
    res.send(respData);
  } catch (error) {
    if (error.name === "ValidationError") res.status(422);
    next(error);
  }
});

// get timelines based on boardId
router.get("/:boardId", async (req, res, next) => {
  const _id = req.params.boardId;
  try {
    const timelines = await Timeline.find({ boardId: _id });
    if (!timelines)
      return res.status(404).send({ error: "Timeline not found!" });
    res.send(timelines);
  } catch (error) {
    next(error);
  }
});

// get timelines based on timelineId
router.get("/:boardId/:id", async (req, res, next) => {
  const _id = req.params.id;
  try {
    const timelines = await Timeline.findById(_id);
    if (!timelines)
      return res.status(404).send({ error: "Timeline not found!" });
    res.send(timelines);
  } catch (error) {
    next(error);
  }
});

// update timeline content based on board id and id
router.patch("/:boardId/:id", async (req, res, next) => {
  const _id = req.params.id;
  const boardId = req.params.boardId;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "groupId",
    "url",
    "start",
    "end",
    "order",
    "progress",
  ];
  // const isValidOperation = updates.every((update) =>
  //     allowedUpdates.includes(update)
  // )
  const isValidOperation = true;
  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });
  try {
    console.log("timeline: ", Timeline);
    const timeline = await Timeline.findOneAndUpdate(
      { boardId, _id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!timeline)
      return res.status(404).send({ error: "Timeline not found!" });
    res.send(timeline);
  } catch (error) {
    next(error);
  }
});

// update timeline content based on id
router.patch("/:id", async (req, res, next) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "groupId", "url", "start", "end", "order"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });
  try {
    const timeline = await Timeline.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!timeline)
      return res.status(404).send({ error: "Timeline not found!" });
    res.send(timeline);
  } catch (error) {
    next(error);
  }
});

// delete timeline based on id
router.delete("/:id", async (req, res, next) => {
  const _id = req.params.id;
  try {
    const timeline = await Timeline.findByIdAndDelete(_id);
    if (!timeline) return res.status(404).send();
    res.send(timeline);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
