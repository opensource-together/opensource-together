import { NextResponse } from "next/server";

export async function GET() {
  // Récupère la liste des projets (exemple vide)
  return NextResponse.json([], { status: 200 });
}

export async function POST(request: Request) {
  const project = await request.json();
  // Logique de création (échantillon : on génère un id)
  const created = { ...project, id: Date.now().toString() };
  return NextResponse.json(created, { status: 201 });
}