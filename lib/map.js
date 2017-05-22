var Territory = function (args) {
  this.name = args.name; // Name of territory, capitalized, with spaces
  this.symbol = args.symbol; // Two letter abbreviation of name
  this.type = args.type; // 'state', 'province', or 'territory'
  this.borderNames = args.borderNames; // Names of adjacent territories
  this.nation = args.nation; // USA, CSA, Mexico, UK
  this.biome = args.biome; // arctic, taiga, forest, mountains, desert, saltflats, prairie, hills, swamp
  this.flag = '';
  this.loyalTo = '';
  this.loyalty = 0;
  this.reserves = {
    infantry: 0,
    cavalry: 0,
    artillery: 0,
  };
};

Territory.prototype.develop = function () {
  if (this.flag === this.loyalTo || this.flag === '') {
    this.loyalty += 1;
    this.loyalty = this.loyalTo === '' ? 0 : this.loyalty;
  } else {
    this.loyalty = 0;
    this.reserves = {
      infantry: 0,
      cavalry: 0,
      artillery: 0,
    };
    this.loyalTo = this.flag;
  }
  if (this.loyalty % 5 === 0 && this.loyalty !== 0) {
    this.reserves.infantry += 1;
  }
  if (this.loyalty % 10 === 0 && this.loyalty !== 0) {
    this.reserves.cavalry += 1;
  }
  if (this.loyalty % 20 === 0 && this.loyalty !== 0) {
    this.reserves.artillery += 1;
  }
};

Territory.prototype.tenantAt = function (territoryName) {
  var i;
  territoryName = territoryName ? territoryName : this.name;
  for (i=0 ; i<game.armies.length ; i++) {
    if (game.armies[i].location.name == territoryName) {
      return game.armies[i];
    }
  }
};

Territory.prototype.flagColor = function () {
  switch (this.loyalTo) {
    case "French Empire":
      return '#e0e030';
    case "Confederate States of America":
      return '#607070';
    case "British Empire":
      return '#d02000';
    case "Coalition of Freedmen":
      return '#809010';
    case "United Mexican States":
      return '#20a000';
    case "United States of America":
      return '#0030c0';
  }
};

var MAP = {
  'Alaska': new Territory ({
    name: "Alaska",
    symbol: "AK",
    type: 'territory',
    nation: 'USA',
    biome: 'arctic',
    borderNames: ['Yukon', 'British Columbia'],
  }),
  'Yukon': new Territory ({
    name: "Yukon",
    symbol: "YK",
    type: 'territory',
    nation: 'UK',
    biome: 'arctic',
    borderNames: ['Alaska', 'Northwest Territories', 'British Columbia'],
  }),
  'Northwest Territories': new Territory ({
    name: "Northwest Territories",
    symbol: "NT",
    type: 'province',
    nation: 'UK',
    biome: 'arctic',
    borderNames: ['Yukon', 'British Columbia', 'Alberta', 'Saskatchewan'],
  }),
  'Nunavut': new Territory ({
    name: "Nunavut",
    symbol: "NU",
    type: 'territory',
    nation: 'UK',
    biome: 'arctic',
    borderNames: ['Northwest Territories', 'Manitoba'],
  }),
  'British Columbia': new Territory ({
    name: "British Columbia",
    symbol: "BC",
    type: 'territory',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['Yukon', 'Alaska', 'Northwest Territories', 'Alberta', 'Washington', 'Idaho', 'Montana'],
  }),
  'Alberta': new Territory ({
    name: "Alberta",
    symbol: "AB",
    type: 'province',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['British Columbia', 'Northwest Territories', 'Saskatchewan', 'Montana'],
  }),
  'Saskatchewan': new Territory ({
    name: "Saskatchewan",
    symbol: "SK",
    type: 'province',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['Alberta', 'Northwest Territories', 'Manitoba', 'Montana', 'North Dakota'],
  }),
  'Manitoba': new Territory ({
    name: "Manitoba",
    symbol: "MB",
    type: 'province',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['Saskatchewan', 'North Dakota', 'Minnesota'],
  }),
  'Washington': new Territory ({
    name: "Washington",
    symbol: "WA",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['British Columbia', 'Idaho', 'Oregon'],
  }),
  'Oregon': new Territory ({
    name: "Oregon",
    symbol: "OR",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['Washington', 'Idaho', 'California', 'Nevada'],
  }),
  'Idaho': new Territory ({
    name: "Idaho",
    symbol: "ID",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['Washington', 'Oregon', 'Nevada', 'Utah', 'Wyoming', 'Montana', 'British Columbia'],
  }),
  'Montana': new Territory ({
    name: "Montana",
    symbol: "MT",
    type: 'territory',
    nation: 'USA',
    biome: 'mountains',
    borderNames: ['British Columbia', 'Alberta', 'Saskatchewan', 'North Dakota', 'South Dakota', 'Wyoming', 'Idaho'],
  }),
  'Wyoming': new Territory ({
    name: "Wyoming",
    symbol: "WY",
    type: 'territory',
    nation: 'USA',
    biome: 'mountains',
    borderNames: ['Idaho', 'Montana', 'South Dakota', 'Nebraska', 'Colorado', 'Utah'],
  }),
  'California': new Territory ({
    name: "California",
    symbol: "CA",
    type: 'state',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['Oregon', 'Nevada', 'Arizona', 'Baja California'],
  }),
  'Nevada': new Territory ({
    name: "Nevada",
    symbol: "NV",
    type: 'state',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['California', 'Oregon', 'Idaho', 'Utah', 'Arizona'],
  }),
  'Utah': new Territory ({
    name: "Utah",
    symbol: "UT",
    type: 'territory',
    nation: 'USA',
    biome: 'saltflats',
    borderNames: ['Nevada', 'Idaho', 'Wyoming', 'Colorado', 'Arizona'],
  }),
  'Arizona': new Territory ({
    name: "Arizona",
    symbol: "AZ",
    type: 'territory',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['California', 'Nevada', 'Utah', 'New Mexico', 'Sonora', 'Baja California'],
  }),
  'New Mexico': new Territory ({
    name: "New Mexico",
    symbol: "NM",
    type: 'territory',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['Arizona', 'Colorado', 'Oklahoma', 'Texas', 'Chihuahua', 'Sonora'],
  }),
  'Texas': new Territory ({
    name: "Texas",
    symbol: "TX",
    type: 'state',
    nation: 'CSA',
    biome: 'desert',
    borderNames: ['New Mexico', 'Oklahoma', 'Arkansas', 'Louisiana', 'Tamaulipas', 'Nuevo Leon', 'Coahuila', 'Chihuahua'],
  }),
  'Oklahoma': new Territory ({
    name: "Oklahoma",
    symbol: "OK",
    type: 'territory',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['New Mexico', 'Colorado', 'Kansas', 'Missouri', 'Arkansas', 'Texas'],
  }),
  'Kansas': new Territory ({
    name: "Kansas",
    symbol: "KS",
    type: 'state',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['Colorado', 'Nebraska', 'Missouri', 'Oklahoma'],
  }),
  'Colorado': new Territory ({
    name: "Colorado",
    symbol: "CO",
    type: 'territory',
    nation: 'USA',
    biome: 'mountains',
    borderNames: ['Utah', 'Wyoming', 'Nebraska', 'Kansas', 'Oklahoma', 'New Mexico'],
  }),
  'Nebraska': new Territory ({
    name: "Nebraska",
    symbol: "NE",
    type: 'state',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['Colorado', 'Wyoming', 'South Dakota', 'Iowa', 'Missouri', 'Kansas'],
  }),
  'South Dakota': new Territory ({
    name: "South Dakota",
    symbol: "SD",
    type: 'territory',
    nation: 'USA',
    biome: 'hills',
    borderNames: ['Wyoming', 'Montana', 'North Dakota', 'Minnesota', 'Iowa', 'Nebraska'],
  }),
  'North Dakota': new Territory ({
    name: "North Dakota",
    symbol: "ND",
    type: 'territory',
    nation: 'USA',
    biome: 'taiga',
    borderNames: ['Montana', 'Saskatchewan', 'Manitoba', 'Minnesota', 'South Dakota'],
  }),
  'Minnesota': new Territory ({
    name: "Minnesota",
    symbol: "MN",
    type: 'territory',
    nation: 'USA',
    biome: 'hills',
    borderNames: ['Manitoba', 'North Dakota', 'South Dakota', 'Iowa'],
  }),
  'Iowa': new Territory ({
    name: "Iowa",
    symbol: "IA",
    type: 'territory',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['Minnesota', 'South Dakota', 'Nebraska', 'Missouri'],
  }),
  'Missouri': new Territory ({
    name: "Missouri",
    symbol: "MO",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['Iowa', 'Nebraska', 'Kansas', 'Oklahoma', 'Arkansas'],
  }),
  'Arkansas': new Territory ({
    name: "Arkansas",
    symbol: "AR",
    type: 'state',
    nation: 'CSA',
    biome: 'hills',
    borderNames: ['Missouri', 'Oklahoma', 'Texas', 'Louisiana'],
  }),
  'Louisiana': new Territory ({
    name: "Louisiana",
    symbol: "LA",
    type: 'state',
    nation: 'CSA',
    biome: 'swamp',
    borderNames: ['Arkansas', 'Texas'],
  }),
  'Baja California': new Territory ({
    name: "Baja California",
    symbol: "BN",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['California', 'Arizona', 'Sonora', 'Baja California Sur'],
  }),
  'Baja California Sur': new Territory ({
    name: "Baja California Sur",
    symbol: "BS",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Baja California'],
  }),
  'Sonora': new Territory ({
    name: "Sonora",
    symbol: "SO",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Baja California', 'Arizona', 'New Mexico', 'Chihuahua', 'Sinaloa'],
  }),
  'Chihuahua': new Territory ({
    name: "Chihuahua",
    symbol: "CH",
    type: 'state',
    nation: 'Mexico',
    biome: 'hills',
    borderNames: ['Sonora', 'New Mexico', 'Texas', 'Coahuila', 'Durango', 'Sinaloa'],
  }),
  'Coahuila': new Territory ({
    name: "Coahuila",
    symbol: "CA",
    type: 'state',
    nation: 'Mexico',
    biome: 'mountains',
    borderNames: ['Chihuahua', 'Texas', 'Nuevo Leon', 'Zacatecas', 'Durango'],
  }),
  'Nuevo Leon': new Territory ({
    name: "Nuevo Leon",
    symbol: "NL",
    type: 'state',
    nation: 'Mexico',
    biome: 'mountains',
    borderNames: ['Tamaulipas', 'Zacatecas', 'Coahuila', 'Texas'],
  }),
  'Tamaulipas': new Territory ({
    name: "Tamaulipas",
    symbol: "TM",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Nuevo Leon', 'Texas'],
  }),
  'Sinaloa': new Territory ({
    name: "Sinaloa",
    symbol: "SI",
    type: 'state',
    nation: 'Mexico',
    biome: 'hills',
    borderNames: ['Durango', 'Chihuahua', 'Sonora'],
  }),
  'Durango': new Territory ({
    name: "Durango",
    symbol: "DU",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Sinaloa', 'Chihuahua', 'Coahuila'],
  }),
  'Zacatecas': new Territory ({
    name: "Zacatecas",
    symbol: "ZA",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Durango', 'Coahuila', 'Nuevo Leon'],
  }),
};
