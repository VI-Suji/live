import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, createContext, useContext } from "react";
import { FaLock } from "react-icons/fa";

export type AccessLevel = 'none' | 'local' | 'full';

const AdminAccessContext = createContext<AccessLevel>('none');

export const useAdminAccess = () => useContext(AdminAccessContext);

const FULL_ACCESS_PASSWORD = "gramika_admin"; // Ideally from env
const LOCAL_ACCESS_PASSWORD = "gramika_local"; // Ideally from env

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [accessLevel, setAccessLevel] = useState<AccessLevel>('none');
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/admin/login");
        } else {
            // check local storage for access
            const storedAccess = localStorage.getItem("gramika_admin_access") as AccessLevel;
            if (storedAccess === 'full' || storedAccess === 'local') {
                setAccessLevel(storedAccess);
            }
            setIsChecking(false);
        }
    }, [session, status, router]);

    // Path restriction logic
    useEffect(() => {
        if (accessLevel === 'local') {
            const allowedPaths = [
                '/admin/dashboard',
                '/admin/local-news',
                '/admin/national-news',
                '/admin/entertainment-news',
                '/admin/health-news',
                '/admin/sports-news',
                '/admin/top-stories',
                '/admin/latest-news',
                '/admin/breaking-news',
                '/admin/obituaries',
                '/admin/doctors',
                '/admin/video-gallery',
                '/admin',
                '/admin/login'
            ];
            // If user tries to access restricted page, redirect to dashboard or local-news
            // We check if current path starts with /admin but isn't in allowed list
            if (router.pathname.startsWith('/admin') && !allowedPaths.includes(router.pathname)) {
                // Allow API routes though? No, this component wraps pages.
                router.replace('/admin/dashboard');
            }
        }
    }, [accessLevel, router.pathname, router]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === FULL_ACCESS_PASSWORD) {
            setAccessLevel('full');
            localStorage.setItem("gramika_admin_access", 'full');
        } else if (passwordInput === LOCAL_ACCESS_PASSWORD) {
            setAccessLevel('local');
            localStorage.setItem("gramika_admin_access", 'local');
        } else {
            setError("Incorrect password");
            return;
        }
    };

    if (status === "loading" || isChecking) {
        return (
            <div className="min-h-screen page-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)] font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    if (accessLevel === 'none') {
        return (
            <div className="min-h-screen page-bg flex items-center justify-center p-4">
                <div className="surface-elevated max-w-md w-full p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <FaLock />
                        </div>
                        <h2 className="text-display text-2xl">Security Check</h2>
                        <p className="text-body mt-2">Please enter your secondary admin password to continue.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => {
                                    setPasswordInput(e.target.value);
                                    setError("");
                                }}
                                className="admin-input"
                                placeholder="Enter Password"
                                autoFocus
                            />
                            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-[var(--text-tertiary)]">Authorized Personnel Only</p>
                    </div>
                </div>
            </div>
        );
    }

    const isMaintenanceMonth = new Date().getFullYear() === 2026 && new Date().getMonth() === 2; // March is 0-indexed as 2

    if (isMaintenanceMonth) {
        return (
            <div className="min-h-screen page-bg flex flex-col items-center justify-center p-4">
                <div className="surface-elevated max-w-lg w-full p-10 text-center">
                    <div className="w-24 h-24 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        <FaLock />
                    </div>
                    <h2 className="text-display text-3xl mb-4">Under Maintenance</h2>
                    <p className="text-body text-lg mb-8">
                        Normal editing capabilities will automatically resume on <strong>April 1st, 2026</strong>.
                    </p>
                    <div className="bg-[var(--accent-muted)] text-[var(--accent)] p-4 rounded-xl text-sm font-medium mb-8 text-left">
                        <span className="font-bold flex items-center gap-2 mb-1">Public Site is Live</span>
                        The main website is completely unaffected and is successfully serving to visitors.
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("gramika_admin_access");
                            import("next-auth/react").then(m => m.signOut({ callbackUrl: "/" }));
                        }}
                        className="w-full py-4 bg-[var(--bg-invert)] text-[var(--bg-page)] rounded-xl font-bold hover:opacity-90 transition-colors"
                    >
                        Sign Out & Return to Website
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminAccessContext.Provider value={accessLevel}>
            {children}
        </AdminAccessContext.Provider>
    );
}
