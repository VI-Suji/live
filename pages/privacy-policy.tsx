import Head from 'next/head';
import Header from '../components/HeaderComponent';
import Footer from '../components/FooterComponent';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Privacy Policy - Gramika</title>
                <meta name="description" content="Privacy Policy for Gramika - Learn how we collect, use, and protect your data." />
                <link rel="canonical" href="https://www.gramika.in/privacy-policy" />
            </Head>

            <Header />

            <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <article className="prose prose-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-black text-gray-900 mb-8 pb-4 border-b">Privacy Policy</h1>

                    <p className="text-gray-600 mb-6">Last updated: December 6, 2025</p>

                    <section className="space-y-6 text-gray-700">
                        <p>
                            At Gramika ("we," "us," or "our"), accessible from https://www.gramika.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Gramika and how we use it.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us when you subscribe to our newsletter, contact us, or participate in interactive features of our website. This may include your name, email address, phone number, and any other information you choose to provide.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Log Files</h2>
                        <p>
                            Gramika follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies and Web Beacons</h2>
                        <p>
                            Like any other website, Gramika uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Google DoubleClick DART Cookie</h2>
                        <p>
                            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.gramika.in and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third Party Privacy Policies</h2>
                        <p>
                            Gramika's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
                        <p>
                            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                        </p>
                        <p>
                            Email: <a href="mailto:newsgramika@gmail.com" className="text-blue-600 hover:underline">newsgramika@gmail.com</a>
                        </p>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
