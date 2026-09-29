// ═══════════════════════════════════════
// ALPHABET
// ═══════════════════════════════════════
const AL=[
 {id:0, iso:'ا',ini:'ا', med:'ـا',fin:'ـا',name:'Alef', tr:'â/a',ipa:'/ɒː/',snd:'like "a" in father',conn:false,isp:false,ex:{w:'آب',t:'âb',m:'water'}},
 {id:1, iso:'ب',ini:'بـ',med:'ـبـ',fin:'ـب',name:'Be',  tr:'b',  ipa:'/b/', snd:'like "b" in boy',  conn:true,isp:false,ex:{w:'باد',t:'bâd',m:'wind'}},
 {id:2, iso:'پ',ini:'پـ',med:'ـپـ',fin:'ـپ',name:'Pe',  tr:'p',  ipa:'/p/', snd:'like "p" in pan',  conn:true,isp:true, ex:{w:'پدر',t:'pedar',m:'father'}},
 {id:3, iso:'ت',ini:'تـ',med:'ـتـ',fin:'ـت',name:'Te',  tr:'t',  ipa:'/t/', snd:'like "t" in top',  conn:true,isp:false,ex:{w:'تاج',t:'tâj',m:'crown'}},
 {id:4, iso:'ث',ini:'ثـ',med:'ـثـ',fin:'ـث',name:'Se',  tr:'s',  ipa:'/s/', snd:'like "s" in sun',  conn:true,isp:false,ex:{w:'ثروت',t:'servat',m:'wealth'}},
 {id:5, iso:'ج',ini:'جـ',med:'ـجـ',fin:'ـج',name:'Jim', tr:'j',  ipa:'/dʒ/',snd:'like "j" in jar',  conn:true,isp:false,ex:{w:'جنگل',t:'jangal',m:'forest'}},
 {id:6, iso:'چ',ini:'چـ',med:'ـچـ',fin:'ـچ',name:'Che', tr:'ch', ipa:'/tʃ/',snd:'like "ch" in chair',conn:true,isp:true, ex:{w:'چای',t:'châi',m:'tea'}},
 {id:7, iso:'ح',ini:'حـ',med:'ـحـ',fin:'ـح',name:'He',  tr:'h',  ipa:'/h/', snd:'aspirated "h"',     conn:true,isp:false,ex:{w:'حرف',t:'harf',m:'letter'}},
 {id:8, iso:'خ',ini:'خـ',med:'ـخـ',fin:'ـخ',name:'Khe', tr:'kh', ipa:'/x/', snd:'like "ch" in loch', conn:true,isp:false,ex:{w:'خانه',t:'khâne',m:'house'}},
 {id:9, iso:'د',ini:'د', med:'ـد',fin:'ـد',name:'Dal',  tr:'d',  ipa:'/d/', snd:'like "d" in door',  conn:false,isp:false,ex:{w:'دست',t:'dast',m:'hand'}},
 {id:10,iso:'ذ',ini:'ذ', med:'ـذ',fin:'ـذ',name:'Zal',  tr:'z',  ipa:'/z/', snd:'like "z" in zoo',   conn:false,isp:false,ex:{w:'ذهن',t:'zehn',m:'mind'}},
 {id:11,iso:'ر',ini:'ر', med:'ـر',fin:'ـر',name:'Re',   tr:'r',  ipa:'/r/', snd:'rolled "r"',         conn:false,isp:false,ex:{w:'رنگ',t:'rang',m:'color'}},
 {id:12,iso:'ز',ini:'ز', med:'ـز',fin:'ـز',name:'Ze',   tr:'z',  ipa:'/z/', snd:'like "z" in zero',  conn:false,isp:false,ex:{w:'زبان',t:'zabân',m:'language'}},
 {id:13,iso:'ژ',ini:'ژ', med:'ـژ',fin:'ـژ',name:'Zhe',  tr:'zh', ipa:'/ʒ/', snd:'like "s" in measure',conn:false,isp:true,ex:{w:'ژاپن',t:'zhâpon',m:'Japan'}},
 {id:14,iso:'س',ini:'سـ',med:'ـسـ',fin:'ـس',name:'Sin', tr:'s',  ipa:'/s/', snd:'like "s" in sun',   conn:true,isp:false,ex:{w:'سبز',t:'sabz',m:'green'}},
 {id:15,iso:'ش',ini:'شـ',med:'ـشـ',fin:'ـش',name:'Shin',tr:'sh', ipa:'/ʃ/', snd:'like "sh" in shop', conn:true,isp:false,ex:{w:'شب',t:'shab',m:'night'}},
 {id:16,iso:'ص',ini:'صـ',med:'ـصـ',fin:'ـص',name:'Sad', tr:'s',  ipa:'/sˤ/',snd:'emphatic "s"',       conn:true,isp:false,ex:{w:'صبح',t:'sobh',m:'morning'}},
 {id:17,iso:'ض',ini:'ضـ',med:'ـضـ',fin:'ـض',name:'Zad', tr:'z',  ipa:'/zˤ/',snd:'emphatic "z"',       conn:true,isp:false,ex:{w:'ضعیف',t:'zaif',m:'weak'}},
 {id:18,iso:'ط',ini:'طـ',med:'ـطـ',fin:'ـط',name:'Ta',  tr:'t',  ipa:'/tˤ/',snd:'emphatic "t"',       conn:true,isp:false,ex:{w:'طلا',t:'talâ',m:'gold'}},
 {id:19,iso:'ظ',ini:'ظـ',med:'ـظـ',fin:'ـظ',name:'Za',  tr:'z',  ipa:'/zˤ/',snd:'emphatic "z"',       conn:true,isp:false,ex:{w:'ظرف',t:'zarf',m:'container'}},
 {id:20,iso:'ع',ini:'عـ',med:'ـعـ',fin:'ـع',name:'Eyn', tr:"'",  ipa:'/ʔ/', snd:'glottal stop',       conn:true,isp:false,ex:{w:'عشق',t:'eshq',m:'love'}},
 {id:21,iso:'غ',ini:'غـ',med:'ـغـ',fin:'ـغ',name:'Gheyn',tr:'gh',ipa:'/ɣ/',snd:'gargling "r"',        conn:true,isp:false,ex:{w:'غروب',t:'ghorub',m:'sunset'}},
 {id:22,iso:'ف',ini:'فـ',med:'ـفـ',fin:'ـف',name:'Fe',  tr:'f',  ipa:'/f/', snd:'like "f" in fan',    conn:true,isp:false,ex:{w:'فارسی',t:'fârsi',m:'Persian'}},
 {id:23,iso:'ق',ini:'قـ',med:'ـقـ',fin:'ـق',name:'Qaf', tr:'q',  ipa:'/q/', snd:'deep throat sound',  conn:true,isp:false,ex:{w:'قلب',t:'qalb',m:'heart'}},
 {id:24,iso:'ک',ini:'کـ',med:'ـکـ',fin:'ـک',name:'Kaf', tr:'k',  ipa:'/k/', snd:'like "k" in key',    conn:true,isp:false,ex:{w:'کتاب',t:'ketâb',m:'book'}},
 {id:25,iso:'گ',ini:'گـ',med:'ـگـ',fin:'ـگ',name:'Gaf', tr:'g',  ipa:'/ɡ/', snd:'like "g" in garden', conn:true,isp:true, ex:{w:'گل',t:'gol',m:'flower'}},
 {id:26,iso:'ل',ini:'لـ',med:'ـلـ',fin:'ـل',name:'Lam', tr:'l',  ipa:'/l/', snd:'like "l" in love',   conn:true,isp:false,ex:{w:'لاله',t:'lâle',m:'tulip'}},
 {id:27,iso:'م',ini:'مـ',med:'ـمـ',fin:'ـم',name:'Mim', tr:'m',  ipa:'/m/', snd:'like "m" in moon',   conn:true,isp:false,ex:{w:'ماه',t:'mâh',m:'moon'}},
 {id:28,iso:'ن',ini:'نـ',med:'ـنـ',fin:'ـن',name:'Nun', tr:'n',  ipa:'/n/', snd:'like "n" in night',  conn:true,isp:false,ex:{w:'نور',t:'nur',m:'light'}},
 {id:29,iso:'و',ini:'و', med:'ـو',fin:'ـو',name:'Vav',  tr:'v/u',ipa:'/v~uː/',snd:'like "v" or "oo"',conn:false,isp:false,ex:{w:'ورزش',t:'varzesh',m:'sport'}},
 {id:30,iso:'ه',ini:'هـ',med:'ـهـ',fin:'ـه',name:'He',  tr:'h',  ipa:'/h/', snd:'like "h" in hat',    conn:true,isp:false,ex:{w:'هوا',t:'havâ',m:'air'}},
 {id:31,iso:'ی',ini:'یـ',med:'ـیـ',fin:'ـی',name:'Ye',  tr:'y/i',ipa:'/j~iː/',snd:'like "y" or "ee"',conn:true,isp:false,ex:{w:'یاد',t:'yâd',m:'memory'}},
];

// ═══════════════════════════════════════
// WAYPOINTS
// Coords normalised 0-1 on the canvas (sz=360, letter at sz*0.62 Amiri, centred sz/2,sz/2)
// W(x,y) = body point   D(x,y) = dot point (larger hit radius)
// Groups within each letter: first group = main body strokes, subsequent = dots/marks
// All waypoints are loaded flat — user draws entire letter then presses Check once.
// ═══════════════════════════════════════
const W=(x,y)=>({x,y,d:false});
const D=(x,y)=>({x,y,d:true});

const WP=[
// 0 ا Alef
[[W(0.498,0.205),W(0.501,0.386),W(0.517,0.573)]],
// 1 ب Be
[[W(0.732,0.383),W(0.732,0.515),W(0.501,0.568),W(0.289,0.533),W(0.267,0.437)],[D(0.520,0.718)]],
// 2 پ Pe
[[W(0.726,0.383),W(0.692,0.524),W(0.495,0.571),W(0.298,0.527),W(0.279,0.405)],[D(0.548,0.668)],[D(0.476,0.671)],[D(0.532,0.749)]],
// 3 ت Te
[[W(0.717,0.380),W(0.711,0.508),W(0.495,0.568),W(0.298,0.533),W(0.276,0.418)],[D(0.532,0.296)],[D(0.467,0.321)]],
// 4 ث Se
[[W(0.717,0.387),W(0.729,0.508),W(0.501,0.571),W(0.298,0.533),W(0.267,0.405)],[D(0.486,0.230)],[D(0.539,0.321)],[D(0.464,0.327)]],
// 5 ج Jim
[[W(0.367,0.458),W(0.673,0.458),W(0.432,0.552),W(0.345,0.755),W(0.457,0.871),W(0.682,0.877)],[D(0.539,0.680)]],
// 6 چ Che
[[W(0.370,0.471),W(0.657,0.452),W(0.420,0.558),W(0.348,0.768),W(0.470,0.868),W(0.648,0.890)],[D(0.489,0.658)],[D(0.573,0.630)],[D(0.551,0.746)]],
// 7 ح He
[[W(0.376,0.446),W(0.657,0.455),W(0.395,0.580),W(0.357,0.796),W(0.517,0.883),W(0.682,0.883)]],
// 8 خ Khe
[[W(0.370,0.468),W(0.636,0.474),W(0.404,0.577),W(0.361,0.780),W(0.520,0.862),W(0.711,0.865)],[D(0.517,0.315)]],
// 9 د Dal
[[W(0.482,0.380),W(0.611,0.530),W(0.432,0.565)]],
// 10 ذ Zal
[[W(0.495,0.377),W(0.607,0.527),W(0.445,0.571)],[D(0.486,0.227)]],
// 11 ر Re
[[W(0.536,0.443),W(0.573,0.580),W(0.501,0.693),W(0.345,0.702)]],
// 12 ز Ze
[[W(0.539,0.446),W(0.579,0.574),W(0.498,0.683),W(0.364,0.696)],[D(0.482,0.258)]],
// 13 ژ Zhe
[[W(0.539,0.446),W(0.576,0.590),W(0.479,0.693),W(0.339,0.699)],[D(0.479,0.224)],[D(0.529,0.287)],[D(0.457,0.302)]],
// 14 س Sin
[[W(0.748,0.374),W(0.732,0.471),W(0.676,0.383),W(0.607,0.505),W(0.554,0.452),W(0.551,0.612),W(0.395,0.708),W(0.248,0.637),W(0.270,0.493)]],
// 15 ش Shin
[[W(0.761,0.371),W(0.711,0.480),W(0.679,0.387),W(0.601,0.493),W(0.542,0.452),W(0.542,0.637),W(0.317,0.683),W(0.261,0.496)],[D(0.645,0.183)],[D(0.620,0.268)],[D(0.704,0.258)]],
// 16 ص Sad
[[W(0.601,0.458),W(0.770,0.355),W(0.826,0.446),W(0.664,0.515),W(0.492,0.471),W(0.473,0.633),W(0.298,0.727),W(0.176,0.640),W(0.220,0.458)]],
// 17 ض Zad
[[W(0.601,0.458),W(0.776,0.349),W(0.820,0.455),W(0.670,0.521),W(0.482,0.458),W(0.432,0.665),W(0.204,0.683),W(0.204,0.480)],[D(0.632,0.230)]],
// 18 ط Ta
[[W(0.451,0.158),W(0.470,0.487),W(0.632,0.408),W(0.695,0.496),W(0.498,0.565),W(0.332,0.568)]],
// 19 ظ Za
[[W(0.454,0.171),W(0.457,0.521),W(0.601,0.427),W(0.704,0.477),W(0.557,0.562),W(0.342,0.596)],[D(0.620,0.268)]],
// 20 ع Eyn
[[W(0.507,0.318),W(0.407,0.446),W(0.607,0.424),W(0.420,0.565),W(0.395,0.768),W(0.523,0.846),W(0.701,0.846)]],
// 21 غ Gheyn
[[W(0.520,0.320),W(0.404,0.423),W(0.611,0.414),W(0.414,0.548),W(0.382,0.761),W(0.529,0.855),W(0.723,0.842)],[D(0.457,0.195)]],
// 22 ف Fe
[[W(0.723,0.361),W(0.664,0.408),W(0.645,0.333),W(0.695,0.298),W(0.770,0.445),W(0.582,0.548),W(0.332,0.573),W(0.239,0.436)],[D(0.589,0.170)]],
// 23 ق Qaf
[[W(0.636,0.442),W(0.551,0.483),W(0.586,0.352),W(0.676,0.533),W(0.545,0.655),W(0.357,0.633),W(0.386,0.417)],[D(0.623,0.223)],[D(0.539,0.264)]],
// 24 ک Kaf
[[W(0.817,0.142),W(0.486,0.323),W(0.632,0.486),W(0.464,0.598),W(0.207,0.589),W(0.192,0.427)]],
// 25 گ Gaf
[[W(0.814,0.142),W(0.501,0.311),W(0.636,0.508),W(0.414,0.602),W(0.176,0.573),W(0.182,0.445),W(0.820,0.061),W(0.545,0.158)]],
// 26 ل Lam
[[W(0.611,0.139),W(0.629,0.536),W(0.461,0.617),W(0.357,0.536),W(0.392,0.408)]],
// 27 م Mim
[[W(0.436,0.517),W(0.479,0.398),W(0.604,0.498),W(0.407,0.561),W(0.473,0.911)]],
// 28 ن Nun
[[W(0.592,0.327),W(0.632,0.548),W(0.470,0.611),W(0.357,0.548),W(0.386,0.417)],[D(0.495,0.227)]],
// 29 و Vav
[[W(0.557,0.492),W(0.486,0.536),W(0.520,0.402),W(0.576,0.573),W(0.492,0.689),W(0.342,0.714)]],
// 30 ه He
[[W(0.561,0.536),W(0.445,0.567),W(0.473,0.408),W(0.561,0.498)]],
// 31 ی Ye
[[W(0.689,0.377),W(0.529,0.467),W(0.654,0.561),W(0.595,0.667),W(0.364,0.686),W(0.311,0.567),W(0.370,0.439)]],
];

// ═══════════════════════════════════════
// FORM WAYPOINTS  (ini/med/fin — null entries fall back to ISO form)
// ═══════════════════════════════════════
const WP_INI=[
  null,
  /* 1 ب */ [[W(0.557,0.454),W(0.561,0.545),W(0.386,0.564)],[D(0.557,0.692)]],
  /* 2 پ */ [[W(0.557,0.448),W(0.567,0.545),W(0.479,0.567),W(0.404,0.564)],[D(0.604,0.682)],[D(0.520,0.704)],[D(0.576,0.786)]],
  /* 3 ت */ [[W(0.563,0.426),W(0.566,0.569),W(0.369,0.576)],[D(0.597,0.329)],[D(0.500,0.341)]],
  /* 4 ث */ [[W(0.561,0.464),W(0.554,0.564),W(0.395,0.579)],[D(0.532,0.267)],[D(0.582,0.342)],[D(0.517,0.348)]],
  /* 5 ج */ [[W(0.392,0.423),W(0.679,0.476),W(0.514,0.504),W(0.357,0.554),W(0.242,0.554)],[D(0.545,0.654)]],
  /* 6 چ */ [[W(0.379,0.432),W(0.686,0.486),W(0.486,0.523),W(0.364,0.564),W(0.236,0.557)],[D(0.579,0.639)],[D(0.507,0.664)],[D(0.545,0.729)]],
  /* 7 ح */ [[W(0.392,0.429),W(0.673,0.479),W(0.529,0.514),W(0.370,0.570),W(0.236,0.567)]],
  /* 8 خ */ [[W(0.398,0.423),W(0.689,0.467),W(0.511,0.517),W(0.373,0.561),W(0.254,0.567)],[D(0.526,0.295)]],
  null,null,null,null,null,
  /* 14 س */ [[W(0.682,0.429),W(0.661,0.520),W(0.592,0.467),W(0.532,0.542),W(0.461,0.495),W(0.382,0.561),W(0.270,0.570)]],
  /* 15 ش */ [[W(0.686,0.429),W(0.632,0.520),W(0.595,0.457),W(0.498,0.567),W(0.467,0.486),W(0.386,0.554),W(0.273,0.554)],[D(0.564,0.229)],[D(0.617,0.311)],[D(0.532,0.326)]],
  /* 16 ص */ [[W(0.442,0.617),W(0.542,0.489),W(0.673,0.432),W(0.707,0.517),W(0.576,0.579),W(0.417,0.504),W(0.342,0.554),W(0.220,0.561)]],
  /* 17 ض */ [[W(0.448,0.629),W(0.545,0.492),W(0.692,0.439),W(0.695,0.554),W(0.511,0.576),W(0.398,0.504),W(0.345,0.554),W(0.223,0.561)],[D(0.532,0.311)]],
  /* 18 ط */ [[W(0.464,0.182),W(0.457,0.529),W(0.589,0.426),W(0.673,0.486),W(0.445,0.567),W(0.276,0.564)]],
  /* 19 ظ */ [[W(0.470,0.182),W(0.442,0.554),W(0.582,0.417),W(0.682,0.473),W(0.554,0.548),W(0.370,0.557),W(0.264,0.561)],[D(0.617,0.286)]],
  /* 20 ع */ [[W(0.595,0.373),W(0.482,0.367),W(0.473,0.492),W(0.642,0.467),W(0.436,0.564),W(0.295,0.557)]],
  /* 21 غ */ [[W(0.614,0.382),W(0.504,0.361),W(0.442,0.476),W(0.642,0.470),W(0.407,0.567),W(0.279,0.576)],[D(0.501,0.261)]],
  /* 22 ف */ [[W(0.582,0.417),W(0.501,0.479),W(0.514,0.361),W(0.598,0.492),W(0.470,0.573),W(0.323,0.573)],[D(0.511,0.239)]],
  /* 23 ق */ [[W(0.579,0.429),W(0.520,0.492),W(0.514,0.361),W(0.601,0.495),W(0.479,0.579),W(0.354,0.564)],[D(0.570,0.220)],[D(0.501,0.245)]],
  /* 24 ک */ [[W(0.707,0.151),W(0.382,0.304),W(0.532,0.501),W(0.348,0.573),W(0.232,0.570)]],
  /* 25 گ */ [[W(0.704,0.154),W(0.395,0.298),W(0.536,0.504),W(0.376,0.579),W(0.245,0.576),W(0.707,0.054),W(0.470,0.164)]],
  /* 26 ل */ [[W(0.536,0.170),W(0.567,0.542),W(0.504,0.567),W(0.386,0.554)]],
  /* 27 م */ [[W(0.529,0.479),W(0.595,0.520),W(0.582,0.395),W(0.439,0.557),W(0.317,0.567)]],
  /* 28 ن */ [[W(0.564,0.448),W(0.576,0.548),W(0.495,0.554),W(0.392,0.557)],[D(0.557,0.317)]],
  null,
  /* 30 ه */ [[W(0.542,0.354),W(0.654,0.504),W(0.514,0.507),W(0.461,0.442),W(0.536,0.436),W(0.467,0.542),W(0.404,0.570),W(0.289,0.557)]],
  /* 31 ی */ [[W(0.579,0.479),W(0.561,0.557),W(0.495,0.567),W(0.382,0.567)],[D(0.604,0.689)],[D(0.529,0.707)]]
];

const WP_MED=[
  null,
  /* 1 ب */ [[W(0.670,0.573),W(0.545,0.554),W(0.504,0.504),W(0.432,0.567),W(0.336,0.570)],[D(0.507,0.686)]],
  /* 2 پ */ [[W(0.692,0.570),W(0.545,0.564),W(0.517,0.511),W(0.439,0.557),W(0.317,0.554)],[D(0.548,0.676)],[D(0.482,0.676)],[D(0.526,0.742)]],
  /* 3 ت */ [[W(0.700,0.582),W(0.559,0.576),W(0.522,0.516),W(0.438,0.569),W(0.300,0.569)],[D(0.528,0.357)],[D(0.459,0.360)]],
  /* 4 ث */ [[W(0.689,0.564),W(0.554,0.561),W(0.517,0.511),W(0.423,0.567),W(0.307,0.561)],[D(0.467,0.279)],[D(0.529,0.354)],[D(0.454,0.367)]],
  /* 5 ج */ [[W(0.804,0.564),W(0.604,0.567),W(0.401,0.426),W(0.645,0.467),W(0.448,0.501),W(0.314,0.561),W(0.217,0.567)],[D(0.495,0.648)]],
  /* 6 چ */ [[W(0.814,0.554),W(0.623,0.564),W(0.595,0.479),W(0.361,0.417),W(0.667,0.473),W(0.445,0.517),W(0.326,0.561),W(0.211,0.567)],[D(0.467,0.667)],[D(0.529,0.645)],[D(0.507,0.742)]],
  /* 7 ح */ [[W(0.795,0.564),W(0.604,0.573),W(0.582,0.467),W(0.345,0.429),W(0.664,0.476),W(0.473,0.511),W(0.320,0.573),W(0.198,0.567)]],
  /* 8 خ */ [[W(0.801,0.557),W(0.611,0.567),W(0.579,0.467),W(0.348,0.429),W(0.670,0.470),W(0.454,0.511),W(0.311,0.570),W(0.198,0.576)],[D(0.517,0.304)]],
  null,null,null,null,null,
  /* 14 س */ [[W(0.789,0.557),W(0.654,0.557),W(0.604,0.492),W(0.564,0.570),W(0.504,0.492),W(0.445,0.567),W(0.404,0.489),W(0.323,0.564),W(0.192,0.557)]],
  /* 15 ش */ [[W(0.795,0.564),W(0.651,0.564),W(0.607,0.479),W(0.539,0.576),W(0.520,0.479),W(0.420,0.576),W(0.404,0.492),W(0.329,0.557),W(0.204,0.567)],[D(0.492,0.267)],[D(0.529,0.342)],[D(0.470,0.354)]],
  /* 16 ص */ [[W(0.820,0.557),W(0.623,0.536),W(0.398,0.629),W(0.482,0.486),W(0.629,0.404),W(0.657,0.501),W(0.511,0.567),W(0.351,0.517),W(0.270,0.564),W(0.167,0.567)]],
  /* 17 ض */ [[W(0.826,0.561),W(0.636,0.542),W(0.382,0.617),W(0.551,0.426),W(0.682,0.445),W(0.595,0.542),W(0.464,0.576),W(0.345,0.523),W(0.270,0.564),W(0.161,0.564)]],
  /* 18 ط */ [[W(0.776,0.561),W(0.548,0.542),W(0.395,0.164),W(0.348,0.557),W(0.548,0.404),W(0.611,0.464),W(0.489,0.570),W(0.226,0.576)]],
  /* 19 ظ */ [[W(0.782,0.567),W(0.536,0.529),W(0.392,0.151),W(0.357,0.561),W(0.545,0.407),W(0.620,0.470),W(0.470,0.573),W(0.220,0.573)],[D(0.542,0.289)]],
  /* 20 ع */ [[W(0.729,0.564),W(0.548,0.554),W(0.436,0.461),W(0.551,0.457),W(0.398,0.554),W(0.261,0.570)]],
  /* 21 غ */ [[W(0.729,0.570),W(0.557,0.561),W(0.432,0.451),W(0.570,0.451),W(0.392,0.548),W(0.276,0.564)],[D(0.457,0.279)]],
  /* 22 ف */ [[W(0.732,0.557),W(0.570,0.564),W(0.464,0.492),W(0.561,0.354),W(0.576,0.457),W(0.404,0.561),W(0.282,0.542)],[D(0.536,0.226)]],
  /* 23 ق */ [[W(0.732,0.554),W(0.567,0.564),W(0.467,0.476),W(0.532,0.361),W(0.576,0.442),W(0.482,0.529),W(0.376,0.570),W(0.270,0.551)],[D(0.545,0.214)],[D(0.464,0.232)]],
  /* 24 ک */ [[W(0.786,0.557),W(0.645,0.567),W(0.492,0.432),W(0.654,0.114),W(0.326,0.332),W(0.482,0.442),W(0.482,0.514),W(0.307,0.570),W(0.220,0.561)]],
  /* 25 گ */ [[W(0.782,0.570),W(0.651,0.554),W(0.479,0.407),W(0.648,0.107),W(0.351,0.307),W(0.482,0.420),W(0.479,0.529),W(0.317,0.579),W(0.211,0.564),W(0.645,0.029),W(0.398,0.154)]],
  /* 26 ل */ [[W(0.670,0.576),W(0.545,0.561),W(0.489,0.167),W(0.501,0.498),W(0.442,0.567),W(0.339,0.567)]],
  /* 27 م */ [[W(0.761,0.532),W(0.570,0.539),W(0.507,0.457),W(0.420,0.517),W(0.507,0.579),W(0.395,0.539),W(0.220,0.564)]],
  /* 28 ن */ [[W(0.711,0.570),W(0.567,0.561),W(0.507,0.495),W(0.454,0.561),W(0.320,0.561)],[D(0.501,0.332)]],
  null,
  /* 30 ه */ [[W(0.726,0.557),W(0.476,0.567),W(0.557,0.379),W(0.486,0.542),W(0.520,0.717),W(0.551,0.582),W(0.401,0.545),W(0.257,0.570)]],
  /* 31 ی */ [[W(0.704,0.582),W(0.548,0.564),W(0.520,0.495),W(0.439,0.567),W(0.332,0.567)],[D(0.545,0.664)],[D(0.457,0.670)]]
];

const WP_FIN=[
  /* 0 ا */ [[W(0.628,0.572),W(0.463,0.563),W(0.406,0.172)]],
  /* 1 ب */ [[W(0.807,0.561),W(0.723,0.564),W(0.645,0.507),W(0.579,0.582),W(0.382,0.617),W(0.251,0.586),W(0.236,0.473)],[D(0.451,0.732)]],
  /* 2 پ */ [[W(0.820,0.567),W(0.701,0.561),W(0.670,0.514),W(0.586,0.579),W(0.395,0.611),W(0.239,0.592),W(0.232,0.451)],[D(0.467,0.701)],[D(0.395,0.711)],[D(0.467,0.779)]],
  /* 3 ت */ [[W(0.829,0.554),W(0.701,0.557),W(0.664,0.507),W(0.614,0.567),W(0.401,0.614),W(0.229,0.579),W(0.245,0.464)],[D(0.486,0.307)],[D(0.404,0.332)]],
  /* 4 ث */ [[W(0.820,0.551),W(0.711,0.561),W(0.657,0.507),W(0.517,0.601),W(0.304,0.617),W(0.226,0.486)],[D(0.432,0.236)],[D(0.482,0.307)],[D(0.411,0.339)]],
  /* 5 ج */ [[W(0.742,0.561),W(0.548,0.567),W(0.517,0.464),W(0.329,0.457),W(0.617,0.457),W(0.386,0.545),W(0.298,0.701),W(0.361,0.867),W(0.651,0.876)],[D(0.486,0.689)]],
  /* 6 چ */ [[W(0.761,0.564),W(0.548,0.564),W(0.507,0.467),W(0.323,0.464),W(0.614,0.461),W(0.407,0.536),W(0.307,0.654),W(0.332,0.854),W(0.623,0.889)],[D(0.514,0.673)],[D(0.457,0.695)],[D(0.511,0.751)]],
  /* 7 ح */ [[W(0.748,0.561),W(0.551,0.567),W(0.489,0.467),W(0.323,0.464),W(0.626,0.454),W(0.376,0.551),W(0.298,0.679),W(0.357,0.848),W(0.629,0.870)]],
  /* 8 خ */ [[W(0.745,0.567),W(0.548,0.567),W(0.482,0.467),W(0.326,0.476),W(0.607,0.464),W(0.398,0.536),W(0.301,0.682),W(0.370,0.864),W(0.623,0.879)],[D(0.457,0.314)]],
  /* 9 د */ [[W(0.704,0.557),W(0.570,0.567),W(0.520,0.304),W(0.532,0.492),W(0.470,0.548),W(0.329,0.554)]],
  /* 10 ذ */ [[W(0.704,0.579),W(0.554,0.564),W(0.529,0.307),W(0.548,0.482),W(0.470,0.551),W(0.357,0.545)],[D(0.495,0.214)]],
  /* 11 ر */ [[W(0.673,0.557),W(0.489,0.532),W(0.507,0.664),W(0.314,0.754)]],
  /* 12 ز */ [[W(0.657,0.567),W(0.501,0.536),W(0.501,0.654),W(0.329,0.748)],[D(0.448,0.339)]],
  /* 13 ژ */ [[W(0.667,0.561),W(0.507,0.536),W(0.507,0.645),W(0.323,0.754)],[D(0.436,0.267)],[D(0.479,0.329)],[D(0.423,0.336)]],
  /* 14 س */ [[W(0.879,0.570),W(0.757,0.567),W(0.695,0.479),W(0.651,0.589),W(0.601,0.498),W(0.539,0.567),W(0.454,0.514),W(0.486,0.667),W(0.342,0.779),W(0.186,0.761),W(0.164,0.620)]],
  /* 15 ش */ [[W(0.882,0.567),W(0.748,0.567),W(0.711,0.486),W(0.657,0.573),W(0.607,0.501),W(0.532,0.589),W(0.467,0.520),W(0.470,0.682),W(0.364,0.767),W(0.220,0.773),W(0.167,0.598)],[D(0.626,0.342)],[D(0.579,0.276)],[D(0.554,0.357)]],
  /* 16 ص */ [[W(0.929,0.551),W(0.707,0.526),W(0.520,0.539),W(0.670,0.389),W(0.776,0.445),W(0.686,0.529),W(0.432,0.501),W(0.442,0.648),W(0.282,0.742),W(0.129,0.692),W(0.157,0.511)]],
  /* 17 ض */ [[W(0.920,0.554),W(0.789,0.564),W(0.695,0.526),W(0.520,0.542),W(0.664,0.404),W(0.773,0.442),W(0.623,0.551),W(0.426,0.479),W(0.442,0.651),W(0.270,0.745),W(0.161,0.707),W(0.145,0.532)],[D(0.579,0.264)]],
  /* 18 ط */ [[W(0.795,0.554),W(0.564,0.551),W(0.426,0.142),W(0.382,0.545),W(0.579,0.404),W(0.629,0.479),W(0.507,0.564),W(0.298,0.561)]],
  /* 19 ظ */ [[W(0.786,0.564),W(0.557,0.551),W(0.420,0.126),W(0.392,0.532),W(0.567,0.414),W(0.632,0.473),W(0.504,0.557),W(0.298,0.567)],[D(0.561,0.286)]],
  /* 20 ع */ [[W(0.717,0.554),W(0.548,0.561),W(0.432,0.467),W(0.539,0.451),W(0.401,0.567),W(0.336,0.779),W(0.445,0.898),W(0.670,0.914)]],
  /* 21 غ */ [[W(0.717,0.567),W(0.542,0.548),W(0.432,0.454),W(0.545,0.454),W(0.404,0.567),W(0.339,0.717),W(0.445,0.898),W(0.657,0.914)],[D(0.482,0.301)]],
  /* 22 ف */ [[W(0.857,0.564),W(0.682,0.561),W(0.595,0.507),W(0.645,0.392),W(0.701,0.470),W(0.595,0.573),W(0.392,0.617),W(0.214,0.592),W(0.198,0.470)],[D(0.548,0.292)]],
  /* 23 ق */ [[W(0.739,0.557),W(0.595,0.548),W(0.507,0.539),W(0.551,0.464),W(0.595,0.629),W(0.501,0.704),W(0.351,0.736),W(0.314,0.579)],[D(0.589,0.345)],[D(0.498,0.370)]],
  /* 24 ک */ [[W(0.898,0.561),W(0.770,0.557),W(0.592,0.429),W(0.757,0.104),W(0.448,0.336),W(0.595,0.420),W(0.595,0.507),W(0.395,0.607),W(0.232,0.611),W(0.132,0.476)]],
  /* 25 گ */ [[W(0.895,0.570),W(0.757,0.567),W(0.604,0.429),W(0.757,0.117),W(0.457,0.307),W(0.589,0.436),W(0.570,0.532),W(0.370,0.604),W(0.195,0.592),W(0.154,0.467),W(0.761,0.011),W(0.517,0.151)]],
  /* 26 ل */ [[W(0.745,0.564),W(0.611,0.561),W(0.545,0.229),W(0.557,0.557),W(0.545,0.739),W(0.401,0.798),W(0.320,0.773),W(0.320,0.570)]],
  /* 27 م */ [[W(0.707,0.557),W(0.507,0.536),W(0.454,0.632),W(0.445,0.492),W(0.336,0.561),W(0.364,0.923)]],
  /* 28 ن */ [[W(0.745,0.567),W(0.623,0.567),W(0.595,0.526),W(0.601,0.670),W(0.486,0.782),W(0.326,0.770),W(0.320,0.595)],[D(0.473,0.392)]],
  /* 29 و */ [[W(0.682,0.564),W(0.467,0.567),W(0.476,0.454),W(0.536,0.545),W(0.507,0.667),W(0.351,0.757)]],
  /* 30 ه */ [[W(0.667,0.570),W(0.517,0.567),W(0.482,0.326),W(0.379,0.495),W(0.482,0.504),W(0.492,0.329)]],
  /* 31 ی */ [[W(0.707,0.554),W(0.529,0.582),W(0.661,0.636),W(0.617,0.720),W(0.432,0.782),W(0.311,0.720),W(0.339,0.539)]]
];

function getWP(id,form){
  const arr=[WP,WP_INI,WP_MED,WP_FIN][form];
  return(arr&&arr[id]&&arr[id].length)?arr[id]:WP[id];
}
function formChar(l,form){return[l.iso,l.ini,l.med,l.fin][form];}
const FORM_NAMES=['Isolated','Initial','Medial','Final'];
// ═══════════════════════════════════════
const S={learned:new Set(),quiz:{tot:0,cor:0},prog:{},stats:{sessions:{},forms:{0:0,1:0,2:0,3:0},days:[]}};
// stats.sessions = {id: count}   — total trace sessions per letter (all forms combined)
// stats.forms    = {0:n,1:n,2:n,3:n} — sessions per form type
// stats.days     = ['YYYY-MM-DD',...] — dates with at least one session (for streak)
function loadS(){
  try{
    // Try new key first, then migrate from old alefba_ keys
    const raw=localStorage.getItem('alefbe_v1')||localStorage.getItem('alefba_v9')||'null';
    const p=JSON.parse(raw);
    if(p){
      S.learned=new Set(p.l||[]);S.quiz=p.q||{tot:0,cor:0};
      S.prog=p.p||{};S.stats=p.st||{sessions:{},forms:{0:0,1:0,2:0,3:0},days:[]};
    }
    // Remove old keys after migration
    localStorage.removeItem('alefba_v9');localStorage.removeItem('alefba_theme');
  }catch(e){}
}
function saveS(){try{localStorage.setItem('alefbe_v1',JSON.stringify({l:[...S.learned],q:S.quiz,p:S.prog,st:S.stats}));}catch(e){}}
function recordSession(id,form){
  if(!S.stats.sessions[id])S.stats.sessions[id]=0;
  S.stats.sessions[id]++;
  if(!S.stats.forms)S.stats.forms={0:0,1:0,2:0,3:0};
  S.stats.forms[form]=(S.stats.forms[form]||0)+1;
  // Track day
  const today=new Date().toISOString().slice(0,10);
  if(!S.stats.days)S.stats.days=[];
  if(!S.stats.days.includes(today))S.stats.days.push(today);
  saveS();
}
function lv(id){const p=S.prog[id];if(!p)return 0;const c=p.comp||[0,0,0];if(c[2]>=2)return 3;if(c[1]>=2)return 2;if(c[0]>=2)return 1;return 0;}
function recComp(id,level){if(!S.prog[id])S.prog[id]={comp:[0,0,0]};S.prog[id].comp[level]=(S.prog[id].comp[level]||0)+1;saveS();}

// ═══════════════════════════════════════
// AUDIO
// Naming convention: audio/letter_{id}.mp3  (e.g. audio/letter_0.mp3 = Alef)
// Place audio files in an 'audio/' folder next to alefba.html
// Uncomment the body of playLetterAudio when files are available
// ═══════════════════════════════════════
// ═══════════════════════════════════════
// AUDIO
// All audio files go in a folder named  data/audio/
// Letter files:  data/audio/alef.mp3, data/audio/be.mp3, etc.  (see full list below)
// Word files:    data/audio/words/ab.mp3, data/audio/words/bad.mp3, etc.
//
// LETTER AUDIO FILES (place in data/audio/):
//   data/audio/alef.mp3   data/audio/be.mp3     data/audio/pe.mp3     data/audio/te.mp3
//   data/audio/se.mp3     data/audio/jim.mp3    data/audio/che.mp3    data/audio/he-jimi.mp3
//   data/audio/khe.mp3    data/audio/dal.mp3    data/audio/zal.mp3    data/audio/re.mp3
//   data/audio/ze.mp3     data/audio/zhe.mp3    data/audio/sin.mp3    data/audio/shin.mp3
//   data/audio/sad.mp3    data/audio/zad.mp3    data/audio/ta.mp3     data/audio/za.mp3
//   data/audio/eyn.mp3    data/audio/gheyn.mp3  data/audio/fe.mp3     data/audio/qaf.mp3
//   data/audio/kaf.mp3    data/audio/gaf.mp3    data/audio/lam.mp3    data/audio/mim.mp3
//   data/audio/nun.mp3    data/audio/vav.mp3    data/audio/he.mp3     data/audio/ye.mp3
//
// WORD AUDIO FILES (place in data/audio/words/):
//   data/audio/words/ab.mp3         data/audio/words/bad.mp3        data/audio/words/dast.mp3
//   data/audio/words/sar.mp3        data/audio/words/cheshm.mp3     data/audio/words/gol.mp3
//   data/audio/words/mah.mp3        data/audio/words/khorshid.mp3   data/audio/words/ketab.mp3
//   data/audio/words/dars.mp3       data/audio/words/nur.mp3        data/audio/words/shab.mp3
//   data/audio/words/ruz.mp3        data/audio/words/khane.mp3      data/audio/words/rah.mp3
//   data/audio/words/del.mp3        data/audio/words/zaban.mp3      data/audio/words/nam.mp3
//   data/audio/words/mard.mp3       data/audio/words/zan.mp3        data/audio/words/bache.mp3
//   data/audio/words/dust.mp3       data/audio/words/pedar.mp3      data/audio/words/madar.mp3
//   data/audio/words/nan.mp3        data/audio/words/ash.mp3        data/audio/words/chai.mp3
//   data/audio/words/mive.mp3       data/audio/words/rang.mp3       data/audio/words/zaman.mp3
//   data/audio/words/derakht.mp3    data/audio/words/kuh.mp3        data/audio/words/darya.mp3
//   data/audio/words/asman.mp3      data/audio/words/zamin.mp3      data/audio/words/atash.mp3
//   data/audio/words/sang.mp3       data/audio/words/madrase.mp3    data/audio/words/shahr.mp3
//   data/audio/words/rusta.mp3      data/audio/words/qalb.mp3       data/audio/words/eshq.mp3
//   data/audio/words/shadi.mp3      data/audio/words/gham.mp3       data/audio/words/omid.mp3
//   data/audio/words/sabr.mp3       data/audio/words/khub.mp3       data/audio/words/bad-adj.mp3
//   data/audio/words/bozorg.mp3     data/audio/words/kuchak.mp3     data/audio/words/sefid.mp3
//   data/audio/words/siyah.mp3      data/audio/words/sabz.mp3       data/audio/words/sorkh.mp3
//   data/audio/words/abi.mp3        data/audio/words/raftan.mp3     data/audio/words/amadan.mp3
//   data/audio/words/khandan.mp3    data/audio/words/neveshtan.mp3  data/audio/words/didan.mp3
// ═══════════════════════════════════════

// Map letter id → audio filename (without path or extension)
const LETTER_AUDIO=[
  'alef','be','pe','te','se','jim','che','he-jimi','khe',
  'dal','zal','re','ze','zhe','sin','shin','sad','zad','ta','za',
  'eyn','gheyn','fe','qaf','kaf','gaf','lam','mim','nun','vav','he','ye'
];

function playLetterAudio(id){
  // Uncomment when audio files are available in data/audio/:
  // const file = LETTER_AUDIO[id];
  // if (!file) return;
  // const audio = new Audio(`data/audio/${file}.mp3`);
  // audio.play().catch(()=>{});
}
// TTS is silenced until proper audio files are added.
// When ready, uncomment playLetterAudio(l.id) below and remove the no-op body.
function speak(l){
  // playLetterAudio(l?.id);
  // const t=l||CL;if(!t||!window.speechSynthesis)return;
  // const u=new SpeechSynthesisUtterance(t.iso+' '+t.ex.w);u.lang='fa-IR';u.rate=.75;
  // speechSynthesis.cancel();speechSynthesis.speak(u);
}
function speakWord(fa){
  // if(!window.speechSynthesis)return;
  // const u=new SpeechSynthesisUtterance(fa);u.lang='fa-IR';u.rate=.75;
  // speechSynthesis.cancel();speechSynthesis.speak(u);
}

// ═══════════════════════════════════════
// NAV
// ═══════════════════════════════════════
// Navigation is handled by page links. goNav() resolves paths from either root or data/webpages/
function goNav(page){
  const inSub=window.location.pathname.includes('/data/webpages/');
  const base=inSub?'':'data/webpages/';
  const root=inSub?'../../':'';
  if(page==='learn'){window.location.href=inSub?root+'index.html':'index.html';}
  else{window.location.href=base+page+'.html';}
}

// ═══════════════════════════════════════
// LEARN
// ═══════════════════════════════════════
function renderAlpha(f){
  let ls=f==='persian'?AL.filter(l=>l.isp):f==='nc'?AL.filter(l=>!l.conn):f==='new'?AL.filter(l=>!S.learned.has(l.id)):AL;
  document.getElementById('alpha-grid').innerHTML=ls.map(l=>{
    const lvl=lv(l.id),pips=[0,1,2].map(i=>`<div class="pip${i<Math.min(lvl,3)?' on':''}"></div>`).join('');
    return`<div class="lcard${l.isp?' isp':''}${S.learned.has(l.id)?' learned':''}${lvl>0?' practiced':''}" onclick="openM(${l.id})">
      <span class="lchar">${l.iso}</span><div class="lname">${l.name}</div><div class="ltrans">${l.tr}</div>
      <div class="prog-pips">${pips}</div></div>`;
  }).join('');
}
function filterL(f,btn){S.filter=f;document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderAlpha(f);}

// ═══════════════════════════════════════
// MODAL
// ═══════════════════════════════════════
let CL=null;
function openM(id){
  const l=AL[id];CL=l;
  document.getElementById('ml').textContent=l.iso;document.getElementById('ml').style.color=l.isp?'var(--persian)':'var(--gold)';
  document.getElementById('mt').textContent=l.name;document.getElementById('mipa').textContent=`${l.ipa} · /${l.tr}/`;
  document.getElementById('msnd').textContent=l.snd;document.getElementById('mex-fa').textContent=l.ex.w;
  document.getElementById('mex-t').textContent=l.ex.t;document.getElementById('mex-m').textContent='"'+l.ex.m+'"';
  document.getElementById('mbadge').innerHTML=l.isp?'<span class="pbadge">✦ Persian-Specific</span>':'';
  document.getElementById('mforms').innerHTML=l.conn
    ?[l.iso,l.ini,l.med,l.fin].map((c,i)=>`<div class="fi"><span class="fc-ch">${c}</span><span class="flbl">${['Isolated','Initial','Medial','Final'][i]}</span></div>`).join('')
    :`<div class="fi"><span class="fc-ch">${l.iso}</span><span class="flbl">Isolated</span></div><div class="fi"><span class="fc-ch">${l.fin}</span><span class="flbl">Final</span></div><div class="fi" style="opacity:.2"><span class="fc-ch">—</span><span class="flbl">N/A</span></div><div class="fi" style="opacity:.2"><span class="fc-ch">—</span><span class="flbl">N/A</span></div>`;
  updLearnBtn();document.getElementById('modal-wrap').classList.add('open');
}
function updLearnBtn(){const ok=S.learned.has(CL.id);const b=document.getElementById('mlearnbtn');b.textContent=ok?'✓ Learned':'Mark as Learned';b.className='mlearn'+(ok?' on':'');}
function closeM(){document.getElementById('modal-wrap').classList.remove('open');renderAlpha(S.filter||'all');}
function togLearned(){const id=CL.id;S.learned.has(id)?S.learned.delete(id):S.learned.add(id);saveS();updLearnBtn();toast(S.learned.has(id)?'✓ Learned':'Removed');}
function traceFromM(){
  const id=CL.id;
  localStorage.setItem('alefbe_trace_id',String(id));
  const inSub=window.location.pathname.includes('/data/webpages/');
  window.location.href=inSub?'trace.html':'data/webpages/trace.html';
}

// ═══════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════
function mkCanvas(dcId,gcId,ccId,cwId){
  const dpr=window.devicePixelRatio||1;
  const sz=Math.min(window.innerWidth-40,360);
  [dcId,gcId,ccId].forEach(id=>{
    const c=document.getElementById(id);if(!c)return;
    c.width=sz*dpr;c.height=sz*dpr;c.style.width=sz+'px';c.style.height=sz+'px';
  });
  const cw=document.getElementById(cwId);if(cw){cw.style.width=sz+'px';cw.style.height=sz+'px';}
  const dc=document.getElementById(dcId),gc=document.getElementById(gcId),cc=document.getElementById(ccId);
  const dX=dc.getContext('2d'),gX=gc.getContext('2d'),cX=cc.getContext('2d');
  dX.scale(dpr,dpr);gX.scale(dpr,dpr);cX.scale(dpr,dpr);
  return{dX,gX,cX,dc,gc,cc,sz,dpr};
}

// ═══════════════════════════════════════
// TRACER  — flat waypoints, single Check
// ═══════════════════════════════════════
const HIT_BODY=0.16;  // hit radius fraction of sz for body points
const HIT_DOT =0.21;  // dot points are more forgiving
const SNAP_R  =[0.18,0.12,0];
const SNAP_STR=[0.82,0.58,0];

const mkTR=()=>({
  ready:false,dc:null,gc:null,cc:null,dX:null,gX:null,cX:null,sz:320,dpr:1,
  idx:0,level:0,form:0,brush:16,drawing:false,lx:0,ly:0,mx:0,my:0,totalDist:0,hasDrawn:false,
  passed:false, // true after onPass fires — blocks further inkD/tryHits until reset
  wpts:[],  // [{x,y,d,hit}]
  rafId:null,pulseT:0,
});
const TR=mkTR(),PR=mkTR();

function initTracer(){
  const r=mkCanvas('dc','gc','cc','trace-cw');
  Object.assign(TR,r);TR.ready=true;
  bindCanvas(TR,'free');
  document.fonts.ready.then(()=>{loadLetter(TR,'free');refreshFreeUI();});
}

function loadLetter(tr,mode){
  // Flatten waypoints for this letter+form, fall back to iso if form not set
  tr.wpts=getWP(tr.idx,tr.form).flat().map(w=>({...w,hit:false}));
  tr.drawing=false;tr.totalDist=0;tr.hasDrawn=false;
  clearDraw(tr);drawGuide(tr);hideRov(mode);
  updateClbl(tr,mode);setChkBtn(mode,false);
  startLoop(tr);
}
function clearDraw(tr){tr.dX&&tr.dX.clearRect(0,0,tr.sz,tr.sz);}
// Vertical offset to align the rendered glyph with the editor-placed waypoints.
// Arabic glyphs sit above the mathematical 'middle' baseline, so we shift down.
const GUIDE_Y_OFFSET=0.06; // fraction of sz

function drawGuide(tr){
  const{gX,sz,idx,level,form}=tr,l=AL[idx];
  gX.clearRect(0,0,sz,sz);
  const a=[0.16,0.10,0][level];
  if(a>0){
    gX.font=`${sz*0.62}px 'Amiri',serif`;gX.textAlign='center';gX.textBaseline='middle';
    gX.fillStyle=l.isp?`rgba(199,129,58,${a})`:`rgba(212,168,67,${a})`;
    gX.fillText(formChar(l,form),sz/2,sz/2+sz*GUIDE_Y_OFFSET-23);
  }
}
function updateClbl(tr,mode){
  const el=document.getElementById(mode==='prac'?'p-clbl':'t-clbl');if(!el)return;
  const bodyPts=tr.wpts.filter(w=>!w.d);
  const dotPts=tr.wpts.filter(w=>w.d);
  const allBodyHit=bodyPts.every(w=>w.hit);
  if(allBodyHit&&dotPts.length>0){
    const remaining=dotPts.filter(w=>!w.hit).length;
    el.textContent=`Now tap the ${remaining} dot${remaining>1?'s':''}`;
  } else {
    const hit=bodyPts.filter(w=>w.hit).length;
    el.textContent=`Draw through the numbered circles (${hit}/${bodyPts.length} hit)`;
  }
}

// ── Animation loop ──
function startLoop(tr){
  if(tr.rafId)cancelAnimationFrame(tr.rafId);
  (function loop(){tr.rafId=requestAnimationFrame(loop);tr.pulseT+=0.05;renderWpts(tr);})();
}
function renderWpts(tr){
  const{cX,sz,level,wpts,pulseT}=tr;
  cX.clearRect(0,0,sz,sz);
  if(level===2)return;

  const bodyPts=wpts.filter(w=>!w.d);
  const dotPts=wpts.filter(w=>w.d);
  const allBodyHit=bodyPts.every(w=>w.hit);

  // Find current (first unhit body) and next body waypoint
  let curBodyIdx=-1;
  for(let i=0;i<bodyPts.length;i++){if(!bodyPts[i].hit){curBodyIdx=i;break;}}

  // Draw hit body points as small gold dots
  bodyPts.forEach((w,i)=>{
    if(!w.hit)return;
    const x=w.x*sz,y=w.y*sz;
    cX.beginPath();cX.arc(x,y,5,0,Math.PI*2);
    cX.fillStyle='rgba(212,168,67,.6)';cX.fill();
  });

  if(!allBodyHit&&curBodyIdx>=0){
    // Active (current) body point — pulsing blue
    const cur=bodyPts[curBodyIdx];
    const x=cur.x*sz,y=cur.y*sz;
    const p=0.5+0.5*Math.sin(pulseT*3.5);
    cX.beginPath();cX.arc(x,y,21+5*p,0,Math.PI*2);
    cX.strokeStyle=`rgba(59,130,246,${0.35+0.3*p})`;cX.lineWidth=2;cX.stroke();
    cX.beginPath();cX.arc(x,y,12,0,Math.PI*2);
    cX.fillStyle=`rgba(59,130,246,${0.65+0.25*p})`;cX.fill();
    cX.fillStyle='#fff';cX.font=`bold ${Math.max(8,sz*.026)}px Raleway`;
    cX.textAlign='center';cX.textBaseline='middle';
    cX.fillText(curBodyIdx+1,x,y+1);

    // Next body point — dim ring only
    if(curBodyIdx+1<bodyPts.length){
      const nxt=bodyPts[curBodyIdx+1];
      const nx=nxt.x*sz,ny=nxt.y*sz;
      cX.beginPath();cX.arc(nx,ny,12,0,Math.PI*2);
      cX.strokeStyle='rgba(59,130,246,.28)';cX.lineWidth=1.5;cX.stroke();
      cX.fillStyle='rgba(59,130,246,.18)';cX.fill();
      cX.fillStyle='rgba(59,130,246,.55)';cX.font=`bold ${Math.max(7,sz*.022)}px Raleway`;
      cX.textAlign='center';cX.textBaseline='middle';
      cX.fillText(curBodyIdx+2,nx,ny+1);
    }
    // Dashed line between current and next in guided mode
    if(level===0&&curBodyIdx+1<bodyPts.length){
      const nxt=bodyPts[curBodyIdx+1];
      cX.beginPath();cX.moveTo(x,y);cX.lineTo(nxt.x*sz,nxt.y*sz);
      cX.strokeStyle='rgba(59,130,246,.15)';cX.lineWidth=1.5;cX.setLineDash([5,5]);cX.stroke();cX.setLineDash([]);
    }
  }

  // Dot (nuqta) points — only shown once all body points are hit
  if(allBodyHit){
    dotPts.forEach((w,i)=>{
      const x=w.x*sz,y=w.y*sz;
      if(w.hit){
        cX.beginPath();cX.arc(x,y,7,0,Math.PI*2);
        cX.fillStyle='rgba(212,168,67,.7)';cX.fill();
      } else {
        const p=0.5+0.5*Math.sin(pulseT*3.5+i*0.8);
        cX.beginPath();cX.arc(x,y,18+4*p,0,Math.PI*2);
        cX.strokeStyle=`rgba(212,168,67,${0.4+0.3*p})`;cX.lineWidth=2;cX.stroke();
        cX.beginPath();cX.arc(x,y,10,0,Math.PI*2);
        cX.fillStyle=`rgba(212,168,67,${0.6+0.3*p})`;cX.fill();
      }
    });
  }
}

// ── Snap toward nearest unhit waypoint ──
function doSnap(tr,px,py){
  if(tr.level===2)return{x:px,y:py};
  const R=SNAP_R[tr.level]*tr.sz;if(R<=0)return{x:px,y:py};
  let best=null,bestD=Infinity;
  tr.wpts.forEach(w=>{
    if(w.hit)return;
    const dx=w.x*tr.sz-px,dy=w.y*tr.sz-py,d=Math.sqrt(dx*dx+dy*dy);
    if(d<bestD){bestD=d;best=w;}
  });
  if(!best||bestD>R)return{x:px,y:py};
  const t=SNAP_STR[tr.level]*(1-bestD/R);
  return{x:px+(best.x*tr.sz-px)*t,y:py+(best.y*tr.sz-py)*t};
}

// ── Check all unhit waypoints ──
function tryHits(tr,mode,sx,sy){
  let anyHit=false;
  tr.wpts.forEach(w=>{
    if(w.hit)return;
    // Dots only become hittable once all body points are hit
    if(w.d&&!tr.wpts.filter(v=>!v.d).every(v=>v.hit))return;
    const R=(w.d?HIT_DOT:HIT_BODY)*tr.sz;
    if(Math.sqrt((w.x*tr.sz-sx)**2+(w.y*tr.sz-sy)**2)<=R){w.hit=true;anyHit=true;setChkBtn(mode,true);}
  });
  if(anyHit)updateClbl(tr,mode);
  // Auto-check when all waypoints are hit (only if not already passed)
  if(!tr.passed&&tr.wpts.length>0&&tr.wpts.every(w=>w.hit)){
    clearTimeout(tr._autoCheck);
    tr._autoCheck=setTimeout(()=>pressCheck(mode),400);
  }
}

// ── Ink ──
function bindCanvas(tr,mode){
  const nc=tr.dc.cloneNode(false);tr.dc.parentNode.replaceChild(nc,tr.dc);
  tr.dc=nc;tr.dX=nc.getContext('2d');tr.dX.scale(tr.dpr,tr.dpr);
  const gXY=e=>{const r=nc.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
  const tXY=e=>{const r=nc.getBoundingClientRect(),t=e.touches[0];return{x:t.clientX-r.left,y:t.clientY-r.top};};
  nc.addEventListener('mousedown', e=>inkD(tr,mode,gXY(e)));
  nc.addEventListener('mousemove', e=>{if(e.buttons)inkM(tr,mode,gXY(e));});
  nc.addEventListener('mouseup',   ()=>tr.drawing=false);
  nc.addEventListener('mouseleave',e=>{if(e.buttons)tr.drawing=false;});
  nc.addEventListener('touchstart',e=>{e.preventDefault();inkD(tr,mode,tXY(e));},{passive:false});
  nc.addEventListener('touchmove', e=>{e.preventDefault();inkM(tr,mode,tXY(e));},{passive:false});
  nc.addEventListener('touchend',  e=>{e.preventDefault();tr.drawing=false;},{passive:false});
}
function inkD(tr,mode,p){
  if(tr.passed)return; // letter already completed — wait for user to tap a button
  hideRov(mode);tr.drawing=true;tr.hasDrawn=true;
  const s=doSnap(tr,p.x,p.y);tr.lx=s.x;tr.ly=s.y;tr.mx=s.x;tr.my=s.y;
  tr.dX.beginPath();tr.dX.arc(s.x,s.y,tr.brush/2,0,Math.PI*2);
  tr.dX.fillStyle='rgba(240,200,112,.93)';tr.dX.fill();
  tryHits(tr,mode,s.x,s.y);
}
function inkM(tr,mode,p){
  if(!tr.drawing)return;
  const s=doSnap(tr,p.x,p.y);
  const nmx=(tr.lx+s.x)/2,nmy=(tr.ly+s.y)/2;
  tr.dX.beginPath();tr.dX.moveTo(tr.mx,tr.my);tr.dX.quadraticCurveTo(tr.lx,tr.ly,nmx,nmy);
  tr.dX.strokeStyle='rgba(240,200,112,.93)';tr.dX.lineWidth=tr.brush;tr.dX.lineCap='round';tr.dX.lineJoin='round';tr.dX.stroke();
  const ddx=s.x-tr.lx,ddy=s.y-tr.ly;tr.totalDist+=Math.sqrt(ddx*ddx+ddy*ddy);
  tr.mx=nmx;tr.my=nmy;tr.lx=s.x;tr.ly=s.y;
  tryHits(tr,mode,s.x,s.y);
  if(tr.totalDist>10)setChkBtn(mode,true);
}

// ═══════════════════════════════════════
// CHECK  — single evaluation of entire letter
// ═══════════════════════════════════════
function setChkBtn(mode,on){
  const b=document.getElementById(mode==='prac'?'p-check':'t-check');if(!b)return;
  b.disabled=!on;b.className='tbtn check'+(on?' ready':'');
}
function pressCheck(mode){
  const tr=mode==='prac'?PR:TR;if(!tr.hasDrawn)return;
  const hit=tr.wpts.filter(w=>w.hit).length,total=tr.wpts.length;
  const score=Math.round(hit/total*100);
  if(score>=55)onPass(tr,mode,score);else onFail(tr,mode,score,hit,total);
}
function onPass(tr,mode,score){
  tr.passed=true; // lock canvas — user must tap a button to continue
  recComp(tr.idx,tr.level);S.learned.add(tr.idx);
  recordSession(tr.idx,tr.form);
  saveS();
  const l=AL[tr.idx];speak(l);
  const fl=document.getElementById(mode==='prac'?'p-cf':'t-cf');
  const cc=document.getElementById(mode==='prac'?'p-cfch':'t-cfch');
  if(fl&&cc){cc.textContent=formChar(l,tr.form);cc.style.color=l.isp?'var(--persian)':'var(--gold)';fl.classList.add('show');}
  setChkBtn(mode,false);
  setTimeout(()=>{
    if(fl)fl.classList.remove('show');
    showRov(mode,score,true);
  },1400);
}
function onFail(tr,mode,score,hit,total){
  const cw=document.getElementById(mode==='prac'?'prac-cw':'trace-cw');
  if(cw){cw.classList.add('shake');setTimeout(()=>cw.classList.remove('shake'),320);}
  showRov(mode,score,false,hit,total);setChkBtn(mode,false);
}
function showRov(mode,score,passed,hit,total){
  const oid=mode==='prac'?'p-rov':'t-rov';
  const el=document.getElementById(oid);if(!el)return;
  el.className='rov show';
  const se=document.getElementById(mode==='prac'?'provsc':'rovsc');
  se.style.color=passed?'var(--ok)':'var(--err)';countUp(se,score,'%');
  const stars=score>=85?3:score>=65?2:score>=45?1:0;
  document.getElementById(mode==='prac'?'provstars':'rovstars').innerHTML=
    [...Array(3)].map((_,i)=>`<span class="sp" style="animation-delay:${i*.11}s">${i<stars?'⭐':'☆'}</span>`).join('');
  document.getElementById(mode==='prac'?'provmsg':'rovmsg').textContent=
    passed?'Letter complete! 🌟':(score<30?'Draw through the circles!':score<50?'Stay closer to the letter.':'Almost — try hitting more circles.');
  if(mode==='free'){
    const btns=document.getElementById('t-rov-btns');
    if(btns){
      btns.innerHTML=passed
        ?`<button class="rovbtn sec" onclick="resetT('free')">↺ Trace Again</button>
           <button class="rovbtn" onclick="nextFree()">Next →</button>`
        :`<button class="rovbtn sec" onclick="resetT('free')">↺ Retry</button>
           <button class="rovbtn" onclick="nextFree()">Skip →</button>`;
    }
  } else {
    const rn=document.getElementById('prov-next');
    if(rn)rn.textContent=passed?'Next →':'Skip →';
    if(passed)setTimeout(()=>pracAdv(),1400);
  }
}
function hideRov(mode){const el=document.getElementById(mode==='prac'?'p-rov':'t-rov');if(el)el.className='rov';}
function resetT(mode){
  const tr=mode==='prac'?PR:TR;
  tr.passed=false; // unlock canvas
  hideRov(mode);clearDraw(tr);
  tr.wpts.forEach(w=>w.hit=false);tr.totalDist=0;tr.hasDrawn=false;
  clearTimeout(tr._autoCheck);
  setChkBtn(mode,false);
}

// ── Free trace controls ──
function refreshFreeUI(){
  const l=AL[TR.idx];
  document.getElementById('tnchar').textContent=formChar(l,TR.form);
  document.getElementById('tnsub').textContent=`${l.name} · /${l.tr}/ · ${FORM_NAMES[TR.form]}`;
  // Update form tab states — disable ini/med for non-connecting letters
  [0,1,2,3].forEach(f=>{
    const btn=document.getElementById('tf'+f);if(!btn)return;
    btn.classList[TR.form===f?'add':'remove']('on');
    btn.disabled=(f===1||f===2)&&!l.conn;
  });
  buildDotNav();
}
function setForm(f,btn){
  const l=AL[TR.idx];
  if((f===1||f===2)&&!l.conn){toast('This letter has no '+FORM_NAMES[f]+' form');return;}
  TR.form=f;
  if(TR.ready){loadLetter(TR,'free');refreshFreeUI();}
}
function fNav(d){TR.idx=(TR.idx+d+32)%32;TR.form=0;if(TR.ready){loadLetter(TR,'free');refreshFreeUI();}}
function jumpFree(id){TR.idx=id;if(TR.ready){loadLetter(TR,'free');refreshFreeUI();}}
function setLv(lv,btn){
  TR.level=lv;
  document.querySelectorAll('.lvtab').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  document.getElementById('tlvlname').textContent=['Guided','Outline','Freehand'][lv]+' Trace';
  document.getElementById('tlvldesc').textContent=['Trace the full letter then press ✓ Check','Outline only — trace then press ✓ Check','No guide — write from memory then press ✓ Check'][lv];
  if(TR.ready){loadLetter(TR,'free');refreshFreeUI();}
}
// Return the ordered forms applicable for a letter
function formsFor(l){
  if(l.conn)return[0,1,2,3];
  return[0,3]; // non-connecting: isolated + final only
}
let _nextFreeTimer=null;
function nextFree(){
  if(_nextFreeTimer){clearTimeout(_nextFreeTimer);_nextFreeTimer=null;}
  TR.passed=false; // unlock canvas for the new letter
  hideRov('free');
  const l=AL[TR.idx];
  const forms=formsFor(l);
  let curPos=forms.indexOf(TR.form);
  if(curPos<0)curPos=0; // safety: if form not in list, treat as first
  if(curPos<forms.length-1){
    TR.form=forms[curPos+1];
  } else {
    TR.idx=(TR.idx+1)%32;
    TR.form=0;
  }
  if(TR.ready){loadLetter(TR,'free');refreshFreeUI();}
}
function doHint(){
  const l=AL[TR.idx],sz=TR.sz;
  TR.gX.clearRect(0,0,sz,sz);TR.gX.font=`${sz*0.62}px 'Amiri',serif`;
  TR.gX.textAlign='center';TR.gX.textBaseline='middle';
  TR.gX.fillStyle=l.isp?'rgba(199,129,58,.72)':'rgba(212,168,67,.72)';
  TR.gX.fillText(formChar(l,TR.form),sz/2,sz/2+sz*GUIDE_Y_OFFSET-23);
  clearTimeout(TR.hintTimer);TR.hintTimer=setTimeout(()=>drawGuide(TR),2200);
}
function buildDotNav(){
  document.getElementById('t-dots').innerHTML=AL.map(l=>{
    const lvl=lv(l.id);
    const cls='dn'+(TR.idx===l.id?' cur':lvl>=3?' master':lvl>=2?' lv2':lvl>=1?' lv1':'');
    return`<div class="${cls}" onclick="jumpFree(${l.id})" title="${l.name}">${l.iso}</div>`;
  }).join('');
}

// ═══════════════════════════════════════
// PRACTICE
// ═══════════════════════════════════════
let PSEL=new Set(AL.map(l=>l.id)),PQUEUE=[],PQI=0,PSETS=3,PMAXATT=3,PSESH={passed:0,scores:{}};
function buildSG(){document.getElementById('sel-grid').innerHTML=AL.map(l=>`<div class="sc${PSEL.has(l.id)?' sel':''}" id="sc-${l.id}" onclick="togSel(${l.id})"><span class="sc-ch">${l.iso}</span><span class="sc-nm">${l.name}</span></div>`).join('');}
function togSel(id){PSEL.has(id)?PSEL.delete(id):PSEL.add(id);document.getElementById('sc-'+id).classList.toggle('sel');}
function selA(){AL.forEach(l=>PSEL.add(l.id));buildSG();}function selN(){PSEL.clear();buildSG();}
function selP(){PSEL=new Set(AL.filter(l=>l.isp).map(l=>l.id));buildSG();}
function selH(){PSEL=new Set([...AL].sort((a,b)=>lv(a.id)-lv(b.id)).slice(0,10).map(l=>l.id));buildSG();}
function showPracSetup(){['prac-setup','prac-active','prac-result'].forEach((id,i)=>document.getElementById(id).style.display=i===0?'block':'none');buildSG();}
function startPrac(){
  if(!PSEL.size){toast('Select at least 1 letter');return;}
  PSETS=+document.getElementById('psets').value;PMAXATT=+document.getElementById('patts').value;
  const formSel=+document.getElementById('pform').value;
  // Build queue of {id,form} pairs
  const forms=formSel===4?[0,1,2,3]:[formSel];
  PQUEUE=[];
  for(let s=0;s<PSETS;s++){
    const batch=[];
    [...PSEL].forEach(id=>{
      const l=AL[id];
      forms.forEach(f=>{
        if((f===1||f===2)&&!l.conn)return; // skip ini/med for non-connecting
        batch.push({id,form:f});
      });
    });
    PQUEUE.push(...batch.sort(()=>Math.random()-.5));
  }
  if(!PQUEUE.length){toast('No valid letter+form combinations');return;}
  PQI=0;PSESH={passed:0,scores:{}};
  document.getElementById('prac-setup').style.display='none';document.getElementById('prac-result').style.display='none';document.getElementById('prac-active').style.display='block';
  const r=mkCanvas('pdc','pgc','pcc','prac-cw');Object.assign(PR,r);PR.brush=16;PR.ready=true;
  bindCanvas(PR,'prac');document.fonts.ready.then(()=>loadPracLetter());
}
function loadPracLetter(){
  const{id,form}=PQUEUE[PQI],l=AL[id];
  PR.idx=id;PR.level=Math.min(TR.level,lv(id));PR.form=form;
  loadLetter(PR,'prac');
  document.getElementById('pa-ch').textContent=formChar(l,form);
  document.getElementById('pa-nm').textContent=`${l.name} · /${l.tr}/ · ${FORM_NAMES[form]}`;
  // Update practice form tab indicators (read-only display)
  [0,1,2,3].forEach(f=>{
    const btn=document.getElementById('pf'+f);if(!btn)return;
    btn.classList[f===form?'add':'remove']('on');
    btn.disabled=true; // display only in practice
  });
  const si=(PQI%Math.max(PQUEUE.length/PSETS,1))+1,sn=Math.floor(PQI/(PQUEUE.length/PSETS))+1;
  document.getElementById('pa-qn').textContent=`${PQI+1}/${PQUEUE.length}`;
  document.getElementById('ppl').textContent=`${PQI+1} of ${PQUEUE.length}`;document.getElementById('psl').textContent=`Set ${Math.min(sn,PSETS)} of ${PSETS}`;
  document.getElementById('pbf').style.width=(PQI/PQUEUE.length*100)+'%';speak(l);
}
function pracAdv(){
  PSESH.passed++;const{id,form}=PQUEUE[PQI];
  const key=`${id}_${form}`;
  if(!PSESH.scores[key])PSESH.scores[key]={id,form,score:0};
  PSESH.scores[key].score=Math.max(PSESH.scores[key].score,Math.round(PR.wpts.filter(w=>w.hit).length/Math.max(PR.wpts.length,1)*100));
  if(PR.rafId){cancelAnimationFrame(PR.rafId);PR.rafId=null;}
  PQI++;if(PQI>=PQUEUE.length){showPracResult();return;}loadPracLetter();
}
function exitPrac(){if(PR.rafId){cancelAnimationFrame(PR.rafId);PR.rafId=null;}showPracSetup();}
function showPracResult(){
  if(PR.rafId){cancelAnimationFrame(PR.rafId);PR.rafId=null;}
  document.getElementById('prac-active').style.display='none';document.getElementById('prac-result').style.display='block';
  const tot=PQUEUE.length,pass=PSESH.passed,pct=Math.round(pass/tot*100);
  const sc=Object.values(PSESH.scores).map(v=>v.score),avg=sc.length?Math.round(sc.reduce((a,b)=>a+b,0)/sc.length):0;
  const[em,ti]=pct>=90?['🏆','Mastery!']:pct>=70?['⭐','Excellent!']:pct>=50?['👍','Good!']:['💪','Keep going!'];
  document.getElementById('pre').textContent=em;document.getElementById('prt').textContent=ti;
  document.getElementById('prsu').textContent=`${pass} passed of ${tot}`;
  document.getElementById('prst').textContent=tot;document.getElementById('prsp').textContent=pass;document.getElementById('prsa').textContent=avg+'%';
  const entries=Object.values(PSESH.scores);
  document.getElementById('prls-g').innerHTML=entries.map(({id,form,score})=>{const l=AL[id];const cls=score>=70?'g':score>=40?'m':'b';return`<div class="prli ${cls}"><span class="prli-ch" style="color:${l.isp?'var(--persian)':'var(--gold2)'}">${formChar(l,form)}</span><span class="prli-v" style="font-size:.5rem;color:var(--dim)">${FORM_NAMES[form]}</span><span class="prli-v">${score?score+'%':'—'}</span></div>`;}).join('');
}

// ═══════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════
let QQ={mode:'ltn',qs:[],cur:0,score:0,ans:false,fkn:0,fnp:0};
function showQSetup(){['qsetup','qgame','fc-game','type-game','qresult'].forEach(id=>{const e=document.getElementById(id);if(e)e.style.display=id==='qsetup'?'block':'none'});}
function selQM(el){document.querySelectorAll('.qmc').forEach(c=>c.classList.remove('on'));el.classList.add('on');QQ.mode=el.dataset.mode;}
function startQuiz(){
  const n=+document.getElementById('qn').value;
  QQ.qs=[...AL].sort(()=>Math.random()-.5).slice(0,n);
  QQ.cur=0;QQ.score=0;QQ.ans=false;QQ.fkn=0;QQ.fnp=0;
  document.getElementById('qsetup').style.display='none';document.getElementById('qresult').style.display='none';
  const isType=['ptl','lttp','stp'].includes(QQ.mode);
  const isFC=QQ.mode==='fc';
  document.getElementById('fc-game').style.display=isFC?'block':'none';
  document.getElementById('qgame').style.display=(!isFC&&!isType)?'block':'none';
  document.getElementById('type-game').style.display=isType?'block':'none';
  if(isFC)renderFC();
  else if(isType)renderType();
  else renderQ();
}
function renderQ(){
  const q=QQ.qs[QQ.cur],n=QQ.qs.length,mode=QQ.mode;
  document.getElementById('qprog').textContent=`${QQ.cur+1}/${n}`;
  document.getElementById('qscr').textContent='Score: '+QQ.score;
  document.getElementById('qbf').style.width=(QQ.cur/n*100)+'%';
  const opts=[...AL.filter(l=>l.id!==q.id).sort(()=>Math.random()-.5).slice(0,3),q].sort(()=>Math.random()-.5);
  if(mode==='ltn'){
    document.getElementById('qlbl').textContent='What is this letter called?';
    document.getElementById('qqst').innerHTML=`<div class="qbl">${q.iso}</div>`;
    document.getElementById('qopts').innerHTML=opts.map(o=>
      `<button class="qob" onclick="ansQ(${o.id})" data-id="${o.id}">
        <span class="onm">${o.name}</span><span class="osnd">/${o.tr}/</span>
      </button>`).join('');
  } else if(mode==='latp'){
    document.getElementById('qlbl').textContent='Which letter makes this sound?';
    document.getElementById('qqst').innerHTML=`<div class="qbn">/${q.tr}/</div>`;
    document.getElementById('qopts').innerHTML=opts.map(o=>
      `<button class="qob" onclick="ansQ(${o.id})" data-id="${o.id}">
        <span class="ol">${o.iso}</span>
      </button>`).join('');
  } else if(mode==='stp'){
    // Hear sound → pick Persian letter
    document.getElementById('qlbl').textContent='Which letter makes this sound?';
    document.getElementById('qqst').innerHTML=
      `<button onclick="speakQ()" style="margin-top:4px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 24px;color:var(--gold);font-family:Raleway,sans-serif;font-size:.78rem;font-weight:600;cursor:pointer;letter-spacing:.5px">🔊 Play sound</button>`;
    document.getElementById('qopts').innerHTML=opts.map(o=>
      `<button class="qob" onclick="ansQ(${o.id})" data-id="${o.id}">
        <span class="ol">${o.iso}</span>
      </button>`).join('');
    setTimeout(()=>speakQ(),300);
  } else {
    document.getElementById('qlbl').textContent='What sound does this make?';
    document.getElementById('qqst').innerHTML=`<div class="qbl">${q.iso}</div>`;
    document.getElementById('qopts').innerHTML=opts.map(o=>
      `<button class="qob" onclick="ansQ(${o.id})" data-id="${o.id}">
        <span class="onm">/${o.tr}/</span>
      </button>`).join('');
  }
}
function speakQ(){/* silenced — audio files not yet available */}
function ansQ(aid){
  if(QQ.ans)return;QQ.ans=true;
  const ok=aid===QQ.qs[QQ.cur].id;if(ok)QQ.score++;S.quiz.tot++;if(ok)S.quiz.cor++;saveS();
  document.querySelectorAll('.qob').forEach(b=>{b.disabled=true;const bid=+b.dataset.id;if(bid===QQ.qs[QQ.cur].id)b.classList.add('correct');else if(bid===aid&&!ok)b.classList.add('wrong');});
  setTimeout(()=>{QQ.cur++;QQ.ans=false;QQ.cur>=QQ.qs.length?showQR():renderQ();},1050);
}

// ── TYPE GAME (ptl / lttp / stp-type) ──
let TY={answered:false};
function renderType(){
  const q=QQ.qs[QQ.cur],n=QQ.qs.length,mode=QQ.mode;
  TY.answered=false;
  document.getElementById('tprog').textContent=`${QQ.cur+1}/${n}`;
  document.getElementById('tscr').textContent='Score: '+QQ.score;
  document.getElementById('tbf').style.width=(QQ.cur/n*100)+'%';
  document.getElementById('type-feedback').textContent='';
  document.getElementById('type-feedback').className='type-feedback';
  const inp=document.getElementById('type-input');
  inp.value='';inp.disabled=false;
  inp.className='type-input'+(mode==='ptl'?' latin-in':'');
  document.getElementById('type-submit').disabled=true;
  // Show/hide Persian keyboard
  const kbd=document.getElementById('fa-kbd');
  if(kbd)kbd.style.display=(mode==='lttp')?'block':'none';
  const pr=document.getElementById('type-prompt');
  if(mode==='ptl'){
    inp.placeholder='Type the Latin sound (e.g. b, sh, kh)…';
    pr.innerHTML=`<div class="qbl">${q.iso}</div><div style="font-size:.62rem;color:var(--dim);margin-top:8px;letter-spacing:1px;text-transform:uppercase">Type the Latin transliteration</div>`;
    setTimeout(()=>inp.focus(),60);
  } else if(mode==='lttp'){
    inp.placeholder='';
    inp.readOnly=true; // keyboard-only for Persian
    pr.innerHTML=`<div class="qbn">/${q.tr}/</div><div style="font-size:.62rem;color:var(--dim);margin-top:8px;letter-spacing:1px;text-transform:uppercase">${q.name} — tap the Persian letter on the keyboard</div>`;
  }
}
function faKbdPress(ch){
  const inp=document.getElementById('type-input');
  if(!inp||inp.disabled)return;
  // For lttp mode only allow single character
  inp.value=ch;
  document.getElementById('type-submit').disabled=false;
  onTypeInput();
}
function faKbdDel(){
  const inp=document.getElementById('type-input');
  if(!inp||inp.disabled)return;
  inp.value='';
  document.getElementById('type-submit').disabled=true;
}
function onTypeInput(){
  const v=document.getElementById('type-input').value.trim();
  document.getElementById('type-submit').disabled=v.length===0;
}
function onTypeKey(e){if(e.key==='Enter')submitType();}
function normTr(s){return s.trim().toLowerCase().replace(/[āâ]/g,'a').replace(/ō/g,'o').replace(/ū/g,'u');}
function submitType(){
  if(TY.answered)return;
  const q=QQ.qs[QQ.cur],mode=QQ.mode;
  const raw=document.getElementById('type-input').value.trim();
  if(!raw)return;
  TY.answered=true;
  let correct=false;
  if(mode==='ptl'){
    // Accept any of the slash-separated transliterations
    const ans=normTr(raw);
    correct=q.tr.split('/').map(normTr).some(t=>ans===t);
  } else {
    // lttp: typed character must equal q.iso exactly (one character)
    correct=raw===q.iso;
  }
  if(correct)QQ.score++;
  S.quiz.tot++;if(correct)S.quiz.cor++;saveS();
  const inp=document.getElementById('type-input');
  inp.className='type-input'+(mode==='ptl'?' latin-in':'')+(correct?' correct':' wrong');
  const fb=document.getElementById('type-feedback');
  if(correct){
    fb.textContent='✓ Correct!';fb.className='type-feedback ok';
  } else {
    fb.textContent=mode==='ptl'?`✗ Answer: /${q.tr}/`:`✗ Answer: ${q.iso} (${q.name} · /${q.tr}/)`;
    fb.className='type-feedback err';
  }
  inp.disabled=true;document.getElementById('type-submit').disabled=true;
  setTimeout(advanceType,1300);
}
function skipType(){
  if(TY.answered)return;
  TY.answered=true;S.quiz.tot++;saveS();
  const q=QQ.qs[QQ.cur],mode=QQ.mode;
  document.getElementById('type-feedback').textContent=
    mode==='ptl'?`Skipped — answer: /${q.tr}/`:`Skipped — answer: ${q.iso} (${q.name} · /${q.tr}/)`;
  document.getElementById('type-feedback').className='type-feedback err';
  document.getElementById('type-input').disabled=true;
  setTimeout(advanceType,1500);
}
function advanceType(){QQ.cur++;if(QQ.cur>=QQ.qs.length)showQR();else renderType();}
function renderFC(){
  const q=QQ.qs[QQ.cur],n=QQ.qs.length;
  document.getElementById('fcprog').textContent=`${QQ.cur+1}/${n}`;document.getElementById('fcsco').textContent=`✓${QQ.fkn} ✗${QQ.fnp}`;
  document.getElementById('fcbf').style.width=(QQ.cur/n*100)+'%';
  document.getElementById('fcl').textContent=q.iso;document.getElementById('fcn').textContent=q.name;document.getElementById('fci').textContent=`${q.ipa} · /${q.tr}/`;
  document.getElementById('flashcard').classList.remove('rev');document.getElementById('fcbtns').style.display='none';
}
function revCard(){const c=document.getElementById('flashcard');if(!c.classList.contains('rev')){c.classList.add('rev');document.getElementById('fcbtns').style.display='grid';}}
function fcA(knew){if(knew)QQ.fkn++;else QQ.fnp++;S.quiz.tot++;if(knew)S.quiz.cor++;saveS();QQ.cur++;QQ.cur>=QQ.qs.length?(QQ.score=QQ.fkn,showQR()):renderFC();}
function showQR(){
  document.getElementById('qgame').style.display='none';document.getElementById('fc-game').style.display='none';
  document.getElementById('type-game').style.display='none';
  document.getElementById('qresult').style.display='block';
  const pct=QQ.score/QQ.qs.length;document.getElementById('res').textContent=`${QQ.score}/${QQ.qs.length}`;
  const[em,msg]=pct===1?['🏆','Perfect!']:pct>=.8?['⭐','Excellent!']:pct>=.6?['👍','Good progress!']:['💪','Keep studying!'];
  document.getElementById('ree').textContent=em;document.getElementById('remsg').textContent=msg;
}
function resetQuiz(){showQSetup();}

// ═══════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════
function renderProg(){
  const tot=S.quiz.tot,cor=S.quiz.cor,pct=tot>0?Math.round(cor/tot*100):null;
  const traced=AL.filter(l=>lv(l.id)>0).length;
  document.getElementById('stl').textContent=`${S.learned.size}/32`;document.getElementById('stt').textContent=`${traced}/32`;
  document.getElementById('stq').textContent=tot;document.getElementById('sta').textContent=pct!==null?pct+'%':'—';
  document.getElementById('acf').style.width=(pct||0)+'%';document.getElementById('acl').textContent=pct!==null?`${cor} of ${tot} correct`:'Complete a quiz first';
  document.getElementById('pgg').innerHTML=AL.map(l=>{
    const lvl=lv(l.id);const cls=lvl>=3?'pgi master':lvl>=2?'pgi m2':lvl>=1?'pgi m1':'pgi';
    return`<div class="${cls}" onclick="openM(${l.id})" title="${l.name}"><span class="pgi-ch">${l.iso}</span><span class="pgi-nm">${l.name}</span></div>`;
  }).join('');
}
function resetAll(){if(!confirm('Reset all progress?'))return;S.learned=new Set();S.quiz={tot:0,cor:0};S.prog={};saveS();renderProg();toast('Progress reset');}

// ═══════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════
function calcStreak(){
  const days=(S.stats.days||[]).slice().sort();
  if(!days.length)return 0;
  const today=new Date().toISOString().slice(0,10);
  // Check today or yesterday is included (streak not broken)
  const last=days[days.length-1];
  const diffMs=new Date(today)-new Date(last);
  if(diffMs>86400000*1.5)return 0; // more than ~1.5 days ago — streak broken
  let streak=1;
  for(let i=days.length-1;i>0;i--){
    const diff=(new Date(days[i])-new Date(days[i-1]))/86400000;
    if(diff<=1.5)streak++;else break;
  }
  return streak;
}
function renderStats(){
  const st=S.stats||{};
  const sessions=st.sessions||{};
  const forms=st.forms||{0:0,1:0,2:0,3:0};
  const totalSessions=Object.values(sessions).reduce((a,b)=>a+b,0);
  const lettersUsed=Object.keys(sessions).filter(k=>sessions[k]>0).length;
  const streak=calcStreak();
  document.getElementById('stat-total').textContent=totalSessions;
  document.getElementById('stat-letters').textContent=`${lettersUsed}/32`;
  document.getElementById('stat-streak').textContent=streak+'d';
  document.getElementById('sf-iso').textContent=forms[0]||0;
  document.getElementById('sf-ini').textContent=forms[1]||0;
  document.getElementById('sf-med').textContent=forms[2]||0;
  document.getElementById('sf-fin').textContent=forms[3]||0;
  const max=Math.max(1,...Object.values(sessions));
  document.getElementById('stat-letter-grid').innerHTML=AL.map(l=>{
    const cnt=sessions[l.id]||0;
    const pct=Math.round(cnt/max*100);
    const cls=cnt===0?'slc none':'slc';
    return`<div class="${cls}" onclick="openM(${l.id})" title="${l.name}: ${cnt} session${cnt!==1?'s':''}">
      <span class="slc-ch">${l.iso}</span>
      <span class="slc-nm">${l.name}</span>
      <span class="slc-cnt">${cnt>0?cnt:'-'}</span>
      <div class="slc-bar"><div class="slc-bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}
function resetStats(){
  if(!confirm('Reset all practice statistics?'))return;
  S.stats={sessions:{},forms:{0:0,1:0,2:0,3:0},days:[]};
  saveS();renderStats();toast('Statistics reset');
}

// ═══════════════════════════════════════
// IMPORT / EXPORT
// ═══════════════════════════════════════
function exportProgress(){
  const payload={
    version:2,
    exported:new Date().toISOString(),
    learned:[...S.learned],
    quiz:S.quiz,
    prog:S.prog,
    stats:S.stats,
  };
  const json=JSON.stringify(payload,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`alefbe-progress-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},200);
  toast('Progress exported ✓');
}
function importProgress(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const data=JSON.parse(e.target.result);
      if(!data.version||!data.learned){
        document.getElementById('import-status').textContent='✗ Invalid file — not an AlefBe export.';
        return;
      }
      if(!confirm(`Import progress from ${data.exported?.slice(0,10)||'unknown date'}? This will overwrite your current data.`)){input.value='';return;}
      S.learned=new Set(data.learned||[]);
      S.quiz=data.quiz||{tot:0,cor:0};
      S.prog=data.prog||{};
      S.stats=data.stats||{sessions:{},forms:{0:0,1:0,2:0,3:0},days:[]};
      saveS();
      renderProg();renderStats();renderAlpha(S.filter||'all');
      document.getElementById('import-status').textContent=`✓ Imported successfully (exported ${data.exported?.slice(0,10)||'unknown'})`;
      toast('Progress imported ✓');
    }catch(err){
      document.getElementById('import-status').textContent='✗ Error reading file: '+err.message;
    }
    input.value='';
  };
  reader.readAsText(file);
}

// ═══════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════
function toggleTheme(){
  document.body.classList.toggle('light');
  const on=document.body.classList.contains('light');
  document.getElementById('theme-btn').textContent=on?'🌙 Dark':'☀️ Light';
  localStorage.setItem('alefbe_theme',on?'light':'dark');
}
(function initTheme(){
  const theme=localStorage.getItem('alefbe_theme')||localStorage.getItem('alefba_theme');
  if(theme==='light'){
    document.body.classList.add('light');
    setTimeout(()=>{const b=document.getElementById('theme-btn');if(b)b.textContent='🌙 Dark';},0);
  }
})();

// ═══════════════════════════════════════
// WORD DATA  — used by Phonics, Word Builder, Connect Script, Dictionary
// ═══════════════════════════════════════
const WORDS=[
  // {fa:'Persian',tr:'transliteration',en:'meaning',cat:'category',letters:[ids...]}
  {fa:'آب',    tr:'âb',      en:'water',      cat:'nature'},
  {fa:'باد',   tr:'bâd',     en:'wind',       cat:'nature'},
  {fa:'دست',   tr:'dast',    en:'hand',       cat:'body'},
  {fa:'سر',    tr:'sar',     en:'head',       cat:'body'},
  {fa:'چشم',   tr:'cheshm',  en:'eye',        cat:'body'},
  {fa:'گل',    tr:'gol',     en:'flower',     cat:'nature'},
  {fa:'ماه',   tr:'mâh',     en:'moon',       cat:'nature'},
  {fa:'خورشید',tr:'khorshid',en:'sun',        cat:'nature'},
  {fa:'کتاب',  tr:'ketâb',   en:'book',       cat:'objects'},
  {fa:'درس',   tr:'dars',    en:'lesson',     cat:'learning'},
  {fa:'نور',   tr:'nur',     en:'light',      cat:'nature'},
  {fa:'شب',    tr:'shab',    en:'night',      cat:'time'},
  {fa:'روز',   tr:'ruz',     en:'day',        cat:'time'},
  {fa:'خانه',  tr:'khâne',   en:'house',      cat:'places'},
  {fa:'راه',   tr:'râh',     en:'road/way',   cat:'places'},
  {fa:'دل',    tr:'del',     en:'heart',      cat:'body'},
  {fa:'زبان',  tr:'zabân',   en:'language',   cat:'learning'},
  {fa:'نام',   tr:'nâm',     en:'name',       cat:'general'},
  {fa:'مرد',   tr:'mard',    en:'man',        cat:'people'},
  {fa:'زن',    tr:'zan',     en:'woman',      cat:'people'},
  {fa:'بچه',   tr:'bache',   en:'child',      cat:'people'},
  {fa:'دوست',  tr:'dust',    en:'friend',     cat:'people'},
  {fa:'پدر',   tr:'pedar',   en:'father',     cat:'people'},
  {fa:'مادر',  tr:'mâdar',   en:'mother',     cat:'people'},
  {fa:'نان',   tr:'nân',     en:'bread',      cat:'food'},
  {fa:'آش',    tr:'âsh',     en:'soup',       cat:'food'},
  {fa:'چای',   tr:'châi',    en:'tea',        cat:'food'},
  {fa:'میوه',  tr:'mive',    en:'fruit',      cat:'food'},
  {fa:'رنگ',   tr:'rang',    en:'color',      cat:'general'},
  {fa:'زمان',  tr:'zamân',   en:'time',       cat:'time'},
  {fa:'درخت',  tr:'derakht', en:'tree',       cat:'nature'},
  {fa:'کوه',   tr:'kuh',     en:'mountain',   cat:'nature'},
  {fa:'دریا',  tr:'daryâ',   en:'sea',        cat:'nature'},
  {fa:'آسمان', tr:'âsmân',   en:'sky',        cat:'nature'},
  {fa:'زمین',  tr:'zamin',   en:'earth/ground',cat:'nature'},
  {fa:'آتش',   tr:'âtash',   en:'fire',       cat:'nature'},
  {fa:'سنگ',   tr:'sang',    en:'stone',      cat:'nature'},
  {fa:'مدرسه', tr:'madrase', en:'school',     cat:'places'},
  {fa:'شهر',   tr:'shahr',   en:'city',       cat:'places'},
  {fa:'روستا', tr:'rustâ',   en:'village',    cat:'places'},
  {fa:'قلب',   tr:'qalb',    en:'heart',      cat:'body'},
  {fa:'عشق',   tr:'eshq',    en:'love',       cat:'feelings'},
  {fa:'شادی',  tr:'shâdi',   en:'joy',        cat:'feelings'},
  {fa:'غم',    tr:'gham',    en:'sorrow',     cat:'feelings'},
  {fa:'امید',  tr:'omid',    en:'hope',       cat:'feelings'},
  {fa:'صبر',   tr:'sabr',    en:'patience',   cat:'feelings'},
  {fa:'خوب',   tr:'khub',    en:'good',       cat:'adjectives'},
  {fa:'بد',    tr:'bad',     en:'bad',        cat:'adjectives'},
  {fa:'بزرگ',  tr:'bozorg',  en:'big',        cat:'adjectives'},
  {fa:'کوچک',  tr:'kuchak',  en:'small',      cat:'adjectives'},
  {fa:'سفید',  tr:'sefid',   en:'white',      cat:'adjectives'},
  {fa:'سیاه',  tr:'siyâh',   en:'black',      cat:'adjectives'},
  {fa:'سبز',   tr:'sabz',    en:'green',      cat:'adjectives'},
  {fa:'سرخ',   tr:'sorkh',   en:'red',        cat:'adjectives'},
  {fa:'آبی',   tr:'âbi',     en:'blue',       cat:'adjectives'},
  {fa:'رفتن',  tr:'raftan',  en:'to go',      cat:'verbs'},
  {fa:'آمدن',  tr:'âmadan',  en:'to come',    cat:'verbs'},
  {fa:'خواندن',tr:'khândan', en:'to read',    cat:'verbs'},
  {fa:'نوشتن', tr:'neveshtan',en:'to write',  cat:'verbs'},
  {fa:'دیدن',  tr:'didan',   en:'to see',     cat:'verbs'},
];
const DICT_CATS=['all','nature','body','people','food','places','time','feelings','adjectives','verbs','learning','objects','general'];

// ═══════════════════════════════════════
// PHONICS
// ═══════════════════════════════════════
let PH={mode:0,q:[],cur:0,score:0,answer:[],word:null};
function selPHMode(el){
  document.querySelectorAll('[data-phmode]').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  PH.mode=+el.dataset.phmode;
}
function showPHSetup(){
  document.getElementById('ph-setup').style.display='block';
  document.getElementById('ph-game').style.display='none';
  document.getElementById('ph-result').style.display='none';
}
function startPhonics(){
  const countVal=+document.getElementById('ph-count').value;
  const pool=WORDS.filter(w=>w.fa.length>=2&&w.fa.length<=7);
  PH.q=[...pool].sort(()=>Math.random()-.5).slice(0,Math.min(countVal,pool.length));
  PH.cur=0;PH.score=0;PH.answer=[];
  document.getElementById('ph-setup').style.display='none';
  document.getElementById('ph-result').style.display='none';
  document.getElementById('ph-game').style.display='block';
  document.getElementById('ph-mode-lbl').textContent=PH.mode===0?'Persian → Latin':'Latin → Persian';
  renderPhonics();
}
function renderPhonics(){
  const w=PH.q[PH.cur];PH.word=w;PH.answer=[];
  document.getElementById('ph-score').textContent=`${PH.score}/${PH.cur}`;
  document.getElementById('ph-bar').style.width=(PH.cur/PH.q.length*100)+'%';
  document.getElementById('ph-fb').textContent='';document.getElementById('ph-fb').className='type-feedback';
  document.getElementById('ph-check').disabled=true;

  if(PH.mode===0){
    // Persian word → tap Latin tiles to spell transliteration
    document.getElementById('ph-word').textContent=w.fa;
    document.getElementById('ph-hint').textContent='Spell the sound in Latin letters';
    const target=w.tr.replace(/[^a-zâêîôûāēīōū]/gi,'').toLowerCase();
    PH._target=target;
    document.getElementById('ph-slots').innerHTML=target.split('').map((_,i)=>
      `<div class="ph-slot latin" id="ph-s${i}"></div>`).join('');
    // One chip per letter in target (allows duplicates), plus distractors
    const targetChars=target.split('');
    const distChars='bpdtszkhlrmngvfjqwy'.split('').filter(c=>!targetChars.includes(c))
      .sort(()=>Math.random()-.5).slice(0,4);
    const choices=[...targetChars,...distChars].sort(()=>Math.random()-.5);
    document.getElementById('ph-choices').innerHTML=choices.map((c,i)=>
      `<div class="ph-chip latin-chip" id="phc${i}" onclick="tapPHChip('${c}',${i})">${c}</div>`).join('');
  } else {
    // Latin → tap Persian tiles to build word
    document.getElementById('ph-word').textContent='/'+w.tr+'/';
    document.getElementById('ph-hint').textContent='"'+w.en+'" — tap the Persian letters in order';
    PH._target=w.fa;
    const n=w.fa.length;
    document.getElementById('ph-slots').innerHTML=[...Array(n)].map((_,i)=>
      `<div class="ph-slot" id="ph-s${i}"></div>`).join('');
    // One chip per character in target (preserves duplicates), plus distractors
    const targetChars=[...w.fa];
    const usedIsos=new Set(targetChars);
    const distract=AL.filter(l=>!usedIsos.has(l.iso)).sort(()=>Math.random()-.5).map(l=>l.iso).slice(0,4);
    const choices=[...targetChars,...distract].sort(()=>Math.random()-.5);
    document.getElementById('ph-choices').innerHTML=choices.map((c,i)=>
      `<div class="ph-chip" id="phc${i}" onclick="tapPHChip('${c}',${i})">${c}</div>`).join('');
  }
}
function tapPHChip(ch,idx){
  const chip=document.getElementById('phc'+idx);
  if(!chip||chip.classList.contains('used'))return;
  const pos=PH.answer.length;
  const target=PH._target;
  if(pos>=target.length)return;
  PH.answer.push({ch,idx});
  chip.classList.add('used');
  const slot=document.getElementById('ph-s'+pos);
  if(slot){slot.textContent=ch;slot.classList.add('filled');}
  if(PH.answer.length===target.length)document.getElementById('ph-check').disabled=false;
}
function phBackspace(){
  if(!PH.answer.length)return;
  const last=PH.answer.pop();
  const chip=document.getElementById('phc'+last.idx);
  if(chip)chip.classList.remove('used');
  const slot=document.getElementById('ph-s'+PH.answer.length);
  if(slot){slot.textContent='';slot.classList.remove('filled');}
  document.getElementById('ph-check').disabled=true;
}
function checkPhonics(){
  const typed=PH.answer.map(a=>a.ch).join('');
  const target=PH._target;
  const ok=typed===target;
  if(ok)PH.score++;
  document.getElementById('ph-check').disabled=true;
  // Colour slots
  [...target].forEach((_,i)=>{
    const slot=document.getElementById('ph-s'+i);
    if(slot)slot.classList.add(ok?'correct':'wrong');
  });
  const fb=document.getElementById('ph-fb');
  fb.className='type-feedback '+(ok?'ok':'err');
  fb.textContent=ok?'✓ Correct!':`✗ Answer: ${target}`;
  setTimeout(advPhonics,1200);
}
function skipPhonics(){
  const fb=document.getElementById('ph-fb');
  fb.className='type-feedback err';fb.textContent=`Skipped — answer: ${PH._target}`;
  document.getElementById('ph-check').disabled=true;
  setTimeout(advPhonics,1400);
}
function advPhonics(){
  PH.cur++;
  if(PH.cur>=PH.q.length){showPhResult();return;}
  PH.answer=[];renderPhonics();
}
function showPhResult(){
  document.getElementById('ph-game').style.display='none';
  document.getElementById('ph-result').style.display='block';
  const pct=PH.score/PH.q.length;
  const[em,ti]=pct===1?['🏆','Perfect!']:pct>=.75?['⭐','Excellent!']:pct>=.5?['👍','Good!']:['💪','Keep going!'];
  document.getElementById('ph-ree').textContent=em;
  document.getElementById('ph-rtt').textContent=ti;
  document.getElementById('ph-rsu').textContent=`${PH.score} of ${PH.q.length} correct`;
  document.getElementById('ph-score').textContent=`${PH.score}/${PH.q.length}`;
}

// ═══════════════════════════════════════
// GAMES: WORD BUILDER
// ═══════════════════════════════════════
let WB={q:[],cur:0,score:0,answer:[],word:null,mode:'wb'};
function startGame(mode){
  ['wb-panel','cs-panel','sd-panel','game-result'].forEach(id=>document.getElementById(id).style.display='none');
  WB.mode=mode;
  if(mode==='wb'){startWB();}
  else if(mode==='cs'){startCS();}
  else if(mode==='sd'){startSD();}
}
function restartGame(){
  document.getElementById('game-result').style.display='none';
  startGame(WB.mode);
}
function backToGames(){
  ['wb-panel','cs-panel','sd-panel','game-result'].forEach(id=>document.getElementById(id).style.display='none');
}
function showGameResult(score,total){
  ['wb-panel','cs-panel','sd-panel'].forEach(id=>document.getElementById(id).style.display='none');
  const el=document.getElementById('game-result');el.style.display='block';
  const pct=score/total;
  const[em,ti]=pct===1?['🏆','Perfect!']:pct>=.75?['⭐','Excellent!']:pct>=.5?['👍','Good!']:['💪','Keep going!'];
  document.getElementById('gr-ree').textContent=em;
  document.getElementById('gr-rtt').textContent=ti;
  document.getElementById('gr-rsu').textContent=`${score} of ${total} correct`;
}
function startWB(){
  WB.q=WORDS.filter(w=>w.fa.length>=3&&w.fa.length<=6).sort(()=>Math.random()-.5).slice(0,10);
  WB.cur=0;WB.score=0;
  document.getElementById('wb-panel').style.display='block';
  renderWB();
}
function renderWB(){
  const w=WB.q[WB.cur];WB.word=w;WB.answer=[];
  document.getElementById('wb-score').textContent=`${WB.score}/${WB.cur}`;
  document.getElementById('wb-bar').style.width=(WB.cur/WB.q.length*100)+'%';
  document.getElementById('wb-hint').textContent=`"${w.en}" · /${w.tr}/`;
  document.getElementById('wb-fb').textContent='';document.getElementById('wb-fb').className='type-feedback';
  document.getElementById('wb-check').disabled=true;
  // Slots
  const n=w.fa.length;
  document.getElementById('wb-slots').innerHTML=[...Array(n)].map((_,i)=>
    `<div class="wb-slot" id="wbs${i}"></div>`).join('');
  // Shuffle letter tiles
  const tiles=[...w.fa].map((c,i)=>({c,i})).sort(()=>Math.random()-.5);
  WB._tiles=tiles;WB._orig=[...w.fa];
  document.getElementById('wb-tiles').innerHTML=tiles.map((t,i)=>
    `<div class="wb-tile" id="wbt${i}" onclick="tapWB(${i})">${t.c}</div>`).join('');
}
function tapWB(tileIdx){
  const tile=document.getElementById('wbt'+tileIdx);
  if(!tile||tile.classList.contains('used'))return;
  const pos=WB.answer.length;
  if(pos>=WB._orig.length)return;
  WB.answer.push({c:WB._tiles[tileIdx].c,tileIdx});
  tile.classList.add('used');
  const slot=document.getElementById('wbs'+pos);
  if(slot){slot.textContent=WB._tiles[tileIdx].c;slot.classList.add('placed');}
  if(WB.answer.length===WB._orig.length)document.getElementById('wb-check').disabled=false;
}
function wbBackspace(){
  if(!WB.answer.length)return;
  const last=WB.answer.pop();
  const tile=document.getElementById('wbt'+last.tileIdx);
  if(tile)tile.classList.remove('used');
  const slot=document.getElementById('wbs'+WB.answer.length);
  if(slot){slot.textContent='';slot.classList.remove('placed');}
  document.getElementById('wb-check').disabled=true;
}
function checkWB(){
  const typed=WB.answer.map(a=>a.c).join('');
  const ok=typed===WB._orig.join('');
  if(ok)WB.score++;
  document.getElementById('wb-check').disabled=true;
  [...WB._orig].forEach((_,i)=>{
    const s=document.getElementById('wbs'+i);if(s)s.classList.add(ok?'correct':'wrong');
  });
  const fb=document.getElementById('wb-fb');
  fb.className='type-feedback '+(ok?'ok':'err');
  fb.textContent=ok?'✓ Correct!':`✗ Answer: ${WB._orig.join('')}`;
  setTimeout(advWB,1200);
}
function skipWB(){
  document.getElementById('wb-fb').className='type-feedback err';
  document.getElementById('wb-fb').textContent=`Skipped — answer: ${WB._orig.join('')}`;
  document.getElementById('wb-check').disabled=true;
  setTimeout(advWB,1400);
}
function advWB(){
  WB.cur++;
  if(WB.cur>=WB.q.length){showGameResult(WB.score,WB.q.length);return;}
  WB.answer=[];renderWB();
}

// ═══════════════════════════════════════
// GAMES: CONNECT THE SCRIPT
// ═══════════════════════════════════════
let CS={q:[],cur:0,score:0,step:0,word:null};
function startCS(){
  // Each question: show a word, ask to identify each letter in sequence
  CS.q=WORDS.filter(w=>w.fa.length>=2&&w.fa.length<=4).sort(()=>Math.random()-.5).slice(0,8);
  CS.cur=0;CS.score=0;CS.step=0;
  document.getElementById('cs-panel').style.display='block';
  renderCS();
}
function renderCS(){
  const w=CS.q[CS.cur];CS.word=w;CS.step=0;
  document.getElementById('cs-score').textContent=`${CS.score}/${CS.cur}`;
  document.getElementById('cs-bar').style.width=(CS.cur/CS.q.length*100)+'%';
  document.getElementById('cs-word').textContent=w.fa;
  document.getElementById('cs-fb').textContent='';document.getElementById('cs-fb').className='type-feedback';
  renderCSStep();
}
function renderCSStep(){
  const w=CS.word;
  const letters=[...w.fa];
  const target=letters[CS.step];
  document.getElementById('cs-word').innerHTML=letters.map((c,i)=>
    `<span style="${i===CS.step?'color:var(--blue);text-shadow:0 0 20px rgba(59,130,246,.5)':i<CS.step?'color:var(--ok)':'color:var(--gold)'}">${c}</span>`).join('');
  document.getElementById('cs-question').textContent=`Letter ${CS.step+1} of ${letters.length} — "${w.en}" · ${w.fa} · /${w.tr}/`;
  const correct=AL.find(l=>l.iso===target||l.fin===target||l.ini===target||l.med===target)||AL[0];
  const wrong=AL.filter(l=>l.id!==correct.id).sort(()=>Math.random()-.5).slice(0,3);
  const opts=[correct,...wrong].sort(()=>Math.random()-.5);
  document.getElementById('cs-opts').innerHTML=opts.map(l=>
    `<div class="cs-opt" data-id="${l.id}" data-correct="${correct.id}" onclick="ansCS(${l.id},${correct.id})">${l.iso}<div style="font-size:.52rem;font-family:Raleway,sans-serif;color:var(--dim);margin-top:2px">${l.name}</div></div>`).join('');
}
function ansCS(aid,cid){
  const ok=aid===cid;
  if(ok)CS.score++;
  document.querySelectorAll('.cs-opt').forEach(b=>{
    b.onclick=null;
    const bid=+b.dataset.id;
    if(bid===cid)b.classList.add('correct');
    else if(bid===aid&&!ok)b.classList.add('wrong');
  });
  const fb=document.getElementById('cs-fb');
  fb.className='type-feedback '+(ok?'ok':'err');
  const correctL=AL.find(l=>l.id===cid);
  fb.textContent=ok?'✓ Correct!':`✗ It was: ${correctL?.iso} (${correctL?.name})`;
  setTimeout(()=>{
    CS.step++;
    fb.textContent='';fb.className='type-feedback';
    if(CS.step>=[...CS.word.fa].length){
      CS.cur++;
      if(CS.cur>=CS.q.length)showGameResult(CS.score,CS.q.length);
      else renderCS();
    } else {
      renderCSStep();
    }
  },900);
}

// ═══════════════════════════════════════
// GAMES: SPEED DRILL
// ═══════════════════════════════════════
let SD={q:[],cur:0,score:0,showTimer:null,speed:2000,active:false};
function setSDSpeed(ms,btn){
  SD.speed=ms;
  document.querySelectorAll('.sd-spbtn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
}
function startSD(){
  clearTimeout(SD.showTimer);
  SD.q=[...AL].sort(()=>Math.random()-.5).slice(0,16);
  SD.cur=0;SD.score=0;SD.active=true;
  document.getElementById('sd-panel').style.display='block';
  document.getElementById('game-result').style.display='none';
  renderSD();
}
function renderSD(){
  if(!SD.active||SD.cur>=SD.q.length)return;
  const l=SD.q[SD.cur];
  clearTimeout(SD.showTimer);
  // Reset UI
  const fb=document.getElementById('sd-fb');
  if(fb){fb.textContent='';fb.className='type-feedback';}
  const sc=document.getElementById('sd-score');
  if(sc)sc.textContent=`${SD.score}/${SD.cur}`;
  const bar=document.getElementById('sd-bar');
  if(bar)bar.style.width=(SD.cur/SD.q.length*100)+'%';
  // Clear choices
  const choicesEl=document.getElementById('sd-choices');
  if(choicesEl)choicesEl.innerHTML='';
  // Show letter
  const letterEl=document.getElementById('sd-letter');
  if(letterEl){letterEl.textContent=l.iso;letterEl.style.opacity='1';}
  // Timer bar animation
  const fill=document.getElementById('sd-timer-fill');
  if(fill){
    fill.style.transition='none';fill.style.width='100%';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      fill.style.transition=`width ${SD.speed}ms linear`;fill.style.width='0%';
    }));
  }
  // Hide letter after SD.speed ms, then show choices
  SD.showTimer=setTimeout(()=>{
    if(letterEl)letterEl.style.opacity='0';
    if(fill){fill.style.transition='none';fill.style.width='0%';}
    setTimeout(()=>showSDChoices(l),150);
  },SD.speed);
}
function showSDChoices(l){
  if(!SD.active)return;
  const wrong=AL.filter(x=>x.id!==l.id).sort(()=>Math.random()-.5).slice(0,3);
  const opts=[l,...wrong].sort(()=>Math.random()-.5);
  const el=document.getElementById('sd-choices');
  if(!el)return;
  el.innerHTML=opts.map(o=>
    `<button class="sd-opt" data-id="${o.id}" onclick="ansSD(${o.id},${l.id})">${o.name} /${o.tr}/</button>`
  ).join('');
}
function ansSD(aid,cid){
  if(!SD.active)return;
  clearTimeout(SD.showTimer);
  const ok=aid===cid;if(ok)SD.score++;
  document.querySelectorAll('.sd-opt').forEach(b=>{
    b.disabled=true;
    const bid=+b.dataset.id;
    if(bid===cid)b.classList.add('correct');
    else if(bid===aid&&!ok)b.classList.add('wrong');
  });
  // Show the letter again briefly
  const letterEl=document.getElementById('sd-letter');
  const correct=SD.q[SD.cur];
  if(letterEl){letterEl.textContent=correct.iso;letterEl.style.opacity='1';}
  const fb=document.getElementById('sd-fb');
  if(fb){
    fb.className='type-feedback '+(ok?'ok':'err');
    fb.textContent=ok?'✓ Correct!':`✗ It was: ${correct.name} /${correct.tr}/`;
  }
  setTimeout(()=>{
    SD.cur++;
    if(SD.cur>=SD.q.length){
      SD.active=false;
      showGameResult(SD.score,SD.q.length);
    } else {
      renderSD();
    }
  },1100);
}

// ═══════════════════════════════════════
// REFERENCE: DIACRITICS & NUMBERS
// ═══════════════════════════════════════
const DIACRITICS=[
  {sym:'بَ', name:'Fatha', tr:'a', desc:'Short /a/ vowel. Placed above a letter. بَ = "ba"'},
  {sym:'بِ', name:'Kasra', tr:'e/i', desc:'Short /e/ or /i/ vowel. Placed below a letter. بِ = "be"'},
  {sym:'بُ', name:'Damma', tr:'o/u', desc:'Short /o/ or /u/ vowel. Placed above a letter. بُ = "bo"'},
  {sym:'بً', name:'Tanvin Fath', tr:'an', desc:'Double fatha = "-an" sound, used on indefinite nouns ending in fatha.'},
  {sym:'بٍ', name:'Tanvin Kasr', tr:'en/in', desc:'Double kasra = "-en/-in" sound, on indefinite nouns.'},
  {sym:'بٌ', name:'Tanvin Damm', tr:'on/un', desc:'Double damma = "-on/-un" sound, on indefinite nouns.'},
  {sym:'بْ', name:'Sukun', tr:'(no vowel)', desc:'Indicates the letter carries no vowel — consonant only. بْ = pure "b".'},
  {sym:'بّ', name:'Tashdid', tr:'(geminate)', desc:'Doubles the consonant. کَبَّر = "kabbar" (the ب is doubled).'},
];
const DIAC_OTHER=[
  {sym:'آ', name:'Madda', tr:'â', desc:'Alef with madda above = long /â/ vowel. Very common at the start of words: آب (âb = water).'},
  {sym:'ء', name:'Hamza', tr:'ʔ', desc:'Glottal stop. Can sit alone or on a carrier: أ إ ؤ ئ. Common in loanwords and classical text.'},
  {sym:'ـ', name:'Tatweel', tr:'(stretch)', desc:'Elongates the preceding letter horizontally for calligraphic or typographic emphasis. Purely visual.'},
  {sym:'٪', name:'Percent', tr:'%', desc:'Persian/Arabic percent sign, used in place of % in Persian typography.'},
];
const NUMS=[
  {fa:'۰',val:0,pr:'sefr'},
  {fa:'۱',val:1,pr:'yek'},
  {fa:'۲',val:2,pr:'do'},
  {fa:'۳',val:3,pr:'se'},
  {fa:'۴',val:4,pr:'chahâr'},
  {fa:'۵',val:5,pr:'panj'},
  {fa:'۶',val:6,pr:'shesh'},
  {fa:'۷',val:7,pr:'haft'},
  {fa:'۸',val:8,pr:'hasht'},
  {fa:'۹',val:9,pr:'noh'},
];

function renderRef(){
  document.getElementById('diac-grid').innerHTML=DIACRITICS.map(d=>
    `<div class="diac-card">
      <span class="diac-sym">${d.sym}</span>
      <div class="diac-name">${d.name}</div>
      <div class="diac-tr">/${d.tr}/</div>
      <div class="diac-desc">${d.desc}</div>
    </div>`).join('');
  document.getElementById('diac-other-grid').innerHTML=DIAC_OTHER.map(d=>
    `<div class="diac-card">
      <span class="diac-sym">${d.sym}</span>
      <div class="diac-name">${d.name}</div>
      <div class="diac-tr">${d.tr}</div>
      <div class="diac-desc">${d.desc}</div>
    </div>`).join('');
  document.getElementById('num-grid').innerHTML=NUMS.map(n=>
    `<div class="num-card">
      <span class="num-fa">${n.fa}</span>
      <span class="num-val">${n.val}</span>
      <span style="font-size:.58rem;color:var(--dim);font-style:italic;display:block;margin-top:2px">${n.pr}</span>
    </div>`).join('');
}

// ═══════════════════════════════════════
// CHAR → LETTER  (handles alef variants, diacritics, tatweel)
// ═══════════════════════════════════════
// Map of Unicode code points that aren't in AL.iso but map to a known letter
const CHAR_MAP={
  'آ':0,  // alef with madda → Alef
  'أ':0,  // alef with hamza above → Alef
  'إ':0,  // alef with hamza below → Alef
  'ا':0,  // plain alef → Alef (redundant but explicit)
  'ب':1,'پ':2,'ت':3,'ث':4,'ج':5,'چ':6,'ح':7,'خ':8,
  'د':9,'ذ':10,'ر':11,'ز':12,'ژ':13,'س':14,'ش':15,
  'ص':16,'ض':17,'ط':18,'ظ':19,'ع':20,'غ':21,'ف':22,
  'ق':23,'ک':24,'ك':24, // Arabic kaf → Kaf
  'گ':25,'ل':26,'م':27,'ن':28,'و':29,'ه':30,'ة':30, // ta marbuta → He
  'ی':31,'ي':31,'ى':31, // Arabic ya variants → Ye
};
// Characters to silently skip when breaking a word into letter badges
const SKIP_CHARS=new Set([
  'ـ','\u200c','\u200d',' ',
  // diacritics (combining marks U+064B–U+065F, U+0670, U+06D6–U+06DC)
  '\u064B','\u064C','\u064D','\u064E','\u064F','\u0650',
  '\u0651','\u0652','\u0653','\u0654','\u0655','\u0656',
  '\u0657','\u0658','\u0659','\u065A','\u065B','\u065C',
  '\u065D','\u065E','\u065F','\u0670','\u06D6','\u06D7',
  '\u06D8','\u06D9','\u06DA','\u06DB','\u06DC',
]);
function charToLetterId(c){
  // Direct map first
  if(c in CHAR_MAP)return CHAR_MAP[c];
  // Fallback: check every form of every letter
  const l=AL.find(a=>a.iso===c||a.fin===c||a.ini===c||a.med===c);
  return l?l.id:null;
}

// ═══════════════════════════════════════
// DICTIONARY — with explicit per-word letter lists
// ═══════════════════════════════════════

let DictCat='all',DictSearch='';
function renderDict(){
  // Category pills
  document.getElementById('dict-cats').innerHTML=DICT_CATS.map(c=>
    `<button class="dict-cat-btn${c===DictCat?' on':''}" onclick="setDictCat('${c}',this)">${c}</button>`).join('');
  filterDict();
}
function setDictCat(c,btn){
  DictCat=c;
  document.querySelectorAll('.dict-cat-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  filterDict();
}
function filterDict(){
  const q=(document.getElementById('dict-search')?.value||'').toLowerCase().trim();DictSearch=q;
  let words=WORDS;
  if(DictCat!=='all')words=words.filter(w=>w.cat===DictCat);
  if(q)words=words.filter(w=>w.fa.includes(q)||w.tr.toLowerCase().includes(q)||w.en.toLowerCase().includes(q));
  const grid=document.getElementById('dict-grid');
  if(!words.length){grid.innerHTML=`<div class="dict-empty">No words found</div>`;return;}
  grid.innerHTML=words.map(w=>{
    // Break word char-by-char, skip joiners/diacritics, map remaining to letter ids
    const seen=new Set(); // for badge dedup display: show each unique letter once in order
    const letterIds=[];
    [...w.fa].forEach(c=>{
      if(SKIP_CHARS.has(c))return;
      const id=charToLetterId(c);
      if(id!==null&&!seen.has(id)){seen.add(id);letterIds.push(id);}
    });
    const badges=letterIds.map(id=>{
      const l=AL[id];
      return`<span class="dict-lbadge" onclick="openM(${id})" title="${l.name} · /${l.tr}/">${l.iso}</span>`;
    }).join('');
    return`<div class="dict-card">
      <div class="dict-word">${w.fa}</div>
      <div class="dict-info">
        <div class="dict-tr">${w.tr}</div>
        <div class="dict-meaning">${w.en} <span style="color:var(--dim);font-size:.65rem">· ${w.cat}</span></div>
        <div class="dict-letters">${badges}</div>
      </div>
      <button class="dict-play" onclick="speakWord('${w.fa}')" title="Listen">🔊</button>
    </div>`;
  }).join('');
}
function speakWord(fa){
  // Dictionary word audio — not yet available.
  // Audio files should be placed in data/audio/words/ named by transliteration (see list below).
  // Uncomment when files are ready:
  // const wordEntry = WORDS.find(w => w.fa === fa);
  // if (!wordEntry) return;
  // const audio = new Audio(`data/audio/words/${wordEntry.tr.replace(/\//g,'-')}.mp3`);
  // audio.play().catch(()=>{});
}

// INIT
function countUp(el,t,s){let c=0;const iv=setInterval(()=>{c=Math.min(c+Math.ceil(t/18),t);el.textContent=c+s;if(c>=t)clearInterval(iv);},18);}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2100);}
// Page-specific init is handled in each HTML file
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM();});

// Auto-load state on every page
loadS();
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.getElementById('modal-wrap');if(m)m.classList.remove('open');}});
