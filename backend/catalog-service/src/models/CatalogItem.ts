import { Schema, model } from 'mongoose';

export type CatalogItem = {
  createdAt: NativeDate;
  updatedAt: NativeDate;
} & {
  sku: number;
  name: string;
  price: number;
} & {
  id?: string | undefined;
};

const CatalogItemSchema = new Schema<CatalogItem>(
  {
    sku: { type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

export default model<CatalogItem>('Item', CatalogItemSchema);
