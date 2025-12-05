import { type Team, TEAMS } from '../data/teams';

export interface GroupResult {
    group: string; // 'A' | 'B' ... | 'L'
    teams: Team[];
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Helper to check if a team can be added to a group
function isValidPlacement(groupTeams: Team[], team: Team): boolean {
    // Check confederation constraints
    const confedCounts: Record<string, number> = {};
    for (const t of groupTeams) {
        confedCounts[t.confederation] = (confedCounts[t.confederation] || 0) + 1;
    }

    if (team.confederation === 'UEFA') {
        // UEFA: Max 2 per group
        if ((confedCounts['UEFA'] || 0) >= 2) return false;
    } else {
        // Others: Max 1 per group
        if ((confedCounts[team.confederation] || 0) >= 1) return false;
    }

    // Special handling for Intercontinental Playoffs (simplified)
    // If team is a playoff winner, we might need deeper checks, but for now we rely on the assigned primary confederation in data.

    return true;
}

// Shuffle array (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export function simulateDraw(_myTeamId?: string): GroupResult[] {
    let attempts = 0;
    const MAX_ATTEMPTS = 1000;

    while (attempts < MAX_ATTEMPTS) {
        attempts++;
        try {
            return tryDraw();
        } catch (e) {
            // Retry if deadlocked
            continue;
        }
    }
    throw new Error('Failed to generate a valid draw after multiple attempts.');
}

function tryDraw(): GroupResult[] {
    // Initialize groups
    const groups: Record<string, Team[]> = {};
    GROUPS.forEach(g => groups[g] = []);

    // 1. Place Hosts (Pot 1 fixed)
    const hosts = TEAMS.filter(t => t.isHost);
    const mexico = hosts.find(t => t.id === 'MEX')!;
    const canada = hosts.find(t => t.id === 'CAN')!;
    const usa = hosts.find(t => t.id === 'USA')!;

    groups['A'].push(mexico);
    groups['B'].push(canada);
    groups['D'].push(usa);

    // 2. Place Top Seeds (Pot 1 protected)
    // ESP, ARG, FRA, ENG should avoid A, B, D and be separated.
    // For simplicity, we place them in random available groups from the remaining set, 
    // ensuring they don't go to A, B, D (already taken by hosts).
    const topSeeds = TEAMS.filter(t => ['ESP', 'ARG', 'FRA', 'ENG'].includes(t.id));
    const otherPot1 = TEAMS.filter(t => t.pot === 1 && !t.isHost && !topSeeds.includes(t));

    // Available groups for Pot 1 (excluding A, B, D)
    const availableGroupsForPot1 = GROUPS.filter(g => !['A', 'B', 'D'].includes(g));

    // Shuffle available groups
    const shuffledGroupsPot1 = shuffle(availableGroupsForPot1);

    // Place Top Seeds first
    const shuffledTopSeeds = shuffle(topSeeds);
    shuffledTopSeeds.forEach((team, i) => {
        groups[shuffledGroupsPot1[i]].push(team);
    });

    // Place remaining Pot 1 teams
    const remainingGroupsPot1 = shuffledGroupsPot1.slice(topSeeds.length);
    const shuffledOtherPot1 = shuffle(otherPot1);
    shuffledOtherPot1.forEach((team, i) => {
        groups[remainingGroupsPot1[i]].push(team);
    });

    // 3. Place Pot 2, 3, 4
    for (let pot = 2; pot <= 4; pot++) {
        const potTeams = shuffle(TEAMS.filter(t => t.pot === pot));

        // Backtracking for this pot placement
        if (!placePotTeams(groups, potTeams)) {
            throw new Error(`Deadlock at Pot ${pot}`);
        }
    }

    // Convert to result format
    return GROUPS.map(g => ({
        group: g,
        teams: groups[g]
    }));
}

function placePotTeams(groups: Record<string, Team[]>, teams: Team[]): boolean {
    // Simple backtracking to place teams into groups
    // We need to assign each team to a distinct group
    // Since there are 12 teams and 12 groups, each group gets 1 team from the pot.

    const groupIds = GROUPS;

    // We can try to fill group by group or team by team.
    // Team by team is easier for recursion.
    return solvePlacement(groups, teams, 0, [...groupIds]);
}

function solvePlacement(groups: Record<string, Team[]>, teams: Team[], teamIndex: number, availableGroups: string[]): boolean {
    if (teamIndex >= teams.length) {
        return true; // All teams placed
    }

    const team = teams[teamIndex];

    // Try to place 'team' in one of the available groups
    // We shuffle available groups to ensure randomness in valid solutions
    // (Actually, 'teams' is already shuffled, so iterating availableGroups is fine, 
    // but shuffling availableGroups adds more randomness if multiple slots are valid)
    const shuffledGroups = shuffle(availableGroups);

    for (const groupId of shuffledGroups) {
        const currentGroupTeams = groups[groupId];

        if (isValidPlacement(currentGroupTeams, team)) {
            // Place team
            groups[groupId].push(team);

            // Recurse
            const remainingGroups = availableGroups.filter(g => g !== groupId);
            if (solvePlacement(groups, teams, teamIndex + 1, remainingGroups)) {
                return true;
            }

            // Backtrack
            groups[groupId].pop();
        }
    }

    return false; // No valid group found for this team
}
