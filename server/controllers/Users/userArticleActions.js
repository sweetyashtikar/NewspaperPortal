import express from "express";
import Article from "../../model/EmployeeModal/ArticleModal.js"


//Liking an Article
export const UserLike = async (req, res) => {
    const { userId } = req.body; // Get the userId from the request body

    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).send('Article not found');

        if (!article.likes.includes(userId)) {
            article.likes.push(userId); // Add userId to likes array
            await article.save();
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Bookmarking an Article
export const UserBookmark =  async (req, res) => {
    const { userId } = req.body; // Get the userId from the request body

    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).send('Article not found');

        if (!article.bookmarks.includes(userId)) {
            article.bookmarks.push(userId); // Add userId to bookmarks array
            await article.save();
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//commenting an article
export const UserComment = async (req, res) => {
    const { userId, text } = req.body; // Get userId and comment text from the request

    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).send('Article not found');

        article.comments.push({ user: userId, text });
        await article.save();

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Share an article
// (You might not need to store anything in the DB, but if tracking, implement similar to likes/bookmarks)
export const shareArticle = async (req, res) => {
    res.status(200).json({ message: 'Article shared!', articleId: req.params.id });
};