
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Temporary storage for complaints
let issues = [];

// Home route
app.get("/", (req, res) => {
  res.send("CampusCare Backend is Running!");
});

// Get all complaints
app.get("/api/issues", (req, res) => {
  res.json(issues);
});

// Submit a new complaint
app.post("/api/issues", (req, res) => {
  const { title, category, location, priority, description } = req.body;

  if (!title || !category || !location || !description) {
    return res.status(400).json({
      message: "Please fill all required fields"
    });
  }

  const newIssue = {
    id: "CC" + Date.now(),
    title,
    category,
    location,
    priority: priority || "Normal",
    description,
    status: "Pending",
    createdAt: new Date()
  };

  issues.push(newIssue);

  res.status(201).json({
    message: "Issue submitted successfully",
    issue: newIssue
  });
});

// Update complaint status
app.patch("/api/issues/:id", (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);

  if (!issue) {
    return res.status(404).json({
      message: "Issue not found"
    });
  }

  const { status } = req.body;
  const validStatuses = ["Pending", "In Progress", "Resolved"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  issue.status = status;

  res.json({
    message: "Status updated successfully",
    issue
  });
});

// Delete a complaint
app.delete("/api/issues/:id", (req, res) => {
  const oldLength = issues.length;

  issues = issues.filter(i => i.id !== req.params.id);

  if (issues.length === oldLength) {
    return res.status(404).json({
      message: "Issue not found"
    });
  }

  res.json({
    message: "Issue deleted successfully"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`CampusCare backend running on port ${PORT}`);
});
