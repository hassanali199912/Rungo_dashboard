import HomeDownloadCta from "../../components/home/HomeDownloadCta";
import HomeFeatures from "../../components/home/HomeFeatures";
import HomeHero from "../../components/home/HomeHero";
import HomeStats from "../../components/home/HomeStats";

export default function Home() {
    return (
        <>
            <HomeHero />
            <HomeStats />
            <HomeFeatures />
            <HomeDownloadCta />
        </>
    );
}
