import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: false, default: '' }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
