import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminId = 'dev-user-id';
  const ledgerId = 'default-ledger';
  const accountId = 'default-account';

  // Default dev password — change this before any real deployment
  const DEFAULT_PASSWORD = 'admin123';
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  console.log('Seeding Database...');

  // 1. Create User
  const user = await prisma.user.upsert({
    where: { email: 'admin@dev.local' },
    update: { passwordHash },
    create: {
      id: adminId,
      email: 'admin@dev.local',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`User created: ${user.name}`);

  // 2. Create Ledger
  const ledger = await prisma.ledger.upsert({
    where: { id: ledgerId },
    update: {},
    create: {
      id: ledgerId,
      name: 'My Personal Ledger',
    },
  });
  console.log(`Ledger created: ${ledger.name}`);

  // 3. Link User to Ledger
  await prisma.ledgerMember.upsert({
    where: {
      userId_ledgerId: {
        userId: adminId,
        ledgerId: ledgerId,
      },
    },
    update: {},
    create: {
      userId: adminId,
      ledgerId: ledgerId,
    },
  });
  console.log('User linked to Ledger');

  // 4. Create an Account
  const account = await prisma.account.upsert({
    where: { id: accountId },
    update: {},
    create: {
      id: accountId,
      name: 'Main Checking',
      type: 'CHECKING',
      userId: adminId,
      ledgerId: ledgerId,
    },
  });
  console.log(`Account created: ${account.name}`);

  // 5. Setup Default Categories
  const categoryTypes = [
    { name: 'Food', type: 'EXPENSE' },
    { name: 'Transport', type: 'EXPENSE' },
    { name: 'Salary', type: 'INCOME' },
    { name: 'Groceries', type: 'EXPENSE' },
    { name: 'Utilities', type: 'EXPENSE' },
    { name: 'Entertainment', type: 'EXPENSE' },
    { name: 'Savings_Transfer', type: 'TRANSFER' },
  ];

  for (const cat of categoryTypes) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, ledgerId },
    });
    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          ledgerId: ledgerId,
        },
      });
      console.log(`Category created: ${cat.name}`);
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });