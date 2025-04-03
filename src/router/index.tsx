import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { publicRouters } from './publicRoutes';
import React from 'react';
import DefaultLayout from '../components/layouts/DefaultLayout';
import { nanoid } from 'nanoid';
import { privateRouters } from './privateRoutes';
import Authentication from './Auththentication';

export default function RootRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {publicRouters.map((route) => {
                    const Page = route.element;
                    const Layout =
                        route.layout === undefined
                            ? React.Fragment
                            : route.layout || DefaultLayout;

                    return (
                        <Route
                            key={nanoid()}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
                {privateRouters.map((route) => {
                    const Layout =
                        route.layout === undefined
                            ? React.Fragment
                            : route.layout || DefaultLayout;
                    return (
                        <Route
                            key={nanoid()}
                            path={route.path}
                            element={
                                <Layout>
                                    <Authentication element={route.element} />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </BrowserRouter>
    );
}
