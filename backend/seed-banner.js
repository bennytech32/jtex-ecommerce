const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Inaongeza banner kwenye database ya Railway...');

    const banner = await prisma.banner.create({
        data: {
            title: "KARIBU JTEX\nBidhaa Mpya Zimefika",
            subtitle: "Jipatie simu, kompyuta na nguo kwa bei nafuu kabisa.",
            bg: "from-[#E8A922] to-[#c28a19]",
            icon: "🎉",
            isActive: true,
            link: "/categories"
        },
    });

    console.log('Banner imeongezwa kwa mafanikio:', banner);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });