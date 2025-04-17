/* 
*File:    server.js
*Project: CSIS 3750 Software Engineering Team Projects
*Author:  Nicolas, Carol, Irem
*History: Version 1.0 03/20/24
*Program: BST Logic
*/


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ServerApiVersion } = require('mongodb');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI
const uri = "mongodb+srv://hritondale:yJLW365FRyhmxpB1@bstproject.pddtayp.mongodb.net/?retryWrites=true&w=majority&appName=BSTProject";

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})
.then(() => console.log('Connected successfully to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema for the Tree
const TreeSchema = new mongoose.Schema({
  nodes: { type: Array, required: true }
});

// Create a model for the Tree
const Tree = mongoose.model('Tree', TreeSchema);

// Define the API endpoint for saving trees
app.post('/saveTree', async (req, res) => {
  try {
    const newTree = new Tree({ nodes: req.body.nodes });
    await newTree.save();
    res.status(201).send({ message: 'Tree saved!' });
  } catch (error) {
    res.status(500).send({ message: 'Error saving tree', error: error });
  }
});

// Define the API endpoint for deleting all trees
app.delete('/api/delete-all-trees', async (req, res) => {
  try {
    const result = await Tree.deleteMany({});
    console.log('Delete operation result:', result);
    if (result.deletedCount === 0) {
      // No documents found and deleted
      return res.status(404).json({ message: 'No trees to delete' });
    }
    res.status(200).json({ message: 'All trees deleted successfully!' });
  } catch (error) {
    console.error('Error deleting trees:', error.message);
    res.status(500).json({ message: 'Error deleting trees', error: error.message });
  }
});

app.get('/api/retrieve-trees', async (req, res) => {
  try {
      const trees = await Tree.find({}); // Assuming 'Tree' is your MongoDB model
      res.status(200).json(trees);
  } catch (error) {
      console.error('Failed to retrieve trees:', error);
      res.status(500).json({ message: 'Failed to retrieve trees', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
