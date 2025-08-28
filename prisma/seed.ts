import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();


async function main() {
  console.log('Seeding process started...');

  // Önceki verileri temizle (ilişkisel kısıtlamalara dikkat ederek)

  console.log('Deleting previous data...');
  await prisma.loan.deleteMany();
  await prisma.user.deleteMany();
  await prisma.book.deleteMany();
  console.log('Previous data deleted.');


  console.log('Creating users...');
  const passwordAlice = await bcrypt.hash('password123', 10);
  const passwordBob = await bcrypt.hash('password456', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      password: passwordAlice
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      password: passwordBob,
    },
  });
  console.log('Users created.');
  console.log('Creating books...');

  const book1 = await prisma.book.create({
    data: {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      published: new Date('1937-09-21'),
      status: 'loaned'
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: '1984',
      author: 'George Orwell',
      published: new Date('1949-06-08'),
      status: 'loaned'
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'Dune',
      author: 'Frank Herbert',
      published: new Date('1965-08-01'),
      status: 'loaned'
    },
  });
  console.log('Books created.');


  console.log('Creating loans...');

  const loan1 = await prisma.loan.create({
    data: {
      userId: user1.id,
      bookId: book1.id,
      loanedAt: new Date('2025-07-01T10:00:00Z'),
      returnedAt: new Date('2025-07-15T15:30:00Z'),
    },
  });

  // Tamamlanmış bir ödünç alma (Bob, 1984'ü alıp iade etti)
  const loan2 = await prisma.loan.create({
    data: {
      userId: user2.id,
      bookId: book2.id,
      loanedAt: new Date('2025-07-20T10:00:00Z'),
      returnedAt: new Date('2025-08-10T15:30:00Z'),
    },
  });
  console.log('Loans created.');

  console.log('--------------------');
  console.log('Seeding finished successfully!');
  console.log('--------------------');
  console.log('Created data:', {
    users: [user1, user2],
    books: [book1, book2, book3],
    loans: [loan1, loan2],
  });
}

// Betiği çalıştır ve olası hataları yönet
main()
  .catch((e) => {
    console.error('An error occurred during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  });