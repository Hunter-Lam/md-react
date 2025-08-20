export const parseUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    const parsedUrl = new URL(url);
    const searchParams = parsedUrl.searchParams;
    
    // Handle JD URLs
    if (parsedUrl.host === "item.jd.com" || parsedUrl.host === "item.m.jd.com") {
      // Extract product ID from pathname
      const pathMatch = parsedUrl.pathname.match(/\/(\d+)\.html/);
      if (pathMatch) {
        const productId = pathMatch[1];
        // Return clean desktop JD URL
        return `https://item.jd.com/${productId}.html`;
      }
    }
    
    if (searchParams.size === 0) {
      return url;
    }
    
    // Handle Tmall and Taobao URLs
    if (parsedUrl.host === "detail.tmall.com" || parsedUrl.host === "item.taobao.com") {
      const keysToDelete = Array.from(searchParams.keys()).filter(
        key => key !== "id" && key !== "skuId"
      );
      keysToDelete.forEach(key => searchParams.delete(key));
      return parsedUrl.toString();
    }
    
    return url;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }
};
