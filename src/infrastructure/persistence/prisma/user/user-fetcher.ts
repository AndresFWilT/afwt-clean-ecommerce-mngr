import {Prisma, PrismaClient} from '@prisma/client';

import { IUserFetcher } from '../../../../domain/port/user/authentication/user-fetcher';
import { User as DomainUser } from '../../../../domain/entity/user';

const prisma = new PrismaClient();

export class PrismaUserFetcher implements IUserFetcher {
    async findByEmail(email: string): Promise<DomainUser | null> {
        const record = await prisma.user.findUnique({
            where: { email },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        }) as Prisma.UserGetPayload<{
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        }>;

        const roles = record.userRoles.map((ur) => ur.role.name);

        return new DomainUser({
            id: record.id.toString(),
            email: record.email,
            password: record.password,
            name: record.name,
            roles,
        });
    }
}
