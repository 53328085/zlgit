import { ENV_MONITOR_TEXT } from "./constants";

export function resolveDisplayText(input, fallback = "") {
  if (input === null || input === undefined) return fallback;
  if (typeof input === "string" || typeof input === "number") {
    const text = String(input).trim();
    return text || fallback;
  }
  if (typeof input === "object") {
    const candidate =
      input.label ??
      input.name ??
      input.displayName ??
      input.title ??
      input.text ??
      input.value;
    if (candidate === input) return fallback;
    return resolveDisplayText(candidate, fallback);
  }
  return fallback;
}

export function normalizeEnvContainers(containers) {
  if (!Array.isArray(containers) || containers.length === 0) {
    return [];
  }

  return containers.map((container, index) => {
    const rawName = resolveDisplayText(
      container?.displayName ?? container?.containerName ?? container?.name,
      ""
    );
    const fallbackName = `${ENV_MONITOR_TEXT.DEFAULT_CONTAINER_PREFIX}${index + 1}`;
    const name = !rawName || rawName === ENV_MONITOR_TEXT.ENV_TITLE ? fallbackName : rawName;
    return {
      ...container,
      id: container?.id ?? `env-container-${index + 1}`,
      name,
      types: Array.isArray(container?.types) ? container.types : [],
    };
  });
}
