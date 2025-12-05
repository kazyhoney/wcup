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

export interface KnockoutMatch {
    id: string;
    round: 'R32' | 'R16' | 'QF' | 'SF' | 'Final';
    matchNumber: number;
    team1: Team | null;
    team2: Team | null;
    winner: Team | null;
    score?: string;
}

// Helper to simulate match winner
export const simulateMatchWinner = (t1: Team, t2: Team): { winner: Team, score: string } => {
    // Calculate win probability based on rank difference
    // Higher rank (lower number) is better.
    // Example: Team 1 (Rank 1) vs Team 2 (Rank 20) -> Diff = 19
    // Base prob = 0.5. Add 0.5% per rank difference.
    // Max cap at 0.85 (85% chance to win) to allow for upsets.

    const rankDiff = t2.rank - t1.rank; // Positive if t1 is better
    let winProb = 0.5 + (rankDiff * 0.005);

    // Cap probability between 0.15 and 0.85
    winProb = Math.max(0.15, Math.min(0.85, winProb));

    // Random factor
    const r = Math.random();

    // Generate realistic scores based on winner and rank difference
    // If rank difference is large, higher chance of bigger score gap
    const isUpset = (winProb > 0.5 && r > winProb) || (winProb < 0.5 && r < winProb);

    // Base goals for winner (1-3)
    let winnerGoals = Math.floor(Math.random() * 3) + 1;
    // Base goals for loser (0-1)
    let loserGoals = Math.floor(Math.random() * 2);

    // Adjust for large rank difference
    if (Math.abs(rankDiff) > 20 && !isUpset) {
        winnerGoals += Math.floor(Math.random() * 2); // Add 0-1 goals
    }

    // Ensure winner has more goals
    if (winnerGoals <= loserGoals) {
        winnerGoals = loserGoals + 1;
    }

    // PK logic for draws (though we force a winner above, let's keep PK notation if close)
    // Actually, for knockout we need a winner. The above logic guarantees a winner.
    // Let's just return the score.

    // If it was a very close game (randomly decided), maybe add PK notation?
    // For simplicity, let's just return the score.

    // Wait, the previous logic had PKs. Let's keep PKs if the "natural" result was a draw.
    // Let's simulate a "natural" score first.

    const lambda1 = 1.2 + (rankDiff * 0.01); // Expected goals for t1
    const lambda2 = 1.2 - (rankDiff * 0.01); // Expected goals for t2

    // Simple Poisson-like simulation
    const p1 = Math.floor(Math.random() * 3 * (lambda1 > 0 ? lambda1 : 0.5));
    const p2 = Math.floor(Math.random() * 3 * (lambda2 > 0 ? lambda2 : 0.5));

    if (p1 !== p2) {
        return p1 > p2 ? { winner: t1, score: `${p1}-${p2}` } : { winner: t2, score: `${p1}-${p2}` };
    }

    // If draw, PKs
    // Weighted PK coin flip
    const pkProb = 0.5 + (rankDiff * 0.002); // Slight advantage for better team in PKs
    return Math.random() < pkProb
        ? { winner: t1, score: `${p1}-${p2} (PK)` }
        : { winner: t2, score: `${p1}-${p2} (PK)` };
};

export const simulateTournament = (groups: GroupResult[], _myTeamId: string, _myRank: 1 | 2): KnockoutMatch[] => {
    const matches: KnockoutMatch[] = [];

    // Flatten groups to find 1st and 2nd place teams
    const groupWinners: Record<string, Team> = {};
    const groupRunnersUp: Record<string, Team> = {};
    const thirdPlaceTeams: Team[] = [];

    groups.forEach(g => {
        if (g.teams.length >= 1) groupWinners[g.group] = g.teams[0];
        if (g.teams.length >= 2) groupRunnersUp[g.group] = g.teams[1];
        if (g.teams.length >= 3) thirdPlaceTeams.push(g.teams[2]);
    });

    // Sort 3rd place teams by rank to find top 8
    thirdPlaceTeams.sort((a, b) => a.rank - b.rank);
    const best8Thirds = thirdPlaceTeams.slice(0, 8);

    // ROUND OF 32 (16 Matches)
    // We need to pair 24 (1st/2nd) + 8 (3rd) = 32 teams.
    // Standard logic often pairs 1st with 2nd, and some 1st with 3rd.
    // Since we have 12 groups, let's try to make it interesting.

    // Group A1 vs B2, B1 vs A2, etc. covers 12 matches (24 teams) if we strictly pair 1st/2nd.
    // But we need to integrate 8 third place teams.
    // This suggests we can't just engage all 2nd place teams with 1st place teams.
    // 8 Group winners should play 8 3rd place teams.
    // 4 Group winners should play 4 2nd place teams.
    // Remaining 8 2nd place teams play each other? No, usually 1st vs 2nd/3rd.

    // Let's use a simplified bracket structure for 32 teams:
    // Slot 1..32.
    // We will assign:
    // 12 Group Winners (A1..L1)
    // 12 Group Runners-up (A2..L2)
    // 8 Best Thirds (3rd..3rd)

    // Total 32.

    // Pairing Strategy:
    // Match 1: A1 vs (Random 3rd)
    // Match 2: B2 vs C2 (Random 2nd vs 2nd? No that's weird)
    // Let's blindly pair "Strong vs Weak" roughly.
    // Pot A: 12 Winners (Rank 1-12 in bracket)
    // Pot B: 4 Best Runners-up (Rank 13-16) -> These play 2nd Place teams?
    // Actually, let's stick to a fixed pattern to ensure reproducibility and "tournament tree" feel.

    // We have 32 slots.
    // Let's fill them with A1..L1, A2..L2, and 8x3rd.
    // A simple credible pattern:
    // Matches 1-8: 1st Place vs 3rd Place (8 matches) -> 8 Winners
    // Matches 9-12: 1st Place vs 2nd Place (4 matches) -> 4 Winners
    // Matches 13-16: 2nd Place vs 2nd Place (4 matches) -> 4 Winners (This happens in EUROs sometimes with 3rd place logic)

    // Let's distribute teams into valid slots.

    const r32Matches: KnockoutMatch[] = [];
    let matchId = 1;

    // Helper to create match
    const createMatch = (t1: Team, t2: Team) => ({
        id: `R32-${matchId++}`,
        round: 'R32' as const,
        matchNumber: matchId - 1,
        team1: t1,
        team2: t2,
        ...simulateMatchWinner(t1, t2)
    });

    // Pattern:
    // 1. A1 vs Best3rd #1
    // 2. B1 vs Best3rd #2
    // ...
    // H1 vs Best3rd #8
    // I1 vs J2
    // K1 vs L2
    // ... (This leaves I2, J1, K2, L1 etc unused)

    // Let's just pair them sequentially for simplicity but keeping constraints in mind?
    // Constrained pairing is complex. Let's do:
    // Pool 1: 12 Winners
    // Pool 2: 12 Runners-up + 8 Thirds = 20 teams.

    // Actually, simpler:
    // A1 vs B2
    // C1 vs D2
    // E1 vs F2
    // G1 vs H2
    // I1 vs J2
    // K1 vs L2 (6 matches)

    // B1 vs A2
    // D1 vs C2
    // F1 vs E2
    // H1 vs G2
    // J1 vs I2
    // L1 vs K2 (6 matches)

    // This uses all 12 winners and 12 runners-up.
    // We leave out the 8 best 3rd place teams entirely!
    // This was the bug in previous thought process. 1st vs 2nd consumes 24 slots. 
    // We need to use 32 slots.

    // So we CANNOT pair all A1-B2.
    // We must have 16 pairings.

    // Revised Pairing:
    // 8 pairs of (1st vs 3rd)
    // 4 pairs of (1st vs 2nd)
    // 4 pairs of (2nd vs 2nd)
    // Total 16 matches.

    const winners = Object.values(groupWinners); // 12
    const runners = Object.values(groupRunnersUp); // 12
    const thirds = best8Thirds; // 8

    // Sort winners by rank to determine "Top Seeds" of the knockout
    winners.sort((a, b) => a.rank - b.rank);

    // Top 8 Winners play Thirds
    const top8Winners = winners.slice(0, 8);
    const bottom4Winners = winners.slice(8, 12);

    // We have 12 runners + 4 bottom winners = 16 teams to pair in other brackets.
    // But we need logically sound placements.

    // Matches 1-8: Top 8 Winners vs 8 Thirds
    for (let i = 0; i < 8; i++) {
        r32Matches.push(createMatch(top8Winners[i], thirds[i]));
    }

    // Matches 9-12: Bottom 4 Winners vs Top 4 Runners
    runners.sort((a, b) => a.rank - b.rank);
    const top4Runners = runners.slice(0, 4);
    const bottom8Runners = runners.slice(4, 12);

    for (let i = 0; i < 4; i++) {
        r32Matches.push(createMatch(bottom4Winners[i], top4Runners[i]));
    }

    // Matches 13-16: Remaining 8 Runners play each other
    for (let i = 0; i < 8; i += 2) {
        if (bottom8Runners[i + 1]) {
            r32Matches.push(createMatch(bottom8Runners[i], bottom8Runners[i + 1]));
        }
    }

    // Note: The order of matches in r32Matches matters for who plays who in R16.
    // Match 1 winner plays Match 2 winner? Or Match 1 vs Match 16 (Seed 1 vs 32)?
    // Standard bracket: 1 vs 2, 3 vs 4...
    // Let's shuffle the pairs to randomize the bracket or sort by ID.
    // But currently we just pushed them in groups.
    // Let's reorder them to mix strong teams.

    // We have 16 completed matches.
    // Let's sort them so the "Top" matches (Match 1 winner) don't immediately play each other.
    // A standard bracket is 1-16, 8-9...
    // Let's just simple pair adjacent matches in the array for R16.
    // So we should shuffle the matches ARRAY before returning? 
    // Or just shuffle the pairing order above?
    // Let's shuffle the order of matches.
    const shuffledR32Matches = matches.concat(r32Matches.sort(() => Math.random() - 0.5));

    // Re-assign match IDs based on new order to look clean in UI
    shuffledR32Matches.forEach((m, idx) => {
        m.id = `R32-${idx + 1}`;
        m.matchNumber = idx + 1;
    });

    matches.push(...shuffledR32Matches);

    // Simulate R16 (Winners of R32)
    const r16Matches: KnockoutMatch[] = [];
    for (let i = 0; i < shuffledR32Matches.length; i += 2) {
        const m1 = shuffledR32Matches[i];
        const m2 = shuffledR32Matches[i + 1];
        if (m1.winner && m2.winner) {
            r16Matches.push({
                id: `R16-${Math.floor(i / 2) + 1}`,
                round: 'R16',
                matchNumber: Math.floor(i / 2) + 1,
                team1: m1.winner,
                team2: m2.winner,
                ...simulateMatchWinner(m1.winner, m2.winner)
            });
        }
    }
    matches.push(...r16Matches);

    // Simulate QF
    const qfMatches: KnockoutMatch[] = [];
    for (let i = 0; i < 8; i += 2) { // 8 R16 matches -> 4 QF matches
        if (!r16Matches[i]) break;
        const m1 = r16Matches[i];
        const m2 = r16Matches[i + 1];
        if (m1?.winner && m2?.winner) {
            const { winner, score } = simulateMatchWinner(m1.winner, m2.winner);
            const match: KnockoutMatch = {
                id: `QF-${Math.floor(i / 2) + 1}`,
                round: 'QF',
                matchNumber: Math.floor(i / 2) + 1,
                team1: m1.winner,
                team2: m2.winner,
                winner,
                score
            };
            qfMatches.push(match);
            matches.push(match);
        }
    }

    // Simulate SF
    const sfMatches: KnockoutMatch[] = [];
    for (let i = 0; i < 4; i += 2) {
        if (!qfMatches[i]) break;
        const m1 = qfMatches[i];
        const m2 = qfMatches[i + 1];
        if (m1?.winner && m2?.winner) {
            const { winner, score } = simulateMatchWinner(m1.winner, m2.winner);
            const match: KnockoutMatch = {
                id: `SF-${Math.floor(i / 2) + 1}`,
                round: 'SF',
                matchNumber: Math.floor(i / 2) + 1,
                team1: m1.winner,
                team2: m2.winner,
                winner,
                score
            };
            sfMatches.push(match);
            matches.push(match);
        }
    }

    // Simulate Final
    if (sfMatches[0]?.winner && sfMatches[1]?.winner) {
        const { winner, score } = simulateMatchWinner(sfMatches[0].winner, sfMatches[1].winner);
        matches.push({
            id: 'Final',
            round: 'Final',
            matchNumber: 1,
            team1: sfMatches[0].winner,
            team2: sfMatches[1].winner,
            winner,
            score
        });
    }

    return matches;
};

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
