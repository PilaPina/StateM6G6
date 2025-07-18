export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

// Ensure the MONGODB_URI environment variable is set
const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error('MONGODB_URI environment variable is not set');

// One global client per runtime process
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/*
 Lazily connect and hand back the FunMix collection.
 */
async function connect() {
  // "topology" is populated once connected; guards extra connects (dev hot‑reloads)
  // @ts-expect-error – topology is intentionally not in the public typings
  if (!client.topology) await client.connect();
  return client.db('WordSalad').collection('FunMix');
}

/* READ – GET  */
export async function GET() {
  try {
    const col = await connect();
    const docs = await col.find({}).toArray();
    return NextResponse.json({
      message: 'Connected to MongoDB!',
      words: docs.map(d => ({ id: d._id.toString(), word: d.word })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/database] ', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* CREATE - POST */
export async function POST(req: Request) {
  try {
    const { word } = await req.json();
    if (!word)
      return NextResponse.json({ error: 'word required' }, { status: 400 });

    const col = await connect();
    const { insertedId } = await col.insertOne({ word });
    return NextResponse.json({ id: insertedId.toString(), word });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/database] ', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* EDIT - PUT */
export async function PUT(req: Request) {
  try {
    const { id, word } = await req.json();
    if (!id || !word)
      return NextResponse.json(
        { error: 'id & word required' },
        { status: 400 },
      );

    const col = await connect();
    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { word } },
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: 'id not found' }, { status: 404 });

    return NextResponse.json({ id, word });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[PUT /api/database] ', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* DELETE */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: 'id required' }, { status: 400 });

    const col = await connect();
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return NextResponse.json({ error: 'id not found' }, { status: 404 });

    return NextResponse.json({ id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[DELETE /api/database] ', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}