import React from "react";
import { useTranslation } from "react-i18next";
import { FaAward, FaGraduationCap, FaUsers } from "react-icons/fa";

const ensureList = (value) => (Array.isArray(value) ? value : []);

const ProfileHighlights = () => {
    const { t } = useTranslation();
    const education = ensureList(
        t("profile.education.items", { returnObjects: true })
    );
    const specialties = ensureList(
        t("profile.specialties.items", { returnObjects: true })
    );
    const certificates = ensureList(
        t("profile.certificates.items", { returnObjects: true })
    );

    return (
        <section className="max-w-5xl mx-auto mt-8 grid gap-5 lg:grid-cols-3">
            <article className="portfolio-panel p-6" data-aos="fade-up">
                <div className="portfolio-icon">
                    <FaGraduationCap />
                </div>
                <p className="portfolio-eyebrow">
                    {t("profile.education.label")}
                </p>
                <h2 className="portfolio-section-title">
                    {t("profile.education.title")}
                </h2>
                <div className="space-y-5 mt-5">
                    {education.map((item) => (
                        <div
                            key={item.degree}
                            className="portfolio-timeline-item"
                        >
                            <p className="font-semibold text-lg text-current">
                                {item.degree}
                            </p>
                            <p className="portfolio-muted text-sm mt-1">
                                {item.school} · {item.period}
                            </p>
                            <p className="portfolio-muted text-sm mt-2">
                                {item.details}
                            </p>
                        </div>
                    ))}
                </div>
            </article>

            <article
                className="portfolio-panel p-6"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <div className="portfolio-icon">
                    <FaUsers />
                </div>
                <p className="portfolio-eyebrow">
                    {t("profile.specialties.label")}
                </p>
                <h2 className="portfolio-section-title">
                    {t("profile.specialties.title")}
                </h2>
                <div className="flex flex-wrap gap-3 mt-5">
                    {specialties.map((specialty) => (
                        <span key={specialty} className="portfolio-chip">
                            {specialty}
                        </span>
                    ))}
                </div>
            </article>

            <article
                className="portfolio-panel p-6"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <div className="portfolio-icon">
                    <FaAward />
                </div>
                <p className="portfolio-eyebrow">
                    {t("profile.certificates.label")}
                </p>
                <h2 className="portfolio-section-title">
                    {t("profile.certificates.title")}
                </h2>
                <div className="space-y-4 mt-5">
                    {certificates.map((certificate) => (
                        <a
                            key={certificate.name}
                            href={certificate.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-certificate"
                        >
                            <span className="font-semibold">
                                {certificate.name}
                            </span>
                            <span className="portfolio-muted text-sm">
                                {certificate.issuer} · {certificate.date}
                            </span>
                        </a>
                    ))}
                </div>
            </article>
        </section>
    );
};

export default ProfileHighlights;
