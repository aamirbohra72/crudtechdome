// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const connectDb = require('./connection/connection');
connectDb();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB Atlas
// const url = process.env.MONGODB_ATLAS_URI;
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Todo Schema
const todoSchema = new mongoose.Schema({
    task: String,
    completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', todoSchema);

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// User authentication
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Create
app.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        const user = await User.findByIdAndUpdate(id, { username, password }, { new: true });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create todo task
app.post('/todos', async (req, res) => {
    try {
        const { task } = req.body;
        const todo = new Todo({ task });
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read all todo tasks
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).send(todos);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update todo task
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task } = req.body;
        const todo = await Todo.findByIdAndUpdate(id, { task }, { new: true });
        res.status(200).send(todo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete todo task
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Mark todo task as complete
app.put('/todos/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndUpdate(id, { completed: true }, { new: true });
        res.status(200).send(todo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
