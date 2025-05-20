import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { publicRouters } from './router/publicRoutes';
import { privateRouters } from './router/privateRoutes';
import React from 'react';
import ManagerSubject from './pages/Manager/ManagerSubject';
import Primarylayout from './components/layouts/PrimaryLayout';

const RootRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                {publicRouters.map((route) => {
                    const Page = route.element;
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                route.layout ? (
                                    <route.layout>
                                        <Page />
                                    </route.layout>
                                ) : (
                                    <Page />
                                )
                            }
                        />
                    );
                })}

                {/* Private routes */}
                {privateRouters.map((route) => {
                    const Page = route.element;
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                route.layout ? (
                                    <route.layout>
                                        <Page />
                                    </route.layout>
                                ) : (
                                    <Page />
                                )
                            }
                        />
                    );
                })}

                {/* Additional routes */}
                <Route
                    path="/subject"
                    element={
                        <Primarylayout>
                            <ManagerSubject />
                        </Primarylayout>
                    }
                />

                {/* Default route */}
                <Route
                    path="*"
                    element={<Navigate to="/home" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default RootRouter; 