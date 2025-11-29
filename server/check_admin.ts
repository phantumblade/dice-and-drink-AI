import prisma from './src/prisma';
import bcrypt from 'bcrypt';


async function main() {
    console.log('Checking admin user...');
    const email = 'admin@example.com';
    const password = 'password123';

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log('❌ Admin user NOT found!');
        console.log('Creating admin user now...');
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                id: 'u_admin_debug',
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
                gamesPlayed: 0,
                winRate: 0,
                favoriteGame: 'System',
                totalSpent: 0,
                xp: 99999
            }
        });
        console.log('✅ Admin user created.');
    } else {
        console.log('✅ Admin user found.');
        console.log('User ID:', user.id);
        console.log('Role:', user.role);
        console.log('Stored Hash:', user.password);

        const isValid = await bcrypt.compare(password, user.password);
        console.log('Password "password123" is valid?', isValid);

        if (!isValid) {
            console.log('⚠️ Password mismatch. Updating password...');
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });
            console.log('✅ Password updated to "password123".');
        } else {
            console.log('✅ Password is correct.');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
