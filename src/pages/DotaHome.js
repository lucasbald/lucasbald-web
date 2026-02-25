import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import data from "../assets/data";
import { buildDotaPlayerPath } from "../utils/dota";

const DotaHome = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const [error, setError] = useState("");

    const goToPlayer = (steamId) => {
        const path = buildDotaPlayerPath(steamId);

        if (!path) {
            setError("Digite um Steam ID válido para continuar.");
            return;
        }

        setError("");
        navigate(path);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        goToPlayer(searchValue);
    };

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
            <section className="max-w-5xl mx-auto space-y-8">
                <header className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                    <img
                        src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/dota_footer_logo.png"
                        alt="Dota 2"
                        className="h-12 md:h-16"
                    />
                    <p className="mt-4 text-gray-300 leading-relaxed">
                        Bem-vindo ao ecossistema de Dota 2. Aqui você pode
                        buscar perfis de jogadores, conferir ranking, últimas
                        partidas e evoluir para novas páginas com heróis,
                        estatísticas e análises.
                    </p>
                </header>

                <form
                    onSubmit={handleSearch}
                    className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700"
                >
                    <label htmlFor="steam-search" className="block mb-3">
                        Buscar jogador por Steam ID (ou account_id)
                    </label>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            id="steam-search"
                            type="text"
                            value={searchValue}
                            onChange={(event) =>
                                setSearchValue(event.target.value)
                            }
                            placeholder="Ex: 1234567890"
                            className="w-full rounded-xl px-4 py-3 text-gray-900"
                        />
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-500 rounded-xl px-6 py-3 font-semibold"
                        >
                            Buscar
                        </button>
                    </div>
                    {error && <p className="mt-3 text-red-400">{error}</p>}
                </form>

                <article
                    role="button"
                    tabIndex={0}
                    onClick={() => goToPlayer(data.dota.steamId)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            goToPlayer(data.dota.steamId);
                        }
                    }}
                    className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 cursor-pointer hover:border-red-500 transition"
                >
                    <p className="text-sm uppercase tracking-wider text-gray-400">
                        Meu perfil Steam
                    </p>
                    <h2 className="text-2xl font-bold mt-2">
                        {data.dota.name}
                    </h2>
                    <p className="text-gray-300 mt-1">
                        Steam ID: {data.dota.steamId}
                    </p>
                    <p className="text-red-400 mt-4">
                        Clique para abrir perfil
                    </p>
                </article>
            </section>
        </main>
    );
};

export default DotaHome;
