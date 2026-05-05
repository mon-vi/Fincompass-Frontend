import { post } from '@/services/apiClient';
import { apiPath, API } from '@/config/endpoints';
import { ENV } from '@/constants/env';

interface ArtifactEndpoint {
  name: string;
  path: string;
  body?: unknown;
}

export async function generatePostOnboardingArtifacts(options: { hasDebts: boolean }): Promise<void> {
  const endpoints: ArtifactEndpoint[] = [
    { name: 'budget/calculate', path: apiPath(API.BUDGET_CALCULATE) },
    { name: 'guidance/generate', path: apiPath(API.GUIDANCE.GENERATE) },
    { name: 'action-plan/generate', path: apiPath(API.ACTION_PLAN.GENERATE) },
    { name: 'health-score/generate', path: apiPath(API.HEALTH_SCORE.GENERATE) },
  ];

  if (options.hasDebts) {
    endpoints.push({
      name: 'timeline/generate',
      path: apiPath(API.TIMELINE_GENERATE),
      body: { strategy: 'minimum', extra_payment: 0 },
    });
  }

  const results = await Promise.allSettled(
    endpoints.map(({ path, body }) => post(path, body)),
  );

  if (ENV.IS_DEV) {
    results.forEach((result, i) => {
      const ep = endpoints[i];
      if (result.status === 'fulfilled') {
        console.log(`[Onboarding] artifact OK  → POST ${ep.name}`, result.value);
      } else {
        console.warn(`[Onboarding] artifact FAIL → POST ${ep.name}`, result.reason);
      }
    });
  }
}
