/**
 * Prisma Seed Script
 * Run with: npx prisma db seed
 * This creates the two user accounts (Maharishi & partner) in the database
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Hash PINs securely — CHANGE THESE PINs to your real ones!
  const pin1Hash = await bcrypt.hash('123456', 12); // Maharishi's PIN
  const pin2Hash = await bcrypt.hash('654321', 12); // Partner's PIN

  // Upsert user 1 — Maharishi
  const user1 = await prisma.user.upsert({
    where: { id: 'user-maharishi' },
    update: {},
    create: {
      id: 'user-maharishi',
      name: 'Maharishi',
      pinHash: pin1Hash,
      role: 'PRIMARY',
      currency: 'INR',
      location: 'Karur',
    },
  });

  // Upsert user 2 — Partner (update her name/PIN when ready)
  const user2 = await prisma.user.upsert({
    where: { id: 'user-partner' },
    update: {},
    create: {
      id: 'user-partner',
      name: 'Her Name',       // ← Update this
      pinHash: pin2Hash,
      role: 'PARTNER',
      currency: 'AED',
      location: 'Dubai',
    },
  });

  console.log('✅ Users created:');
  console.log(`   👤 ${user1.name} (${user1.location}) — PIN: 123456`);
  console.log(`   👤 ${user2.name} (${user2.location}) — PIN: 654321`);
  console.log('\n🎉 Database seeded successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
