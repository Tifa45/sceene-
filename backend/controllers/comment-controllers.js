import Comment from "../db/schemas/comment-schema.js";
export const getCommentsOfShow = async (req, res) => {
  const { relatedShow, page, recent, parentComment } = req.query;

  const limit = !parentComment ? 5 : 0;
  const skip = limit * (parseInt(page) || 0) + (parseInt(recent) || 0);

  if (!relatedShow) {
    return res.status(400).json({ message: "No Avaialble comments!" });
  }
  try {
    const total = await Comment.countDocuments({
      relatedShow,
      parentComment: parentComment ? parentComment : null,
    });
    const comments = await Comment.find({
      relatedShow,
      parentComment: parentComment ? parentComment : null,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("author", "fullName")
      .lean();

    return res.status(200).json({
      commentsData: comments,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("GET COMMENTS OF SHOWS ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getCommentsOfUser = async (req, res) => {
  const limit = 20;
  const page = parseInt(req.query.page) || 0;
  const skip = limit * page;
  const authorId = req.query.user;
  if (!authorId) {
    return res.status(400).json({ message: "No Avaialble comments!" });
  }
  try {
    const total = await Comment.countDocuments({ author: authorId });
    const comments = await Comment.find({ author: authorId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("author", "fullName")
      .populate("relatedShow", "title")
      .lean();
    return res.status(200).json({
      commentsData: comments,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("GET USER COMMENTS ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getCommentDetails = async (req, res) => {
  const { commentId } = req.query;

  try {
    const details = await Comment.findById(commentId, "author relatedShow")
      .populate("author", "fullName")
      .populate("relatedShow", "title")
      .lean();
    if (!details) return res.status(404).json({ message: "No details found!" });
    return res.status(200).json({ commentData: details });
  } catch (error) {
    console.log("GET COMMENT DETAILS ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const addComment = async (req, res) => {
  const { comment } = req.body;

  try {
    const newComment = new Comment(comment);
    const savedComment = await (
      await newComment.save()
    ).populate("author", "fullName");
    return res.status(201).json(savedComment);
  } catch (error) {
    console.log("ADD COMMENT ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const toggleLikeComment = async (req, res) => {
  const { userId } = req.user;
  const { commentId } = req.body;

  try {
    const commentLikes = await Comment.findById(commentId, "likes").lean();
    const isLiked = commentLikes.likes
      .map((like) => like.toString())
      .includes(userId);
    const updateLikes = isLiked
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };
    await Comment.findByIdAndUpdate(commentId, updateLikes);
    return res.status(200).json({ isLiked: !isLiked });
  } catch (error) {
    console.log("LIKE COMMENT ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const editComment = async (req, res) => {
  const { userId } = req.user;
  const { content, commentId } = req.body;

  try {
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment can not be empty!" });
    }
    const comment = await Comment.findById(commentId).lean();
    if (comment.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of the comment!" });
    }
    const editedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      {
        runValidators: true,
        new: true,
      }
    );
    return res.status(200).json({ commentsData: editedComment });
  } catch (error) {
    console.log("EDIT COMMENT ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteComment = async (req, res) => {
  const { userId, userRole } = req.user;
  const { commentId } = req.body;

  try {
    const comment = await Comment.findById(commentId).lean();
    if (
      (Array.isArray(commentId) && userRole !== "admin") ||
      (comment.author !== userId && userRole !== "admin")
    ) {
      return res
        .status(403)
        .json({ message: "Only admins can delete other users comments!" });
    }
    if (Array.isArray(commentId)) {
      await Comment.deleteMany(
        { _id: { $in: commentId } },
        {
          context: { deleterId: userId },
        }
      );
    } else {
      await Comment.findByIdAndDelete(commentId, {
        context: { deleterId: userId },
      });
    }
    return res.status(200).json({ message: "Deleted successfully!" });
  } catch (error) {
    console.log("DELETE COMMENT ERROR: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
