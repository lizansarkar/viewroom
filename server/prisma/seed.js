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

  // 4. Seed Interactive 3D Product Spins
  const spinFramesChair = Array.from(
    { length: 36 },
    (_, i) => `https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800&frame=${i + 1}`
  );

  const productChair = await prisma.product360.upsert({
    where: { id: "prod_aero_chair" },
    update: {},
    create: {
      id: "prod_aero_chair",
      title: "Ergonomic Spatial Chair X1",
      category: "Modern Furniture",
      status: "Studio Ready",
      model3DUrl: "/models/chair.glb",
      authorId: adminUser.id,
      variants: {
        create: [
          {
            name: "Matte Black",
            colorHex: "#1a1a1a",
            accentHex: "#3b82f6",
            imageSequence: spinFramesChair,
          },
          {
            name: "Cyber Cyan",
            colorHex: "#06b6d4",
            accentHex: "#0891b2",
            imageSequence: spinFramesChair,
          },
        ],
      },
      specHotspots: {
        create: [
          {
            angle: 45,
            xPercent: 50,
            yPercent: 45,
            title: "Lumbar Support",
            description: "Adjustable height dynamic spine curve protection",
          },
          {
            angle: 120,
            xPercent: 48,
            yPercent: 15,
            title: "3D Headrest",
            description: "Multi-angle rotational neck relief",
          },
        ],
      },
    },
  });

  const spinFramesWatch = Array.from(
    { length: 36 },
    (_, i) => `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000&frame=${i + 1}`
  );

  const productWatch = await prisma.product360.upsert({
    where: { id: "prod_watch_aero" },
    update: {},
    create: {
      id: "prod_watch_aero",
      title: "Aero Chronograph 360",
      category: "Luxury Timepiece",
      status: "Studio Ready",
      model3DUrl: "/models/watch.glb",
      authorId: adminUser.id,
      variants: {
        create: [
          {
            name: "Onyx Black",
            colorHex: "#0d0d0f",
            accentHex: "#3b82f6",
            imageSequence: spinFramesWatch,
          },
        ],
      },
      specHotspots: {
        create: [
          {
            angle: 45,
            xPercent: 65,
            yPercent: 35,
            title: "Sapphire Crystal Lens",
            description: "Scratch-resistant anti-reflective dual coating",
          },
        ],
      },
    },
  });

  console.log("✅ Seeding completed successfully!");
  console.log(`- Created Admin User: ${adminUser.email}`);
  console.log(`- Created Client User: ${clientUser.email}`);
  console.log(`- Created Tour: ${tour.title}`);
  console.log(`- Created Product: ${productChair.title}`);
  console.log(`- Created Product: ${productWatch.title}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
