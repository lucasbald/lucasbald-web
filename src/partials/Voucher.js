import React from "react";
import { useSearchParams } from "react-router-dom";

const Voucher = () => {
    const [searchParams] = useSearchParams();
    const name = searchParams.get("name") || "Convidado";
    const value = searchParams.get("value") || "R$ 100,00";
    const description = "Parabéns! Você recebeu um voucher exclusivo 🎁";
    const voucherNumber = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">🎟 Voucher Especial</h1>
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-xl text-green-600 font-bold mt-2">{value}</p>
                <p className="text-gray-600 mt-4">{description}</p>
                <div className="mt-6 text-sm text-gray-400">
                    Nº Série: {voucherNumber}
                </div>
            </div>
        </div>
    );
};

export default Voucher;
