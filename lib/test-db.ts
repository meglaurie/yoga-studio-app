import 'dotenv/config';
import { prisma } from '@/lib/prisma';

async function main() {
  const users = await prisma.user.count();
  const classes = await prisma.class.count();
  const products = await prisma.product.count();

  console.log({
    users,
    classes,
    products,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });