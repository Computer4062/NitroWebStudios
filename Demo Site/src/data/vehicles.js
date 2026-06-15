// All vehicle prices stored in OMR (base currency). USD conversion handled in context.
// Brands list also includes filter brands shown in the brand bar.

export const BRANDS = [
  "Ferrari",
  "Lamborghini",
  "Rolls-Royce",
  "Bentley",
  "Porsche",
  "Mercedes-Benz",
  "Aston Martin",
  "McLaren",
  "Bugatti",
  "Koenigsegg",
  "Maybach",
  "Brabus",
  "BMW",
  "Audi",
  "Land Rover",
  "Lexus",
  "Novitec",
  "Mansory",
  "Dodge",
  "Ford",
];

export const COLLECTIONS = ["Armoured", "Customized", "Electric", "Classic"];

export const BODY_TYPES = ["Coupe", "SUV", "Convertible", "Sedan", "Roadster", "Van/MPV"];

export const DRIVE_TYPES = [
  "Combustion - Petrol",
  "Combustion - Diesel",
  "Plugin Hybrid",
  "Full Electric",
];

// Unsplash luxury car imagery
const IMG = {
  ferrari1:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  ferrari2:
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=80",
  lambo1:
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
  lambo2:
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
  rr1:
    "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=80",
  rr2:
    "https://images.unsplash.com/photo-1631295868786-c92ea0833af2?auto=format&fit=crop&w=1600&q=80",
  bentley1:
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1600&q=80",
  porsche1:
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
  porsche2:
    "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80",
  mb1:
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80",
  mb2:
    "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80",
  am1:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80",
  am2:
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1600&q=80",
  mclaren1:
    "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&w=1600&q=80",
  bugatti1:
    "https://images.unsplash.com/photo-1633509817627-1eb2e8e9c3f3?auto=format&fit=crop&w=1600&q=80",
  bugatti2:
    "https://images.unsplash.com/photo-1611821064430-0d40291922d2?auto=format&fit=crop&w=1600&q=80",
  lr1:
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
  lr2:
    "https://images.unsplash.com/photo-1519440439825-a7a6a4d9d5e7?auto=format&fit=crop&w=1600&q=80",
  gen1:
    "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
  gen2:
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80",
  gen3:
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
  gen4:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
};

export const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1611821064430-0d40291922d2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519440439825-a7a6a4d9d5e7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
];

// 22 vehicles. Prices in OMR. dateAdded ISO for sort.
export const VEHICLES = [
  {
    id: "ferrari-sf90",
    brand: "Ferrari",
    model: "SF90 Stradale",
    modelAr: "إس إف 90 ستراداله",
    bodyType: "Coupe",
    drive: "Plugin Hybrid",
    grossPriceOMR: 245000,
    netExportOMR: 215000,
    image: IMG.ferrari1,
    images: [IMG.ferrari1, IMG.ferrari2, IMG.gen1],
    energy: "1.6 L / 100 km · 8.2 kWh / 100 km",
    co2: "154 g/km",
    co2Class: "C",
    notes: "Assetto Fiorano package, carbon-fibre wheels, racing harness.",
    year: 2024,
    collections: ["Customized"],
    dateAdded: "2026-01-14",
  },
  {
    id: "lambo-revuelto",
    brand: "Lamborghini",
    model: "Revuelto LP812",
    modelAr: "ريفويلتو LP812",
    bodyType: "Coupe",
    drive: "Plugin Hybrid",
    grossPriceOMR: 285000,
    netExportOMR: 252000,
    image: IMG.lambo1,
    images: [IMG.lambo1, IMG.lambo2, IMG.gen2],
    energy: "11.9 kWh / 100 km · 14.5 L / 100 km",
    co2: "276 g/km",
    co2Class: "F",
    notes: "Ad Personam livery, sospensione lift, carbon ceramic brakes.",
    year: 2025,
    collections: ["Customized"],
    dateAdded: "2026-01-22",
  },
  {
    id: "rr-phantom-ewb",
    brand: "Rolls-Royce",
    model: "Phantom EWB Privacy",
    modelAr: "فانتوم EWB بريفاسي",
    bodyType: "Sedan",
    drive: "Combustion - Petrol",
    grossPriceOMR: 320000,
    netExportOMR: 281000,
    image: IMG.rr1,
    images: [IMG.rr1, IMG.rr2, IMG.gen3],
    energy: "15.1 L / 100 km",
    co2: "341 g/km",
    co2Class: "G",
    notes: "Starlight headliner, Privacy Suite, Bespoke Audio.",
    year: 2024,
    collections: ["Customized"],
    dateAdded: "2026-01-09",
  },
  {
    id: "rr-cullinan-armoured",
    brand: "Rolls-Royce",
    model: "Cullinan Black Badge — Armoured",
    modelAr: "كولينان بلاك بادج — مدرعة",
    bodyType: "SUV",
    drive: "Combustion - Petrol",
    grossPriceOMR: 412000,
    netExportOMR: 365000,
    image: IMG.rr2,
    images: [IMG.rr2, IMG.rr1, IMG.gen4],
    energy: "16.4 L / 100 km",
    co2: "377 g/km",
    co2Class: "G",
    notes: "VR9 ballistic protection, run-flat tyres, secure intercom.",
    year: 2025,
    collections: ["Armoured", "Customized"],
    dateAdded: "2026-02-04",
  },
  {
    id: "bentley-mulliner-batur",
    brand: "Bentley",
    model: "Mulliner Batur",
    modelAr: "موليناير باتور",
    bodyType: "Coupe",
    drive: "Combustion - Petrol",
    grossPriceOMR: 720000,
    netExportOMR: 640000,
    image: IMG.bentley1,
    images: [IMG.bentley1, IMG.gen2, IMG.gen3],
    energy: "13.8 L / 100 km",
    co2: "315 g/km",
    co2Class: "G",
    notes: "One of eighteen. Hand-finished by Mulliner atelier.",
    year: 2024,
    collections: ["Customized"],
    dateAdded: "2025-12-29",
  },
  {
    id: "porsche-911-turbo-s",
    brand: "Porsche",
    model: "911 Turbo S Cabriolet",
    modelAr: "911 تيربو إس كابريوليه",
    bodyType: "Convertible",
    drive: "Combustion - Petrol",
    grossPriceOMR: 96000,
    netExportOMR: 84500,
    image: IMG.porsche1,
    images: [IMG.porsche1, IMG.porsche2, IMG.gen1],
    energy: "11.1 L / 100 km",
    co2: "254 g/km",
    co2Class: "F",
    notes: "Sport Chrono, PCCB, Burmester 3D high-end.",
    year: 2024,
    collections: [],
    dateAdded: "2026-01-30",
  },
  {
    id: "porsche-taycan-turbo-gt",
    brand: "Porsche",
    model: "Taycan Turbo GT",
    modelAr: "تايكان تيربو GT",
    bodyType: "Sedan",
    drive: "Full Electric",
    grossPriceOMR: 112000,
    netExportOMR: 98000,
    image: IMG.porsche2,
    images: [IMG.porsche2, IMG.porsche1, IMG.gen4],
    energy: "21.6 kWh / 100 km",
    co2: "0 g/km",
    co2Class: "A",
    notes: "Weissach Package, carbon roof, active rear wing.",
    year: 2025,
    collections: ["Electric"],
    dateAdded: "2026-02-12",
  },
  {
    id: "mb-g63-brabus",
    brand: "Mercedes-Benz",
    model: "G 63 Brabus 900 Rocket",
    modelAr: "جي 63 برابوس 900 روكيت",
    bodyType: "SUV",
    drive: "Combustion - Petrol",
    grossPriceOMR: 198000,
    netExportOMR: 175000,
    image: IMG.mb1,
    images: [IMG.mb1, IMG.mb2, IMG.gen2],
    energy: "16.3 L / 100 km",
    co2: "371 g/km",
    co2Class: "G",
    notes: "Brabus Widestar, 900 hp tune, full alligator interior.",
    year: 2025,
    collections: ["Customized"],
    dateAdded: "2026-02-18",
  },
  {
    id: "mb-eqs-amg-armoured",
    brand: "Mercedes-Benz",
    model: "Maybach EQS 680 — Armoured",
    modelAr: "مايباخ EQS 680 — مدرعة",
    bodyType: "SUV",
    drive: "Full Electric",
    grossPriceOMR: 246000,
    netExportOMR: 218000,
    image: IMG.mb2,
    images: [IMG.mb2, IMG.mb1, IMG.gen1],
    energy: "24.2 kWh / 100 km",
    co2: "0 g/km",
    co2Class: "A",
    notes: "Discreet B6 protection, executive rear lounge.",
    year: 2025,
    collections: ["Armoured", "Electric"],
    dateAdded: "2026-02-22",
  },
  {
    id: "aston-valour",
    brand: "Aston Martin",
    model: "Valour Manual",
    modelAr: "فالور مانوال",
    bodyType: "Coupe",
    drive: "Combustion - Petrol",
    grossPriceOMR: 376000,
    netExportOMR: 332000,
    image: IMG.am1,
    images: [IMG.am1, IMG.am2, IMG.gen3],
    energy: "13.7 L / 100 km",
    co2: "311 g/km",
    co2Class: "G",
    notes: "1 of 110. Six-speed manual, tweed-trimmed cabin.",
    year: 2024,
    collections: ["Customized"],
    dateAdded: "2025-12-15",
  },
  {
    id: "aston-db12",
    brand: "Aston Martin",
    model: "DB12 Volante",
    modelAr: "دي بي 12 فولانتي",
    bodyType: "Convertible",
    drive: "Combustion - Petrol",
    grossPriceOMR: 102000,
    netExportOMR: 90000,
    image: IMG.am2,
    images: [IMG.am2, IMG.am1, IMG.gen4],
    energy: "12.2 L / 100 km",
    co2: "278 g/km",
    co2Class: "F",
    notes: "Bridge of Weir leather, 671 hp twin-turbo V8.",
    year: 2025,
    collections: [],
    dateAdded: "2026-01-03",
  },
  {
    id: "mclaren-750s",
    brand: "McLaren",
    model: "750S Spider",
    modelAr: "750S سبايدر",
    bodyType: "Convertible",
    drive: "Combustion - Petrol",
    grossPriceOMR: 138000,
    netExportOMR: 122000,
    image: IMG.mclaren1,
    images: [IMG.mclaren1, IMG.gen1, IMG.gen2],
    energy: "12.5 L / 100 km",
    co2: "284 g/km",
    co2Class: "F",
    notes: "MSO Visual Specification, P-Zero Trofeo R, ceramic disks.",
    year: 2024,
    collections: [],
    dateAdded: "2025-12-08",
  },
  {
    id: "bugatti-chiron-ss",
    brand: "Bugatti",
    model: "Chiron Super Sport",
    modelAr: "شيرون سوبر سبورت",
    bodyType: "Coupe",
    drive: "Combustion - Petrol",
    grossPriceOMR: 1380000,
    netExportOMR: 1220000,
    image: IMG.bugatti1,
    images: [IMG.bugatti1, IMG.bugatti2, IMG.gen3],
    energy: "22.5 L / 100 km",
    co2: "516 g/km",
    co2Class: "G",
    notes: "1,600 hp, fewer than 50 examples worldwide.",
    year: 2024,
    collections: [],
    dateAdded: "2025-11-26",
  },
  {
    id: "bugatti-w16-mistral",
    brand: "Bugatti",
    model: "W16 Mistral Roadster",
    modelAr: "W16 ميسترال رودستر",
    bodyType: "Roadster",
    drive: "Combustion - Petrol",
    grossPriceOMR: 1890000,
    netExportOMR: 1675000,
    image: IMG.bugatti2,
    images: [IMG.bugatti2, IMG.bugatti1, IMG.gen2],
    energy: "23.0 L / 100 km",
    co2: "525 g/km",
    co2Class: "G",
    notes: "Final W16. 1 of 99. Bespoke interior commission included.",
    year: 2025,
    collections: ["Customized"],
    dateAdded: "2026-02-26",
  },
  {
    id: "lr-defender-armoured",
    brand: "Land Rover",
    model: "Defender 130 — Armoured",
    modelAr: "ديفندر 130 — مدرعة",
    bodyType: "SUV",
    drive: "Combustion - Diesel",
    grossPriceOMR: 56000,
    netExportOMR: 49000,
    image: IMG.lr1,
    images: [IMG.lr1, IMG.lr2, IMG.gen4],
    energy: "9.4 L / 100 km",
    co2: "246 g/km",
    co2Class: "E",
    notes: "B6 ballistic conversion, run-flat tyres, secure cabin.",
    year: 2025,
    collections: ["Armoured"],
    dateAdded: "2026-01-19",
  },
  {
    id: "lr-rangerover-sv",
    brand: "Land Rover",
    model: "Range Rover SV LWB",
    modelAr: "رينج روفر SV LWB",
    bodyType: "SUV",
    drive: "Plugin Hybrid",
    grossPriceOMR: 78000,
    netExportOMR: 69000,
    image: IMG.lr2,
    images: [IMG.lr2, IMG.lr1, IMG.gen3],
    energy: "2.1 L / 100 km · 9.5 kWh / 100 km",
    co2: "48 g/km",
    co2Class: "A",
    notes: "SV Bespoke commission, ceramic detail, illuminated treadplates.",
    year: 2025,
    collections: [],
    dateAdded: "2026-02-08",
  },
  {
    id: "ferrari-daytona-sp3",
    brand: "Ferrari",
    model: "Daytona SP3",
    modelAr: "دايتونا SP3",
    bodyType: "Coupe",
    drive: "Combustion - Petrol",
    grossPriceOMR: 920000,
    netExportOMR: 815000,
    image: IMG.ferrari2,
    images: [IMG.ferrari2, IMG.ferrari1, IMG.gen1],
    energy: "16.0 L / 100 km",
    co2: "364 g/km",
    co2Class: "G",
    notes: "Icona series. Naturally aspirated V12, 1 of 599.",
    year: 2024,
    collections: ["Customized"],
    dateAdded: "2025-11-30",
  },
  {
    id: "rr-spectre",
    brand: "Rolls-Royce",
    model: "Spectre",
    modelAr: "سبيكتر",
    bodyType: "Coupe",
    drive: "Full Electric",
    grossPriceOMR: 168000,
    netExportOMR: 148000,
    image: IMG.gen3,
    images: [IMG.gen3, IMG.rr1, IMG.gen2],
    energy: "21.5 kWh / 100 km",
    co2: "0 g/km",
    co2Class: "A",
    notes: "First fully electric Rolls-Royce. Bespoke commission.",
    year: 2025,
    collections: ["Electric"],
    dateAdded: "2026-02-15",
  },
  {
    id: "porsche-911-classic",
    brand: "Porsche",
    model: "911 (964) Carrera RS — Restored",
    modelAr: "911 (964) كاريرا RS — مرممة",
    bodyType: "Coupe",
    drive: "Combustion - Petrol",
    grossPriceOMR: 142000,
    netExportOMR: 126000,
    image: IMG.gen2,
    images: [IMG.gen2, IMG.porsche1, IMG.gen4],
    energy: "12.0 L / 100 km",
    co2: "276 g/km",
    co2Class: "F",
    notes: "Concours-level restoration. Matching numbers, original tools.",
    year: 1993,
    collections: ["Classic"],
    dateAdded: "2025-12-21",
  },
  {
    id: "mercedes-300sl",
    brand: "Mercedes-Benz",
    model: "300 SL Gullwing — 1955",
    modelAr: "300 SL جولوينج — 1955",
    bodyType: "Coupe",
    drive: "Combustion - Petrol",
    grossPriceOMR: 580000,
    netExportOMR: 515000,
    image: IMG.gen4,
    images: [IMG.gen4, IMG.mb1, IMG.gen3],
    energy: "15.8 L / 100 km",
    co2: "—",
    co2Class: "—",
    notes: "Matching numbers, factory documentation, recent service.",
    year: 1955,
    collections: ["Classic"],
    dateAdded: "2025-11-18",
  },
  {
    id: "lambo-urus-mansory",
    brand: "Lamborghini",
    model: "Urus Performante by Mansory",
    modelAr: "أوروس بيرفورمانتي من مانسوري",
    bodyType: "SUV",
    drive: "Combustion - Petrol",
    grossPriceOMR: 134000,
    netExportOMR: 118000,
    image: IMG.lambo2,
    images: [IMG.lambo2, IMG.gen1, IMG.gen2],
    energy: "14.2 L / 100 km",
    co2: "323 g/km",
    co2Class: "G",
    notes: "Mansory Venatus widebody, 820 hp, forged carbon detailing.",
    year: 2025,
    collections: ["Customized"],
    dateAdded: "2026-02-02",
  },
  {
    id: "ferrari-purosangue",
    brand: "Ferrari",
    model: "Purosangue",
    modelAr: "بوروسانغوي",
    bodyType: "SUV",
    drive: "Combustion - Petrol",
    grossPriceOMR: 168000,
    netExportOMR: 148500,
    image: IMG.gen1,
    images: [IMG.gen1, IMG.ferrari1, IMG.gen3],
    energy: "17.4 L / 100 km",
    co2: "393 g/km",
    co2Class: "G",
    notes: "First Ferrari four-door. Carbon roof, Iroko interior trim.",
    year: 2024,
    collections: [],
    dateAdded: "2025-12-05",
  },
];

export const driveLabelKey = (drive) => {
  switch (drive) {
    case "Combustion - Petrol":
      return "drive_petrol";
    case "Combustion - Diesel":
      return "drive_diesel";
    case "Plugin Hybrid":
      return "drive_hybrid";
    case "Full Electric":
      return "drive_electric";
    default:
      return drive;
  }
};

export const bodyLabelKey = (body) => {
  switch (body) {
    case "Coupe":
      return "body_coupe";
    case "SUV":
      return "body_suv";
    case "Convertible":
      return "body_convertible";
    case "Sedan":
      return "body_sedan";
    case "Roadster":
      return "body_roadster";
    case "Van/MPV":
      return "body_van";
    default:
      return body;
  }
};

export const collectionLabelKey = (col) => {
  switch (col) {
    case "Armoured":
      return "coll_armoured";
    case "Customized":
      return "coll_customized";
    case "Electric":
      return "coll_electric";
    case "Classic":
      return "coll_classic";
    default:
      return col;
  }
};
