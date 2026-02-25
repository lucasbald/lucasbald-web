import React, { useEffect, useMemo, useState } from "react";
import { FaCoins, FaTrophy } from "react-icons/fa";
import {
    GiBattleAxe,
    GiBroadsword,
    GiClockwork,
    GiStarSwirl,
} from "react-icons/gi";
import { Link, useParams } from "react-router-dom";

import {
    fetchHeroesMap,
    formatDateTime,
    formatDuration,
    getGameModeLabel,
    getLobbyTypeLabel,
    isRadiantPlayer,
    isRankedMatch,
    isTurboMatch,
} from "../utils/dota";

const TeamTable = ({ title, players, heroesMap }) => (
    <section className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                        <th className="py-2">Herói</th>
                        <th className="py-2">Jogador</th>
                        <th className="py-2">K / D / A</th>
                        <th className="py-2">LH / DN</th>
                        <th className="py-2">💰 GPM / ✨ XPM</th>
                        <th className="py-2">⚔️ Dano em herói</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => {
                        const hero = heroesMap[player.hero_id];

                        return (
                            <tr
                                key={`${player.account_id || "anon"}-${player.hero_id}-${player.player_slot}`}
                                className="border-b border-gray-700"
                            >
                                <td className="py-2">
                                    <div className="flex items-center gap-2">
                                        {hero?.icon ? (
                                            <img
                                                src={hero.icon}
                                                alt={hero.name}
                                                className="w-8 h-8 rounded"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded bg-gray-700" />
                                        )}
                                        <span>
                                            {hero?.name ||
                                                `Hero #${player.hero_id}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-2">
                                    {player.personaname || "Anônimo"}
                                </td>
                                <td className="py-2">
                                    {player.kills} / {player.deaths} /{" "}
                                    {player.assists}
                                </td>
                                <td className="py-2">
                                    {player.last_hits} / {player.denies}
                                </td>
                                <td className="py-2">
                                    <div className="flex items-center gap-2">
                                        <FaCoins className="text-yellow-400" />
                                        <span>{player.gold_per_min}</span>
                                        <GiStarSwirl className="text-blue-400 ml-1" />
                                        <span>{player.xp_per_min}</span>
                                    </div>
                                </td>
                                <td className="py-2">
                                    {player.hero_damage || 0}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </section>
);

const MatchBadge = ({ icon: Icon, label, value, valueClassName = "" }) => (
    <div className="bg-gray-700/60 rounded-xl p-3 border border-gray-600">
        <p className="text-xs uppercase tracking-wide text-gray-400 flex items-center gap-2">
            <Icon />
            {label}
        </p>
        <p className={`text-lg font-semibold mt-1 ${valueClassName}`}>
            {value}
        </p>
    </div>
);

const DotaMatch = () => {
    const { steamId, matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [heroesMap, setHeroesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadMatchData = async () => {
            setLoading(true);
            setError("");

            try {
                const [matchResponse, heroesData] = await Promise.all([
                    fetch(`https://api.opendota.com/api/matches/${matchId}`, {
                        signal: controller.signal,
                    }),
                    fetchHeroesMap(controller.signal),
                ]);

                if (!matchResponse.ok) {
                    throw new Error("Falha ao carregar partida");
                }

                const matchData = await matchResponse.json();
                setMatch(matchData);
                setHeroesMap(heroesData);
            } catch (requestError) {
                if (requestError.name !== "AbortError") {
                    setError(
                        "Não foi possível carregar os detalhes dessa partida."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadMatchData();

        return () => controller.abort();
    }, [matchId]);

    const { radiantPlayers, direPlayers } = useMemo(() => {
        if (!match?.players) {
            return { radiantPlayers: [], direPlayers: [] };
        }

        return {
            radiantPlayers: match.players.filter((player) =>
                isRadiantPlayer(player.player_slot)
            ),
            direPlayers: match.players.filter(
                (player) => !isRadiantPlayer(player.player_slot)
            ),
        };
    }, [match]);

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
            <section className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-wrap gap-4">
                    <Link
                        to={`/dota/player/${steamId}`}
                        className="text-red-400 hover:text-red-300"
                    >
                        ← Voltar para perfil
                    </Link>
                    <Link
                        to="/dota"
                        className="text-red-400 hover:text-red-300"
                    >
                        Ir para /dota
                    </Link>
                </div>

                {loading && <p>Carregando partida...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && match && (
                    <>
                        <header className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                            <h1 className="text-3xl font-bold">
                                Detalhes da partida #{match.match_id}
                            </h1>
                            <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <MatchBadge
                                    icon={FaTrophy}
                                    label="Vencedor"
                                    value={
                                        match.radiant_win ? "Radiant" : "Dire"
                                    }
                                    valueClassName={
                                        match.radiant_win
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }
                                />
                                <MatchBadge
                                    icon={GiClockwork}
                                    label="Duração"
                                    value={formatDuration(match.duration)}
                                />
                                <MatchBadge
                                    icon={GiBattleAxe}
                                    label="Modo de jogo"
                                    value={getGameModeLabel(match.game_mode)}
                                />
                                <MatchBadge
                                    icon={GiBroadsword}
                                    label="Tipo de lobby"
                                    value={getLobbyTypeLabel(match.lobby_type)}
                                />
                                <MatchBadge
                                    icon={GiStarSwirl}
                                    label="Início da partida"
                                    value={formatDateTime(match.start_time)}
                                />
                            </div>
                        </header>

                        <TeamTable
                            title={
                                match.radiant_win
                                    ? "Radiant (Vencedor)"
                                    : "Radiant"
                            }
                            players={radiantPlayers}
                            heroesMap={heroesMap}
                        />
                        <TeamTable
                            title={
                                !match.radiant_win ? "Dire (Vencedor)" : "Dire"
                            }
                            players={direPlayers}
                            heroesMap={heroesMap}
                        />
                    </>
                )}
            </section>
        </main>
    );
};

export default DotaMatch;
