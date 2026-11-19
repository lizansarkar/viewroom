import prisma from "../prismaClient.js";

async function main() {
  const email = process.argv[2];
  const targetRole = (process.argv[3] || "ADMIN").toUpperCase();

  if (!email) {
    console.log("\n=======================================================");
    console.log("  ViewRoom 360 User Role Manager");
    console.log("=======================================================");
    console.log("Usage: node server/scripts/setRole.js <email> [ADMIN|CREATOR|CLIENT]");
    console.log("Example: npm run set-role admin@viewroom.com ADMIN\n");

    console.log("Listing current database users:");
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, authProvider: true },
      orderBy: { createdAt: "desc" },
    });
    console.table(users);
    process.exit(0);
  }

  const validRoles = ["ADMIN", "CREATOR", "CLIENT"];
  if (!validRoles.includes(targetRole)) {
    console.error(`Invalid role: ${targetRole}. Valid roles are: ${validRoles.join(", ")}`);
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User with email "${email}" not found in database. Creating user record with role ${targetRole}...`);
      const newUser = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          role: targetRole,
          authProvider: "email",
        },
      });
      console.log(`✓ Successfully created and assigned role:`);
      console.table([newUser]);
    } else {
      const updated = await prisma.user.update({
        where: { email },
        data: { role: targetRole },
      });
      console.log(`✓ Successfully updated role for ${email}:`);
      console.table([{ id: updated.id, email: updated.email, name: updated.name, role: updated.role }]);
    }
  } catch (err) {
    console.error("Database operation failed:", err.message);
  } finally {
    process.exit(0);
  }
}

main();
