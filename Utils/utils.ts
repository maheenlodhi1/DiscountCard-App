/* eslint-disable prettier/prettier */
/* eslint-disable space-infix-ops */
/* eslint-disable quotes */
/* eslint-disable eol-last */
/* eslint-disable semi */

// export const API_URL = "https://kafu-backend-v2.onrender.com/api/v1";
// export const API_URL = "https://backend.kafucard.com/api/v1";
export const API_URL =
  "https://discountcard-node-c3e0bxhhbgdqg5g5.ukwest-01.azurewebsites.net/api/v1";
// export const GOOGLE_MAPS_API_KEY = 'AIzaSyAGtTzCFC5I7fdjV2E3QJTUMggoKSTYOv0';
export const PYTHON_URL = "https://discountcard-pythonbe.onrender.com";
export const STRIPE_API_KEY =
  "pk_test_51MG2gLGYE1wzxGFGuCFcY5ZLF8HAXapfvU9XV7wRT5rknudqcEJeJhGBYffcC5zPUwlTJ54S0FI0ZeT7d6iChNEf00S43UcvwN";

export const STRIPE_SECRET_KEY =
  "sk_test_51MG2gLGYE1wzxGFGhMudYyQ1m2WFFxGhULvRKQ4rKkrZTiJY1g68v8cm9SkAa4BnNArEzmftHJfsS1Z85SqNFKFm00JK4LgiDM";

export const STRIPE_ENDPOINT_SECRET = "whsec_1mlkAsDnQaGCTr04Ycp7H3avAQX6o2HX";

export const ENCRYPTION_KEY =
  "6acab038d275fb7459435fbf6ab0ce3feff4eeb723260b2c21280b4ae651e0f6";

export const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
};

export const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";
    const display = `${hour}:00 ${ampm}`;
    const value = `${i.toString().padStart(2, "0")}:00`;
    options.push({ display, value });
  }
  return options;
};
