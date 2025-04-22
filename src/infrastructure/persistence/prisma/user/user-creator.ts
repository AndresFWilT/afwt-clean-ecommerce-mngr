import { PrismaClient } from '@prisma/client';

import { ICustomerCreator } from "../../../../domain/port/user/signup/user-creator";

const prisma = new PrismaClient();

export class PrismaUserCreator implements ICustomerCreator {
    async create(data: { email: string; password: string; name: string }): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                },
            });

            const customerRole = await tx.role.findUnique({
                where: { name: 'CUSTOMER' },
            });

            if (!customerRole) throw new Error('Default role CUSTOMER not found');

            await tx.userRole.create({
                data: {
                    userId: user.id,
                    roleId: customerRole.id,
                },
            });
        });
    }
}
