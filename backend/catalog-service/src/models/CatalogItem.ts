import mongoose from 'mongoose';

const CatalogItemSchema = new mongoose.Schema(
  {
    sku: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

export type CatalogItem = mongoose.InferSchemaType<typeof CatalogItemSchema> & {
  id?: string;
};

export default mongoose.model('Item', CatalogItemSchema);
