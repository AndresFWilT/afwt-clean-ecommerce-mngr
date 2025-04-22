export interface IProductRemover {
    execute(id: number): Promise<void>;
}
