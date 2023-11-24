import CatalogItemModel, { type CatalogItem } from '../models/CatalogItem';

/**
 * The function `getAll` retrieves all catalog items from the database and sorts
 * them in descending order based on their creation date.
 * @returns {Promise<Array>} The function `getAll` is returning a promise that
 * resolves to an array of `CatalogItemModel` objects.
 */
const getAll = async (): Promise<Array<CatalogItem>> => {
  return CatalogItemModel.find().sort({ createdAt: -1 }).exec();
};

/**
 * The function `getById` retrieves a catalog item from the database by its id.
 * @param {string} id The id of the catalog item to retrieve.
 * @returns {Promise<CatalogItemModel>} The function `getById` is returning a
 * promise that resolves to a `CatalogItemModel` object.
 */
const getById = async (id: string): Promise<CatalogItem | null> => {
  return CatalogItemModel.findById(id).exec();
};

/**
 * The function `create` creates a new catalog item in the database.
 * @param {CatalogItem} data The data of the catalog item to create.
 * @returns {Promise<CatalogItemModel>} The function `create` is returning a
 * promise that resolves to a `CatalogItemModel` object.
 */
const create = async (data: CatalogItem): Promise<CatalogItem> => {
  const item = new CatalogItemModel(data);
  return item.save();
};

/**
 * The function `update` updates a catalog item in the database.
 * @param {string} id The id of the catalog item to update.
 * @param {CatalogItem} data The data of the catalog item to update.
 * @returns {Promise<CatalogItemModel>} The function `update` is returning a
 * promise that resolves to a `CatalogItemModel` object.
 */
const update = async (
  id: string,
  data: CatalogItem
): Promise<CatalogItem | null> => {
  return CatalogItemModel.findByIdAndUpdate(id, data, { new: true }).exec();
};

// TODO: Change return type from any to correct type
/**
 * The `remove` function is an asynchronous function that deletes a catalog item
 * with the specified ID.
 * @param {string} id - The `id` parameter is a string that represents the unique
 * identifier of the catalog item that needs to be removed.
 * @returns The `remove` function is returning a promise that resolves to the
 * result of the `deleteOne` operation on the `CatalogItemModel` with the specified
 * `_id`.
 */
const remove = async (id: string): Promise<any> => {
  return CatalogItemModel.deleteOne({ _id: id }).exec();
};

export { getAll, getById, create, update, remove };
