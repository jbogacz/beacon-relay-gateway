import { NextResponse } from "next/server";

export async function GET() {
  const users = [
    { id: 1, name: 'Philip', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true }
  ];

  // ES2023 methods
  const sortedUsers = users.toSorted((a, b) => a.name.localeCompare(b.name));
  const lastActiveUser = users.findLast(user => user.active);
  const reversedUsers = users.toReversed();

  return NextResponse.json({
    sorted: sortedUsers,
    lastActive: lastActiveUser,
    reversed: reversedUsers
  });
}
