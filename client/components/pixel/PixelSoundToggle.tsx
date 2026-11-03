import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { pixelAudio } from "@/utils/pixelAudio";
import { cn } from "@/lib/utils";

export function PixelSoundToggle({ className }: { className?: string }) {
  const enabled = useSyncExternalStore(
    pixelAudio.subscribe,
    pixelAudio.getSoundEnabled,
    () => false,
  );
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        pixelAudio.toggleSound();
      }}
      aria-label="Toggle Pixel sounds"
      aria-pressed={enabled}
      title={enabled ? "Mute Pixel sounds" : "Enable Pixel sounds"}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200",
        enabled
          ? "border-cyan-400/40 bg-cyan-950/80 text-cyan-200 hover:text-white"
          : "border-cyan-400/20 bg-cyan-950/40 text-slate-400 hover:border-cyan-300/50 hover:text-cyan-200",
        className,
      )}
    >
      {enabled ? (
        <Volume2 className="h-3.5 w-3.5" />
      ) : (
        <VolumeX className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
