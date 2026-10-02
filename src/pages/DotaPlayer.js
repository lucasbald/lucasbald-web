import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    buildDotaPlayerPath,
    didPlayerWin,
    fetchHeroesMap,
    formatDateTime,
    formatDuration,
    getMatchPath,
    isTurboMatch,
    rankTierLabel,
} from "../utils/dota";

const average = (matches, key) =>
    matches.length
        ? Math.round(
              matches.reduce(
                  (total, match) => total + (Number(match[key]) || 0),
                  0
              ) / matches.length
          )
        : 0;

const percentage = (wins, total) =>
    total ? Math.round((wins / total) * 100) : 0;
const getResult = (match) => didPlayerWin(match.player_slot, match.radiant_win);

const getStreak = (matches) => {
    if (!matches.length) return null;

    const won = getResult(matches[0]);
    const differentResultIndex = matches.findIndex(
        (match) => getResult(match) !== won
    );

    return {
        won,
        count:
            differentResultIndex === -1 ? matches.length : differentResultIndex,
    };
};

const StatCard = ({ label, value, detail, accent = "text-gray-100" }) => (
    <article className="rounded-2xl border border-gray-700 bg-gray-800/80 p-4 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {label}
        </p>
        <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
        {detail && <p className="mt-1 text-sm text-gray-400">{detail}</p>}
    </article>
);

const DotaPlayer = () => {
    const { steamId } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [recentMatches, setRecentMatches] = useState([]);
    const [heroesMap, setHeroesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [playerIdInput, setPlayerIdInput] = useState(steamId);

    const dashboard = useMemo(() => {
        const turboMatches = recentMatches.filter((match) =>
            isTurboMatch(match.game_mode)
        );
        const matches = turboMatches.length ? turboMatches : recentMatches;
        const wins = matches.filter(getResult).length;
        const winsData = matches.filter(getResult);
        const lossesData = matches.filter((match) => !getResult(match));
        const recentTen = matches.slice(0, 10);
        const heroes = matches.reduce((accumulator, match) => {
            const hero = accumulator[match.hero_id] || {
                heroId: match.hero_id,
                games: 0,
                wins: 0,
                kills: 0,
                deaths: 0,
                assists: 0,
            };

            hero.games += 1;
            hero.wins += getResult(match) ? 1 : 0;
            hero.kills += Number(match.kills) || 0;
            hero.deaths += Number(match.deaths) || 0;
            hero.assists += Number(match.assists) || 0;
            accumulator[match.hero_id] = hero;
            return accumulator;
        }, {});

        const kills = average(matches, "kills");
        const deaths = average(matches, "deaths");
        const assists = average(matches, "assists");

        return {
            matches,
            hasTurboData: turboMatches.length > 0,
            wins,
            losses: matches.length - wins,
            winRate: percentage(wins, matches.length),
            recentWinRate: percentage(
                recentTen.filter(getResult).length,
                recentTen.length
            ),
            streak: getStreak(matches),
            kills,
            deaths,
            assists,
            kda: ((kills + assists) / Math.max(1, deaths)).toFixed(2),
            gpm: average(matches, "gold_per_min"),
            xpm: average(matches, "xp_per_min"),
            lastHits: average(matches, "last_hits"),
            towerDamage: average(matches, "tower_damage"),
            deathGap:
                average(lossesData, "deaths") - average(winsData, "deaths"),
            farmGap:
                average(winsData, "last_hits") -
                average(lossesData, "last_hits"),
            heroes: Object.values(heroes)
                .sort((a, b) => b.games - a.games || b.wins - a.wins)
                .slice(0, 5),
        };
    }, [recentMatches]);

    useEffect(() => {
        const controller = new AbortController();
        setPlayerIdInput(steamId);

        const loadPlayerData = async () => {
            setLoading(true);
            setError("");

            try {
                const [profileResponse, matchesResponse, heroesData] =
                    await Promise.all([
                        fetch(
                            `https://api.opendota.com/api/players/${steamId}`,
                            {
                                signal: controller.signal,
                            }
                        ),
                        fetch(
                            `https://api.opendota.com/api/players/${steamId}/recentMatches`,
                            {
                                signal: controller.signal,
                            }
                        ),
                        fetchHeroesMap(controller.signal),
                    ]);

                if (!profileResponse.ok || !matchesResponse.ok) {
                    throw new Error("Falha ao carregar dados do jogador.");
                }

                const [playerData, matchesData] = await Promise.all([
                    profileResponse.json(),
                    matchesResponse.json(),
                ]);

                setPlayer(playerData);
                setRecentMatches(matchesData.slice(0, 20));
                setHeroesMap(heroesData);
            } catch (requestError) {
                if (requestError.name !== "AbortError") {
                    setError(
                        "Não foi possível carregar os dados do jogador no momento."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadPlayerData();
        return () => controller.abort();
    }, [steamId]);

    const updatePlayer = (event) => {
        event.preventDefault();
        const path = buildDotaPlayerPath(playerIdInput);

        if (!path) {
            setError("Digite um Steam ID numérico válido.");
            return;
        }

        navigate(path);
    };

    return (
        <main className="min-h-screen bg-gray-900 px-4 py-10 text-gray-100">
            <section className="mx-auto max-w-6xl space-y-6">
                <Link to="/dota" className="text-red-400 hover:text-red-300">
                    ← Voltar para /dota
                </Link>

                <form
                    onSubmit={updatePlayer}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-700 bg-gray-800 p-4 sm:flex-row sm:items-end"
                >
                    <label
                        className="flex-1 text-sm font-medium text-gray-300"
                        htmlFor="player-id"
                    >
                        Steam ID
                        <input
                            id="player-id"
                            value={playerIdInput}
                            onChange={(event) =>
                                setPlayerIdInput(event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-red-400"
                            inputMode="numeric"
                        />
                    </label>
                    <button
                        className="rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
                        type="submit"
                    >
                        Atualizar dashboard
                    </button>
                </form>

                {loading && <p>Carregando dados do player...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && player && (
                    <>
                        <header className="overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 via-gray-800 to-red-950/50 p-6 shadow-xl">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                {player.profile?.avatarmedium && (
                                    <img
                                        src={player.profile.avatarmedium}
                                        alt={player.profile.personaname}
                                        className="h-20 w-20 rounded-2xl border border-red-400/40"
                                    />
                                )}
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                                        Seu Dota dashboard
                                    </p>
                                    <h1 className="mt-1 text-3xl font-bold">
                                        {player.profile?.personaname ||
                                            "Jogador sem nome"}
                                    </h1>
                                    <p className="mt-2 text-gray-300">
                                        Rank: {rankTierLabel(player.rank_tier)}{" "}
                                        · MMR estimado:{" "}
                                        {player.mmr_estimate?.estimate || "N/A"}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Account ID: {steamId}
                                    </p>
                                </div>
                            </div>
                        </header>

                        <section aria-labelledby="overview-title">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <h2
                                        id="overview-title"
                                        className="text-2xl font-semibold"
                                    >
                                        Visão geral
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {dashboard.hasTurboData
                                            ? "Análise baseada nas partidas Turbo recentes disponíveis."
                                            : "A API não retornou partidas Turbo recentes; exibindo partidas recentes."}
                                    </p>
                                </div>
                                {dashboard.streak && (
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${dashboard.streak.won ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}
                                    >
                                        {dashboard.streak.count}{" "}
                                        {dashboard.streak.won
                                            ? "vitória(s) seguida(s)"
                                            : "derrota(s) seguida(s)"}
                                    </span>
                                )}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    label="Partidas analisadas"
                                    value={dashboard.matches.length}
                                    detail={`${dashboard.wins} vitórias · ${dashboard.losses} derrotas`}
                                />
                                <StatCard
                                    label="Win rate"
                                    value={`${dashboard.winRate}%`}
                                    detail={`Últimas 10: ${dashboard.recentWinRate}%`}
                                    accent={
                                        dashboard.winRate >= 50
                                            ? "text-green-300"
                                            : "text-red-300"
                                    }
                                />
                                <StatCard
                                    label="KDA médio"
                                    value={dashboard.kda}
                                    detail={`${dashboard.kills} / ${dashboard.deaths} / ${dashboard.assists}`}
                                />
                                <StatCard
                                    label="Farm médio"
                                    value={`${dashboard.lastHits} LH`}
                                    detail={`${dashboard.gpm} GPM · ${dashboard.xpm} XPM`}
                                />
                            </div>
                        </section>

                        <section className="grid gap-6 lg:grid-cols-2">
                            <article className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-xl">
                                <h2 className="text-2xl font-semibold">
                                    Heróis mais jogados
                                </h2>
                                <div className="mt-5 space-y-4">
                                    {dashboard.heroes.map((heroStats) => {
                                        const hero =
                                            heroesMap[heroStats.heroId];
                                        return (
                                            <div
                                                className="flex items-center gap-3"
                                                key={heroStats.heroId}
                                            >
                                                {hero?.icon ? (
                                                    <img
                                                        src={hero.icon}
                                                        alt=""
                                                        className="h-10 w-10 rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-gray-700" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold">
                                                        {hero?.name ||
                                                            `Hero #${heroStats.heroId}`}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {heroStats.games} jogos
                                                        ·{" "}
                                                        {percentage(
                                                            heroStats.wins,
                                                            heroStats.games
                                                        )}
                                                        % WR
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-300">
                                                    {heroStats.kills}/
                                                    {heroStats.deaths}/
                                                    {heroStats.assists}
                                                </p>
                                            </div>
                                        );
                                    })}
                                    {!dashboard.heroes.length && (
                                        <p className="text-gray-400">
                                            Ainda não há partidas disponíveis
                                            para analisar.
                                        </p>
                                    )}
                                </div>
                            </article>
                            <article className="rounded-2xl border border-red-900/70 bg-gray-800 p-6 shadow-xl">
                                <p className="text-sm font-semibold uppercase tracking-widest text-red-300">
                                    🧠 Insights
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold">
                                    O que melhorar agora
                                </h2>
                                <ul className="mt-5 space-y-4 text-gray-300">
                                    <li>
                                        <span className="mr-2 text-red-300">
                                            ⚠️
                                        </span>
                                        {dashboard.deathGap > 0
                                            ? `Nas derrotas, você morre ${dashboard.deathGap} vez(es) a mais por partida do que nas vitórias. Priorize sair de fights sem visão e jogar perto de aliados.`
                                            : "Suas mortes estão controladas entre vitórias e derrotas; mantenha esse padrão de posicionamento."}
                                    </li>
                                    <li>
                                        <span className="mr-2 text-yellow-300">
                                            🎯
                                        </span>
                                        {dashboard.farmGap > 0
                                            ? `Nas vitórias você faz ${dashboard.farmGap} LH a mais. Reserve janelas de farm após as fights antes de procurar o próximo confronto.`
                                            : "Seu farm não cresce nas vitórias. Experimente transformar vantagens em torres, Roshan e controle de mapa."}
                                    </li>
                                    <li>
                                        <span className="mr-2 text-blue-300">
                                            📈
                                        </span>
                                        {dashboard.towerDamage > 0
                                            ? `Sua média é ${dashboard.towerDamage.toLocaleString("pt-BR")} de dano em estruturas. Depois de uma kill, converta a vantagem em objetivo.`
                                            : "A API ainda não trouxe dano de estrutura suficiente. Reanalise depois de mais partidas públicas."}
                                    </li>
                                </ul>
                            </article>
                        </section>

                        <section className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-xl">
                            <h2 className="mb-1 text-2xl font-semibold">
                                Partidas recentes
                            </h2>
                            <p className="mb-4 text-sm text-gray-400">
                                Clique no ID da match para ver os detalhes.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700 text-gray-400">
                                            <th className="py-2">Herói</th>
                                            <th className="py-2">Match</th>
                                            <th className="py-2">K / D / A</th>
                                            <th className="py-2">Duração</th>
                                            <th className="py-2">Início</th>
                                            <th className="py-2">Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.matches.map((match) => {
                                            const won = getResult(match);
                                            const hero =
                                                heroesMap[match.hero_id];
                                            return (
                                                <tr
                                                    key={match.match_id}
                                                    className="border-b border-gray-700 hover:bg-gray-700/40"
                                                >
                                                    <td className="py-2">
                                                        <div className="flex items-center gap-2">
                                                            {hero?.icon ? (
                                                                <img
                                                                    src={
                                                                        hero.icon
                                                                    }
                                                                    alt={
                                                                        hero.name
                                                                    }
                                                                    className="h-8 w-8 rounded"
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded bg-gray-700" />
                                                            )}
                                                            <span>
                                                                {hero?.name ||
                                                                    `Hero #${match.hero_id}`}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2">
                                                        <Link
                                                            to={getMatchPath(
                                                                steamId,
                                                                match.match_id
                                                            )}
                                                            className="text-blue-300 hover:text-blue-200"
                                                        >
                                                            {match.match_id}
                                                        </Link>
                                                    </td>
                                                    <td className="py-2">
                                                        {match.kills} /{" "}
                                                        {match.deaths} /{" "}
                                                        {match.assists}
                                                    </td>
                                                    <td className="py-2">
                                                        {formatDuration(
                                                            match.duration
                                                        )}
                                                    </td>
                                                    <td className="py-2">
                                                        {formatDateTime(
                                                            match.start_time
                                                        )}
                                                    </td>
                                                    <td
                                                        className={`py-2 ${won ? "text-green-400" : "text-red-400"}`}
                                                    >
                                                        {won
                                                            ? "Vitória"
                                                            : "Derrota"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </section>
        </main>
    );
};

export default DotaPlayer;
