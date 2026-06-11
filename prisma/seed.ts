import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Check if admin user exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@trivela.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash("Admin@123", 12);
    
    const admin = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@trivela.com",
        password: hashedPassword,
        fullName: "Admin User",
        role: "ADMIN",
        totalPoints: 0,
      },
    });

    console.log("✅ Admin user created:", admin.email);
  } else {
    console.log("✅ Admin user already exists");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
