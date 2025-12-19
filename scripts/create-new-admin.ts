import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = "streichhiram00@gmail.com";
  const rawPassword = "Admin123!";

  console.log(`⏳ Creating new Admin user for: ${email}...`);

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await db.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      hashedPassword: hashedPassword,
    },
    create: {
      email: email,
      name: "Admin Streich",
      role: "ADMIN",
      hashedPassword: hashedPassword,
    },
  });

  console.log(`
  =========================================
  ✅ ADMIN USER CREATED SUCCESSFULLY!
  =========================================
  📧 Email:    ${email}
  🔑 Password: ${rawPassword}
  🛡️ Role:     ${user.role}
  =========================================
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error creating admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
