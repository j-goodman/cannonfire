var Territory = function (args) {
  this.name = args.name; // Name of territory, capitalized, with spaces
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
    type: 'territory',
    nation: 'USA',
    biome: 'arctic',
    borderNames: ['Yukon'],
  }),
  'Yukon': new Territory ({
    name: "Yukon",
    type: 'territory',
    nation: 'UK',
    biome: 'arctic',
    borderNames: ['Alaska', 'Northwest Territories', 'British Columbia'],
  }),
  'Northwest Territories': new Territory ({
    name: "Northwest Territories",
    type: 'province',
    nation: 'UK',
    biome: 'arctic',
    borderNames: ['Yukon', 'British Columbia', 'Alberta', 'Saskatchewan'],
  }),
  'Nunavut': new Territory ({
    name: "Nunavut",
    type: 'territory',
    nation: 'UK',
    biome: 'arctic',
    borderNames: ['Northwest Territories', 'Manitoba'],
  }),
  'British Columbia': new Territory ({
    name: "British Columbia",
    type: 'territory',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['Yukon', 'Northwest Territories', 'Alberta', 'Washington', 'Idaho', 'Montana'],
  }),
  'Alberta': new Territory ({
    name: "Alberta",
    type: 'province',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['British Columbia', 'Northwest Territories', 'Saskatchewan', 'Montana'],
  }),
  'Saskatchewan': new Territory ({
    name: "Saskatchewan",
    type: 'province',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['Alberta', 'Northwest Territories', 'Manitoba', 'Montana', 'North Dakota'],
  }),
  'Manitoba': new Territory ({
    name: "Manitoba",
    type: 'province',
    nation: 'UK',
    biome: 'taiga',
    borderNames: ['Saskatchewan', 'North Dakota', 'Minnesota'],
  }),
  'Washington': new Territory ({
    name: "Washington",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['British Columbia', 'Idaho', 'Oregon'],
  }),
  'Oregon': new Territory ({
    name: "Oregon",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['Washington', 'Idaho', 'California', 'Nevada'],
  }),
  'Idaho': new Territory ({
    name: "Idaho",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['Washington', 'Oregon', 'Nevada', 'Utah', 'Wyoming', 'Montana', 'British Columbia'],
  }),
  'Montana': new Territory ({
    name: "Montana",
    type: 'territory',
    nation: 'USA',
    biome: 'mountains',
    borderNames: ['British Columbia', 'Alberta', 'Saskatchewan', 'North Dakota', 'South Dakota', 'Wyoming', 'Idaho'],
  }),
  'Wyoming': new Territory ({
    name: "Wyoming",
    type: 'territory',
    nation: 'USA',
    biome: 'mountains',
    borderNames: ['Idaho', 'Montana', 'South Dakota', 'Nebraska', 'Colorado', 'Utah'],
  }),
  'California': new Territory ({
    name: "California",
    type: 'state',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['Oregon', 'Nevada', 'Arizona', 'Baja California'],
  }),
  'Nevada': new Territory ({
    name: "Nevada",
    type: 'state',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['California', 'Oregon', 'Idaho', 'Utah', 'Arizona'],
  }),
  'Utah': new Territory ({
    name: "Utah",
    type: 'territory',
    nation: 'USA',
    biome: 'saltflats',
    borderNames: ['Nevada', 'Idaho', 'Wyoming', 'Colorado', 'Arizona'],
  }),
  'Arizona': new Territory ({
    name: "Arizona",
    type: 'territory',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['California', 'Nevada', 'Utah', 'New Mexico', 'Sonora', 'Baja California'],
  }),
  'New Mexico': new Territory ({
    name: "New Mexico",
    type: 'territory',
    nation: 'USA',
    biome: 'desert',
    borderNames: ['Arizona', 'Colorado', 'Oklahoma', 'Texas', 'Chihuahua', 'Sonora'],
  }),
  'Texas': new Territory ({
    name: "Texas",
    type: 'state',
    nation: 'CSA',
    biome: 'desert',
    borderNames: ['New Mexico', 'Oklahoma', 'Arkansas', 'Louisiana', 'Tamaulipas', 'Nuevo Leon', 'Coahuila', 'Chihuahua'],
  }),
  'Oklahoma': new Territory ({
    name: "Oklahoma",
    type: 'territory',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['New Mexico', 'Colorado', 'Kansas', 'Missouri', 'Arkansas', 'Texas'],
  }),
  'Kansas': new Territory ({
    name: "Kansas",
    type: 'state',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['Colorado', 'Nebraska', 'Missouri', 'Oklahoma'],
  }),
  'Colorado': new Territory ({
    name: "Colorado",
    type: 'territory',
    nation: 'USA',
    biome: 'mountains',
    borderNames: ['Utah', 'Wyoming', 'Nebraska', 'Kansas', 'Oklahoma', 'New Mexico'],
  }),
  'Nebraska': new Territory ({
    name: "Nebraska",
    type: 'state',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['Colorado', 'Wyoming', 'South Dakota', 'Iowa', 'Missouri', 'Kansas'],
  }),
  'South Dakota': new Territory ({
    name: "South Dakota",
    type: 'territory',
    nation: 'USA',
    biome: 'hills',
    borderNames: ['Wyoming', 'Montana', 'North Dakota', 'Minnesota', 'Iowa', 'Nebraska'],
  }),
  'North Dakota': new Territory ({
    name: "North Dakota",
    type: 'territory',
    nation: 'USA',
    biome: 'taiga',
    borderNames: ['Montana', 'Saskatchewan', 'Manitoba', 'Minnesota', 'South Dakota'],
  }),
  'Minnesota': new Territory ({
    name: "Minnesota",
    type: 'territory',
    nation: 'USA',
    biome: 'hills',
    borderNames: ['Manitoba', 'North Dakota', 'South Dakota', 'Iowa'],
  }),
  'Iowa': new Territory ({
    name: "Iowa",
    type: 'territory',
    nation: 'USA',
    biome: 'prairie',
    borderNames: ['Minnesota', 'South Dakota', 'Nebraska', 'Missouri'],
  }),
  'Missouri': new Territory ({
    name: "Missouri",
    type: 'territory',
    nation: 'USA',
    biome: 'forest',
    borderNames: ['Iowa', 'Nebraska', 'Kansas', 'Oklahoma', 'Arkansas'],
  }),
  'Arkansas': new Territory ({
    name: "Arkansas",
    type: 'state',
    nation: 'CSA',
    biome: 'hills',
    borderNames: ['Missouri', 'Oklahoma', 'Texas', 'Louisiana'],
  }),
  'Louisiana': new Territory ({
    name: "Louisiana",
    type: 'state',
    nation: 'CSA',
    biome: 'swamp',
    borderNames: ['Arkansas', 'Texas'],
  }),
  'Baja California': new Territory ({
    name: "Baja California",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['California', 'Arizona', 'Sonora', 'Baja California Sur'],
  }),
  'Baja California Sur': new Territory ({
    name: "Baja California Sur",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Baja California'],
  }),
  'Sonora': new Territory ({
    name: "Sonora",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Baja California', 'Arizona', 'New Mexico', 'Chihuahua', 'Sinaloa'],
  }),
  'Chihuahua': new Territory ({
    name: "Chihuahua",
    type: 'state',
    nation: 'Mexico',
    biome: 'hills',
    borderNames: ['Sonora', 'New Mexico', 'Texas', 'Coahuila', 'Durango', 'Sinaloa'],
  }),
  'Coahuila': new Territory ({
    name: "Coahuila",
    type: 'state',
    nation: 'Mexico',
    biome: 'mountains',
    borderNames: ['Chihuahua', 'Texas', 'Nuevo Leon', 'Zacatecas', 'Durango'],
  }),
  'Nuevo Leon': new Territory ({
    name: "Nuevo Leon",
    type: 'state',
    nation: 'Mexico',
    biome: 'mountains',
    borderNames: ['Tamaulipas', 'Zacatecas', 'Coahuila', 'Texas'],
  }),
  'Tamaulipas': new Territory ({
    name: "Tamaulipas",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Nuevo Leon', 'Texas'],
  }),
  'Sinaloa': new Territory ({
    name: "Sinaloa",
    type: 'state',
    nation: 'Mexico',
    biome: 'hills',
    borderNames: ['Durango', 'Chihuahua', 'Sonora'],
  }),
  'Durango': new Territory ({
    name: "Durango",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Sinaloa', 'Chihuahua', 'Coahuila'],
  }),
  'Zacatecas': new Territory ({
    name: "Zacatecas",
    type: 'state',
    nation: 'Mexico',
    biome: 'desert',
    borderNames: ['Durango', 'Coahuila', 'Nuevo Leon'],
  }),
};
