import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = (global as any).prisma;
}

// Log the database URL (make sure to remove this in production)
console.log('Database URL:', process.env.DATABASE_URL);
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, address, website, description, image } = body;

    // Validate input
    if (!address || !website) {
      return NextResponse.json({ error: 'Address and website are required' }, { status: 400 });
    }

    try {
      const contract = await prisma.contract.create({
        data: {
          name: name || '',
          address,
          website,
          description: description || '',
          image: image || '',
        },
      });

      return NextResponse.json(contract, { status: 201 });
    } catch (prismaError) {
      if (prismaError instanceof Prisma.PrismaClientKnownRequestError) {
        if (prismaError.code === 'P2002') {
          return NextResponse.json({ error: 'A contract with this address or website already exists' }, { status: 409 });
        }
      }
      throw prismaError;
    }
  } catch (error) {
    console.error('Error creating contract:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } 
}

export async function GET(request: Request) {
  try {
    await prisma.$connect();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    console.log(`Fetching contract for address: ${address}`);
    const contract = await prisma.contract.findUnique({
      where: {
        address: address,
      },
    });

    if (!contract) {
      console.log(`No contract found for address: ${address}`);
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    console.log(`Contract found:`, contract);
    return NextResponse.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}