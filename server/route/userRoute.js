import express from 'express';
import { registerUser, loginUser, checkUser } from '../controller/usercontroller';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error logging in user' });
  }
});

router.get('/checkuser', async (req, res) => {
  try {
    await checkUser(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error checking user' });
  }
});

module.exports = router;