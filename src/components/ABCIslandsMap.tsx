"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface IslandInfo {
  name: string;
  label: string;
  description: string;
  coords: [number, number];
  isHQ?: boolean;
}

const islands: IslandInfo[] = [
  {
    name: "Aruba",
    label: "ARUBA",
    description: "Our Headquarters",
    coords: [12.5211, -69.9683],
    isHQ: true,
  },
  {
    name: "Curacao",
    label: "CURAÇAO",
    description: "Serving 15+ clients",
    coords: [12.1696, -68.99],
  },
  {
    name: "Bonaire",
    label: "BONAIRE",
    description: "Growing market",
    coords: [12.1443, -68.2655],
  },
];

function MapInner() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || !containerRef.current) return;
    initRef.current = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Extra guard: if container already has a map, remove it
      const container = containerRef.current!;
      if ((container as any)._leaflet_id) {
        return;
      }

      const map = L.map(container, {
        center: [12.35, -69.1],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
      });

      map.getContainer().style.background = "#000";

      // Stadia Alidade Smooth Dark — visible dark map with clear land/water contrast
      L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        { maxZoom: 20 }
      ).addTo(map);

      // Custom markers for each island
      islands.forEach((island) => {
        const isHQ = island.isHQ;

        // Pulsing circle marker
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;">
              ${
                isHQ
                  ? `<div style="position:absolute;width:40px;height:40px;border-radius:50%;border:1.5px solid #FF541F;animation:hq-pulse 2s ease-out infinite;"></div>
                     <div style="position:absolute;width:40px;height:40px;border-radius:50%;border:1px solid #FF541F;animation:hq-pulse 2s ease-out infinite 0.5s;"></div>`
                  : ""
              }
              <div style="width:12px;height:12px;border-radius:50%;background:${isHQ ? "#FF541F" : "rgba(255,255,255,0.5)"};border:2px solid ${isHQ ? "#FF541F" : "rgba(255,255,255,0.3)"};box-shadow:0 0 ${isHQ ? "20px" : "10px"} ${isHQ ? "rgba(255,84,31,0.4)" : "rgba(255,255,255,0.1)"};"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker(island.coords, { icon: pulseIcon }).addTo(map);

        // Label below the marker
        const labelIcon = L.divIcon({
          className: "",
          html: `
            <div style="text-align:center;white-space:nowrap;">
              <div style="font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${isHQ ? "white" : "rgba(255,255,255,0.4)"};font-weight:600;margin-bottom:2px;">
                ${island.label}
                ${isHQ ? '<span style="display:inline-block;background:#FF541F;color:white;font-size:8px;padding:1px 6px;margin-left:6px;font-weight:700;letter-spacing:0.1em;">HQ</span>' : ""}
              </div>
              <div style="font-family:var(--font-mono),monospace;font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:0.05em;">
                ${island.description}
              </div>
            </div>
          `,
          iconSize: [150, 40],
          iconAnchor: [75, -15],
        });

        L.marker(island.coords, { icon: labelIcon, interactive: false }).addTo(
          map
        );

        // Hover events available for future use
        marker.on("mouseover", () => {});
        marker.on("mouseout", () => {});
      });

      // Dashed connection lines between islands
      const lineCoords = islands.map(
        (i) => i.coords as [number, number]
      );
      L.polyline(lineCoords, {
        color: "rgba(255,255,255,0.08)",
        weight: 1,
        dashArray: "6 4",
      }).addTo(map);

      mapRef.current = map;
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden orange-map"
      style={{ background: "#000" }}
    />
  );
}

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => Promise.resolve(MapInner), { ssr: false });

export default function ABCIslandsMap() {
  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-mono-accent text-xs text-white/30 tracking-[0.2em] mb-4">
            WHERE WE OPERATE
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            The <span className="text-primary">ABC</span> Islands
          </h2>
          <p className="text-white/40 mt-4 max-w-md mx-auto">
            Serving businesses across the Dutch Caribbean
          </p>
        </motion.div>

        {/* Leaflet Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <MapComponent />
        </motion.div>

        {/* Stats below map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-12 md:gap-20 mt-16"
        >
          {[
            { value: "3", label: "ISLANDS" },
            { value: "75+", label: "CLIENTS" },
            { value: "85+", label: "PROJECTS" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </p>
              <p className="font-mono-accent text-[10px] text-white/30 tracking-widest mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
