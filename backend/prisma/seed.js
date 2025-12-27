const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create service categories
  const categories = await Promise.all([
    prisma.serviceCategory.create({
      data: { name: 'House Cleaning', status: 'active' }
    }),
    prisma.serviceCategory.create({
      data: { name: 'Office Cleaning', status: 'active' }
    }),
    prisma.serviceCategory.create({
      data: { name: 'Deep Cleaning', status: 'active' }
    }),
    prisma.serviceCategory.create({
      data: { name: 'Window Cleaning', status: 'active' }
    }),
    prisma.serviceCategory.create({
      data: { name: 'Carpet Cleaning', status: 'active' }
    })
  ]);
  console.log('✅ Created service categories');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      fullName: 'System Administrator',
      email: 'admin@cleaningservice.com',
      phone: '+1234567890',
      passwordHash: adminPassword,
      role: 'admin',
      status: 'active'
    }
  });
  console.log('✅ Created admin user');

  // Create company owner
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.create({
    data: {
      fullName: 'John Smith',
      email: 'owner@cleancompany.com',
      phone: '+1234567891',
      passwordHash: ownerPassword,
      role: 'company_admin',
      status: 'active'
    }
  });
  console.log('✅ Created company owner');

  // Create customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.create({
    data: {
      fullName: 'Jane Doe',
      email: 'customer@example.com',
      phone: '+1234567892',
      passwordHash: customerPassword,
      role: 'customer',
      status: 'active'
    }
  });
  console.log('✅ Created customer');

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Sparkle Clean Services',
      description: 'Professional cleaning services for homes and offices',
      registrationNumber: 'REG123456',
      address: '123 Main Street',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
      phone: '+1234567893',
      email: 'info@sparkleclean.com',
      ownerId: owner.id,
      verificationStatus: 'verified'
    }
  });
  console.log('✅ Created company');

  // Create service areas
  await prisma.serviceArea.create({
    data: {
      companyId: company.id,
      city: 'New York',
      coverageRadiusKm: 50
    }
  });
  console.log('✅ Created service areas');

  // Create services
  await Promise.all([
    prisma.service.create({
      data: {
        companyId: company.id,
        categoryId: categories[0].id,
        name: 'Basic House Cleaning',
        description: 'Standard cleaning of all rooms including dusting, vacuuming, and mopping',
        basePrice: 89.99,
        durationMinutes: 120,
        isActive: true
      }
    }),
    prisma.service.create({
      data: {
        companyId: company.id,
        categoryId: categories[1].id,
        name: 'Office Cleaning',
        description: 'Professional office cleaning including desks, floors, and common areas',
        basePrice: 149.99,
        durationMinutes: 180,
        isActive: true
      }
    }),
    prisma.service.create({
      data: {
        companyId: company.id,
        categoryId: categories[2].id,
        name: 'Deep House Cleaning',
        description: 'Thorough deep cleaning including appliances, baseboards, and hard-to-reach areas',
        basePrice: 199.99,
        durationMinutes: 240,
        isActive: true
      }
    })
  ]);
  console.log('✅ Created services');

  // Create staff member
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.create({
    data: {
      fullName: 'Mike Johnson',
      email: 'staff@sparkleclean.com',
      phone: '+1234567894',
      passwordHash: staffPassword,
      role: 'staff',
      status: 'active'
    }
  });

  await prisma.companyStaff.create({
    data: {
      companyId: company.id,
      userId: staff.id,
      role: 'cleaner',
      status: 'active'
    }
  });
  console.log('✅ Created staff member');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:');
  console.log('  Email: admin@cleaningservice.com');
  console.log('  Password: admin123');
  console.log('\nCompany Owner:');
  console.log('  Email: owner@cleancompany.com');
  console.log('  Password: owner123');
  console.log('\nCustomer:');
  console.log('  Email: customer@example.com');
  console.log('  Password: customer123');
  console.log('\nStaff:');
  console.log('  Email: staff@sparkleclean.com');
  console.log('  Password: staff123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });