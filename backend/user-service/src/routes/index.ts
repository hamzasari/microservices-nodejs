import express from 'express';
import { sign } from 'jsonwebtoken';

import {
  getAll,
  getById,
  create,
  authenticate,
  update,
  remove
} from '../services/UserService';
import { User } from '../models/User';

const createResponse = (user: User) => ({
  id: user.id,
  email: user.email,
  isAdmin: user.isAdmin
});

const router = express.Router();

router.get('/users', async (_, res) => {
  try {
    const users = await getAll();
    return res.json(users.map(createResponse));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await getById(req.params.id);
    if (!user) {
      return res.status(404).send('Not Found');
    }
    return res.json(createResponse(user));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = await create(req.body);
    return res.json(createResponse(user));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await update(req.params.id, req.body);
    if (!user) {
      return res.status(404).send('Not Found');
    }
    return res.json(createResponse(user));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/users/authenticate', async (req, res) => {
  try {
    const user = await authenticate(req.body.email, req.body.password);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    const token = sign(
      createResponse(user as User),
      process.env.JWT_SECRET ?? 'DEFAULT SECRET',
      {
        expiresIn: '1d'
      }
    );
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const deletionResult = await remove(req.params.id);
    if (deletionResult.deletedCount === 0) {
      return res.status(404).send('Not Found');
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// All non-specified routes return 404
router.get('*', (_, res) => res.status(404).send('Not Found'));

export default router;
