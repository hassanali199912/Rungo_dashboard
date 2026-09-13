import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        const userMain = document.querySelector<HTMLElement>("[data-user-main-scroll]");
        if (userMain) {
            userMain.scrollTop = 0;
        }
    }, [pathname, search]);

    return null;
}
