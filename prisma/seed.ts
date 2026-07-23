import { Role } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

async function main() {
  // Créer admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.profile.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      fullName: 'Administrateur',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Créer agent
  const agentPassword = await bcrypt.hash('agent123', 10);
  await prisma.profile.upsert({
    where: { email: 'agent@gmail.com' },
    update: {},
    create: {
      fullName: 'agent',
      email: 'agent@gmail.com',
      password: agentPassword,
      role: Role.AGENT,
    },
  });

  // Créer client
  const clientPassword = await bcrypt.hash('client123', 10);
  await prisma.profile.upsert({
    where: { email: 'client@gmail.com' },
    update: {},
    create: {
      fullName: 'Client',
      email: 'client@gmail.com',
      password: clientPassword,
      role: Role.CLIENT,
    },
  });

  console.log('Seed terminé');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
