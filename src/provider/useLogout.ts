import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthProvider';

export function useLogout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const busy = useRef(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const handleLogout = async () => {
        if (busy.current) return;
        busy.current = true;
        setLoggingOut(true);
        try { await logout(); }
        catch (cause) {
            if (!axios.isAxiosError(cause) || cause.response?.status !== 401) {
                toast.error('Server logout could not be confirmed. Please try again when connected.');
            }
        } finally {
            busy.current = false;
            setLoggingOut(false);
            navigate('/login', { replace: true });
        }
    };
    return { handleLogout, loggingOut };
}
