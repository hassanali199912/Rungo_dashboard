export const MIN_SHORT_VIDEO_SECONDS = 10;
export const MAX_SHORT_VIDEO_SECONDS = 90;

export type ShortVideoDurationIssue = "out_of_range" | "unreadable";

export type ShortVideoDurationResult =
    | { ok: true; seconds: number }
    | { ok: false; issue: ShortVideoDurationIssue };

function readVideoDurationSeconds(file: File): Promise<number | null> {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        let settled = false;

        const finish = (value: number | null) => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timer);
            video.onloadedmetadata = null;
            video.ondurationchange = null;
            video.onerror = null;
            URL.revokeObjectURL(url);
            video.removeAttribute("src");
            video.load();
            resolve(value);
        };

        const acceptKnownDuration = () => {
            const duration = video.duration;
            if (!Number.isFinite(duration) || duration <= 0) return false;
            finish(duration);
            return true;
        };

        const timer = window.setTimeout(() => finish(null), 8000);
        video.preload = "metadata";
        video.onerror = () => finish(null);
        video.onloadedmetadata = () => {
            if (acceptKnownDuration()) return;
            video.ondurationchange = () => {
                acceptKnownDuration();
            };
            try {
                video.currentTime = 1e101;
            } catch {
                finish(null);
            }
        };
        video.src = url;
    });
}

export async function inspectShortVideoDuration(file: File): Promise<ShortVideoDurationResult> {
    const seconds = await readVideoDurationSeconds(file);
    if (seconds == null) return { ok: false, issue: "unreadable" };
    if (seconds < MIN_SHORT_VIDEO_SECONDS || seconds > MAX_SHORT_VIDEO_SECONDS) {
        return { ok: false, issue: "out_of_range" };
    }
    return { ok: true, seconds };
}

export function formatVideoDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.round(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${remainder}`;
}
