export interface IRateLimitConfig {
  windowMs: number
  max: number
}

export default {
  /*
  |--------------------------------------------------------------------------
  | MS Request Window
  |--------------------------------------------------------------------------
  |
  | Fifteen minutes for max of limited request
  |
  */
  windowMs: 1 * 60 * 1000, // 1 minutes

  /*
  |--------------------------------------------------------------------------
  | Max request
  |--------------------------------------------------------------------------
  |
  | Limit each IP to 100 requests per windowMs
  |
  */
  max: 100,
} as IRateLimitConfig
