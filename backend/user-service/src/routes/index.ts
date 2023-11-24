import express from 'express';

const router = express.Router();

router.get('/users', async (_, res) => {
  return res.send('Hello, world!');
});

// All non-specified routes return 404
router.get('*', (_, res) => res.status(404).send('Not Found'));

export default router;
