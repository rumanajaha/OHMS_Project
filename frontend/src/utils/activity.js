export const logActivity = (title, message, type = 'info') => {
  try {
    const activities = JSON.parse(localStorage.getItem('ohms_recent_activity') || '[]');
    activities.unshift({
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toISOString()
    });
    // Keep only the 50 most recent activities
    if (activities.length > 50) activities.length = 50;
    
    localStorage.setItem('ohms_recent_activity', JSON.stringify(activities));
    
    // Dispatch an event so components listening can re-render immediately
    window.dispatchEvent(new Event('ohms-activity'));
  } catch (error) {
    console.error('Failed to log activity', error);
  }
};

export const getActivities = () => {
  try {
    return JSON.parse(localStorage.getItem('ohms_recent_activity') || '[]');
  } catch (error) {
    console.error('Failed to fetch activity', error);
    return [];
  }
};
