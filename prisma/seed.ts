import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.review.deleteMany();
  await prisma.serving.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.lunch.deleteMany();

  const meatballs = await prisma.lunch.create({
    data: {
      name: "Meatballs",
      line: "Nordic",
      description: "Classic Swedish meatballs, cream sauce, lingonberry, mash.",
      ecoScore: 2.4,
      ingredients: {
        create: [
          { id: 0, name: "Meat", amount: 100, unit: "g" },
          { id: 1, name: "Potatoes", amount: 200, unit: "g" },
          { id: 2, name: "Gravy", amount: 150, unit: "ml" },
        ],
      },
      servings: {
        create: [
          {
            date: new Date("2024-01-01"),
          },
          { date: new Date("2024-01-02") },
        ],
      },
      reviews: {
        create: [
          {
            rating: 5,
            comment: "Delicious!",
            tags: ["filling", "balanced"],
            posted: new Date(),
            userId: null,
          },
        ],
      },
    },
  });

  const tacos = await prisma.lunch.create({
    data: {
      name: "Tacos",
      line: "Street food",
      description: "Tacos with seasoned meat, corn, salsa and fresh toppings.",
      ecoScore: 1.7,
      ingredients: {
        create: [
          { id: 3, name: "Meat", amount: 100, unit: "g" },
          { id: 4, name: "Corn", amount: 200, unit: "g" },
          { id: 5, name: "Salsa", amount: 150, unit: "ml" },
        ],
      },
      servings: {
        create: [
          {
            date: new Date("2024-01-01"),
          },
          { date: new Date("2024-01-02") },
        ],
      },
      reviews: {
        create: [
          {
            rating: 5,
            comment: "Delicious!",
            tags: ["fresh"],
            posted: new Date(),
            userId: null,
          },
        ],
      },
    },
  });

  console.log({ meatballs, tacos });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
