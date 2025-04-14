import express from "express"
const router = express.Router();
import {UserLike,UserBookmark,UserComment,shareArticle} from "../../controllers/Users/userArticleActions.js"

// Routes for article interactions (e.g., likes and bookmarks)
router.post('/:id/like', UserLike);
router.post('/:id/bookmark', UserBookmark);
router.post('/:id/share', shareArticle);
router.post('./id/comment',UserComment )

export default router;