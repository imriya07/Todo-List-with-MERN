const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markTaskAsCompleted
} = require('../controllers/taskController');
const auth = require('../middleware/auth'); 

const router = express.Router();

router.use(auth);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', markTaskAsCompleted);

module.exports = router;
