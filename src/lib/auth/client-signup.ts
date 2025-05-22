import { signIn } from 'next-auth/react';
import { register } from '@/actions/actions';
import { useRouter } from 'next/navigation';

export function createSignUpHandler(
  router: ReturnType<typeof useRouter>,
  callbackUrl: string
) {
  return async function handleSignUp(
    _prevState: unknown,
    formData: FormData
  ): Promise<string | null> {
    const result = await register(undefined, formData);
    if (result) return result;

    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      return 'Account created, but sign-in failed.';
    }

    return null;
  };
}