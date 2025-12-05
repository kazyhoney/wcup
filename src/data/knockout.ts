export interface KnockoutOpponent {
    rank: 1 | 2;
    opponentDescription: string;
    targetGroups: string[]; // Groups to look up potential opponents from
}

export const KNOCKOUT_MAPPINGS: Record<string, { first: KnockoutOpponent; second: KnockoutOpponent }> = {
    'A': {
        first: { rank: 1, opponentDescription: 'グループC/E/F/H/Iの3位', targetGroups: ['C', 'E', 'F', 'H', 'I'] },
        second: { rank: 2, opponentDescription: 'グループBの2位', targetGroups: ['B'] }
    },
    'B': {
        first: { rank: 1, opponentDescription: 'グループA/D/G/J/Lの3位', targetGroups: ['A', 'D', 'G', 'J', 'L'] },
        second: { rank: 2, opponentDescription: 'グループAの2位', targetGroups: ['A'] }
    },
    'C': {
        first: { rank: 1, opponentDescription: 'グループE/F/H/I/Jの3位', targetGroups: ['E', 'F', 'H', 'I', 'J'] },
        second: { rank: 2, opponentDescription: 'グループDの2位', targetGroups: ['D'] }
    },
    'D': {
        first: { rank: 1, opponentDescription: 'グループB/G/J/Lの3位', targetGroups: ['B', 'G', 'J', 'L'] },
        second: { rank: 2, opponentDescription: 'グループCの2位', targetGroups: ['C'] }
    },
    'E': {
        first: { rank: 1, opponentDescription: 'グループA/C/F/H/Iの3位', targetGroups: ['A', 'C', 'F', 'H', 'I'] },
        second: { rank: 2, opponentDescription: 'グループFの2位', targetGroups: ['F'] }
    },
    'F': {
        first: { rank: 1, opponentDescription: 'グループD/G/J/Lの3位', targetGroups: ['D', 'G', 'J', 'L'] },
        second: { rank: 2, opponentDescription: 'グループEの2位', targetGroups: ['E'] }
    },
    'G': {
        first: { rank: 1, opponentDescription: 'グループA/C/E/H/Iの3位', targetGroups: ['A', 'C', 'E', 'H', 'I'] },
        second: { rank: 2, opponentDescription: 'グループHの2位', targetGroups: ['H'] }
    },
    'H': {
        first: { rank: 1, opponentDescription: 'グループB/D/J/Lの3位', targetGroups: ['B', 'D', 'J', 'L'] },
        second: { rank: 2, opponentDescription: 'グループGの2位', targetGroups: ['G'] }
    },
    'I': {
        first: { rank: 1, opponentDescription: 'グループA/C/E/Fの3位', targetGroups: ['A', 'C', 'E', 'F'] },
        second: { rank: 2, opponentDescription: 'グループJの2位', targetGroups: ['J'] }
    },
    'J': {
        first: { rank: 1, opponentDescription: 'グループB/D/G/Lの3位', targetGroups: ['B', 'D', 'G', 'L'] },
        second: { rank: 2, opponentDescription: 'グループIの2位', targetGroups: ['I'] }
    },
    'K': {
        first: { rank: 1, opponentDescription: 'グループLの2位', targetGroups: ['L'] },
        second: { rank: 2, opponentDescription: 'グループLの1位', targetGroups: ['L'] }
    },
    'L': {
        first: { rank: 1, opponentDescription: 'グループKの2位', targetGroups: ['K'] },
        second: { rank: 2, opponentDescription: 'グループKの1位', targetGroups: ['K'] }
    }
};
