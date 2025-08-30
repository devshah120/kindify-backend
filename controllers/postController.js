const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    // Picture from multer upload
    let picture = null;
    if (req.file) {
      picture = `/uploads/posts/${req.file.filename}`;
    }

    const newPost = await Post.create({
      name,
      location,
      picture,
      createdBy: req.user.id // assuming JWT middleware adds `req.user`
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (err) {
    console.error('Create Post Error:', err);
    res.status(500).json({ error: err.message });
  }
};



exports.getPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10, query } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // Build filter condition
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } }
        ]
      };
    }

    // Fetch posts with optional filter
    const posts = await Post.find(filter)
      .select('name location picture likedBy')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



