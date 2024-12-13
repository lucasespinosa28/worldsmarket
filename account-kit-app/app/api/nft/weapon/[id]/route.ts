import { NextRequest, NextResponse } from 'next/server';

const weapons = [
  { id: 1, name: "Iron Sword", type: "Sword", damage: 10, rarity: "Common" },
  { id: 2, name: "Wooden Bow", type: "Bow", damage: 8, rarity: "Common" },
  { id: 3, name: "Steel Axe", type: "Axe", damage: 12, rarity: "Uncommon" },
  { id: 4, name: "Mage Staff", type: "Staff", damage: 15, rarity: "Uncommon" },
  { id: 5, name: "Enchanted Dagger", type: "Dagger", damage: 18, rarity: "Rare" },
  { id: 6, name: "Flaming Spear", type: "Spear", damage: 20, rarity: "Rare" },
  { id: 7, name: "Thunderbolt Hammer", type: "Hammer", damage: 25, rarity: "Epic" },
  { id: 8, name: "Void Scythe", type: "Scythe", damage: 30, rarity: "Epic" },
  { id: 9, name: "Dragon Slayer Greatsword", type: "Greatsword", damage: 40, rarity: "Legendary" },
  { id: 10, name: "Celestial Bow", type: "Bow", damage: 50, rarity: "Mythic" },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id) || id < 1) {
    return NextResponse.json({ error: "Invalid weapon ID. Must be a positive integer." }, { status: 400 });
  }

  // Generate weapon data for IDs beyond 10
  const weaponIndex = (id - 1) % weapons.length;
  const baseWeapon = weapons[weaponIndex];

  const weapon = {
    ...baseWeapon,
    id: id,
    damage: Math.floor(baseWeapon.damage * (1 + (id - 1) / 10)), // Increase damage for higher IDs
  };

  // Calculate the image index (0-9) using modulo
  const imageIndex = (id - 1) % 10;
  return NextResponse.json({
    ...weapon,
    description: `A ${weapon.rarity.toLowerCase()} ${weapon.type.toLowerCase()} that deals ${weapon.damage} damage`,
    price: id * 20,
    image: `http://localhost:3000/weapons/nerf_0000${imageIndex}_.png`
  });
}