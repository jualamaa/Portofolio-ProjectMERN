import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeWrapper from '../common/ThemeWrapper';

function resolveRouteTheme(pathname) {
    if (pathname === '/about' || pathname === '/certificates') {
        return 'light';
    }
    if (pathname.startsWith('/projects/') && pathname !== '/projects/') {
        return 'light';
    }
    return 'dark';
}

export default function PublicLayout() {
    const { pathname } = useLocation();
    const activeTheme = resolveRouteTheme(pathname);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <ThemeWrapper theme={activeTheme} className="flex flex-col justify-between">
            <Navbar theme={activeTheme} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer theme={activeTheme} />
        </ThemeWrapper>
    );
}