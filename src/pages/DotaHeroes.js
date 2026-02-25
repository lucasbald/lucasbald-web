import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { fetchHeroesMap } from "../utils/dota";

const DotaHeroes = () => {
    const [heroesMap, setHeroesMap] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadHeroes = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await fetchHeroesMap(controller.signal);
                setHeroesMap(data);
            } catch (requestError) {
                if (requestError.name !== "AbortError") {
                    setError("Não foi possível carregar os heróis no momento.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadHeroes();

        return () => controller.abort();
    }, []);

    const filteredHeroes = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return Object.values(heroesMap)
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((hero) => {
                if (!normalizedSearch) {
                    return true;
                }

                return hero.name.toLowerCase().includes(normalizedSearch);
            });
    }, [heroesMap, search]);

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
            <section className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <Link
                        to="/dota"
                        className="text-red-400 hover:text-red-300"
                    >
                        ← Voltar para /dota
                    </Link>
                    <span className="text-gray-400 text-sm">
                        {filteredHeroes.length} heróis encontrados
                    </span>
                </div>

                <header className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <h1 className="text-3xl font-bold">Heróis de Dota 2</h1>
                    <p className="text-gray-300 mt-2">
                        Catálogo de heróis com busca rápida por nome.
                    </p>

                    <div className="mt-4">
                        <label htmlFor="hero-search" className="block mb-2">
                            Buscar herói
                        </label>
                        <input
                            id="hero-search"
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Ex: Pudge, Invoker, Crystal Maiden..."
                            className="w-full md:w-2/3 rounded-xl px-4 py-3 text-gray-900"
                        />
                    </div>
                </header>

                {loading && <p>Carregando heróis...</p>}
                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && (
                    <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredHeroes.map((hero) => (
                            <article
                                key={hero.id}
                                className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden"
                            >
                                {hero.image ? (
                                    <img
                                        src={hero.image}
                                        alt={hero.name}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-700" />
                                )}
                                <div className="p-4">
                                    <div className="flex items-center gap-2">
                                        {hero.icon ? (
                                            <img
                                                src={hero.icon}
                                                alt={hero.name}
                                                className="w-8 h-8 rounded"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded bg-gray-700" />
                                        )}
                                        <h2 className="text-lg font-semibold">
                                            {hero.name}
                                        </h2>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </section>
        </main>
    );
};

export default DotaHeroes;
