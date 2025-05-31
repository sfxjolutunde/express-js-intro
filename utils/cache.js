const blogCache = new Map();

export const getCache = (key)=>{
  return blogCache.get(key);
}

export const setCache = (key, value, ttl)=>{
  //ttl = time to live in seconds
  blogCache.set(key, value);
  setTimeout(()=>{
    blogCache.delete(key);
  },ttl * 1000); // Convert seconds to milliseconds
}

export const clearCache = (key)=>{
  blogCache.delete(key);
}