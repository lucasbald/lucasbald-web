const STEAM_ACCOUNT_OFFSET = "76561197960265728";
const DOTA_CDN_BASE = "https://cdn.cloudflare.steamstatic.com";
const HEROES_URL =
    "https://cdn.jsdelivr.net/gh/odota/dotaconstants@master/build/heroes.json";
const HERO_LORE_URL =
    "https://cdn.jsdelivr.net/gh/odota/dotaconstants@master/build/hero_lore.json";

const GAME_MODE_LABELS = {
    0: "Unknown",
    1: "All Pick",
    2: "Captains Mode",
    3: "Random Draft",
    4: "Single Draft",
    5: "All Random",
    12: "Least Played",
    13: "Limited Heroes",
    16: "Captains Draft",
    18: "Ability Draft",
    20: "All Random Deathmatch",
    22: "Ranked All Pick",
    23: "Turbo",
};

const LOBBY_TYPE_LABELS = {
    0: "Normal",
    1: "Practice",
    2: "Tournament",
    3: "Tutorial",
    4: "Co-op Bots",
    5: "Solo Queue",
    6: "Ranked",
    7: "Ranked",
    8: "1v1 Mid",
    9: "Battle Cup",
};

const subtractLargeNumbers = (value, offset) => {
    let carry = 0;
    let result = "";

    const a = value.split("").reverse();
    const b = offset.split("").reverse();

    for (let index = 0; index < a.length; index += 1) {
        const digitA = Number(a[index] || 0);
        const digitB = Number(b[index] || 0);

        let subtraction = digitA - digitB - carry;

        if (subtraction < 0) {
            subtraction += 10;
            carry = 1;
        } else {
            carry = 0;
        }

        result = `${subtraction}${result}`;
    }

    return result.replace(/^0+/, "") || "0";
};

const extractHeroName = (str) => {
    return str.replace('npc_dota_hero_', '');
}

export const steamIdToAccountId = (steamId) => {
    if (!steamId) {
        return null;
    }

    const cleanId = `${steamId}`.trim();

    if (!/^\d+$/.test(cleanId)) {
        return null;
    }

    if (cleanId.length > 10) {
        const accountId = subtractLargeNumbers(cleanId, STEAM_ACCOUNT_OFFSET);
        return Number(accountId);
    }

    return Number(cleanId);
};

export const buildDotaPlayerPath = (steamId) => {
    const accountId = steamIdToAccountId(steamId);

    if (!accountId && accountId !== 0) {
        return null;
    }

    return `/dota/player/${accountId}`;
};

export const rankTierLabel = (rankTier) => {
    if (!rankTier) {
        return "Sem ranking calibrado";
    }

    const medalMap = {
        1: "Herald",
        2: "Guardian",
        3: "Crusader",
        4: "Archon",
        5: "Legend",
        6: "Ancient",
        7: "Divine",
        8: "Immortal",
    };

    const medal = Math.floor(rankTier / 10);
    const stars = rankTier % 10;

    return `${medalMap[medal] || "Unknown"}${stars ? ` ${stars}` : ""}`;
};

export const formatDuration = (durationInSeconds) => {
    if (!durationInSeconds && durationInSeconds !== 0) {
        return "N/A";
    }

    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
};

export const formatDateTime = (unixTime) => {
    if (!unixTime) {
        return "N/A";
    }

    return new Date(unixTime * 1000).toLocaleString("pt-BR");
};

export const isRadiantPlayer = (playerSlot) => playerSlot < 128;

export const didPlayerWin = (playerSlot, radiantWin) =>
    (isRadiantPlayer(playerSlot) && radiantWin) ||
    (!isRadiantPlayer(playerSlot) && !radiantWin);

export const getMatchPath = (accountId, matchId) =>
    `/dota/player/${accountId}/match/${matchId}`;

export const getHeroPath = (heroId) => `/dota/heroes/${heroId}`;

export const getGameModeLabel = (gameModeId) =>
    GAME_MODE_LABELS[gameModeId] || `Modo ${gameModeId}`;

export const getLobbyTypeLabel = (lobbyTypeId) =>
    LOBBY_TYPE_LABELS[lobbyTypeId] || `Lobby ${lobbyTypeId}`;

export const isTurboMatch = (gameModeId) => Number(gameModeId) === 23;

export const isRankedMatch = (lobbyTypeId) =>
    [6, 7].includes(Number(lobbyTypeId));

export const fetchHeroesMap = async (signal) => {
    const [heroesResponse, loreResponse] = await Promise.all([
        fetch(HEROES_URL, { signal }),
        fetch(HERO_LORE_URL, { signal }),
    ]);

    if (!heroesResponse.ok || !loreResponse.ok) {
        throw new Error("Falha ao carregar catálogo de heróis");
    }

    const [heroesData, loreData] = await Promise.all([
        heroesResponse.json(),
        loreResponse.json(),
    ]);

    return Object.values(heroesData).reduce((accumulator, hero) => {
        accumulator[hero.id] = {
            id: hero.id,
            name: hero.localized_name,
            key: hero.name,
            icon: hero.icon ? `${DOTA_CDN_BASE}${hero.icon}` : "",
            image: hero.img ? `${DOTA_CDN_BASE}${hero.img}` : "",
            primaryAttr: hero.primary_attr,
            attackType: hero.attack_type,
            roles: hero.roles || [],
            baseHealth: hero.base_health,
            baseMana: hero.base_mana,
            baseArmor: hero.base_armor,
            baseAttackMin: hero.base_attack_min,
            baseAttackMax: hero.base_attack_max,
            moveSpeed: hero.move_speed,
            strGain: hero.str_gain,
            agiGain: hero.agi_gain,
            intGain: hero.int_gain,
            lore: loreData[extractHeroName(hero.name)] || "Lore não disponível no momento.",
        };

        return accumulator;
    }, {});
};
