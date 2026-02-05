/**
 * FIPS 10-4 to ISO 3166-1 alpha-2 country code mapping
 * The CIA World Factbook uses FIPS codes, but flag APIs use ISO codes
 */

export const FIPS_TO_ISO: Record<string, string> = {
  // A
  'aa': 'aw', // Aruba
  'ac': 'ag', // Antigua and Barbuda
  'ae': 'ae', // United Arab Emirates (same)
  'af': 'af', // Afghanistan (same)
  'ag': 'dz', // Algeria
  'aj': 'az', // Azerbaijan
  'al': 'al', // Albania (same)
  'am': 'am', // Armenia (same)
  'an': 'ad', // Andorra
  'ao': 'ao', // Angola (same)
  'aq': 'as', // American Samoa
  'ar': 'ar', // Argentina (same)
  'as': 'au', // Australia
  'at': 'at', // Austria - actually Ashmore and Cartier Islands (no flag)
  'au': 'at', // Austria
  'av': 'ai', // Anguilla
  'ax': 'ax', // Akrotiri (UK base, use GB)
  'ay': 'aq', // Antarctica

  // B
  'ba': 'bh', // Bahrain
  'bb': 'bb', // Barbados (same)
  'bc': 'bw', // Botswana
  'bd': 'bm', // Bermuda
  'be': 'be', // Belgium (same)
  'bf': 'bs', // Bahamas
  'bg': 'bd', // Bangladesh
  'bh': 'bz', // Belize
  'bk': 'ba', // Bosnia and Herzegovina
  'bl': 'bo', // Bolivia
  'bm': 'mm', // Burma/Myanmar
  'bn': 'bj', // Benin
  'bo': 'by', // Belarus
  'bp': 'sb', // Solomon Islands
  'bq': '', // Navassa Island (no flag)
  'br': 'br', // Brazil (same)
  'bt': 'bt', // Bhutan (same)
  'bu': 'bg', // Bulgaria
  'bv': 'bv', // Bouvet Island (Norway)
  'bx': 'bn', // Brunei
  'by': 'bi', // Burundi

  // C
  'ca': 'ca', // Canada (same)
  'cb': 'kh', // Cambodia
  'cd': 'td', // Chad
  'ce': 'lk', // Sri Lanka
  'cf': 'cg', // Congo (Brazzaville)
  'cg': 'cd', // Congo (Kinshasa)
  'ch': 'cn', // China
  'ci': 'cl', // Chile
  'cj': 'ky', // Cayman Islands
  'ck': 'cc', // Cocos (Keeling) Islands
  'cm': 'cm', // Cameroon (same)
  'cn': 'km', // Comoros
  'co': 'co', // Colombia (same)
  'cq': 'mp', // Northern Mariana Islands
  'cr': 'cr', // Costa Rica - actually Coral Sea Islands (no flag)
  'cs': 'cr', // Costa Rica
  'ct': 'cf', // Central African Republic
  'cu': 'cu', // Cuba (same)
  'cv': 'cv', // Cabo Verde (same)
  'cw': 'ck', // Cook Islands
  'cy': 'cy', // Cyprus (same)

  // D
  'da': 'dk', // Denmark
  'dj': 'dj', // Djibouti (same)
  'do': 'dm', // Dominica
  'dr': 'do', // Dominican Republic
  'dx': 'sx', // Sint Maarten - actually Dhekelia (UK base)

  // E
  'ec': 'ec', // Ecuador (same)
  'ee': 'ee', // Estonia - actually (same)
  'eg': 'eg', // Egypt (same)
  'ei': 'ie', // Ireland
  'ek': 'gq', // Equatorial Guinea
  'en': 'ee', // Estonia
  'er': 'er', // Eritrea (same)
  'es': 'sv', // El Salvador
  'et': 'et', // Ethiopia (same)
  'ez': 'cz', // Czech Republic

  // F
  'fi': 'fi', // Finland (same)
  'fj': 'fj', // Fiji (same)
  'fk': 'fk', // Falkland Islands (same)
  'fm': 'fm', // Micronesia (same)
  'fo': 'fo', // Faroe Islands (same)
  'fp': 'pf', // French Polynesia
  'fr': 'fr', // France (same)
  'fs': 'tf', // French Southern Territories

  // G
  'ga': 'gm', // Gambia
  'gb': 'ga', // Gabon
  'gg': 'ge', // Georgia
  'gh': 'gh', // Ghana (same)
  'gi': 'gi', // Gibraltar (same)
  'gj': 'gd', // Grenada
  'gk': 'gg', // Guernsey
  'gl': 'gl', // Greenland (same)
  'gm': 'de', // Germany
  'gq': 'gu', // Guam
  'gr': 'gr', // Greece (same)
  'gt': 'gt', // Guatemala (same)
  'gv': 'gn', // Guinea
  'gy': 'gy', // Guyana (same)
  'gz': 'ps', // Gaza Strip (Palestine)

  // H
  'ha': 'ht', // Haiti
  'hk': 'hk', // Hong Kong (same)
  'hm': 'hm', // Heard Island and McDonald Islands (same)
  'ho': 'hn', // Honduras
  'hr': 'hr', // Croatia (same)
  'hu': 'hu', // Hungary (same)

  // I
  'ic': 'is', // Iceland
  'id': 'id', // Indonesia (same)
  'im': 'im', // Isle of Man (same)
  'in': 'in', // India (same)
  'io': 'io', // British Indian Ocean Territory (same)
  'ip': '', // Clipperton Island (France, no specific flag)
  'ir': 'ir', // Iran (same)
  'is': 'il', // Israel
  'it': 'it', // Italy (same)
  'iv': 'ci', // Cote d'Ivoire
  'iz': 'iq', // Iraq

  // J
  'ja': 'jp', // Japan
  'je': 'je', // Jersey (same)
  'jm': 'jm', // Jamaica (same)
  'jn': 'sj', // Jan Mayen (Norway)
  'jo': 'jo', // Jordan (same)

  // K
  'ke': 'ke', // Kenya (same)
  'kg': 'kg', // Kyrgyzstan (same)
  'kn': 'kp', // North Korea
  'kr': 'ki', // Kiribati
  'ks': 'kr', // South Korea
  'kt': 'cx', // Christmas Island
  'ku': 'kw', // Kuwait
  'kv': 'xk', // Kosovo
  'kz': 'kz', // Kazakhstan (same)

  // L
  'la': 'la', // Laos (same)
  'le': 'lb', // Lebanon
  'lg': 'lv', // Latvia
  'lh': 'lt', // Lithuania
  'li': 'lr', // Liberia
  'lo': 'sk', // Slovakia
  'ls': 'li', // Liechtenstein
  'lt': 'ls', // Lesotho
  'lu': 'lu', // Luxembourg (same)
  'ly': 'ly', // Libya (same)

  // M
  'ma': 'mg', // Madagascar
  'mc': 'mo', // Macau
  'md': 'md', // Moldova (same)
  'mg': 'mn', // Mongolia
  'mh': 'ms', // Montserrat
  'mi': 'mw', // Malawi
  'mj': 'me', // Montenegro
  'mk': 'mk', // North Macedonia (same)
  'ml': 'ml', // Mali (same)
  'mn': 'mc', // Monaco
  'mo': 'ma', // Morocco
  'mp': 'mu', // Mauritius
  'mr': 'mr', // Mauritania (same)
  'mt': 'mt', // Malta (same)
  'mu': 'om', // Oman
  'mv': 'mv', // Maldives (same)
  'mx': 'mx', // Mexico (same)
  'my': 'my', // Malaysia (same)
  'mz': 'mz', // Mozambique (same)

  // N
  'nc': 'nc', // New Caledonia (same)
  'ne': 'nu', // Niue
  'nf': 'nf', // Norfolk Island (same)
  'ng': 'ne', // Niger
  'nh': 'vu', // Vanuatu
  'ni': 'ng', // Nigeria
  'nl': 'nl', // Netherlands (same)
  'nn': 'sj', // Svalbard - actually Sint Maarten
  'no': 'no', // Norway (same)
  'np': 'np', // Nepal (same)
  'nr': 'nr', // Nauru (same)
  'ns': 'sr', // Suriname
  'nu': 'ni', // Nicaragua
  'nz': 'nz', // New Zealand (same)

  // O
  'od': 'ss', // South Sudan
  'oo': '', // World/Ocean (no flag)

  // P
  'pa': 'py', // Paraguay
  'pc': 'pn', // Pitcairn Islands
  'pe': 'pe', // Peru (same)
  'pf': '', // Paracel Islands (disputed, no flag)
  'pg': 'pg', // Papua New Guinea (same) - actually Spratly Islands
  'pk': 'pk', // Pakistan (same)
  'pl': 'pl', // Poland (same)
  'pm': 'pa', // Panama
  'po': 'pt', // Portugal
  'pp': 'pg', // Papua New Guinea
  'ps': 'pw', // Palau
  'pu': 'gw', // Guinea-Bissau

  // Q
  'qa': 'qa', // Qatar (same)

  // R
  'ri': 'rs', // Serbia
  'rm': 'mh', // Marshall Islands
  'rn': 'mr', // Saint Martin (France) - actually Martinique
  'ro': 'ro', // Romania (same)
  'rp': 'ph', // Philippines
  'rq': 'pr', // Puerto Rico
  'rs': 'ru', // Russia
  'rw': 'rw', // Rwanda (same)

  // S
  'sa': 'sa', // Saudi Arabia (same)
  'sb': 'pm', // Saint Pierre and Miquelon
  'sc': 'kn', // Saint Kitts and Nevis
  'se': 'sc', // Seychelles
  'sf': 'za', // South Africa
  'sg': 'sn', // Senegal
  'sh': 'sh', // Saint Helena (same)
  'si': 'si', // Slovenia (same)
  'sl': 'sl', // Sierra Leone (same)
  'sm': 'sm', // San Marino (same)
  'sn': 'sg', // Singapore
  'so': 'so', // Somalia (same)
  'sp': 'es', // Spain
  'st': 'lc', // Saint Lucia
  'su': 'sd', // Sudan
  'sv': 'sj', // Svalbard
  'sw': 'se', // Sweden
  'sx': 'gs', // South Georgia and South Sandwich Islands
  'sy': 'sy', // Syria (same)
  'sz': 'ch', // Switzerland

  // T
  'tb': 'bl', // Saint Barthelemy
  'td': 'tt', // Trinidad and Tobago
  'th': 'th', // Thailand (same)
  'ti': 'tj', // Tajikistan
  'tk': 'tc', // Turks and Caicos Islands
  'tl': 'tk', // Tokelau
  'tn': 'to', // Tonga
  'to': 'tg', // Togo
  'tp': 'st', // Sao Tome and Principe
  'ts': 'tn', // Tunisia
  'tt': 'tl', // Timor-Leste
  'tu': 'tr', // Turkey
  'tv': 'tv', // Tuvalu (same)
  'tw': 'tw', // Taiwan (same)
  'tx': 'tm', // Turkmenistan
  'tz': 'tz', // Tanzania (same)

  // U
  'uc': 'cw', // Curacao
  'ug': 'ug', // Uganda (same)
  'uk': 'gb', // United Kingdom
  'um': 'um', // US Minor Outlying Islands (same)
  'up': 'ua', // Ukraine
  'us': 'us', // United States (same)
  'uv': 'bf', // Burkina Faso
  'uy': 'uy', // Uruguay (same)
  'uz': 'uz', // Uzbekistan (same)

  // V
  'vc': 'vc', // Saint Vincent and the Grenadines (same)
  've': 've', // Venezuela (same)
  'vi': 'vg', // British Virgin Islands
  'vm': 'vn', // Vietnam
  'vq': 'vi', // US Virgin Islands
  'vt': 'va', // Vatican City

  // W
  'wa': 'na', // Namibia
  'we': 'ps', // West Bank (Palestine)
  'wf': 'wf', // Wallis and Futuna (same)
  'wi': 'eh', // Western Sahara
  'wq': '', // Wake Island (US, no specific flag)
  'ws': 'ws', // Samoa (same)
  'wz': 'sz', // Eswatini (Swaziland)

  // X
  'xo': '', // Indian Ocean (no flag)
  'xq': '', // Arctic Ocean (no flag)
  'xx': '', // World (no flag)

  // Y
  'ym': 'ye', // Yemen

  // Z
  'za': 'zm', // Zambia
  'zh': '', // Atlantic Ocean (no flag)
  'zi': 'zw', // Zimbabwe
  'zn': '', // Pacific Ocean (no flag)
};

/**
 * Get ISO code for flag from FIPS code
 */
export function getISOCode(fipsCode: string): string {
  return FIPS_TO_ISO[fipsCode.toLowerCase()] || fipsCode.toLowerCase();
}
