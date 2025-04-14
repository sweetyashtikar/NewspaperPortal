import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
    title: {type: String,required: true},
    content: {type: String,required: true},
    author: {type: mongoose.Schema.Types.ObjectId,ref: 'Employee', required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId,ref: 'User', }],
    bookmarks: [{type: mongoose.Schema.Types.ObjectId,ref: 'User'}],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });


export default mongoose.model('Article', ArticleSchema);