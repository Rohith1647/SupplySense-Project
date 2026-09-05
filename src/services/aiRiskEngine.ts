import { GeoLocation } from './geocodingService';
import { WeatherData } from './weatherService';
import { NewsArticle } from './newsService';
import { StockItem } from '../context/InventoryContext';

export interface DemandForecastItem {
  itemName: string;
  category: string;
  demandTrend: 'Surging' | 'Critical Shortage' | 'High Risk' | 'Price Spike Expected';
  urgency: 'Immediate' | 'Within 7 Days' | 'Within 14 Days';
  reasoning: string;
  impactedIndustries: string[];
}

export interface MatchedCompanyStock {
  item: StockItem;
  matchType: 'direct_location' | 'bom_dependency';
  riskSeverity: 'low' | 'medium' | 'high' | 'critical';
  impactExplanation: string;
  mitigationAdvice: string;
}

export interface RiskAnalysisResult {
  location: GeoLocation;
  weather: WeatherData;
  news: NewsArticle[];
  compositeRiskScore: number; // 0-100
  riskLevel: 'safe' | 'warning' | 'critical';
  executiveSummary: string;
  predictedHighDemandItems: DemandForecastItem[];
  matchedCompanyStock: MatchedCompanyStock[];
  allEnterpriseMatchedStock: MatchedCompanyStock[];
  timestamp: string;
}

export function generateAiRiskAnalysis(
  location: GeoLocation,
  weather: WeatherData,
  news: NewsArticle[],
  companyInventory: StockItem[],
  allInventory: StockItem[]
): RiskAnalysisResult {
  // 1. Calculate Composite Risk Score (0-100)
  let weatherFactor = weather.alertLevel === 'critical' ? 40 : weather.alertLevel === 'warning' ? 25 : 10;
  
  let newsFactor = 0;
  if (news.length > 0) {
    const avgImpact = news.reduce((acc, n) => acc + n.impactScore, 0) / news.length;
    newsFactor = Math.min(50, Math.round(avgImpact * 5));
  } else {
    newsFactor = 15;
  }

  let compositeRiskScore = Math.min(100, Math.max(15, weatherFactor + newsFactor + 10));
  let riskLevel: 'safe' | 'warning' | 'critical' = 'safe';
  if (compositeRiskScore >= 70) riskLevel = 'critical';
  else if (compositeRiskScore >= 40) riskLevel = 'warning';

  // 2. Synthesize AI Executive Summary for THIS PLACE ALONE
  const topNewsTitle = news.length > 0 ? news[0].title : `Localized transit dynamics in ${location.name}.`;
  const executiveSummary = `CRISIS BRIEFING FOR ${location.name.toUpperCase()} (${location.country}): The region is experiencing a Disruption Risk Score of ${compositeRiskScore}/100. Local environmental conditions highlight ${weather.conditionText} with temperatures at ${weather.temperature}°C and wind speeds reaching ${weather.windSpeed} km/h. Key local logistics event: "${topNewsTitle}". Commercial distributors and industrial plants operating strictly within ${location.name} face immediate lead-time extensions, component buffer depletion, and transport corridor congestion. Proactive inventory reallocation for ${location.name} is strongly advised.`;

  // 3. Generate Predicted High Demand / High Risk Items for THIS PLACE ALONE
  const predictedHighDemandItems = generateDemandForecast(location.name, compositeRiskScore);

  // 4. Cross-match against Logged-in Company Inventory & Enterprise Inventory
  const matchedCompanyStock = matchStockToDisruption(location.name, companyInventory, predictedHighDemandItems);
  const allEnterpriseMatchedStock = matchStockToDisruption(location.name, allInventory, predictedHighDemandItems);

  return {
    location,
    weather,
    news,
    compositeRiskScore,
    riskLevel,
    executiveSummary,
    predictedHighDemandItems,
    matchedCompanyStock,
    allEnterpriseMatchedStock,
    timestamp: new Date().toLocaleTimeString()
  };
}

function generateDemandForecast(locationName: string, riskScore: number): DemandForecastItem[] {
  const loc = locationName.toLowerCase();

  if (loc.includes('nepal') || loc.includes('kathmandu')) {
    return [
      {
        itemName: 'Essential Pharmaceuticals & Medical Supplies (Nepal)',
        category: 'Pharmaceuticals',
        demandTrend: 'Surging',
        urgency: 'Immediate',
        reasoning: 'Border customs gate congestion at Birgunj & Tatopani checkpoints slows pharmaceutical inflows into Nepal.',
        impactedIndustries: ['Healthcare', 'Hospitals', 'Retail Pharmacy']
      },
      {
        itemName: 'Himalayan Transit Heavy Truck Fuel & Spare Parts',
        category: 'Logistics Assets',
        demandTrend: 'Critical Shortage',
        urgency: 'Within 7 Days',
        reasoning: 'Prithvi Highway monsoon landslides trap inland cargo convoys connecting Kathmandu to western Nepal.',
        impactedIndustries: ['Inland Trucking', 'Freight Transport']
      },
      {
        itemName: 'Structural Construction Steel & Cement Buffers',
        category: 'Building Materials',
        demandTrend: 'Price Spike Expected',
        urgency: 'Within 14 Days',
        reasoning: 'Cross-border rail and road transport delays increase regional safety stock holding costs.',
        impactedIndustries: ['Infrastructure', 'Construction']
      }
    ];
  }

  if (loc.includes('bangalore') || loc.includes('bengaluru')) {
    return [
      {
        itemName: '32-Bit Microcontrollers & High-Density PCBs (Bangalore)',
        category: 'Semiconductors',
        demandTrend: 'Surging',
        urgency: 'Immediate',
        reasoning: 'Arterial road congestion across Electronic City & Whitefield slows hardware assembly dispatches.',
        impactedIndustries: ['Electronics Manufacturing', 'Automotive IT', 'Aerospace']
      },
      {
        itemName: 'Air Charter Express Freight Pallets (BLR Cargo)',
        category: 'Air Logistics',
        demandTrend: 'Critical Shortage',
        urgency: 'Within 7 Days',
        reasoning: 'Tech exporters shift high-value R&D prototypes from ocean lines to Kempegowda Air Cargo flights.',
        impactedIndustries: ['Semiconductors', 'R&D Labs']
      },
      {
        itemName: 'Industrial Power Backup Generators & MOSFETs',
        category: 'Industrial Power',
        demandTrend: 'High Risk',
        urgency: 'Within 14 Days',
        reasoning: 'Staggered grid maintenance across Peenya industrial clusters increases local power backup consumption.',
        impactedIndustries: ['Heavy Machining', 'Tooling Fabs']
      }
    ];
  }

  if (loc.includes('chennai')) {
    return [
      {
        itemName: 'Active Pharmaceutical Ingredients (APIs) & Cold-Chain Vials',
        category: 'Pharmaceuticals',
        demandTrend: 'Surging',
        urgency: 'Immediate',
        reasoning: 'Chennai Port container terminal berth anchorage delays disrupt outbound pharma container shipments.',
        impactedIndustries: ['Pharma Manufacturing', 'Global Export']
      },
      {
        itemName: 'Precision Automotive Gearboxes & Transmission Axles',
        category: 'Automotive Components',
        demandTrend: 'Critical Shortage',
        urgency: 'Within 7 Days',
        reasoning: 'Ro-Ro export berth queues at Kamarajar Port (Ennore) slow OEM component dispatches.',
        impactedIndustries: ['Automotive Assembly', 'OEM Plants']
      }
    ];
  }

  if (loc.includes('shenzhen') || loc.includes('guangdong')) {
    return [
      {
        itemName: '32-Bit Automotive MCUs & Semiconductors',
        category: 'Semiconductors',
        demandTrend: 'Surging',
        urgency: 'Immediate',
        reasoning: 'Yantian typhoon closures and packaging plant power limits freeze outbound electronics shipments.',
        impactedIndustries: ['Automotive', 'Consumer Electronics', 'Industrial Automation']
      },
      {
        itemName: 'Lithium Iron Phosphate (LFP) Battery Cells',
        category: 'Energy Storage',
        demandTrend: 'Critical Shortage',
        urgency: 'Within 7 Days',
        reasoning: 'Disrupted coastal shipping corridors halt battery container exports from Pearl River Delta factories.',
        impactedIndustries: ['EV Manufacturing', 'Grid Energy Systems']
      }
    ];
  }

  if (loc.includes('rotterdam') || loc.includes('netherlands') || loc.includes('germany')) {
    return [
      {
        itemName: '40ft High-Cube Shipping Containers (TEU)',
        category: 'Shipping Assets',
        demandTrend: 'Critical Shortage',
        urgency: 'Immediate',
        reasoning: 'Port dockworker strikes and Rhine river barge closures create a 20,000+ container queue at Maasvlakte terminals.',
        impactedIndustries: ['Global Freight Forwarding', 'Retail', 'Chemical Export']
      }
    ];
  }

  // Dynamic place-specific fallback forecast for ANY place searched in the world
  const locTitle = locationName.charAt(0).toUpperCase() + locationName.slice(1);
  return [
    {
      itemName: `Regional Warehouse Safety Buffer Stock (${locTitle})`,
      category: 'Logistics Assets',
      demandTrend: riskScore > 60 ? 'Surging' : 'High Risk',
      urgency: 'Immediate',
      reasoning: `Localized transit corridor delays surrounding ${locTitle} increase local warehousing safety buffer requirements.`,
      impactedIndustries: ['Local Manufacturing', 'Regional Distribution']
    },
    {
      itemName: `Emergency Courier & Air Cargo Express Slots (${locTitle})`,
      category: 'Express Logistics',
      demandTrend: 'High Risk',
      urgency: 'Within 7 Days',
      reasoning: `Uncertain transport schedules in ${locTitle} prompt procurement leads to secure high-priority express freight slots.`,
      impactedIndustries: ['Commercial Trade', 'High-Tech Hardware']
    },
    {
      itemName: `Sub-Assembly Critical Component Stocks (${locTitle})`,
      category: 'Industrial Components',
      demandTrend: 'Price Spike Expected',
      urgency: 'Within 14 Days',
      reasoning: `Lead time extensions for ${locTitle} shipments cause secondary component price volatility.`,
      impactedIndustries: ['Assembly Plants', 'Machinery']
    }
  ];
}

function matchStockToDisruption(
  locationName: string,
  inventory: StockItem[],
  forecastItems: DemandForecastItem[]
): MatchedCompanyStock[] {
  const matches: MatchedCompanyStock[] = [];
  const locLower = locationName.toLowerCase();
  const forecastNames = forecastItems.map(f => f.itemName.toLowerCase());
  const forecastCategories = forecastItems.map(f => f.category.toLowerCase());

  inventory.forEach(item => {
    const itemLoc = item.locationTag.toLowerCase();
    const itemNameLower = item.name.toLowerCase();
    const itemCategoryLower = item.category.toLowerCase();
    const itemBomLower = item.bomParent.toLowerCase();

    const isDirectLocationMatch = itemLoc.includes(locLower) || locLower.includes(itemLoc);
    const isCategoryForecastMatch = forecastCategories.some(c => itemCategoryLower.includes(c) || c.includes(itemCategoryLower));
    const isNameForecastMatch = forecastNames.some(f => itemNameLower.includes(f) || f.includes(itemNameLower));

    if (isDirectLocationMatch) {
      matches.push({
        item,
        matchType: 'direct_location',
        riskSeverity: 'critical',
        impactExplanation: `Direct Physical Exposure: Item "${item.name}" (${item.quantity} ${item.unit}) is currently stored/located at ${item.locationTag}, directly inside the ${locationName} disruption zone.`,
        mitigationAdvice: `Action Plan: Freeze outbound dispatch commitments from ${item.locationTag}. Audit local warehouse safety protocols and initiate emergency re-routing to nearest secondary warehouse.`
      });
    } else if (isCategoryForecastMatch || isNameForecastMatch) {
      matches.push({
        item,
        matchType: 'bom_dependency',
        riskSeverity: 'high',
        impactExplanation: `BOM Dependency / Market Surge: Item "${item.name}" belongs to category "${item.category}" which is predicted to suffer a market supply deficit due to the ${locationName} crisis.`,
        mitigationAdvice: `Action Plan: Lock in current inventory buffers. Restrict stock consumption to high-priority BOM parent "${item.bomParent}" and place pre-orders with backup regional suppliers.`
      });
    } else if (forecastNames.some(f => itemBomLower.includes(f))) {
      matches.push({
        item,
        matchType: 'bom_dependency',
        riskSeverity: 'medium',
        impactExplanation: `Downstream BOM Impact: Finished product "${item.bomParent}" relies on components affected by the ${locationName} disruption.`,
        mitigationAdvice: `Action Plan: Verify component lead times with Tier-1 suppliers before confirming new finished product delivery schedules.`
      });
    }
  });

  return matches;
}
