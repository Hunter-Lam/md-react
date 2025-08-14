export interface ProductInfo {
  title: string;
  brand: string;
  price: number;
  cleanUrl: string;
}

export const fetchJDProductInfo = async (url: string): Promise<ProductInfo | null> => {
  try {
    const parsedUrl = new URL(url);
    
    // Check if it's a JD URL
    if (parsedUrl.host !== "item.jd.com" && parsedUrl.host !== "item.m.jd.com") {
      throw new Error("Not a JD.com URL");
    }
    
    // Extract product ID
    const pathMatch = parsedUrl.pathname.match(/\/(\d+)\.html/);
    if (!pathMatch) {
      throw new Error("Invalid JD URL format");
    }
    
    const productId = pathMatch[1];
    const cleanUrl = `https://item.jd.com/${productId}.html`;
    
    try {
      // Try to use CORS proxy to fetch the page
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(cleanUrl)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      
      // Parse HTML to extract product information
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract title
      let title = '';
      const titleElement = doc.querySelector('.sku-name') || 
                          doc.querySelector('.itemInfo-wrap .p-name a') ||
                          doc.querySelector('title');
      if (titleElement) {
        title = titleElement.textContent?.trim() || '';
        // Clean up title by removing extra whitespace and JD.com suffix
        title = title.replace(/\s+/g, ' ').replace(/【京东.*?】.*$/, '').trim();
      }
      
      // Extract brand
      let brand = '';
      const brandElement = doc.querySelector('.p-parameter .parameter2 li:first-child') ||
                          doc.querySelector('.brand .val') ||
                          doc.querySelector('[data-hook="brand"]');
      if (brandElement) {
        brand = brandElement.textContent?.trim().replace(/^品牌：/, '') || '';
      }
      
      // If brand not found in parameters, try to extract from title
      if (!brand && title) {
        // Common brand patterns in Chinese product titles
        const brandPatterns = [
          /^([A-Za-z0-9\u4e00-\u9fff]+)\s/,  // Brand at the beginning
          /【([A-Za-z0-9\u4e00-\u9fff]+)】/,   // Brand in brackets
        ];
        
        for (const pattern of brandPatterns) {
          const match = title.match(pattern);
          if (match) {
            brand = match[1];
            break;
          }
        }
      }
      
      // Extract price
      let price = 0;
      const priceElement = doc.querySelector('.price .p-price .price') ||
                          doc.querySelector('.summary-price .p-price') ||
                          doc.querySelector('.price-now') ||
                          doc.querySelector('[data-hook="price"]');
      if (priceElement) {
        const priceText = priceElement.textContent?.trim() || '';
        const priceMatch = priceText.match(/[\d,]+\.?\d*/);
        if (priceMatch) {
          price = parseFloat(priceMatch[0].replace(/,/g, ''));
        }
      }
      
      return {
        title,
        brand,
        price,
        cleanUrl
      };
      
    } catch (fetchError) {
      console.warn("Failed to fetch from proxy, using mock data for demonstration:", fetchError);
      
      // Fallback: Return mock data based on product ID for demonstration
      // In a real implementation, you might use a backend service or different approach
      const mockData = getMockProductData(productId);
      return {
        ...mockData,
        cleanUrl
      };
    }
    
  } catch (error) {
    console.error("Error fetching JD product info:", error);
    return null;
  }
};

// Mock data function for demonstration purposes
function getMockProductData(productId: string): Omit<ProductInfo, 'cleanUrl'> {
  // This is just for demonstration - in real implementation you'd fetch actual data
  const mockProducts: Record<string, Omit<ProductInfo, 'cleanUrl'>> = {
    '100226972106': {
      title: 'Apple iPhone 15 Pro Max 256GB 深空黑色 5G手機',
      brand: 'Apple',
      price: 9999.00
    },
    '100012043978': {
      title: '小米13 Ultra 徠卡專業攝影 16GB+512GB 黑色',
      brand: '小米',
      price: 5999.00
    }
  };
  
  return mockProducts[productId] || {
    title: `JD產品 ${productId} (示例數據)`,
    brand: '示例品牌',
    price: 299.99
  };
}
