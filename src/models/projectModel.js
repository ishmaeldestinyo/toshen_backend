import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    images: {
        type: [String],
        required: true,
    },

    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
}, {
    timestamps: true,
});


export const Project = mongoose.model('Project', projectSchema);


// Category Model

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
export const Category = mongoose.model('Category', categorySchema);