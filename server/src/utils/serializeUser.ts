import { Prisma } from '@prisma/client';

export const userProfileInclude = {
  badges: true,
  bookings: {
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: 'desc' as const,
    },
  },
  registeredTournaments: {
    include: {
      tournament: true,
    },
  },
  campaignsJoined: {
    include: {
      campaign: true,
      character: true,
    },
  },
} satisfies Prisma.UserInclude;

type UserWithProfile = Prisma.UserGetPayload<{
  include: typeof userProfileInclude;
}>;

export const serializeUserProfile = (user: UserWithProfile) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  registeredTournaments: user.registeredTournaments,
  pendingRequests: [],
  badges: user.badges,
  bookings: user.bookings.map((booking) => ({
    id: booking.id,
    date: booking.date.toISOString().split('T')[0],
    time: booking.time,
    participants: booking.participants,
    duration: booking.duration,
    totalPrice: booking.totalPrice,
    status: booking.status,
    items: booking.items,
  })),
  campaignsJoined: user.campaignsJoined,
  stats: {
    xp: user.xp,
    gamesPlayed: user.gamesPlayed,
    winRate: user.winRate,
    favoriteGame: user.favoriteGame || 'Nessuno',
    totalSpent: user.totalSpent,
  },
});
