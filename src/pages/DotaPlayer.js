import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { rankTierLabel } from "../utils/dota";

const DotaPlayer = () => {
    const { steamId } = useParams();
    const [player, setPlayer] = useState(null);
    const [recentMatches, setRecentMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadPlayerData = async () => {
            setLoading(true);
            setError("");

            try {
                const [profileResponse, matchesResponse] = await Promise.all([
                    fetch(`https://api.opendota.com/api/players/${steamId}`, {
                        signal: controller.signal,
                    }),
                    fetch(
                        `https://api.opendota.com/api/players/${steamId}/recentMatches`,
                        {
                            signal: controller.signal,
                        }
                    ),
                ]);

                if (!profileResponse.ok || !matchesResponse.ok) {
                    throw new Error("Falha ao carregar dados do jogador.");
                }

                const [playerData, matchesData] = await Promise.all([
                    profileResponse.json(),
                    matchesResponse.json(),
                ]);

                setPlayer(playerData);
                setRecentMatches(matchesData.slice(0, 10));
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

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
            <section className="max-w-6xl mx-auto space-y-6">
                <Link to="/dota" className="text-red-400 hover:text-red-300">
                    ← Voltar para /dota
                </Link>

                {loading && <p>Carregando dados do player...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && player && (
                    <>
                        <header className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                            <h1 className="text-3xl font-bold">
                                {player.profile?.personaname ||
                                    "Jogador sem nome"}
                            </h1>
                            <p className="text-gray-300 mt-2">
                                Rank: {rankTierLabel(player.rank_tier)}
                            </p>
                            <p className="text-gray-300">
                                MMR estimado:{" "}
                                {player.mmr_estimate?.estimate || "N/A"}
                            </p>
                            {player.profile?.avatarmedium && (
                                <img
                                    src={player.profile.avatarmedium}
                                    alt={player.profile.personaname}
                                    className="mt-4 rounded-full w-24 h-24"
                                />
                            )}
                        </header>

                        <section className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4">
                                Últimas partidas
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-gray-700">
                                            <th className="py-2">Match</th>
                                            <th className="py-2">Hero ID</th>
                                            <th className="py-2">K / D / A</th>
                                            <th className="py-2">Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentMatches.map((match) => {
                                            const won =
                                                (match.player_slot < 128 &&
                                                    match.radiant_win) ||
                                                (match.player_slot >= 128 &&
                                                    !match.radiant_win);

                                            return (
                                                <tr
                                                    key={match.match_id}
                                                    className="border-b border-gray-700"
                                                >
                                                    <td className="py-2">
                                                        {match.match_id}
                                                    </td>
                                                    <td className="py-2">
                                                        {match.hero_id}
                                                    </td>
                                                    <td className="py-2">
                                                        {match.kills} /{" "}
                                                        {match.deaths} /{" "}
                                                        {match.assists}
                                                    </td>
                                                    <td
                                                        className={`py-2 ${
                                                            won
                                                                ? "text-green-400"
                                                                : "text-red-400"
                                                        }`}
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
