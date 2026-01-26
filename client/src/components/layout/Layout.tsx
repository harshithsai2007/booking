import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

import CursorGlow from '../ui/CursorGlow';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-apple-black text-apple-text relative">
            <CursorGlow />
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
