import { EventColor } from "calendar-utils";

export type Colors = "SLATE" | "ZINC" | "STONE" | "RED" | "ORANGE" | "AMBER" | "YELLOW" | "LIME" | "GREEN" | "EMERALD" | "TEAL" | "CYAN" | "SKY" | "BLUE" | "INDIGO" | "VIOLET" | "PURPLE" | "FUCHSIA" | "PINK" | "ROSE";

export const colors: Record<Colors, EventColor> = {
  SLATE:   { primary: "#94a3b8", secondary: "#cbd5e1" },
  ZINC:    { primary: "#a1a1aa", secondary: "#d4d4d8" },
  STONE:   { primary: "#a8a29e", secondary: "#d6d3d1" },
  RED:     { primary: "#f87171", secondary: "#fca5a5" },
  ORANGE:  { primary: "#fb923c", secondary: "#fdba74" },
  AMBER:   { primary: "#fbbf24", secondary: "#fcd34d" },
  YELLOW:  { primary: "#facc15", secondary: "#fde047" },
  LIME:    { primary: "#a3e635", secondary: "#bef264" },
  GREEN:   { primary: "#4ade80", secondary: "#86efac" },
  EMERALD: { primary: "#34d399", secondary: "#6ee7b7" },
  TEAL:    { primary: "#2dd4bf", secondary: "#5eead4" },
  CYAN:    { primary: "#22d3ee", secondary: "#67e8f9" },
  SKY:     { primary: "#38bdf8", secondary: "#7dd3fc" },
  BLUE:    { primary: "#60a5fa", secondary: "#93c5fd" },
  INDIGO:  { primary: "#818cf8", secondary: "#a5b4fc" },
  VIOLET:  { primary: "#a78bfa", secondary: "#c4b5fd" },
  PURPLE:  { primary: "#c084fc", secondary: "#d8b4fe" },
  FUCHSIA: { primary: "#e879f9", secondary: "#f0abfc" },
  PINK:    { primary: "#f472b6", secondary: "#f9a8d4" },
  ROSE:    { primary: "#fb7185", secondary: "#fda4af" },
};