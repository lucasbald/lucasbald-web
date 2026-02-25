const STEAM_ACCOUNT_OFFSET = "76561197960265728";

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
