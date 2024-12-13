import { NextRequest, NextResponse } from 'next/server';

const potions = [
  { id: 1, name: "Health Potion", effect: "Heal", value: 50, rarity: "Common" },
  { id: 2, name: "Mana Potion", effect: "Restore Mana", value: 50, rarity: "Common" },
  { id: 3, name: "Strength Elixir", effect: "Increase Strength", value: 10, rarity: "Uncommon" },
  { id: 4, name: "Speed Potion", effect: "Increase Speed", value: 15, rarity: "Uncommon" },
  { id: 5, name: "Invisibility Draught", effect: "Invisibility", value: 30, rarity: "Rare" },
  { id: 6, name: "Fire Resistance Tonic", effect: "Fire Resistance", value: 50, rarity: "Rare" },
  { id: 7, name: "Polymorph Potion", effect: "Shape Shift", value: 60, rarity: "Epic" },
  { id: 8, name: "Elixir of Life", effect: "Revive", value: 100, rarity: "Epic" },
  { id: 9, name: "Potion of Flight", effect: "Flight", value: 120, rarity: "Legendary" },
  { id: 10, name: "Omnipotence Brew", effect: "All Stats Boost", value: 200, rarity: "Mythic" },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id) || id < 1 || id > 10) {
    return NextResponse.json({ error: "Invalid potion ID. Must be between 1 and 10." }, { status: 400 });
  }

  const potion = potions[id - 1];

  if (!potion) {
    return NextResponse.json({ error: "Potion not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...potion,
    description: `A ${potion.rarity.toLowerCase()} potion that ${potion.effect.toLowerCase()} by ${potion.value}`,
    price: id * 10,
    image: `http://localhost:3000/potions/fantasy_0000${id-1}_.png`
  });
}