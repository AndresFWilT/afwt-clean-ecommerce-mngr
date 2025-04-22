export interface IProductDeleter {
    delete(id: number): Promise<void>;
}
