import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  const adminEmail = "admin@vibepulse.com";
  const password = "AdminPassword123!";

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert crea o actualiza, así puedes correr la seed varias veces
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Actualiza contraseña si cambió
      role: "ADMIN", // Asegura que siempre sea ADMIN
    },
    create: {
      name: "Admin Principal",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user creado/actualizado: ${admin.email}`);
  console.log("Seed completada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
