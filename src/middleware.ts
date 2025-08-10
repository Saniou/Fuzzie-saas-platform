// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Публічні маршрути (без авторизації)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/payment/success',
]);

// Маршрути, які слід повністю пропустити логікою захисту
const isIgnoredRoute = createRouteMatcher([
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
  // Вебхуки краще пропускати без перевірок
  '/api/clerk-webhook(.*)',
  '/api/drive-activity/notification(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Повністю пропускаємо ігноровані маршрути
  if (isIgnoredRoute(req)) {
    return;
  }

  // Захищаємо всі НЕ публічні маршрути
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Рекомендований шаблон від Clerk: пропускає _next та статичні файли
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    // Завжди запускаємо для API роутів
    '/(api|trpc)(.*)',
  ],
};
