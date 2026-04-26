export type ActionCategory = 'debt' | 'budget' | 'savings' | 'income';
export type ActionPriority = 'high' | 'medium' | 'low';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  priority: ActionPriority;
  isCompleted: boolean;
  completedAt: string | null;
  dueDate: string | null;
  createdAt: string;
}

export interface UpdateActionItemPayload {
  isCompleted?: boolean;
}

export interface ActionPlanApiAdapter {
  /** GET /api/v1/action-plan */
  list(): Promise<ActionItem[]>;
  /** PATCH /api/v1/action-plan/{id} */
  update(id: string, payload: UpdateActionItemPayload): Promise<ActionItem>;
}
