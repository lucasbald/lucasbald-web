import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    didPlayerWin,
    fetchHeroesMap,
    formatDateTime,
    formatDuration,
    isRadiantPlayer,
} from "../utils/dota";

const TeamTable = ({ title, players, heroesMap, radiantWin }) => (
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
                        <th className="py-2">GPM / XPM</th>
                        <th className="py-2">Dano em herói</th>
                        <th className="py-2">Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => {
                        const hero = heroesMap[player.hero_id];
                        const won = didPlayerWin(
                            player.player_slot,
                            radiantWin
                        );

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
                                    {player.gold_per_min} / {player.xp_per_min}
                                </td>
                                <td className="py-2">
                                    {player.hero_damage || 0}
                                </td>
                                <td
                                    className={`py-2 ${
                                        won ? "text-green-400" : "text-red-400"
                                    }`}
                                >
                                    {won ? "Vitória" : "Derrota"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </section>
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
                            <div className="mt-4 grid md:grid-cols-2 gap-3 text-gray-300">
                                <p>
                                    <strong>Vencedor:</strong>{" "}
                                    {match.radiant_win ? "Radiant" : "Dire"}
                                </p>
                                <p>
                                    <strong>Duração:</strong>{" "}
                                    {formatDuration(match.duration)}
                                </p>
                                <p>
                                    <strong>Início:</strong>{" "}
                                    {formatDateTime(match.start_time)}
                                </p>
                                <p>
                                    <strong>Game Mode:</strong>{" "}
                                    {match.game_mode}
                                </p>
                                <p>
                                    <strong>Lobby Type:</strong>{" "}
                                    {match.lobby_type}
                                </p>
                                <p>
                                    <strong>Patch:</strong>{" "}
                                    {match.patch || "N/A"}
                                </p>
                            </div>
                        </header>

                        <TeamTable
                            title="Radiant"
                            players={radiantPlayers}
                            heroesMap={heroesMap}
                            radiantWin={match.radiant_win}
                        />
                        <TeamTable
                            title="Dire"
                            players={direPlayers}
                            heroesMap={heroesMap}
                            radiantWin={match.radiant_win}
                        />
                    </>
                )}
            </section>
        </main>
    );
};

export default DotaMatch;
