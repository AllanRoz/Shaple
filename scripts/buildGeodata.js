import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as topojson from 'topojson-client';
import * as d3Geo from 'd3-geo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. ALL 50 US STATES
const US_STATE_METADATA = {
  'Alabama': {
    abbreviation: 'AL',
    capital: 'Montgomery',
    region: 'South',
    difficulty: 'normal',
    aliases: ['AL', 'Bama', 'Heart of Dixie', 'Yellowhammer State'],
    funFact: 'Alabama is home to the world’s first electric trolley system and the Saturn V rocket that took humans to the Moon.'
  },
  'Alaska': {
    abbreviation: 'AK',
    capital: 'Juneau',
    region: 'West',
    difficulty: 'easy',
    aliases: ['AK', 'The Last Frontier'],
    funFact: 'Alaska is larger than Texas, California, and Montana combined, with coastline longer than all other US states together.'
  },
  'Arizona': {
    abbreviation: 'AZ',
    capital: 'Phoenix',
    region: 'West',
    difficulty: 'normal',
    aliases: ['AZ', 'Grand Canyon State', 'Copper State'],
    funFact: 'Home to the Grand Canyon and the world’s largest stand of ponderosa pine trees.'
  },
  'Arkansas': {
    abbreviation: 'AR',
    capital: 'Little Rock',
    region: 'South',
    difficulty: 'hard',
    aliases: ['AR', 'Natural State', 'Land of Opportunity'],
    funFact: 'Arkansas contains Crater of Diamonds State Park, the only active diamond mine in the world where the public can search for gems.'
  },
  'California': {
    abbreviation: 'CA',
    capital: 'Sacramento',
    region: 'West',
    difficulty: 'easy',
    aliases: ['CA', 'Golden State', 'Cali'],
    funFact: 'California contains both the highest point (Mount Whitney) and the lowest point (Badwater Basin) in the contiguous United States.'
  },
  'Colorado': {
    abbreviation: 'CO',
    capital: 'Denver',
    region: 'West',
    difficulty: 'easy',
    aliases: ['CO', 'Centennial State', 'Colorful Colorado'],
    funFact: 'Colorado has the highest average altitude of any US state and contains 58 mountain peaks over 14,000 feet.'
  },
  'Connecticut': {
    abbreviation: 'CT',
    capital: 'Hartford',
    region: 'Northeast',
    difficulty: 'hard',
    aliases: ['CT', 'Constitution State', 'Nutmeg State'],
    funFact: 'The first telephone book ever published was issued in New Haven, Connecticut, in 1878 with only 50 names.'
  },
  'Delaware': {
    abbreviation: 'DE',
    capital: 'Dover',
    region: 'Northeast',
    difficulty: 'hard',
    aliases: ['DE', 'First State', 'Diamond State'],
    funFact: 'Delaware was the very first state to ratify the United States Constitution on December 7, 1787.'
  },
  'Florida': {
    abbreviation: 'FL',
    capital: 'Tallahassee',
    region: 'South',
    difficulty: 'easy',
    aliases: ['FL', 'Sunshine State'],
    funFact: 'Florida is the only place in the world where both American alligators and American crocodiles coexist in the wild.'
  },
  'Georgia': {
    abbreviation: 'GA',
    capital: 'Atlanta',
    region: 'South',
    difficulty: 'normal',
    aliases: ['GA', 'Peach State', 'Empire State of the South'],
    funFact: 'Georgia is the top producer of peanuts, pecans, and peaches in the nation and where Coca-Cola was invented in 1886.'
  },
  'Hawaii': {
    abbreviation: 'HI',
    capital: 'Honolulu',
    region: 'West',
    difficulty: 'easy',
    aliases: ['HI', 'Aloha State'],
    funFact: 'Hawaii is the only US state made entirely of islands and the only state that grows commercial coffee and cacao.'
  },
  'Idaho': {
    abbreviation: 'ID',
    capital: 'Boise',
    region: 'West',
    difficulty: 'easy',
    aliases: ['ID', 'Gem State'],
    funFact: 'Known as the Gem State because almost every known type of gemstone has been found here, plus it produces ~30% of US potatoes.'
  },
  'Illinois': {
    abbreviation: 'IL',
    capital: 'Springfield',
    region: 'Midwest',
    difficulty: 'normal',
    aliases: ['IL', 'Prairie State', 'Land of Lincoln'],
    funFact: 'Home to the world’s first skyscraper (Home Insurance Building, 1885) and the starting point of historic Route 66.'
  },
  'Indiana': {
    abbreviation: 'IN',
    capital: 'Indianapolis',
    region: 'Midwest',
    difficulty: 'hard',
    aliases: ['IN', 'Hoosier State', 'Crossroads of America'],
    funFact: 'Indiana produces over 70% of the world’s supply of peppermint oil and is world-famous for the Indianapolis 500.'
  },
  'Iowa': {
    abbreviation: 'IA',
    capital: 'Des Moines',
    region: 'Midwest',
    difficulty: 'hard',
    aliases: ['IA', 'Hawkeye State', 'Corn State'],
    funFact: 'Iowa is the only state whose east and west borders are formed 100% by water (the Mississippi and Missouri rivers).'
  },
  'Kansas': {
    abbreviation: 'KS',
    capital: 'Topeka',
    region: 'Midwest',
    difficulty: 'hard',
    aliases: ['KS', 'Sunflower State', 'Wheat State'],
    funFact: 'The geographic center of the 48 contiguous United States is located near Lebanon, Kansas.'
  },
  'Kentucky': {
    abbreviation: 'KY',
    capital: 'Frankfort',
    region: 'South',
    difficulty: 'normal',
    aliases: ['KY', 'Bluegrass State'],
    funFact: 'Kentucky contains Mammoth Cave, the longest cave system in the world with over 400 miles of surveyed passageways.'
  },
  'Louisiana': {
    abbreviation: 'LA',
    capital: 'Baton Rouge',
    region: 'South',
    difficulty: 'easy',
    aliases: ['LA', 'Pelican State', 'Bayou State'],
    funFact: 'Louisiana is the only US state with political subdivisions called "parishes" rather than counties.'
  },
  'Maine': {
    abbreviation: 'ME',
    capital: 'Augusta',
    region: 'Northeast',
    difficulty: 'normal',
    aliases: ['ME', 'Pine Tree State', 'Vacationland'],
    funFact: 'Maine is the only US state whose name has just one syllable, and it borders only one other US state (New Hampshire).'
  },
  'Maryland': {
    abbreviation: 'MD',
    capital: 'Annapolis',
    region: 'South',
    difficulty: 'hard',
    aliases: ['MD', 'Old Line State', 'Free State'],
    funFact: 'Maryland has such diverse topography (from Atlantic beaches to Appalachian mountains) that it is nicknamed "America in Miniature".'
  },
  'Massachusetts': {
    abbreviation: 'MA',
    capital: 'Boston',
    region: 'Northeast',
    difficulty: 'easy',
    aliases: ['MA', 'Bay State', 'Old Colony'],
    funFact: 'Both basketball (Springfield) and volleyball (Holyoke) were invented in Massachusetts in the 1890s.'
  },
  'Michigan': {
    abbreviation: 'MI',
    capital: 'Lansing',
    region: 'Midwest',
    difficulty: 'easy',
    aliases: ['MI', 'Great Lakes State', 'Mitten State', 'Wolverine State'],
    funFact: 'Michigan is the only state split into two distinct peninsulas (Upper and Lower) and you are never more than 6 miles from a body of water.'
  },
  'Minnesota': {
    abbreviation: 'MN',
    capital: 'Saint Paul',
    region: 'Midwest',
    difficulty: 'normal',
    aliases: ['MN', 'Land of 10,000 Lakes', 'North Star State', 'Gopher State'],
    funFact: 'Despite its nickname "Land of 10,000 Lakes", Minnesota actually has 11,842 lakes measuring 10 acres or larger.'
  },
  'Mississippi': {
    abbreviation: 'MS',
    capital: 'Jackson',
    region: 'South',
    difficulty: 'normal',
    aliases: ['MS', 'Magnolia State', 'Hospitality State'],
    funFact: 'The root of American blues music originated in the Mississippi Delta, which influenced rock and roll worldwide.'
  },
  'Missouri': {
    abbreviation: 'MO',
    capital: 'Jefferson City',
    region: 'Midwest',
    difficulty: 'hard',
    aliases: ['MO', 'Show-Me State'],
    funFact: 'Missouri is tied with Tennessee for bordering the most other states: 8 different states touch its borders.'
  },
  'Montana': {
    abbreviation: 'MT',
    capital: 'Helena',
    region: 'West',
    difficulty: 'normal',
    aliases: ['MT', 'Treasure State', 'Big Sky Country'],
    funFact: 'Montana is home to the Triple Divide Peak, where water flows into three different oceans: Atlantic, Pacific, and Arctic.'
  },
  'Nebraska': {
    abbreviation: 'NE',
    capital: 'Lincoln',
    region: 'Midwest',
    difficulty: 'hard',
    aliases: ['NE', 'Cornhusker State'],
    funFact: 'Nebraska is the only triply landlocked US state (you must cross at least three states to reach an ocean or ocean-connected bay).'
  },
  'Nevada': {
    abbreviation: 'NV',
    capital: 'Carson City',
    region: 'West',
    difficulty: 'normal',
    aliases: ['NV', 'Silver State', 'Battle Born State'],
    funFact: 'Nevada is the most mountainous state in the contiguous US, boasting more than 300 individual mountain ranges.'
  },
  'New Hampshire': {
    abbreviation: 'NH',
    capital: 'Concord',
    region: 'Northeast',
    difficulty: 'hard',
    aliases: ['NH', 'Granite State'],
    funFact: 'Mount Washington in New Hampshire recorded a surface wind speed of 231 mph in 1934, a world record for decades.'
  },
  'New Jersey': {
    abbreviation: 'NJ',
    capital: 'Trenton',
    region: 'Northeast',
    difficulty: 'normal',
    aliases: ['NJ', 'Garden State'],
    funFact: 'New Jersey has the highest population density of any US state and more diners than any other place in the world.'
  },
  'New Mexico': {
    abbreviation: 'NM',
    capital: 'Santa Fe',
    region: 'West',
    difficulty: 'hard',
    aliases: ['NM', 'Land of Enchantment'],
    funFact: 'Santa Fe, founded in 1610, is the oldest state capital in the United States and sits at 7,199 feet above sea level.'
  },
  'New York': {
    abbreviation: 'NY',
    capital: 'Albany',
    region: 'Northeast',
    difficulty: 'easy',
    aliases: ['NY', 'Empire State', 'New York State'],
    funFact: 'New York was the first state to require license plates on automobiles back in 1901.'
  },
  'North Carolina': {
    abbreviation: 'NC',
    capital: 'Raleigh',
    region: 'South',
    difficulty: 'normal',
    aliases: ['NC', 'Tar Heel State', 'Old North State'],
    funFact: 'The Wright brothers completed the first controlled powered airplane flight at Kitty Hawk, North Carolina in 1903.'
  },
  'North Dakota': {
    abbreviation: 'ND',
    capital: 'Bismarck',
    region: 'Midwest',
    difficulty: 'hard',
    aliases: ['ND', 'Peace Garden State', 'Roughrider State'],
    funFact: 'North Dakota produces more sunflowers, honey, and durum wheat (for pasta) than any other US state.'
  },
  'Ohio': {
    abbreviation: 'OH',
    capital: 'Columbus',
    region: 'Midwest',
    difficulty: 'normal',
    aliases: ['OH', 'Buckeye State', 'Birthplace of Aviation'],
    funFact: 'Ohio has produced seven US presidents and 25 astronauts, including Neil Armstrong and John Glenn.'
  },
  'Oklahoma': {
    abbreviation: 'OK',
    capital: 'Oklahoma City',
    region: 'South',
    difficulty: 'easy',
    aliases: ['OK', 'Sooner State', 'Panhandle State'],
    funFact: 'Oklahoma’s distinctive panhandle was formed because Texas ceded land north of 36°30′ to comply with federal slave state bans.'
  },
  'Oregon': {
    abbreviation: 'OR',
    capital: 'Salem',
    region: 'West',
    difficulty: 'normal',
    aliases: ['OR', 'Beaver State', 'Pacific Wonderland'],
    funFact: 'Crater Lake in Oregon is the deepest lake in the United States (1,949 feet deep) formed by a collapsed volcano.'
  },
  'Pennsylvania': {
    abbreviation: 'PA',
    capital: 'Harrisburg',
    region: 'Northeast',
    difficulty: 'normal',
    aliases: ['PA', 'Keystone State', 'Penn State'],
    funFact: 'Both the Declaration of Independence and the United States Constitution were drafted and signed in Philadelphia, PA.'
  },
  'Rhode Island': {
    abbreviation: 'RI',
    capital: 'Providence',
    region: 'Northeast',
    difficulty: 'hard',
    aliases: ['RI', 'Ocean State', 'Little Rhody'],
    funFact: 'Rhode Island is the smallest US state by land area, but has over 400 miles of tidal shoreline.'
  },
  'South Carolina': {
    abbreviation: 'SC',
    capital: 'Columbia',
    region: 'South',
    difficulty: 'normal',
    aliases: ['SC', 'Palmetto State'],
    funFact: 'The first battle of the American Civil War occurred at Fort Sumter in Charleston Harbor, South Carolina.'
  },
  'South Dakota': {
    abbreviation: 'SD',
    capital: 'Pierre',
    region: 'Midwest',
    difficulty: 'hard',
    aliases: ['SD', 'Mount Rushmore State', 'Coyote State'],
    funFact: 'Home to Mount Rushmore National Memorial, depicting 60-foot granite faces of Washington, Jefferson, Roosevelt, and Lincoln.'
  },
  'Tennessee': {
    abbreviation: 'TN',
    capital: 'Nashville',
    region: 'South',
    difficulty: 'normal',
    aliases: ['TN', 'Volunteer State'],
    funFact: 'Tennessee is the birthplace of country music (Nashville), rock & roll, and the blues (Memphis).'
  },
  'Texas': {
    abbreviation: 'TX',
    capital: 'Austin',
    region: 'South',
    difficulty: 'easy',
    aliases: ['TX', 'Lone Star State'],
    funFact: 'Texas is so large that El Paso is closer to San Diego, California than it is to Houston, Texas.'
  },
  'Utah': {
    abbreviation: 'UT',
    capital: 'Salt Lake City',
    region: 'West',
    difficulty: 'easy',
    aliases: ['UT', 'Beehive State'],
    funFact: 'Utah features a distinctive notched rectangle silhouette because the southwest corner of Wyoming was carved out in 1868.'
  },
  'Vermont': {
    abbreviation: 'VT',
    capital: 'Montpelier',
    region: 'Northeast',
    difficulty: 'hard',
    aliases: ['VT', 'Green Mountain State'],
    funFact: 'Vermont is the leading producer of pure maple syrup in the US and its capital Montpelier is the only US capital without a McDonald’s.'
  },
  'Virginia': {
    abbreviation: 'VA',
    capital: 'Richmond',
    region: 'South',
    difficulty: 'normal',
    aliases: ['VA', 'Old Dominion', 'Mother of Presidents'],
    funFact: 'Eight US presidents were born in Virginia, more than in any other state.'
  },
  'Washington': {
    abbreviation: 'WA',
    capital: 'Olympia',
    region: 'West',
    difficulty: 'normal',
    aliases: ['WA', 'Evergreen State', 'Washington State'],
    funFact: 'Washington produces more apples, sweet cherries, pears, and hops for beer than any other US state.'
  },
  'West Virginia': {
    abbreviation: 'WV',
    capital: 'Charleston',
    region: 'South',
    difficulty: 'normal',
    aliases: ['WV', 'Mountain State'],
    funFact: 'West Virginia is the only state in the Union that was formed by seceding from a Confederate state during the Civil War.'
  },
  'Wisconsin': {
    abbreviation: 'WI',
    capital: 'Madison',
    region: 'Midwest',
    difficulty: 'normal',
    aliases: ['WI', 'Badger State', 'America’s Dairyland'],
    funFact: 'Wisconsin produces more than 600 varieties of cheese and makes over 25% of all cheese in the United States.'
  },
  'Wyoming': {
    abbreviation: 'WY',
    capital: 'Cheyenne',
    region: 'West',
    difficulty: 'easy',
    aliases: ['WY', 'Equality State', 'Cowboy State'],
    funFact: 'Wyoming was the first US state or territory to grant women the right to vote in 1869, earning the title "The Equality State".'
  }
};

// 2. EXTENDED COUNTRY DICTIONARY WITH ALIASES AND MAPPINGS TO NATURAL EARTH NAMES
const COUNTRY_INFO = {
  'Afghanistan': { code: 'AF', flagEmoji: '🇦🇫', continent: 'Asia', capital: 'Kabul', difficulty: 'normal', aliases: ['Islamic Republic of Afghanistan'], funFact: 'Afghanistan is home to the world\'s oldest known oil paintings, dating back to 650 AD in Bamiyan.' },
  'Albania': { code: 'AL', flagEmoji: '🇦🇱', continent: 'Europe', capital: 'Tirana', difficulty: 'normal', aliases: ['Shqipëria', 'Republic of Albania'], funFact: 'Albania has more than 173,000 concrete military bunkers built across the country during the Cold War.' },
  'Algeria': { code: 'DZ', flagEmoji: '🇩🇿', continent: 'Africa', capital: 'Algiers', difficulty: 'normal', aliases: ['People’s Democratic Republic of Algeria'], funFact: 'Algeria is the largest country by land area in Africa and the 10th largest in the world; ~80% of it is the Sahara Desert.' },
  'Andorra': { code: 'AD', flagEmoji: '🇦🇩', continent: 'Europe', capital: 'Andorra la Vella', difficulty: 'hard', aliases: ['Principality of Andorra'], funFact: 'Andorra is the only country in the world where Catalan is the sole official language.' },
  'Angola': { code: 'AO', flagEmoji: '🇦🇴', continent: 'Africa', capital: 'Luanda', difficulty: 'normal', aliases: ['Republic of Angola'], funFact: 'Angola is home to the ancient Welwitschia mirabilis desert plant, which can live for over 1,000 to 2,000 years.' },
  'Antigua and Barb.': { name: 'Antigua and Barbuda', code: 'AG', flagEmoji: '🇦🇬', continent: 'North America', capital: 'Saint John\'s', difficulty: 'hard', aliases: ['Antigua and Barbuda', 'Antigua'], funFact: 'Antigua is renowned for having 365 distinct beaches — one for every day of the year.' },
  'Argentina': { code: 'AR', flagEmoji: '🇦🇷', continent: 'South America', capital: 'Buenos Aires', difficulty: 'easy', aliases: ['Argentine Republic', 'Arg'], funFact: 'Argentina is home to Aconcagua, the highest mountain peak in both the Western and Southern Hemispheres (22,837 ft).' },
  'Armenia': { code: 'AM', flagEmoji: '🇦🇲', continent: 'Asia', capital: 'Yerevan', difficulty: 'hard', aliases: ['Republic of Armenia', 'Hayastan'], funFact: 'Armenia was the first nation in the world to adopt Christianity as its state religion in 301 AD.' },
  'Australia': { code: 'AU', flagEmoji: '🇦🇺', continent: 'Oceania', capital: 'Canberra', difficulty: 'easy', aliases: ['Commonwealth of Australia', 'Aussie', 'Oz'], funFact: 'Australia is the only continent occupied by a single country and is home to more kangaroos than human beings.' },
  'Austria': { code: 'AT', flagEmoji: '🇦🇹', continent: 'Europe', capital: 'Vienna', difficulty: 'normal', aliases: ['Republic of Austria', 'Österreich'], funFact: 'Austria’s flag is one of the oldest national flags in the world, dating back to 1191 during the Crusades.' },
  'Azerbaijan': { code: 'AZ', flagEmoji: '🇦🇿', continent: 'Asia', capital: 'Baku', difficulty: 'hard', aliases: ['Republic of Azerbaijan'], funFact: 'Azerbaijan is known as the "Land of Fire" due to natural subterranean gas fires like Yanar Dag burning for centuries.' },
  'Bahamas': { code: 'BS', flagEmoji: '🇧🇸', continent: 'North America', capital: 'Nassau', difficulty: 'hard', aliases: ['The Bahamas', 'Commonwealth of The Bahamas'], funFact: 'The Bahamas consists of over 700 coral islands and cays surrounded by some of the clearest ocean water on Earth.' },
  'Bahrain': { code: 'BH', flagEmoji: '🇧🇭', continent: 'Asia', capital: 'Manama', difficulty: 'hard', aliases: ['Kingdom of Bahrain'], funFact: 'Bahrain is an island nation connected to Saudi Arabia by the 15.5-mile King Fahd Causeway.' },
  'Bangladesh': { code: 'BD', flagEmoji: '🇧🇩', continent: 'Asia', capital: 'Dhaka', difficulty: 'normal', aliases: ['People’s Republic of Bangladesh'], funFact: 'Bangladesh is home to the Sundarbans, the largest contiguous mangrove forest on Earth and habitat of the Bengal tiger.' },
  'Barbados': { code: 'BB', flagEmoji: '🇧🇧', continent: 'North America', capital: 'Bridgetown', difficulty: 'hard', aliases: [], funFact: 'Barbados is the birthplace of commercial rum, with Mount Gay Distilleries founded in 1703.' },
  'Belarus': { code: 'BY', flagEmoji: '🇧🇾', continent: 'Europe', capital: 'Minsk', difficulty: 'normal', aliases: ['Republic of Belarus', 'White Russia', 'Belorussia'], funFact: 'Belarus has the Belovezhskaya Pushcha, one of the last and largest remaining primeval forests in Europe.' },
  'Belgium': { code: 'BE', flagEmoji: '🇧🇪', continent: 'Europe', capital: 'Brussels', difficulty: 'normal', aliases: ['Kingdom of Belgium', 'Belgique', 'België'], funFact: 'Belgium produces over 220,000 tons of high-grade chocolate per year and invented the modern saxophone.' },
  'Belize': { code: 'BZ', flagEmoji: '🇧🇿', continent: 'North America', capital: 'Belmopan', difficulty: 'hard', aliases: ['British Honduras'], funFact: 'Belize has the Great Blue Hole, a giant marine sinkhole over 400 feet deep made famous by Jacques Cousteau.' },
  'Benin': { code: 'BJ', flagEmoji: '🇧🇯', continent: 'Africa', capital: 'Porto-Novo', difficulty: 'hard', aliases: ['Republic of Benin', 'Dahomey'], funFact: 'Benin is the historic birthplace of the Vodun (Voodoo) religion and home to the stilt village of Ganvié.' },
  'Bhutan': { code: 'BT', flagEmoji: '🇧🇹', continent: 'Asia', capital: 'Thimphu', difficulty: 'hard', aliases: ['Kingdom of Bhutan', 'Druk Yul'], funFact: 'Bhutan measures prosperity using "Gross National Happiness" and is the world’s first carbon-negative country.' },
  'Bolivia': { code: 'BO', flagEmoji: '🇧🇴', continent: 'South America', capital: 'Sucre', difficulty: 'normal', aliases: ['Plurinational State of Bolivia'], funFact: 'Bolivia contains the Salar de Uyuni, the world\'s largest salt flat (over 4,000 sq mi), creating a mirror effect when wet.' },
  'Bosnia and Herz.': { name: 'Bosnia and Herzegovina', code: 'BA', flagEmoji: '🇧🇦', continent: 'Europe', capital: 'Sarajevo', difficulty: 'normal', aliases: ['Bosnia', 'Bosnia and Herzegovina', 'BiH', 'Bosnia-Herzegovina'], funFact: 'Sarajevo hosted the 1984 Winter Olympics and was the first European city with a full-time electric tram network.' },
  'Botswana': { code: 'BW', flagEmoji: '🇧🇼', continent: 'Africa', capital: 'Gaborone', difficulty: 'normal', aliases: ['Republic of Botswana'], funFact: 'Botswana hosts the Okavango Delta, an unusual inland river delta that empties into the Kalahari Desert.' },
  'Brazil': { code: 'BR', flagEmoji: '🇧🇷', continent: 'South America', capital: 'Brasília', difficulty: 'easy', aliases: ['Federative Republic of Brazil', 'Brasil'], funFact: 'Brazil is the fifth largest country in the world by area and population, and contains ~60% of the Amazon rainforest.' },
  'Brunei': { code: 'BN', flagEmoji: '🇧🇳', continent: 'Asia', capital: 'Bandar Seri Begawan', difficulty: 'hard', aliases: ['Brunei Darussalam', 'Nation of Brunei'], funFact: 'Brunei is completely surrounded by Malaysia and the South China Sea, with citizens paying zero income tax.' },
  'Bulgaria': { code: 'BG', flagEmoji: '🇧🇬', continent: 'Europe', capital: 'Sofia', difficulty: 'normal', aliases: ['Republic of Bulgaria'], funFact: 'Bulgaria produces ~70% of the world\'s rose oil, an essential ingredient in luxury French perfumes.' },
  'Burkina Faso': { code: 'BF', flagEmoji: '🇧🇫', continent: 'Africa', capital: 'Ouagadougou', difficulty: 'hard', aliases: ['Upper Volta'], funFact: 'The name "Burkina Faso" means "Land of Incorruptible People" in indigenous Moré and Dioula languages.' },
  'Burundi': { code: 'BI', flagEmoji: '🇧🇮', continent: 'Africa', capital: 'Gitega', difficulty: 'hard', aliases: ['Republic of Burundi'], funFact: 'Burundi borders Lake Tanganyika, the second deepest and second largest freshwater lake in the world by volume.' },
  'Cabo Verde': { name: 'Cape Verde', code: 'CV', flagEmoji: '🇨🇻', continent: 'Africa', capital: 'Praia', difficulty: 'hard', aliases: ['Cape Verde', 'Cabo Verde', 'Republic of Cabo Verde'], funFact: 'Cape Verde is an archipelago of 10 volcanic islands situated 350 miles off the western coast of Africa.' },
  'Cambodia': { code: 'KH', flagEmoji: '🇰🇭', continent: 'Asia', capital: 'Phnom Penh', difficulty: 'normal', aliases: ['Kingdom of Cambodia', 'Kampuchea'], funFact: 'Cambodia\'s national flag is the only flag in the world that features a specific building: Angkor Wat.' },
  'Cameroon': { code: 'CM', flagEmoji: '🇨🇲', continent: 'Africa', capital: 'Yaoundé', difficulty: 'normal', aliases: ['Republic of Cameroon'], funFact: 'Cameroon is called "Africa in miniature" because it exhibits all major climates and vegetation types of Africa.' },
  'Canada': { code: 'CA', flagEmoji: '🇨🇦', continent: 'North America', capital: 'Ottawa', difficulty: 'easy', aliases: ['Dominion of Canada', 'CAN'], funFact: 'Canada has the longest coastline of any country in the world (over 151,000 miles) and more lakes than all other countries combined.' },
  'Central African Rep.': { name: 'Central African Republic', code: 'CF', flagEmoji: '🇨🇫', continent: 'Africa', capital: 'Bangui', difficulty: 'hard', aliases: ['CAR', 'Central African Republic'], funFact: 'The Central African Republic is one of the best places in the world for stargazing due to virtually zero light pollution.' },
  'Chad': { code: 'TD', flagEmoji: '🇹🇩', continent: 'Africa', capital: 'N’Djamena', difficulty: 'normal', aliases: ['Republic of Chad'], funFact: 'Chad is nicknamed the "Dead Heart of Africa" due to its central continental location and vast Sahara desert.' },
  'Chile': { code: 'CL', flagEmoji: '🇨🇱', continent: 'South America', capital: 'Santiago', difficulty: 'easy', aliases: ['Republic of Chile'], funFact: 'Chile is the longest north-to-south country in the world (2,653 miles long) but averages only 110 miles wide.' },
  'China': { code: 'CN', flagEmoji: '🇨🇳', continent: 'Asia', capital: 'Beijing', difficulty: 'easy', aliases: ['People’s Republic of China', 'PRC', 'Zhongguo'], funFact: 'Despite spanning 5 geographical time zones, all of China operates under a single official time zone (UTC+8).' },
  'Colombia': { code: 'CO', flagEmoji: '🇨🇴', continent: 'South America', capital: 'Bogotá', difficulty: 'normal', aliases: ['Republic of Colombia'], funFact: 'Colombia is the second most biodiverse country on Earth and the world’s leading producer of fine emeralds.' },
  'Comoros': { code: 'KM', flagEmoji: '🇰🇲', continent: 'Africa', capital: 'Moroni', difficulty: 'hard', aliases: ['Union of the Comoros'], funFact: 'Comoros is known as the "Perfume Islands" for its fragrant plant life and is a top producer of ylang-ylang.' },
  'Congo': { name: 'Republic of the Congo', code: 'CG', flagEmoji: '🇨🇬', continent: 'Africa', capital: 'Brazzaville', difficulty: 'hard', aliases: ['Congo-Brazzaville', 'Republic of the Congo', 'Congo Republic'], funFact: 'Brazzaville sits right across the Congo River from Kinshasa, making them the two closest national capitals.' },
  'Costa Rica': { code: 'CR', flagEmoji: '🇨🇷', continent: 'North America', capital: 'San José', difficulty: 'normal', aliases: ['Republic of Costa Rica'], funFact: 'Costa Rica constitutionally abolished its military in 1948 and generates over 99% of electricity from renewables.' },
  'Croatia': { code: 'HR', flagEmoji: '🇭🇷', continent: 'Europe', capital: 'Zagreb', difficulty: 'easy', aliases: ['Republic of Croatia', 'Hrvatska'], funFact: 'The Dalmatian dog breed traces its roots to Dalmatia in Croatia, as does the modern necktie (cravat).' },
  'Cuba': { code: 'CU', flagEmoji: '🇨🇺', continent: 'North America', capital: 'Havana', difficulty: 'easy', aliases: ['Republic of Cuba'], funFact: 'Cuba is shaped remarkably like an alligator (nicknamed "El Cocodrilo") and is the largest Caribbean island.' },
  'Cyprus': { code: 'CY', flagEmoji: '🇨🇾', continent: 'Europe', capital: 'Nicosia', difficulty: 'hard', aliases: ['Republic of Cyprus'], funFact: 'Cyprus and Kosovo are the only two nations whose flags prominently display the outline shape of the country.' },
  'Czechia': { code: 'CZ', flagEmoji: '🇨🇿', continent: 'Europe', capital: 'Prague', difficulty: 'normal', aliases: ['Czech Republic', 'Czechia', 'Cesko'], funFact: 'Czechia consumes more beer per capita than any other nation and Prague Castle is the largest ancient castle complex.' },
  'Côte d\'Ivoire': { name: 'Ivory Coast', code: 'CI', flagEmoji: '🇨🇮', continent: 'Africa', capital: 'Yamoussoukro', difficulty: 'normal', aliases: ['Cote d\'Ivoire', 'Ivory Coast', 'Cote d Ivoire'], funFact: 'Ivory Coast is the world\'s largest exporter of cocoa beans, supplying over 40% of the globe\'s chocolate supply.' },
  'Dem. Rep. Congo': { name: 'Democratic Republic of the Congo', code: 'CD', flagEmoji: '🇨🇩', continent: 'Africa', capital: 'Kinshasa', difficulty: 'normal', aliases: ['DRC', 'DR Congo', 'Democratic Republic of the Congo', 'Zaire', 'Congo-Kinshasa'], funFact: 'The DRC contains the second largest rainforest on Earth after the Amazon and the deepest river in the world (720 ft).' },
  'Denmark': { code: 'DK', flagEmoji: '🇩🇰', continent: 'Europe', capital: 'Copenhagen', difficulty: 'normal', aliases: ['Kingdom of Denmark', 'Danmark'], funFact: 'The Danish flag is recognized by Guinness World Records as the oldest continuously used national flag, dating to 1219.' },
  'Djibouti': { code: 'DJ', flagEmoji: '🇩🇯', continent: 'Africa', capital: 'Djibouti City', difficulty: 'hard', aliases: ['Republic of Djibouti'], funFact: 'Lake Assal in Djibouti is the lowest point on land in Africa (509 ft below sea level) and saltier than the Dead Sea.' },
  'Dominica': { code: 'DM', flagEmoji: '🇩🇲', continent: 'North America', capital: 'Roseau', difficulty: 'hard', aliases: ['Commonwealth of Dominica'], funFact: 'Known as the "Nature Isle of the Caribbean" for its lush rainforests, home to the Boiling Lake geothermal feature.' },
  'Dominican Rep.': { name: 'Dominican Republic', code: 'DO', flagEmoji: '🇩🇴', continent: 'North America', capital: 'Santo Domingo', difficulty: 'normal', aliases: ['Dominican Republic', 'DR', 'Dominicana'], funFact: 'Santo Domingo was founded in 1496, making it the oldest continuously inhabited European settlement in the Americas.' },
  'Ecuador': { code: 'EC', flagEmoji: '🇪🇨', continent: 'South America', capital: 'Quito', difficulty: 'normal', aliases: ['Republic of Ecuador'], funFact: 'Because of Earth\'s equatorial bulge, Mount Chimborazo in Ecuador is the closest point on Earth to space and the Moon.' },
  'Egypt': { code: 'EG', flagEmoji: '🇪🇬', continent: 'Africa', capital: 'Cairo', difficulty: 'easy', aliases: ['Arab Republic of Egypt', 'Misr'], funFact: 'Home to the Great Pyramid of Giza, the oldest and only surviving ancient wonder of the Seven Wonders of the Ancient World.' },
  'El Salvador': { code: 'SV', flagEmoji: '🇸🇻', continent: 'North America', capital: 'San Salvador', difficulty: 'hard', aliases: ['Republic of El Salvador'], funFact: 'Known as the "Land of Volcanoes" with over 20 active volcanoes, and was first to adopt Bitcoin as legal tender.' },
  'Eq. Guinea': { name: 'Equatorial Guinea', code: 'GQ', flagEmoji: '🇬🇶', continent: 'Africa', capital: 'Malabo', difficulty: 'hard', aliases: ['Equatorial Guinea', 'Republic of Equatorial Guinea'], funFact: 'Equatorial Guinea is the only independent sovereign country in Africa where Spanish is an official language.' },
  'Eritrea': { code: 'ER', flagEmoji: '🇪🇷', continent: 'Africa', capital: 'Asmara', difficulty: 'hard', aliases: ['State of Eritrea'], funFact: 'Asmara is famous for its preserved futuristic Italian Art Deco architecture and is a UNESCO World Heritage Site.' },
  'Estonia': { code: 'EE', flagEmoji: '🇪🇪', continent: 'Europe', capital: 'Tallinn', difficulty: 'hard', aliases: ['Republic of Estonia', 'Eesti'], funFact: 'Estonia is one of the world\'s most digital nations; Skype was created here and ~99% of government services are online.' },
  'eSwatini': { name: 'Eswatini', code: 'SZ', flagEmoji: '🇸🇿', continent: 'Africa', capital: 'Mbabane', difficulty: 'hard', aliases: ['Swaziland', 'Kingdom of Eswatini', 'Eswatini'], funFact: 'Eswatini is one of the last remaining absolute monarchies in Africa and the world.' },
  'Ethiopia': { code: 'ET', flagEmoji: '🇪🇹', continent: 'Africa', capital: 'Addis Ababa', difficulty: 'normal', aliases: ['Federal Democratic Republic of Ethiopia'], funFact: 'Ethiopia has its own unique 13-month calendar running ~7 to 8 years behind the Western Gregorian calendar.' },
  'Fiji': { code: 'FJ', flagEmoji: '🇫🇯', continent: 'Oceania', capital: 'Suva', difficulty: 'hard', aliases: ['Republic of Fiji'], funFact: 'Fiji straddles the 180-degree meridian (International Date Line), which had to be bent around Fiji.' },
  'Finland': { code: 'FI', flagEmoji: '🇫🇮', continent: 'Europe', capital: 'Helsinki', difficulty: 'easy', aliases: ['Republic of Finland', 'Suomi'], funFact: 'Finland has over 3 million saunas for a population of 5.5 million — more saunas than private cars.' },
  'France': { code: 'FR', flagEmoji: '🇫🇷', continent: 'Europe', capital: 'Paris', difficulty: 'easy', aliases: ['French Republic', 'FR', 'La France'], funFact: 'Due to overseas territories across all oceans, France spans 12 different time zones, the most of any country.' },
  'Gabon': { code: 'GA', flagEmoji: '🇬🇦', continent: 'Africa', capital: 'Libreville', difficulty: 'hard', aliases: ['Gabonese Republic'], funFact: 'Over 80% of Gabon is covered by pristine tropical rainforest, and 11% of the country is dedicated to national parks.' },
  'Gambia': { code: 'GM', flagEmoji: '🇬🇲', continent: 'Africa', capital: 'Banjul', difficulty: 'hard', aliases: ['The Gambia', 'Republic of The Gambia'], funFact: 'The Gambia is the smallest country in mainland Africa, tracing the banks of the winding Gambia River inside Senegal.' },
  'Georgia': { code: 'GE', flagEmoji: '🇬🇪', continent: 'Asia', capital: 'Tbilisi', difficulty: 'hard', aliases: ['Sakartvelo'], funFact: 'Archaeological evidence proves Georgia has made wine for over 8,000 years, making it the "Cradle of Wine".' },
  'Germany': { code: 'DE', flagEmoji: '🇩🇪', continent: 'Europe', capital: 'Berlin', difficulty: 'easy', aliases: ['Federal Republic of Germany', 'Deutschland', 'DE'], funFact: 'Germany has over 20,000 castles and ~65% of the Autobahn highways have no federally mandated speed limit.' },
  'Ghana': { code: 'GH', flagEmoji: '🇬🇭', continent: 'Africa', capital: 'Accra', difficulty: 'normal', aliases: ['Republic of Ghana', 'Gold Coast'], funFact: 'Ghana was the first sub-Saharan African country to gain independence from colonial rule in 1957.' },
  'Greece': { code: 'GR', flagEmoji: '🇬🇷', continent: 'Europe', capital: 'Athens', difficulty: 'easy', aliases: ['Hellenic Republic', 'Hellas'], funFact: 'Greece has thousands of islands and no part of the Greek mainland is more than 85 miles from the sea.' },
  'Grenada': { code: 'GD', flagEmoji: '🇬🇩', continent: 'North America', capital: 'St. George\'s', difficulty: 'hard', aliases: ['Isle of Spice'], funFact: 'Known as the "Spice Isle" because it is one of the world\'s largest exporters of nutmeg and mace.' },
  'Guatemala': { code: 'GT', flagEmoji: '🇬🇹', continent: 'North America', capital: 'Guatemala City', difficulty: 'normal', aliases: ['Republic of Guatemala'], funFact: 'Guatemala was the heart of the ancient Maya civilization, home to the towering ruins of Tikal in the jungle.' },
  'Guinea': { code: 'GN', flagEmoji: '🇬🇳', continent: 'Africa', capital: 'Conakry', difficulty: 'hard', aliases: ['Republic of Guinea', 'Guinea-Conakry'], funFact: 'Guinea contains roughly one-third of the world’s proven reserves of bauxite, the ore used to make aluminum.' },
  'Guinea-Bissau': { code: 'GW', flagEmoji: '🇬🇼', continent: 'Africa', capital: 'Bissau', difficulty: 'hard', aliases: ['Republic of Guinea-Bissau'], funFact: 'Includes the Bijagós Archipelago, an ecosystem of 88 islands recognized as a UNESCO Biosphere Reserve.' },
  'Guyana': { code: 'GY', flagEmoji: '🇬🇾', continent: 'South America', capital: 'Georgetown', difficulty: 'hard', aliases: ['Co-operative Republic of Guyana'], funFact: 'Guyana is the only English-speaking country in South America and home to Kaieteur Falls, the largest single-drop waterfall.' },
  'Haiti': { code: 'HT', flagEmoji: '🇭🇹', continent: 'North America', capital: 'Port-au-Prince', difficulty: 'normal', aliases: ['Republic of Haiti'], funFact: 'Haiti became the world’s first independent Black republic and first nation to abolish slavery successfully in 1804.' },
  'Honduras': { code: 'HN', flagEmoji: '🇭🇳', continent: 'North America', capital: 'Tegucigalpa', difficulty: 'normal', aliases: ['Republic of Honduras'], funFact: 'Honduras is home to the Yoro "Lluvia de Peces" (Rain of Fish), a rare annual meteorological phenomenon.' },
  'Hungary': { code: 'HU', flagEmoji: '🇭🇺', continent: 'Europe', capital: 'Budapest', difficulty: 'normal', aliases: ['Magyarország', 'Republic of Hungary'], funFact: 'Hungarian inventors gave the world the Rubik’s Cube, the ballpoint pen (Biro), and holographic photography.' },
  'Iceland': { code: 'IS', flagEmoji: '🇮🇸', continent: 'Europe', capital: 'Reykjavik', difficulty: 'easy', aliases: ['Republic of Iceland', 'Ísland'], funFact: 'Iceland has no military forces, ~130 active/dormant volcanoes, and runs 100% on renewable geothermal and hydro energy.' },
  'India': { code: 'IN', flagEmoji: '🇮🇳', continent: 'Asia', capital: 'New Delhi', difficulty: 'easy', aliases: ['Republic of India', 'Bharat'], funFact: 'India is the world\'s most populous nation, birthplace of chess, yoga, and the mathematical number zero.' },
  'Indonesia': { code: 'ID', flagEmoji: '🇮🇩', continent: 'Asia', capital: 'Jakarta', difficulty: 'easy', aliases: ['Republic of Indonesia'], funFact: 'Indonesia is the world’s largest archipelagic nation, comprising more than 17,500 islands over 3,000 miles.' },
  'Iran': { code: 'IR', flagEmoji: '🇮🇷', continent: 'Asia', capital: 'Tehran', difficulty: 'normal', aliases: ['Islamic Republic of Iran', 'Persia'], funFact: 'Iran is home to one of the world’s oldest continuous civilizations, with monuments dating back 5,000 years.' },
  'Iraq': { code: 'IQ', flagEmoji: '🇮🇶', continent: 'Asia', capital: 'Baghdad', difficulty: 'normal', aliases: ['Republic of Iraq', 'Mesopotamia'], funFact: 'Iraq was ancient Mesopotamia, the "Cradle of Civilization" where writing (cuneiform) was first invented.' },
  'Ireland': { code: 'IE', flagEmoji: '🇮🇪', continent: 'Europe', capital: 'Dublin', difficulty: 'easy', aliases: ['Republic of Ireland', 'Éire'], funFact: 'Known as the Emerald Isle due to lush green landscapes, and there are no native wild snakes on the island.' },
  'Israel': { code: 'IL', flagEmoji: '🇮🇱', continent: 'Asia', capital: 'Jerusalem', difficulty: 'normal', aliases: ['State of Israel'], funFact: 'Israel contains the Dead Sea, whose shoreline at 1,410 ft below sea level is the lowest land elevation on Earth.' },
  'Italy': { code: 'IT', flagEmoji: '🇮🇹', continent: 'Europe', capital: 'Rome', difficulty: 'easy', aliases: ['Italian Republic', 'Italia'], funFact: 'Italy\'s "boot" shape encloses two independent sovereign nations within its borders: San Marino and Vatican City.' },
  'Jamaica': { code: 'JM', flagEmoji: '🇯🇲', continent: 'North America', capital: 'Kingston', difficulty: 'hard', aliases: [], funFact: 'Jamaica’s flag is the only national flag that contains zero red, white, or blue colors.' },
  'Japan': { code: 'JP', flagEmoji: '🇯🇵', continent: 'Asia', capital: 'Tokyo', difficulty: 'easy', aliases: ['Nippon', 'Nihon', 'Land of the Rising Sun'], funFact: 'Japan is an archipelago of 6,852 islands and has the world\'s oldest operating business (Kongō Gumi, 578 AD).' },
  'Jordan': { code: 'JO', flagEmoji: '🇯🇴', continent: 'Asia', capital: 'Amman', difficulty: 'normal', aliases: ['Hashemite Kingdom of Jordan'], funFact: 'Jordan is home to the ancient rock-carved city of Petra, one of the New 7 Wonders of the World.' },
  'Kazakhstan': { code: 'KZ', flagEmoji: '🇰🇿', continent: 'Asia', capital: 'Astana', difficulty: 'normal', aliases: ['Republic of Kazakhstan'], funFact: 'Kazakhstan is the largest landlocked country in the world and where wild apples originally evolved.' },
  'Kenya': { code: 'KE', flagEmoji: '🇰🇪', continent: 'Africa', capital: 'Nairobi', difficulty: 'normal', aliases: ['Republic of Kenya'], funFact: 'Kenya is home to the Maasai Mara, host to the annual migration of over 1.5 million wildebeest.' },
  'Kiribati': { code: 'KI', flagEmoji: '🇰🇮', continent: 'Oceania', capital: 'South Tarawa', difficulty: 'hard', aliases: ['Republic of Kiribati'], funFact: 'Kiribati is the only nation in the world situated in all four hemispheres (Northern, Southern, Eastern, Western).' },
  'Kosovo': { code: 'XK', flagEmoji: '🇽🇰', continent: 'Europe', capital: 'Pristina', difficulty: 'hard', aliases: ['Republic of Kosovo'], funFact: 'Kosovo declared independence in 2008 and is the youngest country in Europe.' },
  'Kuwait': { code: 'KW', flagEmoji: '🇰🇼', continent: 'Asia', capital: 'Kuwait City', difficulty: 'hard', aliases: ['State of Kuwait'], funFact: 'The Kuwaiti Dinar is consistently the highest-valued currency unit in the world.' },
  'Kyrgyzstan': { code: 'KG', flagEmoji: '🇰🇬', continent: 'Asia', capital: 'Bishkek', difficulty: 'hard', aliases: ['Kyrgyz Republic'], funFact: 'Issyk-Kul in Kyrgyzstan is the second largest high-altitude alpine lake in the world after Lake Titicaca.' },
  'Laos': { code: 'LA', flagEmoji: '🇱🇦', continent: 'Asia', capital: 'Vientiane', difficulty: 'normal', aliases: ['Lao PDR', 'Lao People\'s Democratic Republic'], funFact: 'Laos is the only landlocked nation in Southeast Asia and historic "Land of a Million Elephants".' },
  'Latvia': { code: 'LV', flagEmoji: '🇱🇻', continent: 'Europe', capital: 'Riga', difficulty: 'hard', aliases: ['Republic of Latvia', 'Latvija'], funFact: 'Latvia has the widest natural waterfall in Europe (Ventas Rumba, up to 885 feet wide).' },
  'Lebanon': { code: 'LB', flagEmoji: '🇱🇧', continent: 'Asia', capital: 'Beirut', difficulty: 'hard', aliases: ['Lebanese Republic'], funFact: 'The Cedar tree on the Lebanese flag has been prized for shipbuilding since Phoenician times 4,000 years ago.' },
  'Lesotho': { code: 'LS', flagEmoji: '🇱🇸', continent: 'Africa', capital: 'Maseru', difficulty: 'hard', aliases: ['Kingdom of Lesotho'], funFact: 'Lesotho is the only independent state in the world lying entirely above 1,000 meters (3,281 feet) elevation.' },
  'Liberia': { code: 'LR', flagEmoji: '🇱🇷', continent: 'Africa', capital: 'Monrovia', difficulty: 'hard', aliases: ['Republic of Liberia'], funFact: 'Liberia was founded by free Black people from the US in 1822; Monrovia is named after James Monroe.' },
  'Libya': { code: 'LY', flagEmoji: '🇱🇾', continent: 'Africa', capital: 'Tripoli', difficulty: 'normal', aliases: ['State of Libya'], funFact: 'Libya contains Leptis Magna, one of the best-preserved ancient Roman provincial cities in the Mediterranean.' },
  'Liechtenstein': { code: 'LI', flagEmoji: '🇱🇮', continent: 'Europe', capital: 'Vaduz', difficulty: 'hard', aliases: ['Principality of Liechtenstein'], funFact: 'Liechtenstein is one of only two doubly landlocked countries in the world (along with Uzbekistan).' },
  'Lithuania': { code: 'LT', flagEmoji: '🇱🇹', continent: 'Europe', capital: 'Vilnius', difficulty: 'hard', aliases: ['Republic of Lithuania', 'Lietuva'], funFact: 'Lithuania was the largest country in Europe in the 14th century, stretching from the Baltic to the Black Sea.' },
  'Luxembourg': { code: 'LU', flagEmoji: '🇱🇺', continent: 'Europe', capital: 'Luxembourg City', difficulty: 'hard', aliases: ['Grand Duchy of Luxembourg'], funFact: 'Luxembourg is the world\'s only Grand Duchy and the first nation to make all public transit 100% free.' },
  'Madagascar': { code: 'MG', flagEmoji: '🇲🇬', continent: 'Africa', capital: 'Antananarivo', difficulty: 'easy', aliases: ['Republic of Madagascar'], funFact: 'Roughly 90% of all plant and animal species found in Madagascar exist nowhere else on Earth.' },
  'Malawi': { code: 'MW', flagEmoji: '🇲🇼', continent: 'Africa', capital: 'Lilongwe', difficulty: 'hard', aliases: ['Republic of Malawi', 'Nyasaland'], funFact: 'Lake Malawi contains more species of fish (especially colorful cichlids) than any other lake on Earth.' },
  'Malaysia': { code: 'MY', flagEmoji: '🇲🇾', continent: 'Asia', capital: 'Kuala Lumpur', difficulty: 'normal', aliases: [], funFact: 'Malaysia is split into Peninsular Malaysia and Malaysian Borneo by the South China Sea.' },
  'Maldives': { code: 'MV', flagEmoji: '🇲🇻', continent: 'Asia', capital: 'Malé', difficulty: 'hard', aliases: ['Republic of Maldives'], funFact: 'The Maldives is the lowest and flattest country in the world, with an average ground level of just 4 feet 11 inches.' },
  'Mali': { code: 'ML', flagEmoji: '🇲🇱', continent: 'Africa', capital: 'Bamako', difficulty: 'normal', aliases: ['Republic of Mali'], funFact: 'Mali was the home of Mansa Musa, widely considered one of the wealthiest individuals in human history.' },
  'Malta': { code: 'MT', flagEmoji: '🇲🇹', continent: 'Europe', capital: 'Valletta', difficulty: 'hard', aliases: ['Republic of Malta'], funFact: 'Malta has megalithic temples older than Stonehenge and the Pyramids of Giza, dating back to 3600 BC.' },
  'Mauritania': { code: 'MR', flagEmoji: '🇲🇷', continent: 'Africa', capital: 'Nouakchott', difficulty: 'normal', aliases: ['Islamic Republic of Mauritania'], funFact: 'Mauritania contains the "Eye of the Sahara" (Richat Structure), a 25-mile circular dome visible from orbit.' },
  'Mauritius': { code: 'MU', flagEmoji: '🇲🇺', continent: 'Africa', capital: 'Port Louis', difficulty: 'hard', aliases: ['Republic of Mauritius'], funFact: 'Mauritius was the only known home of the now-extinct flightless Dodo bird.' },
  'Mexico': { code: 'MX', flagEmoji: '🇲🇽', continent: 'North America', capital: 'Mexico City', difficulty: 'easy', aliases: ['United Mexican States', 'Mex'], funFact: 'Mexico City is built on the ruins of the ancient Aztec capital Tenochtitlan and is sinking several inches a year.' },
  'Moldova': { code: 'MD', flagEmoji: '🇲🇩', continent: 'Europe', capital: 'Chișinău', difficulty: 'hard', aliases: ['Republic of Moldova'], funFact: 'Mileștii Mici in Moldova is the largest underground wine cellar in the world, holding 2 million bottles.' },
  'Monaco': { code: 'MC', flagEmoji: '🇲🇨', continent: 'Europe', capital: 'Monaco', difficulty: 'hard', aliases: ['Principality of Monaco'], funFact: 'Monaco is the second-smallest independent state in the world (after Vatican City), measuring under 1 square mile.' },
  'Mongolia': { code: 'MN', flagEmoji: '🇲🇳', continent: 'Asia', capital: 'Ulaanbaatar', difficulty: 'easy', aliases: [], funFact: 'Mongolia is the most sparsely populated sovereign country in the world, with only ~5 people per square mile.' },
  'Montenegro': { code: 'ME', flagEmoji: '🇲🇪', continent: 'Europe', capital: 'Podgorica', difficulty: 'hard', aliases: ['Crna Gora'], funFact: 'Montenegro features the Tara River Canyon, the deepest canyon in Europe and second deepest in the world.' },
  'Morocco': { code: 'MA', flagEmoji: '🇲🇦', continent: 'Africa', capital: 'Rabat', difficulty: 'normal', aliases: ['Kingdom of Morocco', 'Al-Maghrib'], funFact: 'University of al-Qarawiyyin in Fez was founded in 859 AD, recognized as the world\'s oldest continuous university.' },
  'Mozambique': { code: 'MZ', flagEmoji: '🇲🇿', continent: 'Africa', capital: 'Maputo', difficulty: 'normal', aliases: ['Republic of Mozambique'], funFact: 'Mozambique’s flag is the only one in the world to feature a modern rifle (AK-47) with a bayonet and hoe.' },
  'Myanmar': { code: 'MM', flagEmoji: '🇲🇲', continent: 'Asia', capital: 'Naypyidaw', difficulty: 'normal', aliases: ['Burma', 'Republic of the Union of Myanmar'], funFact: 'Myanmar is one of only three countries in the world that have not officially adopted the metric system.' },
  'Namibia': { code: 'NA', flagEmoji: '🇳🇦', continent: 'Africa', capital: 'Windhoek', difficulty: 'normal', aliases: ['Republic of Namibia'], funFact: 'The Namib Desert in Namibia is believed to be the world\'s oldest desert, existing for at least 55 million years.' },
  'Nepal': { code: 'NP', flagEmoji: '🇳🇵', continent: 'Asia', capital: 'Kathmandu', difficulty: 'normal', aliases: ['Federal Democratic Republic of Nepal'], funFact: 'Nepal is home to Mount Everest (29,032 ft) and is the only country with a non-quadrilateral flag.' },
  'Netherlands': { code: 'NL', flagEmoji: '🇳🇱', continent: 'Europe', capital: 'Amsterdam', difficulty: 'normal', aliases: ['Holland', 'Kingdom of the Netherlands', 'Nederland'], funFact: 'Roughly 26% of the Netherlands lies below sea level and the country has more bicycles than residents.' },
  'New Zealand': { code: 'NZ', flagEmoji: '🇳🇿', continent: 'Oceania', capital: 'Wellington', difficulty: 'easy', aliases: ['Aotearoa', 'NZ'], funFact: 'New Zealand was the first nation to grant all women the right to vote in 1893 and has no native land mammals except bats.' },
  'Nicaragua': { code: 'NI', flagEmoji: '🇳🇮', continent: 'North America', capital: 'Managua', difficulty: 'normal', aliases: ['Republic of Nicaragua'], funFact: 'Lake Nicaragua is the largest freshwater lake in Central America and the only one to host oceanic bull sharks.' },
  'Niger': { code: 'NE', flagEmoji: '🇳🇪', continent: 'Africa', capital: 'Niamey', difficulty: 'normal', aliases: ['Republic of the Niger'], funFact: 'Niger is named after the Niger River and nicknamed the "Frying Pan of the World" for its hot desert climate.' },
  'Nigeria': { code: 'NG', flagEmoji: '🇳🇬', continent: 'Africa', capital: 'Abuja', difficulty: 'normal', aliases: ['Federal Republic of Nigeria'], funFact: 'Nigeria is Africa\'s most populous nation (over 220 million people) with more than 500 indigenous languages.' },
  'North Korea': { code: 'KP', flagEmoji: '🇰🇵', continent: 'Asia', capital: 'Pyongyang', difficulty: 'normal', aliases: ['DPRK', 'Democratic People’s Republic of Korea', 'Korea, North'], funFact: 'North Korea uses its own Juche calendar, counting years from 1912, the birth year of Kim Il Sung.' },
  'Macedonia': { name: 'North Macedonia', code: 'MK', flagEmoji: '🇲🇰', continent: 'Europe', capital: 'Skopje', difficulty: 'hard', aliases: ['North Macedonia', 'Macedonia', 'Republic of North Macedonia', 'FYROM'], funFact: 'Mother Teresa was born in Skopje in 1910 when it was part of the Ottoman Empire.' },
  'Norway': { code: 'NO', flagEmoji: '🇳🇴', continent: 'Europe', capital: 'Oslo', difficulty: 'easy', aliases: ['Kingdom of Norway', 'Norge'], funFact: 'Norway’s coastline of glacial fjords and islands exceeds 64,000 miles if all inlets are counted.' },
  'Oman': { code: 'OM', flagEmoji: '🇴🇲', continent: 'Asia', capital: 'Muscat', difficulty: 'normal', aliases: ['Sultanate of Oman'], funFact: 'Oman is the oldest continuously independent state in the Arab world, famous for frankincense.' },
  'Pakistan': { code: 'PK', flagEmoji: '🇵🇰', continent: 'Asia', capital: 'Islamabad', difficulty: 'normal', aliases: ['Islamic Republic of Pakistan'], funFact: 'Pakistan contains K2 and manufactures over 70% of all hand-stitched soccer balls worldwide in Sialkot.' },
  'Panama': { code: 'PA', flagEmoji: '🇵🇦', continent: 'North America', capital: 'Panama City', difficulty: 'easy', aliases: ['Republic of Panama'], funFact: 'Panama is the only place in the world where you can see the sun rise on the Pacific and set on the Atlantic from one spot.' },
  'Papua New Guinea': { code: 'PG', flagEmoji: '🇵🇬', continent: 'Oceania', capital: 'Port Moresby', difficulty: 'normal', aliases: ['PNG', 'Independent State of Papua New Guinea'], funFact: 'Papua New Guinea is the most linguistically diverse country on Earth, with over 840 living indigenous languages.' },
  'Paraguay': { code: 'PY', flagEmoji: '🇵🇾', continent: 'South America', capital: 'Asunción', difficulty: 'normal', aliases: ['Republic of Paraguay'], funFact: 'Paraguay is home to the Itaipu Dam, generating almost 100% of the country’s electricity with clean hydro power.' },
  'Peru': { code: 'PE', flagEmoji: '🇵🇪', continent: 'South America', capital: 'Lima', difficulty: 'normal', aliases: ['Republic of Peru'], funFact: 'Peru was the heart of the Inca Empire, home to Machu Picchu, and cultivates over 4,000 varieties of potatoes.' },
  'Philippines': { code: 'PH', flagEmoji: '🇵🇭', continent: 'Asia', capital: 'Manila', difficulty: 'easy', aliases: ['Republic of the Philippines', 'Pilipinas', 'PH'], funFact: 'The Philippines comprises 7,641 islands and is named after King Philip II of Spain.' },
  'Poland': { code: 'PL', flagEmoji: '🇵🇱', continent: 'Europe', capital: 'Warsaw', difficulty: 'normal', aliases: ['Republic of Poland', 'Polska'], funFact: 'Poland adopted the first written constitution in Europe (and second in the world after the US) on May 3, 1791.' },
  'Portugal': { code: 'PT', flagEmoji: '🇵🇹', continent: 'Europe', capital: 'Lisbon', difficulty: 'normal', aliases: ['Portuguese Republic'], funFact: 'Portugal produces over 50% of the world’s supply of natural wine cork from vast cork oak forests.' },
  'Qatar': { code: 'QA', flagEmoji: '🇶🇦', continent: 'Asia', capital: 'Doha', difficulty: 'hard', aliases: ['State of Qatar'], funFact: 'Qatar hosted the 2022 FIFA World Cup, the first held in the Arab world.' },
  'Romania': { code: 'RO', flagEmoji: '🇷🇴', continent: 'Europe', capital: 'Bucharest', difficulty: 'normal', aliases: ['România'], funFact: 'The Palace of the Parliament in Bucharest is the second largest administrative building in the world after the Pentagon.' },
  'Russia': { code: 'RU', flagEmoji: '🇷🇺', continent: 'Europe', capital: 'Moscow', difficulty: 'easy', aliases: ['Russian Federation', 'Russia', 'RF'], funFact: 'Russia is the largest country on Earth by land area, spanning 11 time zones and one-eighth of Earth\'s land.' },
  'Rwanda': { code: 'RW', flagEmoji: '🇷🇼', continent: 'Africa', capital: 'Kigali', difficulty: 'hard', aliases: ['Republic of Rwanda'], funFact: 'Known as the "Land of a Thousand Hills", Rwanda has the highest percentage of female parliamentarians in the world.' },
  'S. Sudan': { name: 'South Sudan', code: 'SS', flagEmoji: '🇸🇸', continent: 'Africa', capital: 'Juba', difficulty: 'hard', aliases: ['South Sudan', 'Republic of South Sudan'], funFact: 'South Sudan gained independence in July 2011, making it the most recently recognized sovereign nation in the world.' },
  'Saudi Arabia': { code: 'SA', flagEmoji: '🇸🇦', continent: 'Asia', capital: 'Riyadh', difficulty: 'easy', aliases: ['Kingdom of Saudi Arabia', 'KSA'], funFact: 'Saudi Arabia is the largest country in the world without any permanent flowing surface rivers.' },
  'Senegal': { code: 'SN', flagEmoji: '🇸🇳', continent: 'Africa', capital: 'Dakar', difficulty: 'normal', aliases: ['Republic of Senegal'], funFact: 'Lake Retba (Lac Rose) in Senegal is famous for pink waters caused by Dunaliella salina micro-algae.' },
  'Serbia': { code: 'RS', flagEmoji: '🇷🇸', continent: 'Europe', capital: 'Belgrade', difficulty: 'normal', aliases: ['Republic of Serbia', 'Srbija'], funFact: 'Eighteen Roman emperors were born on the territory of modern-day Serbia, including Constantine the Great.' },
  'Seychelles': { code: 'SC', flagEmoji: '🇸🇨', continent: 'Africa', capital: 'Victoria', difficulty: 'hard', aliases: ['Republic of Seychelles'], funFact: 'Seychelles is an archipelago of 115 islands in the Indian Ocean, home to giant Aldabra tortoises.' },
  'Sierra Leone': { code: 'SL', flagEmoji: '🇸🇱', continent: 'Africa', capital: 'Freetown', difficulty: 'hard', aliases: ['Republic of Sierra Leone'], funFact: 'Freetown was founded in 1792 as a settlement for freed enslaved African Americans and British loyalists.' },
  'Singapore': { code: 'SG', flagEmoji: '🇸🇬', continent: 'Asia', capital: 'Singapore', difficulty: 'hard', aliases: ['Republic of Singapore', 'Lion City'], funFact: 'Singapore is an island city-state and one of only three sovereign city-states in the world (with Monaco and Vatican City).' },
  'Slovakia': { code: 'SK', flagEmoji: '🇸🇰', continent: 'Europe', capital: 'Bratislava', difficulty: 'hard', aliases: ['Slovak Republic', 'Slovensko'], funFact: 'Slovakia has more castles per capita than almost any other country (over 180 castles).' },
  'Slovenia': { code: 'SI', flagEmoji: '🇸🇮', continent: 'Europe', capital: 'Ljubljana', difficulty: 'hard', aliases: ['Republic of Slovenia', 'Slovenija'], funFact: 'Over 60% of Slovenia is covered in lush forest, and Ljubljana was named European Green Capital.' },
  'Solomon Is.': { name: 'Solomon Islands', code: 'SB', flagEmoji: '🇸🇧', continent: 'Oceania', capital: 'Honiara', difficulty: 'hard', aliases: ['Solomon Islands'], funFact: 'Comprises hundreds of islands in the South Pacific, famous for WWII battle sites like Guadalcanal.' },
  'Somalia': { code: 'SO', flagEmoji: '🇸🇴', continent: 'Africa', capital: 'Mogadishu', difficulty: 'easy', aliases: ['Federal Republic of Somalia'], funFact: 'Somalia has the longest coastline in mainland Africa (over 1,880 miles) along the Horn of Africa.' },
  'South Africa': { code: 'ZA', flagEmoji: '🇿🇦', continent: 'Africa', capital: 'Pretoria', difficulty: 'easy', aliases: ['Republic of South Africa', 'RSA'], funFact: 'South Africa has three official capitals: Pretoria (Executive), Cape Town (Legislative), Bloemfontein (Judicial).' },
  'South Korea': { code: 'KR', flagEmoji: '🇰🇷', continent: 'Asia', capital: 'Seoul', difficulty: 'normal', aliases: ['Republic of Korea', 'ROK', 'Korea, South', 'Korea'], funFact: 'South Korea has the world’s fastest internet speeds and Seoul’s subway system spans over 700 miles.' },
  'Spain': { code: 'ES', flagEmoji: '🇪🇸', continent: 'Europe', capital: 'Madrid', difficulty: 'easy', aliases: ['Kingdom of Spain', 'España', 'ES'], funFact: 'Spain produces around 44% of the world’s entire supply of olive oil, more than double Italy’s production.' },
  'Sri Lanka': { code: 'LK', flagEmoji: '🇱🇰', continent: 'Asia', capital: 'Colombo', difficulty: 'easy', aliases: ['Democratic Socialist Republic of Sri Lanka', 'Ceylon'], funFact: 'Known as the "Pearl of the Indian Ocean", Sri Lanka is the historic home of true cinnamon and Ceylon tea.' },
  'Sudan': { code: 'SD', flagEmoji: '🇸🇩', continent: 'Africa', capital: 'Khartoum', difficulty: 'normal', aliases: ['Republic of the Sudan'], funFact: 'Sudan has more than 200 ancient pyramids in Meroë, over twice as many as Egypt.' },
  'Suriname': { code: 'SR', flagEmoji: '🇸🇷', continent: 'South America', capital: 'Paramaribo', difficulty: 'hard', aliases: ['Republic of Suriname', 'Dutch Guiana'], funFact: 'Suriname is the only Dutch-speaking sovereign nation in South America and has ~93% forest cover.' },
  'Sweden': { code: 'SE', flagEmoji: '🇸🇪', continent: 'Europe', capital: 'Stockholm', difficulty: 'easy', aliases: ['Kingdom of Sweden', 'Sverige'], funFact: 'Sweden has an estimated 267,570 islands, more islands than any other country on Earth.' },
  'Switzerland': { code: 'CH', flagEmoji: '🇨🇭', continent: 'Europe', capital: 'Bern', difficulty: 'normal', aliases: ['Swiss Confederation', 'Schweiz', 'Suisse'], funFact: 'Switzerland has four official languages (German, French, Italian, Romansh) and has maintained armed neutrality since 1815.' },
  'Syria': { code: 'SY', flagEmoji: '🇸🇾', continent: 'Asia', capital: 'Damascus', difficulty: 'normal', aliases: ['Syrian Arab Republic'], funFact: 'Damascus is widely considered one of the oldest continuously inhabited cities in the world, settled 11,000 years ago.' },
  'Taiwan': { code: 'TW', flagEmoji: '🇹🇼', continent: 'Asia', capital: 'Taipei', difficulty: 'normal', aliases: ['Republic of China', 'ROC'], funFact: 'Taiwan manufactures over 60% of the world’s advanced semiconductor computer chips.' },
  'Tajikistan': { code: 'TJ', flagEmoji: '🇹🇯', continent: 'Asia', capital: 'Dushanbe', difficulty: 'hard', aliases: ['Republic of Tajikistan'], funFact: 'Over 90% of Tajikistan is covered by high mountains of the Pamir and Alay ranges ("Roof of the World").' },
  'Tanzania': { code: 'TZ', flagEmoji: '🇹🇿', continent: 'Africa', capital: 'Dodoma', difficulty: 'normal', aliases: ['United Republic of Tanzania'], funFact: 'Home to Mount Kilimanjaro (highest free-standing mountain in the world) and the Serengeti National Park.' },
  'Thailand': { code: 'TH', flagEmoji: '🇹🇭', continent: 'Asia', capital: 'Bangkok', difficulty: 'normal', aliases: ['Kingdom of Thailand', 'Siam'], funFact: 'Thailand is the only Southeast Asian country that was never colonized by any European empire.' },
  'Timor-Leste': { code: 'TL', flagEmoji: '🇹🇱', continent: 'Asia', capital: 'Dili', difficulty: 'hard', aliases: ['East Timor', 'Democratic Republic of Timor-Leste'], funFact: 'Timor-Leste gained independence in 2002, becoming the first new sovereign nation of the 21st century.' },
  'Togo': { code: 'TG', flagEmoji: '🇹🇬', continent: 'Africa', capital: 'Lomé', difficulty: 'hard', aliases: ['Togolese Republic'], funFact: 'Togo is one of the narrowest countries in the world, measuring just 32 miles wide at its southern Atlantic coast.' },
  'Trinidad and Tobago': { code: 'TT', flagEmoji: '🇹🇹', continent: 'North America', capital: 'Port of Spain', difficulty: 'hard', aliases: ['Trinidad & Tobago'], funFact: 'Trinidad and Tobago is the birthplace of steelpan drums, calypso, and the limbo dance.' },
  'Tunisia': { code: 'TN', flagEmoji: '🇹🇳', continent: 'Africa', capital: 'Tunis', difficulty: 'normal', aliases: ['Republic of Tunisia'], funFact: 'Tunisia was the site of ancient Carthage and the filming location for Luke Skywalker’s home on Tatooine.' },
  'Turkey': { code: 'TR', flagEmoji: '🇹🇷', continent: 'Asia', capital: 'Ankara', difficulty: 'easy', aliases: ['Republic of Türkiye', 'Turkiye', 'Turkey'], funFact: 'Istanbul is the only metropolis in the world located across two continents: Europe and Asia.' },
  'Turkmenistan': { code: 'TM', flagEmoji: '🇹🇲', continent: 'Asia', capital: 'Ashgabat', difficulty: 'hard', aliases: [], funFact: 'Home to the "Gates of Hell" (Darvaza gas crater), burning continuously in the desert since 1971.' },
  'Uganda': { code: 'UG', flagEmoji: '🇺🇬', continent: 'Africa', capital: 'Kampala', difficulty: 'normal', aliases: ['Republic of Uganda'], funFact: 'Winston Churchill dubbed Uganda the "Pearl of Africa" in 1908 for its magnificent wildlife and landscapes.' },
  'Ukraine': { code: 'UA', flagEmoji: '🇺🇦', continent: 'Europe', capital: 'Kyiv', difficulty: 'normal', aliases: ['Ukrayina'], funFact: 'Ukraine is the largest country located entirely within the European continent.' },
  'United Arab Emirates': { code: 'AE', flagEmoji: '🇦🇪', continent: 'Asia', capital: 'Abu Dhabi', difficulty: 'normal', aliases: ['UAE', 'Emirates'], funFact: 'The UAE is home to Burj Khalifa in Dubai, the tallest building in world history at 2,717 feet.' },
  'United Kingdom': { code: 'GB', flagEmoji: '🇬🇧', continent: 'Europe', capital: 'London', difficulty: 'easy', aliases: ['UK', 'Britain', 'Great Britain', 'England', 'United Kingdom of Great Britain and Northern Ireland'], funFact: 'Nowhere in the United Kingdom is more than 75 miles from the sea.' },
  'United States of America': { name: 'United States', code: 'US', flagEmoji: '🇺🇸', continent: 'North America', capital: 'Washington, D.C.', difficulty: 'easy', aliases: ['USA', 'United States', 'US', 'America', 'United States of America'], funFact: 'The United States has the world’s largest national economy and put the first humans on the Moon.' },
  'Uruguay': { code: 'UY', flagEmoji: '🇺🇾', continent: 'South America', capital: 'Montevideo', difficulty: 'normal', aliases: ['Oriental Republic of Uruguay'], funFact: 'Uruguay hosted and won the very first FIFA World Cup tournament in 1930.' },
  'Uzbekistan': { code: 'UZ', flagEmoji: '🇺🇿', continent: 'Asia', capital: 'Tashkent', difficulty: 'normal', aliases: ['Republic of Uzbekistan'], funFact: 'Uzbekistan is one of only two "doubly landlocked" countries in the world (along with Liechtenstein).' },
  'Vanuatu': { code: 'VU', flagEmoji: '🇻🇺', continent: 'Oceania', capital: 'Port Vila', difficulty: 'hard', aliases: ['Republic of Vanuatu'], funFact: 'Vanuatu is the birthplace of modern bungee jumping, inspired by the ancient ritual of "land diving" (Naghol).' },
  'Venezuela': { code: 'VE', flagEmoji: '🇻🇪', continent: 'South America', capital: 'Caracas', difficulty: 'normal', aliases: ['Bolivarian Republic of Venezuela'], funFact: 'Venezuela is home to Angel Falls, the world’s highest uninterrupted waterfall at 3,212 feet tall.' },
  'Vietnam': { code: 'VN', flagEmoji: '🇻🇳', continent: 'Asia', capital: 'Hanoi', difficulty: 'easy', aliases: ['Socialist Republic of Vietnam', 'Viet Nam'], funFact: 'Vietnam has a distinctive "S" shape and contains Son Doong, the largest cave passage in the world.' },
  'Yemen': { code: 'YE', flagEmoji: '🇾🇪', continent: 'Asia', capital: 'Sana\'a', difficulty: 'normal', aliases: ['Republic of Yemen'], funFact: 'Shibam in Yemen is called the "Manhattan of the Desert" for its 500-year-old mudbrick high-rise tower buildings.' },
  'Zambia': { code: 'ZM', flagEmoji: '🇿🇲', continent: 'Africa', capital: 'Lusaka', difficulty: 'normal', aliases: ['Republic of Zambia'], funFact: 'Zambia shares Victoria Falls with Zimbabwe, the largest curtain of falling water in the world.' },
  'Zimbabwe': { code: 'ZW', flagEmoji: '🇿🇼', continent: 'Africa', capital: 'Harare', difficulty: 'normal', aliases: ['Republic of Zimbabwe', 'Rhodesia'], funFact: 'Zimbabwe is named after the ancient stone ruins of Great Zimbabwe, built between the 11th and 15th centuries.' }
};

// Helper: simplify SVG path coordinate decimals
function cleanSvgPath(pathStr) {
  if (!pathStr) return '';
  return pathStr.replace(/(\d+\.\d{2})\d+/g, '$1');
}

// 3. GENERATE US STATES
console.log('Generating US States dataset...');
const usData = JSON.parse(fs.readFileSync(path.join(__dirname, '../node_modules/us-atlas/states-10m.json'), 'utf8'));
const usFeatures = topojson.feature(usData, usData.objects.states).features;

const statesList = [];

for (const [stateName, meta] of Object.entries(US_STATE_METADATA)) {
  const feat = usFeatures.find(f => f.properties.name === stateName);
  if (!feat) {
    console.warn(`Could not find feature for state: ${stateName}`);
    continue;
  }

  // Project individual state geometry centered and fitted to 500x500 box with 40px margins
  const projection = d3Geo.geoMercator().fitExtent([[40, 40], [460, 460]], feat);
  const pathGenerator = d3Geo.geoPath(projection);
  const rawPath = pathGenerator(feat);
  const svgPath = cleanSvgPath(rawPath);

  const id = stateName.toLowerCase().replace(/[^a-z0-9]/g, '');

  statesList.push({
    id,
    name: stateName,
    type: 'state',
    country: 'United States',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    abbreviation: meta.abbreviation,
    capital: meta.capital,
    region: meta.region,
    difficulty: meta.difficulty,
    aliases: [meta.abbreviation, stateName, ...(meta.aliases || [])],
    funFact: meta.funFact,
    viewBox: '0 0 500 500',
    svgPath
  });
}

console.log(`Generated ${statesList.length} US States.`);

// 4. GENERATE WORLD COUNTRIES
console.log('Generating World Countries dataset...');
const worldData = JSON.parse(fs.readFileSync(path.join(__dirname, '../node_modules/world-atlas/countries-110m.json'), 'utf8'));
const world50mData = JSON.parse(fs.readFileSync(path.join(__dirname, '../node_modules/world-atlas/countries-50m.json'), 'utf8'));

const world110Features = topojson.feature(worldData, worldData.objects.countries).features;
const world50Features = topojson.feature(world50mData, world50mData.objects.countries).features;

const countriesList = [];

for (const [atlasName, meta] of Object.entries(COUNTRY_INFO)) {
  // Find feature in 110m, or fallback to 50m
  let feat = world110Features.find(f => f.properties && f.properties.name === atlasName);
  if (!feat) {
    feat = world50Features.find(f => f.properties && f.properties.name === atlasName);
  }

  if (!feat) {
    // Try matching by canonical name
    const canonicalName = meta.name || atlasName;
    feat = world110Features.find(f => f.properties && f.properties.name === canonicalName) ||
           world50Features.find(f => f.properties && f.properties.name === canonicalName);
  }

  if (!feat) {
    console.warn(`Could not find feature for country: ${atlasName}`);
    continue;
  }

  const countryDisplayName = meta.name || atlasName;
  const id = countryDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Project country geometry centered and fitted to 500x500 box
  const projection = d3Geo.geoMercator().fitExtent([[40, 40], [460, 460]], feat);
  const pathGenerator = d3Geo.geoPath(projection);
  const rawPath = pathGenerator(feat);
  const svgPath = cleanSvgPath(rawPath);

  const aliases = [countryDisplayName, atlasName, meta.code, ...(meta.aliases || [])];
  const uniqueAliases = [...new Set(aliases.filter(Boolean))];

  countriesList.push({
    id,
    name: countryDisplayName,
    type: 'country',
    code: meta.code,
    flagEmoji: meta.flagEmoji,
    continent: meta.continent,
    capital: meta.capital,
    difficulty: meta.difficulty || 'normal',
    aliases: uniqueAliases,
    funFact: meta.funFact,
    viewBox: '0 0 500 500',
    svgPath
  });
}

console.log(`Generated ${countriesList.length} World Countries.`);

// Sort alphabetically by name
statesList.sort((a, b) => a.name.localeCompare(b.name));
countriesList.sort((a, b) => a.name.localeCompare(b.name));

// Write to src/data/states.js and src/data/countries.js
const outputDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'states.js'),
  `// Auto-generated real geographic US State shapes from US Census / TopoJSON\nexport const USA_STATES = ${JSON.stringify(statesList, null, 2)};\nexport default USA_STATES;\n`,
  'utf8'
);

fs.writeFileSync(
  path.join(outputDir, 'countries.js'),
  `// Auto-generated real geographic World Country shapes from Natural Earth / TopoJSON\nexport const WORLD_COUNTRIES = ${JSON.stringify(countriesList, null, 2)};\nexport default WORLD_COUNTRIES;\n`,
  'utf8'
);

console.log('Successfully written data files to src/data/states.js and src/data/countries.js!');
