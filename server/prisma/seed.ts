import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed completa...");

  const adminEmail = "admin@vibepulse.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "AdminPassword123!";
  const clientEmail = "cliente@vibepulse.com";
  const clientPassword = process.env.CLIENT_SEED_PASSWORD || "Cliente123!";

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const clientHash = await bcrypt.hash(clientPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin Principal",
      password: adminHash,
      role: "ADMIN",
    },
    create: {
      name: "Admin Principal",
      email: adminEmail,
      password: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: clientEmail },
    update: {
      name: "Cliente Demo",
      password: clientHash,
      role: "CLIENT",
    },
    create: {
      name: "Cliente Demo",
      email: clientEmail,
      password: clientHash,
      role: "CLIENT",
    },
  });

  const categoriesSeed = [
    {
      name: "Moda",
      slug: "moda",
      imageUrl: "https://placehold.co/400x400?text=Moda",
      description: "Tendencias juveniles para todos los días",
    },
    {
      name: "Accesorios",
      slug: "accesorios",
      imageUrl: "https://placehold.co/400x400?text=Accesorios",
      description: "Complementos para elevar tu outfit",
    },
    {
      name: "Calzado",
      slug: "calzado",
      imageUrl: "https://placehold.co/400x400?text=Calzado",
      description: "Sneakers y botas para estilo urbano",
    },
    {
      name: "Deporte",
      slug: "deporte",
      imageUrl: "https://placehold.co/400x400?text=Deporte",
      description: "Prendas activas para tu rutina",
    },
  ];

  const categories = [];
  for (const category of categoriesSeed) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categories.push(record);
  }

  const [moda, accesorios, calzado, deporte] = categories;

  const productsSeed = [
    // Moda
    {
      name: "Chaqueta Oversize Vibe",
      description: "Chaqueta estilo urbano con ajuste oversize.",
      price: 219900,
      imageUrl: "https://placehold.co/700x900?text=Chaqueta+Oversize",
      stock: 14,
      featured: true,
      categoryId: moda.id,
    },
    {
      name: "Hoodie Street Pulse",
      description: "Hoodie unisex de algodón pesado.",
      price: 169900,
      imageUrl: "https://placehold.co/700x900?text=Hoodie",
      stock: 30,
      featured: true,
      categoryId: moda.id,
    },
    {
      name: "Camisa Oxford Urbana",
      description: "Camisa casual moderna.",
      price: 119900,
      imageUrl: "https://placehold.co/700x900?text=Camisa+Oxford",
      stock: 28,
      featured: true,
      categoryId: moda.id,
    },
    {
      name: "Camisa Denim Retro",
      description: "Camisa en denim liviano.",
      price: 134900,
      imageUrl: "https://placehold.co/700x900?text=Camisa+Denim",
      stock: 22,
      categoryId: moda.id,
    },
    {
      name: "Camiseta Basic Core",
      description: "Camiseta básica diaria.",
      price: 64900,
      imageUrl: "https://placehold.co/700x900?text=Camiseta",
      stock: 60,
      featured: true,
      categoryId: moda.id,
    },
    {
      name: "Camiseta Oversize",
      description: "Camiseta oversize urbana.",
      price: 89900,
      imageUrl: "https://placehold.co/700x900?text=Camiseta+Oversize",
      stock: 38,
      categoryId: moda.id,
    },
    {
      name: "Saco Knit Minimal",
      description: "Saco tejido minimalista.",
      price: 159900,
      imageUrl: "https://placehold.co/700x900?text=Saco",
      stock: 20,
      categoryId: moda.id,
    },
    {
      name: "Chaqueta Bomber",
      description: "Chaqueta bomber ligera.",
      price: 199900,
      imageUrl: "https://placehold.co/700x900?text=Bomber",
      stock: 18,
      categoryId: moda.id,
    },
    {
      name: "Blazer Urban Noir",
      description: "Blazer casual para looks elegantes de calle.",
      price: 189900,
      imageUrl: "https://placehold.co/700x900?text=Blazer",
      stock: 16,
      categoryId: moda.id,
    },
    {
      name: "Jean Relaxed Blue",
      description: "Jean relaxed fit de lavado medio.",
      price: 149900,
      imageUrl: "https://placehold.co/700x900?text=Jean",
      stock: 34,
      categoryId: moda.id,
    },
    {
      name: "Pantalon Cargo District",
      description: "Cargo urbano con bolsillos amplios y corte recto.",
      price: 154900,
      imageUrl: "https://placehold.co/700x900?text=Cargo",
      stock: 26,
      categoryId: moda.id,
    },
    {
      name: "Vestido Rib Soft",
      description: "Vestido tejido de ajuste cómodo para uso diario.",
      price: 124900,
      imageUrl: "https://placehold.co/700x900?text=Vestido",
      stock: 19,
      categoryId: moda.id,
    },

    // Accesorios
    {
      name: "Gorra Classic",
      description: "Gorra urbana.",
      price: 59900,
      imageUrl: "https://placehold.co/700x900?text=Gorra",
      stock: 50,
      categoryId: accesorios.id,
    },
    {
      name: "Gorra Snapback",
      description: "Gorra snapback moderna.",
      price: 69900,
      imageUrl: "https://placehold.co/700x900?text=Snapback",
      stock: 45,
      categoryId: accesorios.id,
    },
    {
      name: "Medias Pack",
      description: "Pack de medias.",
      price: 39900,
      imageUrl: "https://placehold.co/700x900?text=Medias",
      stock: 80,
      categoryId: accesorios.id,
    },
    {
      name: "Bolso Crossbody Metro",
      description: "Bolso compacto para llevar esenciales con estilo.",
      price: 89900,
      imageUrl: "https://placehold.co/700x900?text=Crossbody",
      stock: 29,
      categoryId: accesorios.id,
    },
    {
      name: "Mochila Campus Flex",
      description: "Mochila versátil con compartimento acolchado.",
      price: 139900,
      imageUrl: "https://placehold.co/700x900?text=Mochila",
      stock: 21,
      categoryId: accesorios.id,
    },
    {
      name: "Cinturon Leather Edge",
      description: "Cinturón minimalista de acabado mate.",
      price: 54900,
      imageUrl: "https://placehold.co/700x900?text=Cinturon",
      stock: 40,
      categoryId: accesorios.id,
    },
    {
      name: "Lentes Solar Frame",
      description: "Lentes de sol con montura liviana y look moderno.",
      price: 79900,
      imageUrl: "https://placehold.co/700x900?text=Lentes",
      stock: 27,
      categoryId: accesorios.id,
    },

    // Calzado
    {
      name: "Sneakers Aero",
      description: "Zapatillas urbanas.",
      price: 289900,
      imageUrl: "https://placehold.co/700x900?text=Sneakers",
      stock: 18,
      categoryId: calzado.id,
    },
    {
      name: "Zapatos Casual",
      description: "Zapatos cómodos.",
      price: 229900,
      imageUrl: "https://placehold.co/700x900?text=Zapatos",
      stock: 24,
      categoryId: calzado.id,
    },
    {
      name: "Botas Urban",
      description: "Botas resistentes.",
      price: 319900,
      imageUrl: "https://placehold.co/700x900?text=Botas",
      stock: 15,
      categoryId: calzado.id,
    },
    {
      name: "Tenis Runner Flow",
      description: "Tenis livianos para caminatas y uso diario.",
      price: 209900,
      imageUrl: "https://placehold.co/700x900?text=Runner",
      stock: 23,
      categoryId: calzado.id,
    },
    {
      name: "Mocasines Ease",
      description: "Mocasines casuales con plantilla suave.",
      price: 179900,
      imageUrl: "https://placehold.co/700x900?text=Mocasines",
      stock: 17,
      categoryId: calzado.id,
    },
    {
      name: "High Tops Impact",
      description: "Tenis high top con silueta urbana marcada.",
      price: 259900,
      imageUrl: "https://placehold.co/700x900?text=High+Tops",
      stock: 20,
      categoryId: calzado.id,
    },
    {
      name: "Sandalias Urban Slide",
      description: "Sandalias tipo slide para confort diario.",
      price: 99900,
      imageUrl: "https://placehold.co/700x900?text=Sandalias",
      stock: 31,
      categoryId: calzado.id,
    },

    // Deporte
    {
      name: "Jogger Motion",
      description: "Jogger deportivo.",
      price: 129900,
      imageUrl: "https://placehold.co/700x900?text=Jogger",
      stock: 24,
      categoryId: deporte.id,
    },
    {
      name: "Camiseta Training",
      description: "Camiseta deportiva.",
      price: 74900,
      imageUrl: "https://placehold.co/700x900?text=Training",
      stock: 48,
      categoryId: deporte.id,
    },
    {
      name: "Top Active Breeze",
      description: "Top deportivo de secado rápido para entrenamientos intensos.",
      price: 68900,
      imageUrl: "https://placehold.co/700x900?text=Top+Active",
      stock: 32,
      categoryId: deporte.id,
    },
    {
      name: "Short Flex Run",
      description: "Short transpirable con cintura elástica.",
      price: 84900,
      imageUrl: "https://placehold.co/700x900?text=Short",
      stock: 36,
      categoryId: deporte.id,
    },
    {
      name: "Chaqueta Wind Sport",
      description: "Rompevientos liviano para exteriores.",
      price: 144900,
      imageUrl: "https://placehold.co/700x900?text=Windbreaker",
      stock: 18,
      categoryId: deporte.id,
    },
  ];

  for (const product of productsSeed) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: product,
      });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  console.log("✅ Seed lista con productos nuevos.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
