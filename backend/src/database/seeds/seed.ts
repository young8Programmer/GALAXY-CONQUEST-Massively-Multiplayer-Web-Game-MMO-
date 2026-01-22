import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Planet } from '../entities/planet.entity';
import { dataSourceOptions } from '../data-source';

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const planetRepository = dataSource.getRepository(Planet);

  console.log('🌱 Starting database seed...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = userRepository.create({
      username: `player${i}`,
      email: `player${i}@test.com`,
      password: hashedPassword,
      level: Math.floor(Math.random() * 10) + 1,
      rating: 1000 + Math.floor(Math.random() * 500),
      metal: Math.floor(Math.random() * 10000),
      gas: Math.floor(Math.random() * 5000),
      crystal: Math.floor(Math.random() * 3000),
    });
    users.push(await userRepository.save(user));
  }

  console.log(`✅ Created ${users.length} users`);

  // Create planets
  const planets = [];
  for (let system = 1; system <= 10; system++) {
    for (let position = 1; position <= 5; position++) {
      const owner = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : null;
      
      const planet = planetRepository.create({
        name: `Planet ${system}-${position}`,
        ownerId: owner?.id || null,
        x: Math.random() * 100,
        y: Math.random() * 100,
        system,
        position,
        level: Math.floor(Math.random() * 5) + 1,
        metal: Math.floor(Math.random() * 1000),
        gas: Math.floor(Math.random() * 500),
        crystal: Math.floor(Math.random() * 300),
        metalMine: Math.floor(Math.random() * 3),
        gasMine: Math.floor(Math.random() * 3),
        crystalMine: Math.floor(Math.random() * 3),
      });
      planets.push(await planetRepository.save(planet));
    }
  }

  console.log(`✅ Created ${planets.length} planets`);

  await dataSource.destroy();
  console.log('🎉 Seed completed!');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
