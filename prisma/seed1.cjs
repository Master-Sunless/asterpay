const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.serviceProvider.create({
        data: {
            name: "Netflix",
            apiKey: "dummy-api-key",
            apiUrl: "https://api.netflix.com",
            plans: {
                create: [
                    { name: "Basic", priceUSD: 999, externalPlanId: "basic_01" },
                    { name: "Premium", priceUSD: 1999, externalPlanId: "premium_01" }
                ]
            }
        }
    });
    console.log("Seed data added!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
