import type { FormState } from '@/actions/actions';  // or wherever the type is

export function hasErrors(formState: FormState | null): formState is Exclude<FormState, { success: true }> {
    return formState !== null && formState.success === false;
  }