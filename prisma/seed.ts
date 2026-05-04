import "dotenv/config";
//import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
//const pool = new Pool({ connectionString });
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
async function main() {
    const meatballsContent = {
        name: "Meatballs",
        eco_score: 1,
        ingredients: {
            create: [
                { name: "Meat", amount: 100, unit: "g" },
                { name: "Potatoes", amount: 200, unit: "g" },
                { name: "Gravy", amount: 150, unit: "ml" },
            ],
        },
        reviews: {
            create: [
                {
                    rating: 5,
                    comment: "Delicious!",
                    date: new Date(),
                    userId: null,
                },
            ],
        },
        servings: [new Date("2024-01-01"), new Date("2024-01-02")],
    }
    const meatballs = await prisma.lunch.upsert({
        where: { name: meatballsContent.name },
        update: meatballsContent,
        create: meatballsContent,
    });
    const tacosContent = {

        name: "Tacos",
        eco_score: 1,
        ingredients: {
            create: [
                { name: "Meat", amount: 100, unit: "g" },
                { name: "Corn", amount: 200, unit: "g" },
                { name: "Salsa", amount: 150, unit: "ml" },
            ],
        },
        reviews: {
            create: [
                {
                    rating: 5,
                    comment: "Delicious!",
                    date: new Date(),
                    userId: null,
                },
            ],
        },
        servings: [new Date("2024-01-01"), new Date("2024-01-02")],
    }
    const tacos = await prisma.lunch.upsert({
        where: { name: tacosContent.name },
        update: tacosContent,
        create: tacosContent,
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
