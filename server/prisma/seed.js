import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with initial ViewRoom data...");

  // Hashed password for demo users
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@viewroom.com" },
    update: {},
    create: {
      email: "admin@viewroom.com",
      name: "ViewRoom Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  // 2. Seed Client User
  const clientUser = await prisma.user.upsert({
    where: { email: "client@viewroom.com" },
    update: {},
    create: {
      email: "client@viewroom.com",
      name: "John Client",
      passwordHash,
      role: "CLIENT",
    },
  });

  // 3. Seed Flagship Virtual Tour
  const tour = await prisma.virtualTour.upsert({
    where: { id: "tour_skyline_headquarters" },
    update: {},
    create: {
      id: "tour_skyline_headquarters",
      title: "Skyline Innovation Campus 360°",
      description: "Explore our futuristic multi-story campus featuring state-of-the-art labs, open workspaces, and panoramic aerial views.",
      category: "Commercial Real Estate",
      author: { connect: { id: adminUser.id } },
      scenes: {
        create: [
          {
            id: "aerial_view",
            name: "AERIAL VIEW",
            floorLevel: "Campus Aerial",
            thumbnailUrl: "/panoramas/panorama_aerial.jpg",
            panoramaUrl: "/panoramas/panorama_aerial.jpg",
          },
          {
            id: "entrance",
            name: "ENTRANCE",
            floorLevel: "Main Building",
            thumbnailUrl: "/panoramas/panorama_entrance.jpg",
            panoramaUrl: "/panoramas/panorama_entrance.jpg",
          },
        ],
      },
    },
  });

  console.log("✅ Seeding completed successfully!");
  console.log(`- Created Admin User: ${adminUser.email}`);
  console.log(`- Created Client User: ${clientUser.email}`);
  console.log(`- Created Tour: ${tour.title}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
