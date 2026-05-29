/**
 * Seed script — populates the database with test/demo data.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run seed
 *
 * This script is safe to run multiple times — it uses skip-on-conflict logic
 * and will not duplicate data.
 *
 * NOTE: Users reference Clerk IDs. The placeholder Clerk IDs below are used
 * for local development / DB inspection only. For an end-to-end test, replace
 * them with real Clerk user IDs from your Clerk dashboard (or sign-up flow).
 */

import { db } from "@workspace/db";
import {
  usersTable,
  companiesTable,
  productsTable,
  rfqsTable,
  rfqItemsTable,
  quotationsTable,
  quotationItemsTable,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";

// ─── Placeholder Clerk IDs ───────────────────────────────────────────────────
// Replace with real Clerk user IDs for end-to-end manual testing.
const ADMIN_CLERK_ID    = "user_seed_admin_000001";
const BUYER_CLERK_ID    = "user_seed_buyer_000002";
const SUPPLIER_CLERK_ID = "user_seed_supplier_000003";

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ── 1. Products ────────────────────────────────────────────────────────────
  console.log("📦 Seeding products...");
  const products = [
    {
      name: "Sesame Seeds",
      slug: "sesame-seeds",
      category: "Oilseeds",
      description: "High-quality Sudanese white sesame seeds, rich in oil content (50–55%). Available in hulled and natural grades. Widely used in food processing, confectionery, and oil extraction.",
      unit: "MT",
    },
    {
      name: "Gum Arabic",
      slug: "gum-arabic",
      category: "Natural Gums",
      description: "Premium Acacia Senegal gum arabic, used in food & beverage, pharmaceuticals, and cosmetics. Available in spray-dried and kibbled grades. Sudan is the world's largest producer.",
      unit: "MT",
    },
    {
      name: "Groundnuts",
      slug: "groundnuts",
      category: "Oilseeds",
      description: "Sudanese groundnuts (peanuts) — bold and Virginia types. Available in-shell, shelled, blanched, and split. Used in food processing, oil extraction, and peanut butter production.",
      unit: "MT",
    },
    {
      name: "Hibiscus (Karkade)",
      slug: "hibiscus-karkade",
      category: "Botanicals",
      description: "Dried Hibiscus sabdariffa flowers (Karkade), deep red with high anthocyanin content. Used in herbal teas, fruit juices, food coloring, and nutraceuticals.",
      unit: "MT",
    },
    {
      name: "Long Staple Cotton",
      slug: "long-staple-cotton",
      category: "Fibres",
      description: "Sudanese extra-long staple (ELS) cotton, Barakat variety. Staple length 36–41mm. Available as seed cotton, lint, or baled. Prized for fine textile manufacturing.",
      unit: "MT",
    },
  ];

  const seededProducts: { id: number; name: string }[] = [];
  for (const p of products) {
    const existing = await db.query.productsTable.findFirst({
      where: eq(productsTable.slug, p.slug),
    });
    if (existing) {
      console.log(`  ✓ Already exists: ${p.name}`);
      seededProducts.push({ id: existing.id, name: existing.name });
    } else {
      const [created] = await db
        .insert(productsTable)
        .values({ ...p, isActive: true })
        .returning({ id: productsTable.id, name: productsTable.name });
      console.log(`  + Created: ${created.name} (id=${created.id})`);
      seededProducts.push(created);
    }
  }

  // ── 2. Companies ───────────────────────────────────────────────────────────
  console.log("\n🏢 Seeding companies...");

  const buyerCompanyData = {
    name: "Global Agri Traders Ltd",
    type: "buyer" as const,
    ownerId: BUYER_CLERK_ID,
    country: "United Kingdom",
    city: "London",
    address: "12 Commodity Lane, London EC2M 4YG",
    registrationNumber: "GB-12345678",
    taxId: "GB-VAT-987654",
    website: "https://globalagritraders.example.com",
    description: "International commodity trading house specialising in African agricultural products.",
    verificationStatus: "approved" as const,
    verifiedAt: new Date(),
  };

  const supplierCompanyData = {
    name: "Khartoum Agricultural Exports Co.",
    type: "supplier" as const,
    ownerId: SUPPLIER_CLERK_ID,
    country: "Sudan",
    city: "Khartoum",
    address: "Omdurman Street, Khartoum North, Sudan",
    registrationNumber: "SD-98765432",
    taxId: "SD-TAX-123456",
    website: "https://khartoumexports.example.com",
    description: "Leading Sudanese exporter of sesame seeds, gum arabic, and groundnuts with 15 years of experience.",
    verificationStatus: "approved" as const,
    verifiedAt: new Date(),
  };

  let buyerCompanyId: number;
  let supplierCompanyId: number;

  const existingBuyerCo = await db.query.companiesTable.findFirst({
    where: eq(companiesTable.ownerId, BUYER_CLERK_ID),
  });
  if (existingBuyerCo) {
    buyerCompanyId = existingBuyerCo.id;
    console.log(`  ✓ Buyer company already exists: ${existingBuyerCo.name}`);
  } else {
    const [c] = await db
      .insert(companiesTable)
      .values(buyerCompanyData)
      .returning({ id: companiesTable.id, name: companiesTable.name });
    buyerCompanyId = c.id;
    console.log(`  + Created buyer company: ${c.name} (id=${c.id})`);
  }

  const existingSupplierCo = await db.query.companiesTable.findFirst({
    where: eq(companiesTable.ownerId, SUPPLIER_CLERK_ID),
  });
  if (existingSupplierCo) {
    supplierCompanyId = existingSupplierCo.id;
    console.log(`  ✓ Supplier company already exists: ${existingSupplierCo.name}`);
  } else {
    const [c] = await db
      .insert(companiesTable)
      .values(supplierCompanyData)
      .returning({ id: companiesTable.id, name: companiesTable.name });
    supplierCompanyId = c.id;
    console.log(`  + Created supplier company: ${c.name} (id=${c.id})`);
  }

  // ── 3. Users ───────────────────────────────────────────────────────────────
  console.log("\n👤 Seeding users...");

  const usersToSeed = [
    {
      clerkId: ADMIN_CLERK_ID,
      email: "admin@sudanexport.dev",
      firstName: "Platform",
      lastName: "Admin",
      role: "admin" as const,
      status: "active" as const,
      country: "Sudan",
      companyId: null as number | null,
    },
    {
      clerkId: BUYER_CLERK_ID,
      email: "buyer@globalagritraders.dev",
      firstName: "James",
      lastName: "Morrison",
      role: "buyer" as const,
      status: "active" as const,
      country: "United Kingdom",
      companyId: buyerCompanyId,
    },
    {
      clerkId: SUPPLIER_CLERK_ID,
      email: "supplier@khartoumexports.dev",
      firstName: "Ahmed",
      lastName: "Hassan",
      role: "supplier" as const,
      status: "active" as const,
      country: "Sudan",
      companyId: supplierCompanyId,
    },
  ];

  for (const u of usersToSeed) {
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, u.clerkId),
    });
    if (existing) {
      console.log(`  ✓ Already exists: ${u.email} (${u.role})`);
    } else {
      await db.insert(usersTable).values(u);
      console.log(`  + Created: ${u.email} (${u.role})`);
    }
  }

  // ── 4. Sample RFQ ──────────────────────────────────────────────────────────
  console.log("\n📋 Seeding sample RFQ...");

  const sesame    = seededProducts.find((p) => p.name === "Sesame Seeds")!;
  const gumArabic = seededProducts.find((p) => p.name === "Gum Arabic")!;

  let rfqId: number;
  const existingRfq = await db.query.rfqsTable.findFirst({
    where: eq(rfqsTable.referenceNumber, "RFQ-20260001"),
  });

  if (existingRfq) {
    rfqId = existingRfq.id;
    console.log(`  ✓ Already exists: ${existingRfq.referenceNumber}`);
  } else {
    const [rfq] = await db
      .insert(rfqsTable)
      .values({
        referenceNumber: "RFQ-20260001",
        title: "500 MT Sesame Seeds + 50 MT Gum Arabic — Q3 2026",
        status: "quoting",
        buyerId: BUYER_CLERK_ID,
        destinationCountry: "United Kingdom",
        deliveryPort: "Port of Felixstowe",
        paymentTerms: "LC",
        incoterms: "CIF",
        deliveryDeadline: "2026-09-30",
        validUntil: "2026-07-15",
        notes:
          "Product must meet EU food safety standards. Phytosanitary certificate required. " +
          "Prefer suppliers with ISO 22000 or HACCP certification.",
      })
      .returning({ id: rfqsTable.id, referenceNumber: rfqsTable.referenceNumber });
    rfqId = rfq.id;
    console.log(`  + Created RFQ: ${rfq.referenceNumber} (id=${rfq.id})`);

    await db.insert(rfqItemsTable).values([
      {
        rfqId,
        productId: sesame.id,
        quantity: "500",
        unit: "MT",
        targetPrice: "1200.00",
        specifications: "Hulled, moisture < 5%, oil content > 50%, free of pesticide residues.",
      },
      {
        rfqId,
        productId: gumArabic.id,
        quantity: "50",
        unit: "MT",
        targetPrice: "2800.00",
        specifications: "Kibbled grade, Acacia Senegal, moisture < 12%, food grade quality.",
      },
    ]);
    console.log("  + Created 2 RFQ line items");
  }

  // ── 5. Sample Quotation ────────────────────────────────────────────────────
  console.log("\n💬 Seeding sample quotation...");

  const existingQuotation = await db.query.quotationsTable.findFirst({
    where: eq(quotationsTable.rfqId, rfqId),
  });

  if (existingQuotation) {
    console.log(`  ✓ Already exists (id=${existingQuotation.id})`);
  } else {
    const rfqItems = await db.query.rfqItemsTable.findMany({
      where: eq(rfqItemsTable.rfqId, rfqId),
    });

    const [quotation] = await db
      .insert(quotationsTable)
      .values({
        rfqId,
        supplierId: SUPPLIER_CLERK_ID,
        status: "submitted",
        totalAmount: "740000.00",
        currency: "USD",
        validUntil: "2026-07-20",
        deliveryTime: "6–8 weeks from order confirmation",
        paymentTerms: "LC at sight",
        notes:
          "All products are of latest harvest (2025/2026 season). Export documentation including " +
          "phytosanitary certificate, certificate of origin, and weight certificate included. " +
          "SGS inspection available at buyer's request.",
      })
      .returning({ id: quotationsTable.id });

    const quotationId = quotation.id;

    if (rfqItems.length >= 2) {
      await db.insert(quotationItemsTable).values([
        {
          quotationId,
          rfqItemId: rfqItems[0].id,
          quantity: "500",
          unit: "MT",
          unitPrice: "1180.00",
          totalPrice: "590000.00",
          currency: "USD",
          specifications:
            "Hulled white sesame, moisture 4.5%, oil content 52%, compliant with EU pesticide limits.",
        },
        {
          quotationId,
          rfqItemId: rfqItems[1].id,
          quantity: "50",
          unit: "MT",
          unitPrice: "3000.00",
          totalPrice: "150000.00",
          currency: "USD",
          specifications:
            "Kibbled Acacia Senegal gum arabic, moisture 10%, food grade, Kosher certified.",
        },
      ]);
    }

    console.log(`  + Created quotation (id=${quotationId}, total=USD 740,000)`);
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const result = await db.execute(sql`
    SELECT
      (SELECT COUNT(*)::int FROM users)       AS users,
      (SELECT COUNT(*)::int FROM companies)   AS companies,
      (SELECT COUNT(*)::int FROM products)    AS products,
      (SELECT COUNT(*)::int FROM rfqs)        AS rfqs,
      (SELECT COUNT(*)::int FROM quotations)  AS quotations
  `);

  console.log("\n✅ Seed complete! Database summary:");
  console.table(result.rows[0]);
  console.log(
    "\n⚠️  NOTE: Seed user Clerk IDs are placeholders.\n" +
    "   To use these accounts end-to-end, sign up via the app\n" +
    "   and update users.clerk_id with real IDs from your Clerk dashboard.\n"
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
