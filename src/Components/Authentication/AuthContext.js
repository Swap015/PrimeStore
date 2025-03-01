import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/check-auth`, { withCredentials: true });
                setIsAuthenticated(response.data.isAuthenticated);
            } catch (error) {
                console.error("Error checking authentication status:", error);
                setIsAuthenticated(false);
            }
        };
        checkAuthStatus();
    }, []);

    const login = () => {
        setIsAuthenticated(true); // Set auth state to true on login
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
            setIsAuthenticated(false); // Reset auth state to false on logout

        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
