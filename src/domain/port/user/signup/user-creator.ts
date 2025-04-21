export interface ICustomerCreator {
    create(data: { email: string; password: string; name: string }): Promise<void>;
}
