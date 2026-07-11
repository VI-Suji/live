import React from "react";
import Header from "../components/HeaderComponent";
import Footer from "../components/FooterComponent";
import Meta from "../components/Meta";

const TermsAndConditions = () => {
    return (
        <div className="page-bg min-h-screen">
            <Meta
                title="Terms and Conditions | Gramika News"
                description="Terms and Conditions for Gramika - Read our terms of service."
                url="https://www.gramika.in/terms-and-conditions"
            />
            <Header />

            <main className="page-container py-12 sm:py-16">
                <article className="surface-elevated p-8 sm:p-10 legal-content max-w-4xl mx-auto">
                    <h1>Terms and Conditions</h1>
                    <p className="legal-meta">Last updated: December 6, 2025</p>

                    <section className="space-y-6">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website (https://www.gramika.in), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>

                        <h2>2. Description of Service</h2>
                        <p>
                            Gramika provides users with access to news, articles, and local updates. You understand and agree that the Service may include advertisements and that these advertisements are necessary for Gramika to provide the Service.
                        </p>

                        <h2>3. Content and Copyright</h2>
                        <p>
                            All content on this website, including text, graphics, logos, images, and software, is the property of Gramika or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is the exclusive property of Gramika.
                        </p>

                        <h2>4. User Conduct</h2>
                        <p>
                            You agree not to use the website for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the website in any way that could damage the website, the Service, or the general business of Gramika.
                        </p>

                        <h2>5. Disclaimer of Warranties</h2>
                        <p>
                            The site and its original content, features, and functionality are owned by Gramika and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                        </p>

                        <h2>6. Changes to Terms</h2>
                        <p>
                            Gramika reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at: <a href="mailto:newsgramika@gmail.com">newsgramika@gmail.com</a>
                        </p>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default TermsAndConditions;
