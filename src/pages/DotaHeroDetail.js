import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchHeroesMap } from "../utils/dota";

const StatCard = ({ label, value }) => (
    <div className="bg-gray-700/60 rounded-xl p-3 border border-gray-600">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-lg font-semibold mt-1">{value ?? "N/A"}</p>
    </div>
);

const DotaHeroDetail = () => {
    const { heroId } = useParams();
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadHero = async () => {
            setLoading(true);
            setError("");

            try {
                const heroesMap = await fetchHeroesMap(controller.signal);
                const selectedHero = heroesMap[heroId];

                if (!selectedHero) {
                    setError("Herói não encontrado.");
                    return;
                }

                setHero(selectedHero);
            } catch (requestError) {
                if (requestError.name !== "AbortError") {
                    setError("Não foi possível carregar os detalhes do herói.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadHero();

        return () => controller.abort();
    }, [heroId]);

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
            <section className="max-w-5xl mx-auto space-y-6">
                <div className="flex gap-4">
                    <Link
                        to="/dota/heroes"
                        className="text-red-400 hover:text-red-300"
                    >
                        ← Voltar para heróis
                    </Link>
                    <Link
                        to="/dota"
                        className="text-red-400 hover:text-red-300"
                    >
                        Ir para /dota
                    </Link>
                </div>

                {loading && <p>Carregando herói...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && hero && (
                    <>
                        <header className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
                            {hero.image ? (
                                <img
                                    src={hero.image}
                                    alt={hero.name}
                                    className="w-full h-56 object-cover"
                                />
                            ) : (
                                <div className="w-full h-56 bg-gray-700" />
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-3">
                                    {hero.icon ? (
                                        <img
                                            src={hero.icon}
                                            alt={hero.name}
                                            className="w-12 h-12 rounded"
                                        />
                                    ) : null}
                                    <h1 className="text-3xl font-bold">
                                        {hero.name}
                                    </h1>
                                </div>
                                <p className="text-gray-300 mt-3">
                                    {hero.lore}
                                </p>
                            </div>
                        </header>

                        <section className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4">
                                Informações básicas
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <StatCard
                                    label="Atributo primário"
                                    value={hero.primaryAttr}
                                />
                                <StatCard
                                    label="Tipo de ataque"
                                    value={hero.attackType}
                                />
                                <StatCard
                                    label="Funções"
                                    value={
                                        hero.roles.length
                                            ? hero.roles.join(", ")
                                            : "N/A"
                                    }
                                />
                                <StatCard
                                    label="Vida base"
                                    value={hero.baseHealth}
                                />
                                <StatCard
                                    label="Mana base"
                                    value={hero.baseMana}
                                />
                                <StatCard
                                    label="Armadura base"
                                    value={hero.baseArmor}
                                />
                                <StatCard
                                    label="Ataque base"
                                    value={`${hero.baseAttackMin} - ${hero.baseAttackMax}`}
                                />
                                <StatCard
                                    label="Velocidade de movimento"
                                    value={hero.moveSpeed}
                                />
                                <StatCard
                                    label="Ganho STR / AGI / INT"
                                    value={`${hero.strGain} / ${hero.agiGain} / ${hero.intGain}`}
                                />
                            </div>
                        </section>
                    </>
                )}
            </section>
        </main>
    );
};

export default DotaHeroDetail;
