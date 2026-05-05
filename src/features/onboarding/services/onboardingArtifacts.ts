import { post } from '@/services/apiClient';
import { apiPath, API } from '@/config/endpoints';

export async function generatePostOnboardingArtifacts(options: { hasDebts: boolean }): Promise<void> {
  const requests = [
    post(apiPath(API.BUDGET_CALCULATE)),
    post(apiPath(API.GUIDANCE.GENERATE)),
    post(apiPath(API.ACTION_PLAN.GENERATE)),
    post(apiPath(API.HEALTH_SCORE.GENERATE)),
  ];

  if (options.hasDebts) {
    requests.push(post(apiPath(API.TIMELINE_GENERATE), { strategy: 'minimum', extra_payment: 0 }));
  }

  await Promise.allSettled(requests);
}
