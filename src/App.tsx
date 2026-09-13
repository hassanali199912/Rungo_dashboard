import AppProviders from "./provider";
import AppRouter from "./routes";

function App() {
    return (
        <AppProviders>
            <AppRouter />
        </AppProviders>
    );
}

export default App;
