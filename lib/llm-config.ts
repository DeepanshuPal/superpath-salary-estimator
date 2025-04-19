// LLM configuration settings
export const llmConfig = {
  // Feature flags to easily enable/disable LLM features
  features: {
    insights: true,
    jobTitleNormalization: true,
    negotiationScript: true,
  },

  // Cache settings
  cache: {
    // TTL in seconds
    serverTtl: 86400, // 24 hours
    clientTtl: 3600, // 1 hour
  },

  // Model settings
  model: {
    // Default model to use
    default: "gpt-4o",
    // Fallback model if default is unavailable
    fallback: "gpt-3.5-turbo",
  },

  // Provider settings
  provider: {
    // Current provider
    current: "openai",
    // Available providers
    available: ["openai"],
  },

  // Rate limiting
  rateLimit: {
    // Max requests per minute
    requestsPerMinute: 10,
    // Max tokens per day
    tokensPerDay: 100000,
  },
}

// Helper to check if a feature is enabled
export function isFeatureEnabled(feature: keyof typeof llmConfig.features): boolean {
  return llmConfig.features[feature]
}

// Helper to get the current model
export function getCurrentModel(): string {
  return llmConfig.model.default
}

// Helper to get the fallback model
export function getFallbackModel(): string {
  return llmConfig.model.fallback
}
