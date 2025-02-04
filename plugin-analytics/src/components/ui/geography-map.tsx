"use client";

import React, { useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography as GeographyComponent,
} from "react-simple-maps";
import useHtmlTheme from "../../hooks/useHtmlTheme";
import { useState } from "react";
import countriesData from "../../data/countries.json";
import localData from "../../data/country-code-map.json";
// Use a more reliable GeoJSON source

type CountryData = {
  countryCode: string;
  views: number;
};

// just to get the styles right
const exampleCountryData: CountryData[] = [
  { countryCode: "AU", views: 4234 },
  { countryCode: "US", views: 1324 },
  { countryCode: "GB", views: 3567 },
  { countryCode: "CA", views: 2891 },
  { countryCode: "DE", views: 4102 },
  { countryCode: "FR", views: 3245 },
  { countryCode: "JP", views: 5123 },
  { countryCode: "BR", views: 2456 },
  { countryCode: "IN", views: 6789 },
  { countryCode: "CN", views: 8901 },
  { countryCode: "ZA", views: 1567 },
  { countryCode: "MX", views: 2345 },
  { countryCode: "RU", views: 3789 },
  { countryCode: "IT", views: 2678 },
  { countryCode: "ES", views: 2134 },
];

const GeographyMap = ({
  countryData = exampleCountryData,
}: {
  countryData: CountryData[];
}) => {
  const theme = useHtmlTheme();
  const isDarkMode = theme !== "light";
  const [tooltipContent, setTooltipContent] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const colors = {
    background: isDarkMode ? "#141414" : "#ffffff",
    stroke: isDarkMode ? "#e7e7e7" : "#141414",
    default: isDarkMode ? "#141414" : "#f1f1f1",
  };

  const getCountryColor = (countryCode: string) => {
    const country = countryData.find((d) => d.countryCode === countryCode);
    if (!country) return colors.default;

    const maxViews = Math.max(...countryData.map((d) => d.views));
    const opacity = 0.3 + (country.views / maxViews) * 0.7;

    return isDarkMode
      ? `rgba(209, 54, 111, ${opacity})`
      : `rgba(209, 54, 111, ${opacity})`;
  };

  const getAlpha2FromId = (id: string): string | undefined => {
    const country = countriesData[id as keyof typeof countriesData];
    return country?.alpha2;
  };

  const mapRef = useRef<HTMLDivElement>(null);

  const getTooltipPosition = (evt: React.MouseEvent) => {
    if (!mapRef.current) return { x: 0, y: 0 };

    const rect = mapRef.current.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left + 5,
      y: evt.clientY - rect.top - 20,
    };
  };

  return (
    <div className="tw-w-full tw-h-[400px] tw-relative" ref={mapRef}>
      {tooltipContent && (
        <div
          className="tw-absolute tw-z-10 tw-px-2 tw-py-1 tw-text-sm tw-text-white tw-bg-black tw-rounded-md tw-pointer-events-none tw-whitespace-nowrap"
          style={{
            left: `${tooltipContent.x}px`,
            top: `${tooltipContent.y}px`,
          }}
        >
          {tooltipContent.text}
        </div>
      )}
      {/* @ts-ignore */}
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 0],
          rotate: [0, 0, 0],
        }}
        width={800}
        height={400}
        style={{
          width: "100%",
          height: "100%",
          // backgroundColor: colors.background,
        }}
      >
        {/* @ts-ignore */}
        <Geographies geography={localData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = getAlpha2FromId(geo.id);
              const country = countryData.find(
                (d) => d.countryCode === countryCode,
              );
              const countryName =
                countriesData[geo.id as keyof typeof countriesData]?.name;

              return (
                // @ts-ignore
                <GeographyComponent
                  key={geo.rsmKey}
                  stroke={colors.stroke}
                  geography={geo}
                  fill={getCountryColor(countryCode || "")}
                  onMouseEnter={(evt) => {
                    const { x, y } = getTooltipPosition(evt);
                    const tooltipText = country
                      ? `${countryName}: ${country.views.toLocaleString()} views`
                      : `${countryName || "Unknown"}: 0 views`;

                    setTooltipContent({
                      x,
                      y,
                      text: tooltipText,
                    });
                  }}
                  onMouseMove={(evt) => {
                    const { x, y } = getTooltipPosition(evt);
                    setTooltipContent((prev) =>
                      prev
                        ? {
                            ...prev,
                            x,
                            y,
                          }
                        : null,
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent(null);
                  }}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              ) as any;
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default GeographyMap;
