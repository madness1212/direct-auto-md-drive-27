import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a unique visitor ID and store it in localStorage
const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Generate a session ID for this browser session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  const trackPageView = async (pagePath: string) => {
    try {
      await supabase.from('website_analytics').insert({
        visitor_id: visitorId,
        page_path: pagePath,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackCarView = async (carId: string, pageType: 'listing' | 'details' | 'catalog' = 'listing') => {
    try {
      await supabase.from('car_views').insert({
        car_id: carId,
        visitor_id: visitorId,
        session_id: sessionId,
        page_type: pageType,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Error tracking car view:', error);
    }
  };

  // Auto-track page views on component mount
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  return {
    trackPageView,
    trackCarView,
    visitorId,
    sessionId
  };
};

export const usePageAnalytics = (pagePath?: string) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const path = pagePath || window.location.pathname;
    trackPageView(path);
  }, [pagePath, trackPageView]);
};