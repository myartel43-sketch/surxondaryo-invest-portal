let loading: Promise<any> | null = null;

declare global {
  interface Window {
    L?: any;
  }
}

function addStyle(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function addScript(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export async function loadLeaflet(withDraw = false) {
  if (typeof window === "undefined") return null;

  if (!loading) {
    loading = (async () => {
      addStyle(
        "leaflet-css",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      );
      await addScript(
        "leaflet-js",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
      );
      return window.L;
    })();
  }

  const L = await loading;

  if (withDraw && !L?.Control?.Draw) {
    addStyle(
      "leaflet-draw-css",
      "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css",
    );
    await addScript(
      "leaflet-draw-js",
      "https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js",
    );
  }

  return window.L;
}
