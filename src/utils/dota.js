const STEAM_ACCOUNT_OFFSET = "76561197960265728";
const DOTA_CDN_BASE = "https://cdn.cloudflare.steamstatic.com";
const HEROES_URL =
    "https://cdn.jsdelivr.net/gh/odota/dotaconstants@master/build/heroes.json";

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

export const fetchHeroesMap = async (signal) => {
    const response = await fetch(HEROES_URL, { signal });

    if (!response.ok) {
        throw new Error("Falha ao carregar catálogo de heróis");
    }

    const data = await response.json();

    return Object.values(data).reduce((accumulator, hero) => {
        accumulator[hero.id] = {
            id: hero.id,
            name: hero.localized_name,
            icon: hero.icon ? `${DOTA_CDN_BASE}${hero.icon}` : "",
            image: hero.img ? `${DOTA_CDN_BASE}${hero.img}` : "",
        };

        return accumulator;
    }, {});
};
