"use client";

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";

export interface TurnstileWidgetRef {
  reset: () => void;
  getResponse: () => string | null;
}

interface TurnstileWidgetProps {
  action?: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (errorCode?: string) => void;
  className?: string;
  theme?: "dark" | "light" | "auto";
  size?: "normal" | "compact" | "flexible";
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          action?: string;
          theme?: "dark" | "light" | "auto";
          size?: "normal" | "compact" | "flexible";
          retry?: "auto" | "never";
          "retry-interval"?: number;
          refreshExpired?: "auto" | "manual" | "never";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (errorCode?: string) => void;
          [key: string]: any;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId?: string) => string | null;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const DEFAULT_SITE_KEY = "0x4AAAAAAE7f-7PwGOTBRUpd";

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  (
    {
      action,
      onVerify,
      onExpire,
      onError,
      className = "",
      theme = "dark",
      size = "normal",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const isRenderedRef = useRef<boolean>(false);

    // Keep latest callbacks in refs so changes don't trigger iframe re-creation
    const onVerifyRef = useRef(onVerify);
    onVerifyRef.current = onVerify;
    const onExpireRef = useRef(onExpire);
    onExpireRef.current = onExpire;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const [hasError, setHasError] = useState<boolean>(false);

    const siteKey =
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || DEFAULT_SITE_KEY;

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile) return;
      if (isRenderedRef.current && widgetIdRef.current) return;

      // Clean up previous widget if any
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: action,
          theme: theme,
          size: size,
          retry: 'auto',
          'retry-interval': 2000,
          callback: (token: string) => {
            setHasError(false);
            onVerifyRef.current?.(token);
          },
          "expired-callback": () => {
            onExpireRef.current?.();
          },
          "error-callback": (code?: string) => {
            console.error(`[Cloudflare Turnstile] Verification failed (code: ${code || 'unknown'})`);
            setHasError(true);
            onErrorRef.current?.(code);
          },
        });
        widgetIdRef.current = id;
        isRenderedRef.current = true;
      } catch (err) {
        console.warn("Turnstile render warning:", err);
      }
    }, [siteKey, action, theme, size]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.turnstile && widgetIdRef.current) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            isRenderedRef.current = false;
            renderWidget();
          }
        }
      },
      getResponse: () => {
        if (window.turnstile && widgetIdRef.current) {
          return window.turnstile.getResponse(widgetIdRef.current);
        }
        return null;
      },
    }));

    useEffect(() => {
      const scriptId = "cf-turnstile-script";

      if (window.turnstile) {
        renderWidget();
        return () => {
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch {
              // ignore
            }
            widgetIdRef.current = null;
            isRenderedRef.current = false;
          }
        };
      }

      // Check if script element already exists in document
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 80);

      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
      }, 10000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
          isRenderedRef.current = false;
        }
      };
    }, [renderWidget]);

    return (
      <div className={`flex flex-col items-center justify-center my-2 max-w-full overflow-hidden ${className}`}>
        <div ref={containerRef} className="min-h-[65px] min-w-[280px] sm:min-w-[300px] flex items-center justify-center" />
        {hasError && (
          <button
            type="button"
            onClick={() => {
              setHasError(false);
              if (window.turnstile && widgetIdRef.current) {
                try {
                  window.turnstile.reset(widgetIdRef.current);
                } catch {
                  isRenderedRef.current = false;
                  renderWidget();
                }
              }
            }}
            className="text-[11px] text-zinc-400 hover:text-white underline mt-1.5 transition-colors cursor-pointer"
          >
            Verification issue? Click to retry
          </button>
        )}
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
export default TurnstileWidget;
