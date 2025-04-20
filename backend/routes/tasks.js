
const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markTaskAsCompleted
} = require('../controllers/taskController');

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', markTaskAsCompleted);

module.exports = router;
