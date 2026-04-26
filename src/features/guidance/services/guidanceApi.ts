export type GuidanceType = 'tip' | 'warning' | 'insight';

export interface GuidanceItem {
  id: string;
  title: string;
  body: string;
  type: GuidanceType;
  isDismissed: boolean;
  createdAt: string;
}

export interface GuidanceApiAdapter {
  /** GET /api/v1/guidance */
  list(): Promise<GuidanceItem[]>;
  /** PATCH /api/v1/guidance/{id}/dismiss */
  dismiss(id: string): Promise<void>;
}
