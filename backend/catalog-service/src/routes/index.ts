import express from 'express';
import requireAdmin from '../utils/requireAdmin';
import {
  getAll,
  getById,
  create,
  remove,
  update
} from '../services/CatalogService';
import { CatalogItem } from '../models/CatalogItem';

const router = express.Router();

const createResponse = (data: CatalogItem) => ({
  id: data.id,
  price: data.price,
  sku: data.sku,
  name: data.name
});

router.get('/items', async (_, res) => {
  try {
    const items = await getAll();
    return res.json(items.map(createResponse));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/items/:id', async (req, res) => {
  try {
    const item = await getById(req.params.id);
    if (!item) {
      return res.status(404).send('Not Found');
    }
    return res.json(createResponse(item));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/items', requireAdmin, async (req, res) => {
  try {
    const item = await create(req.body);
    return res.json(createResponse(item));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.put('/items/:id', requireAdmin, async (req, res) => {
  try {
    const item = await update(req.params.id, req.body);
    if (!item) {
      return res.status(404).send('Not Found');
    }
    return res.json(createResponse(item));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.delete('/items/:id', requireAdmin, async (req, res) => {
  try {
    const item = await remove(req.params.id);
    if (!item) {
      return res.status(404).send('Not Found');
    }
    return res.json(createResponse(item));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// All non-specified routes return 404
router.get('*', (_, res) => res.status(404).send('Not Found'));

export default router;
