const exportToCsv = require("export-to-csv");
const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const userWalletToUpdate = [
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "LTC",
    "walletAmount": 303.81390417,
    "walletAddress": "MFx5AfwaUG6sPTshPDQCGJZoDeDEQ2xf16"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "ETH",
    "walletAmount": 0.56682722,
    "walletAddress": "0xe6846737FBe41690ae0AC23ADb3A4Ecd2A09F3b0"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "BCH",
    "walletAmount": 10.20789987,
    "walletAddress": "36peb4fuNjxvCUvFfsbTmWxnMK9HCoa2na"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "AED",
    "walletAmount": 823221.61129685,
    "walletAddress": "undefined"
  },
  {
    "user": "Nancy Elabd",
    "email": "diaaaboshokka@gmail.com",
    "viabtcUserId": 600003,
    "coin": "BTC",
    "walletAmount": 0.0235,
    "walletAddress": "3EDWubfhsixdL818oUetqZaQUWjPkSQaoe"
  },
  {
    "user": "-",
    "email": "-",
    "viabtcUserId": "-",
    "coin": "BTC",
    "walletAmount": 0.00005,
    "walletAddress": "3M2Mo1LcZRJE3xdfa7edzMbUsdugvxivpn"
  },
  {
    "user": "Bitex Gmail",
    "email": "bitexuae@gmail.com",
    "viabtcUserId": 600007,
    "coin": "LTC",
    "walletAmount": 0.01,
    "walletAddress": "M9D1aCzT9iBDYU6gieP11A7MqoZxmy3by2"
  },
  {
    "user": "Main Admin",
    "email": "admin@bitexuae.com",
    "viabtcUserId": 600013,
    "coin": "AED",
    "walletAmount": 1000000,
    "walletAddress": ""
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi111@gmail.com",
    "viabtcUserId": 600014,
    "coin": "AED",
    "walletAmount": 5485.9,
    "walletAddress": ""
  },
  {
    "user": "Dragos Dumitrascu",
    "email": "dragos_bitex@objectmail.com",
    "viabtcUserId": 600017,
    "coin": "AED",
    "walletAmount": 16.167,
    "walletAddress": ""
  },
  {
    "user": "Ahmed Mohamed Mohamed Abdelaty Hefny",
    "email": "omarahmedmohamed.1982@gmail.com",
    "viabtcUserId": 600021,
    "coin": "AED",
    "walletAmount": 0.5697,
    "walletAddress": ""
  },
  {
    "user": "Furqan Samdani",
    "email": "furqan7@gmail.com",
    "viabtcUserId": 600030,
    "coin": "AED",
    "walletAmount": 0.4606,
    "walletAddress": ""
  },
  {
    "user": "Sameer Khan",
    "email": "sosolid786@gmail.com",
    "viabtcUserId": 600031,
    "coin": "AED",
    "walletAmount": 1.815,
    "walletAddress": ""
  },
  {
    "user": "Tawhid Al Sharif",
    "email": "tawhid.alsharif@gmail.com",
    "viabtcUserId": 600036,
    "coin": "AED",
    "walletAmount": 1.0877,
    "walletAddress": ""
  },
  {
    "user": "Mubarak Saeed",
    "email": "mubarakalmutawa83@gmail.com",
    "viabtcUserId": 600050,
    "coin": "AED",
    "walletAmount": 1.1321,
    "walletAddress": ""
  },
  {
    "user": "Martin Walter Stefan Richter",
    "email": "combinefoundation@protonmail.com",
    "viabtcUserId": 600093,
    "coin": "AED",
    "walletAmount": 50.9997,
    "walletAddress": ""
  },
  {
    "user": "Rahil Alam",
    "email": "rahilalam83@gmail.com",
    "viabtcUserId": 600130,
    "coin": "AED",
    "walletAmount": 1.02,
    "walletAddress": ""
  },
  {
    "user": "Abrar Hussain",
    "email": "abrarhussainalam@protonmail.com",
    "viabtcUserId": 600131,
    "coin": "AED",
    "walletAmount": 0.1699,
    "walletAddress": ""
  },
  {
    "user": "Alaaeldin Mohamed Gabr",
    "email": "alaagbr5@gmail.com",
    "viabtcUserId": 600160,
    "coin": "AED",
    "walletAmount": 0.278,
    "walletAddress": ""
  },
  {
    "user": "Demo Account",
    "email": "demoacc@gmail.com",
    "viabtcUserId": 600161,
    "coin": "AED",
    "walletAmount": 482.189,
    "walletAddress": ""
  },
  {
    "user": "Razvan Baciu",
    "email": "just1razz@gmail.com",
    "viabtcUserId": 600167,
    "coin": "AED",
    "walletAmount": 0.5296,
    "walletAddress": ""
  },
  {
    "user": "Umar KHALID",
    "email": "umarkhalid2@gmail.com",
    "viabtcUserId": 600200,
    "coin": "AED",
    "walletAmount": 1.063,
    "walletAddress": ""
  },
  {
    "user": "Radhakrishnan Seetharaman Radhakrishnan Seetharaman",
    "email": "sitharam26@gmail.com",
    "viabtcUserId": 600239,
    "coin": "AED",
    "walletAmount": 2.0847,
    "walletAddress": ""
  },
  {
    "user": "Vimal Nair",
    "email": "vimalsn@gmail.com",
    "viabtcUserId": 600245,
    "coin": "AED",
    "walletAmount": 1.1368,
    "walletAddress": ""
  },
  {
    "user": "hyunchul lee",
    "email": "jleefly00@gmail.com",
    "viabtcUserId": 600267,
    "coin": "AED",
    "walletAmount": 1.54,
    "walletAddress": ""
  },
  {
    "user": "Nasir Alseeri Alqemzi",
    "email": "nasir.alseeri@gmail.com",
    "viabtcUserId": 600320,
    "coin": "AED",
    "walletAmount": 0.05,
    "walletAddress": ""
  },
  {
    "user": "Hakan Balci",
    "email": "h.balci1@gmx.de",
    "viabtcUserId": 600346,
    "coin": "AED",
    "walletAmount": 0.9124,
    "walletAddress": ""
  },
  {
    "user": "Mohammad Parvez",
    "email": "parvez.hyd43@gmail.com",
    "viabtcUserId": 600321,
    "coin": "AED",
    "walletAmount": 8.22,
    "walletAddress": ""
  },
  {
    "user": "Muhammad usman Akhtar",
    "email": "usman_somi1@yahoo.com",
    "viabtcUserId": 600400,
    "coin": "AED",
    "walletAmount": 0.46,
    "walletAddress": ""
  },
  {
    "user": "Nazimuddin Khwaja",
    "email": "khwaja.nazim220@gmail.com",
    "viabtcUserId": 600427,
    "coin": "AED",
    "walletAmount": 0.00999999,
    "walletAddress": ""
  },
  {
    "user": "Hadi Reslan",
    "email": "hadihr13@gmail.com",
    "viabtcUserId": 600464,
    "coin": "AED",
    "walletAmount": 0.0584,
    "walletAddress": ""
  },
  {
    "user": "Wissam Badine",
    "email": "wissambadine@gmail.com",
    "viabtcUserId": 600492,
    "coin": "AED",
    "walletAmount": 5.3764,
    "walletAddress": ""
  },
  {
    "user": "Jakhongir Bakhtiyorov",
    "email": "Jakhongir713@gmail.com",
    "viabtcUserId": 600499,
    "coin": "AED",
    "walletAmount": 0.0041,
    "walletAddress": ""
  },
  {
    "user": "Felix Jr Tambago",
    "email": "tambagofelix@ymail.com",
    "viabtcUserId": 600501,
    "coin": "AED",
    "walletAmount": 0.6728,
    "walletAddress": ""
  },
  {
    "user": "Andrew Redula",
    "email": "andrew.redula@yahoo.com",
    "viabtcUserId": 600505,
    "coin": "AED",
    "walletAmount": 0.8481999999999998,
    "walletAddress": ""
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi111@gmail.com",
    "viabtcUserId": 600014,
    "coin": "BTC",
    "walletAmount": 0.05358138,
    "walletAddress": "36RVdie5CjUJWtY2p65MLkw9AqLnbdLbDy"
  },
  {
    "user": "Monark Modi",
    "email": "monark@bitexuae.com",
    "viabtcUserId": 600015,
    "coin": "BTC",
    "walletAmount": 0.00004,
    "walletAddress": "3J5cvGRhnvw1SH16BbxBACy7B1oBNUTrHo"
  },
  {
    "user": "Billy Dellomas",
    "email": "billyd_08@yahoo.com",
    "viabtcUserId": 600529,
    "coin": "AED",
    "walletAmount": 0.0055,
    "walletAddress": ""
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi111@gmail.com",
    "viabtcUserId": 600014,
    "coin": "ETH",
    "walletAmount": 0.1,
    "walletAddress": "0x037B132275061bb5e2de65bF9b9e0CbE63629D87"
  },
  {
    "user": "Christopher  Hanson",
    "email": "christopher.smedley.hanson@gmail.com",
    "viabtcUserId": 600571,
    "coin": "AED",
    "walletAmount": 14.734,
    "walletAddress": ""
  },
  {
    "user": "Santhosh  Shiva shankar",
    "email": "sankumar9030@gmail.com",
    "viabtcUserId": 600574,
    "coin": "AED",
    "walletAmount": 99.256,
    "walletAddress": ""
  },
  {
    "user": "Dean Le Roux",
    "email": "dean@ramyautomotive.com",
    "viabtcUserId": 600578,
    "coin": "AED",
    "walletAmount": 66.316788,
    "walletAddress": ""
  },
  {
    "user": "Yaprak  Guvener",
    "email": "yaprak.rock@gmail.com",
    "viabtcUserId": 600617,
    "coin": "AED",
    "walletAmount": 0.5872,
    "walletAddress": ""
  },
  {
    "user": "sumit sharma",
    "email": "sumitanupsharma@gmail.com",
    "viabtcUserId": 600637,
    "coin": "AED",
    "walletAmount": 100,
    "walletAddress": ""
  },
  {
    "user": "Suresh Sarikonda",
    "email": "suresh_2307@yahoo.co.in",
    "viabtcUserId": 600657,
    "coin": "AED",
    "walletAmount": 0.0098,
    "walletAddress": ""
  },
  {
    "user": "Robert Teiber",
    "email": "robert.teiber@protonmail.com",
    "viabtcUserId": 600659,
    "coin": "AED",
    "walletAmount": 4.3,
    "walletAddress": ""
  },
  {
    "user": "Yazid Hamiche",
    "email": "yazid.hamiche@yahoo.fr",
    "viabtcUserId": 600668,
    "coin": "AED",
    "walletAmount": 2.12445097,
    "walletAddress": ""
  },
  {
    "user": "mark anthony soliman",
    "email": "soliman_mark02@yahoo.com",
    "viabtcUserId": 600689,
    "coin": "AED",
    "walletAmount": 0.6233,
    "walletAddress": ""
  },
  {
    "user": "Ariel Agustin",
    "email": "apagustin@gmail.com",
    "viabtcUserId": 600782,
    "coin": "AED",
    "walletAmount": 400,
    "walletAddress": ""
  },
  {
    "user": "Butti  Hamad",
    "email": "bmejren@me.com",
    "viabtcUserId": 600821,
    "coin": "AED",
    "walletAmount": 1.7796,
    "walletAddress": ""
  },
  {
    "user": "jooyeob lee",
    "email": "jooyeob0917@gmail.com",
    "viabtcUserId": 600862,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": ""
  },
  {
    "user": "ASHA VELAYUDHAN",
    "email": "reachtoasha@gmail.com",
    "viabtcUserId": 600890,
    "coin": "AED",
    "walletAmount": 0.65,
    "walletAddress": ""
  },
  {
    "user": "Sumit Kumar Gupta",
    "email": "lorince99@gmail.com",
    "viabtcUserId": 600972,
    "coin": "AED",
    "walletAmount": 0.3868,
    "walletAddress": ""
  },
  {
    "user": "Lenaic Tchatchoua",
    "email": "lenaic.tc@gmail.com",
    "viabtcUserId": 600984,
    "coin": "AED",
    "walletAmount": 0.65999999,
    "walletAddress": ""
  },
  {
    "user": "Mohammad hossein  Zarei",
    "email": "commercial@scatgt.com",
    "viabtcUserId": 600997,
    "coin": "AED",
    "walletAmount": 0.07,
    "walletAddress": ""
  },
  {
    "user": "Dinesh Chilla",
    "email": "dinesh.chilla@gmail.com",
    "viabtcUserId": 601049,
    "coin": "AED",
    "walletAmount": 0.06,
    "walletAddress": ""
  },
  {
    "user": "HARUN SOYLU",
    "email": "harunsoylu@gmail.com",
    "viabtcUserId": 601081,
    "coin": "AED",
    "walletAmount": 3.365,
    "walletAddress": ""
  },
  {
    "user": "Rameez  Shikalgar",
    "email": "rameez.shikalgar@gmail.com",
    "viabtcUserId": 601083,
    "coin": "AED",
    "walletAmount": 0.553795,
    "walletAddress": ""
  },
  {
    "user": "Prasanth Babusenan",
    "email": "thegame.6844@gmail.com",
    "viabtcUserId": 601097,
    "coin": "AED",
    "walletAmount": 0.00229093,
    "walletAddress": ""
  },
  {
    "user": "Barthelemy Cabouat",
    "email": "barth.cabouat@gmail.com",
    "viabtcUserId": 601098,
    "coin": "AED",
    "walletAmount": 8.92,
    "walletAddress": ""
  },
  {
    "user": "Abdullah Yasin Mohd Nasir",
    "email": "abdullah.yasin.88@gmail.com",
    "viabtcUserId": 601114,
    "coin": "AED",
    "walletAmount": 0.0859,
    "walletAddress": ""
  },
  {
    "user": "Hassan Sabri",
    "email": "hassanacma@gmail.com",
    "viabtcUserId": 601138,
    "coin": "AED",
    "walletAmount": 0.1558,
    "walletAddress": ""
  },
  {
    "user": "Majdi Saad",
    "email": "majdi.i.saad@gmail.com",
    "viabtcUserId": 601142,
    "coin": "AED",
    "walletAmount": 0.0005,
    "walletAddress": ""
  },
  {
    "user": "Wilson Manoharan",
    "email": "wilsonjune.hse@gmail.com",
    "viabtcUserId": 601145,
    "coin": "AED",
    "walletAmount": 4.34,
    "walletAddress": ""
  },
  {
    "user": "Raymond Alcera",
    "email": "raymond.alcera.dxb@gmail.com",
    "viabtcUserId": 601159,
    "coin": "AED",
    "walletAmount": 0.9258,
    "walletAddress": ""
  },
  {
    "user": "NASWIN KARIM",
    "email": "naswinkarim@gmail.com",
    "viabtcUserId": 601187,
    "coin": "AED",
    "walletAmount": 0.7079,
    "walletAddress": ""
  },
  {
    "user": "Marinus Johannes Adrianus  Hellemons",
    "email": "mja.hellemons@gmail.com",
    "viabtcUserId": 601204,
    "coin": "AED",
    "walletAmount": 0.21,
    "walletAddress": ""
  },
  {
    "user": "faizan ali",
    "email": "faizansahel9@gmail.com",
    "viabtcUserId": 601212,
    "coin": "AED",
    "walletAmount": 6.126,
    "walletAddress": ""
  },
  {
    "user": "Bastiaan Moossdorff",
    "email": "bastiaanmoossdorff@hotmail.com",
    "viabtcUserId": 601224,
    "coin": "AED",
    "walletAmount": 3.3003,
    "walletAddress": ""
  },
  {
    "user": "Adam Baker",
    "email": "ajbaker21@hotmail.com",
    "viabtcUserId": 601278,
    "coin": "AED",
    "walletAmount": 43.4,
    "walletAddress": ""
  },
  {
    "user": "Stanley Benngard",
    "email": "stanley_b72@mac.com",
    "viabtcUserId": 601296,
    "coin": "AED",
    "walletAmount": 15.0136,
    "walletAddress": ""
  },
  {
    "user": "Muhammad Noormahomed",
    "email": "mnoormahomed@gmail.com",
    "viabtcUserId": 601386,
    "coin": "AED",
    "walletAmount": 0.28,
    "walletAddress": ""
  },
  {
    "user": "Jasar Ayaz",
    "email": "jasar15@gmail.com",
    "viabtcUserId": 601393,
    "coin": "AED",
    "walletAmount": 42.29,
    "walletAddress": ""
  },
  {
    "user": "Gokulakrishnan Govindarajan",
    "email": "ggk03101988@gmail.com",
    "viabtcUserId": 601447,
    "coin": "AED",
    "walletAmount": 0.0323,
    "walletAddress": ""
  },
  {
    "user": "Ovais ur Rehman Siddiqui",
    "email": "ovais.rehman@gmail.com",
    "viabtcUserId": 601468,
    "coin": "AED",
    "walletAmount": 1.1075,
    "walletAddress": ""
  },
  {
    "user": "SAFEER KADAMBODAN",
    "email": "safeerk007@gmail.com",
    "viabtcUserId": 601472,
    "coin": "AED",
    "walletAmount": 1.3572,
    "walletAddress": ""
  },
  {
    "user": "nivaldo lima",
    "email": "nivaldooliveirabjj@gmail.com",
    "viabtcUserId": 601477,
    "coin": "AED",
    "walletAmount": 247.086,
    "walletAddress": ""
  },
  {
    "user": "Unni menon Vattekkad",
    "email": "unniinbox@protonmail.com",
    "viabtcUserId": 601494,
    "coin": "AED",
    "walletAmount": 0.0179,
    "walletAddress": ""
  },
  {
    "user": "shakeel ahmed",
    "email": "Shaks40@hotmail.com",
    "viabtcUserId": 601503,
    "coin": "AED",
    "walletAmount": 0.7411,
    "walletAddress": ""
  },
  {
    "user": "Rangaiah Kurupati",
    "email": "rangachow@gmail.com",
    "viabtcUserId": 601505,
    "coin": "AED",
    "walletAmount": 3.9,
    "walletAddress": ""
  },
  {
    "user": "Dora Czuczor",
    "email": "czuczor.dora@gmail.com",
    "viabtcUserId": 601517,
    "coin": "AED",
    "walletAmount": 25.56999999,
    "walletAddress": ""
  },
  {
    "user": "Nasreen Moolla",
    "email": "nasy512@gmail.com",
    "viabtcUserId": 601521,
    "coin": "AED",
    "walletAmount": 5.02,
    "walletAddress": ""
  },
  {
    "user": "Abdul Hameed  Arif",
    "email": "talha123us@hotmail.com",
    "viabtcUserId": 601547,
    "coin": "AED",
    "walletAmount": 23.3549,
    "walletAddress": ""
  },
  {
    "user": "Vasilios Modinos",
    "email": "vasilis@modinos.net",
    "viabtcUserId": 601559,
    "coin": "AED",
    "walletAmount": 10.955,
    "walletAddress": ""
  },
  {
    "user": "AHMED KASSEM",
    "email": "ahmedfouad77@gmail.com",
    "viabtcUserId": 601562,
    "coin": "AED",
    "walletAmount": 0.3749,
    "walletAddress": ""
  },
  {
    "user": "Shamzeer Cheekkilodan",
    "email": "shamzeerck@gmail.com",
    "viabtcUserId": 601595,
    "coin": "AED",
    "walletAmount": 0.0255,
    "walletAddress": ""
  },
  {
    "user": "faizan ali",
    "email": "faizansahel1@gmail.com",
    "viabtcUserId": 601628,
    "coin": "AED",
    "walletAmount": 9.4388,
    "walletAddress": ""
  },
  {
    "user": "Brandon Tunnicliffe",
    "email": "brandtunni@gmail.com",
    "viabtcUserId": 601647,
    "coin": "AED",
    "walletAmount": 0.00019553,
    "walletAddress": ""
  },
  {
    "user": "Fida Hussain",
    "email": "fhmining@outlook.com",
    "viabtcUserId": 601700,
    "coin": "AED",
    "walletAmount": 0.234,
    "walletAddress": ""
  },
  {
    "user": "Sohail Munir",
    "email": "crypto@munir.me",
    "viabtcUserId": 601714,
    "coin": "AED",
    "walletAmount": 23.83,
    "walletAddress": ""
  },
  {
    "user": "Vinod  Patil",
    "email": "vinodpatil2074@gmail.com",
    "viabtcUserId": 602232,
    "coin": "AED",
    "walletAmount": 24.8,
    "walletAddress": ""
  },
  {
    "user": "Umberto Gigante",
    "email": "gigante.umberto@gmail.com",
    "viabtcUserId": 602247,
    "coin": "AED",
    "walletAmount": 0.2317,
    "walletAddress": ""
  },
  {
    "user": "Saravanan kumarashanmugam",
    "email": "saran945@yahoo.co.in",
    "viabtcUserId": 602249,
    "coin": "AED",
    "walletAmount": 148.452,
    "walletAddress": ""
  },
  {
    "user": "Brian Pitaluna",
    "email": "brianpitaluna@gmail.com",
    "viabtcUserId": 602337,
    "coin": "AED",
    "walletAmount": 24.82,
    "walletAddress": ""
  },
  {
    "user": "Jayr Motta",
    "email": "jayrmotta@protonmail.com",
    "viabtcUserId": 602338,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": ""
  },
  {
    "user": "rohit boraniya",
    "email": "rohit@nkr.ae",
    "viabtcUserId": 602339,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": ""
  },
  {
    "user": "Syed faizan Hussain",
    "email": "syedfaizan1123@yahoo.com",
    "viabtcUserId": 602443,
    "coin": "AED",
    "walletAmount": 0.39,
    "walletAddress": ""
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi111@gmail.com",
    "viabtcUserId": 600014,
    "coin": "LTC",
    "walletAmount": 6.18314475,
    "walletAddress": "MQjtD454NGn8T8yGVYwKxL4ytKj4MF1bDY"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi111@gmail.com",
    "viabtcUserId": 600014,
    "coin": "XRP",
    "walletAmount": 23762.4,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi111@gmail.com",
    "viabtcUserId": 600014,
    "coin": "BCH",
    "walletAmount": 9995.395,
    "walletAddress": "36DasLGRj7csFSxpAGpo7rwpHb3212ZrZ9"
  },
  {
    "user": "Wilhem Berrios Flores",
    "email": "muradym73@gmail.com",
    "viabtcUserId": 602506,
    "coin": "BTC",
    "walletAmount": 0.00008,
    "walletAddress": "3LwAuvzzgenSdZMS9MM98SBKq9JXC9VFZV"
  },
  {
    "user": "Barthelemy Cabouat",
    "email": "barth.cabouat@gmail.com",
    "viabtcUserId": 601098,
    "coin": "BTC",
    "walletAmount": 0.0009,
    "walletAddress": "3AmXAFB5EWuZsV718DAh3oG4i2SpFiVNDA"
  },
  {
    "user": "Dragos Dumitrascu",
    "email": "dragos_bitex@objectmail.com",
    "viabtcUserId": 600017,
    "coin": "ETH",
    "walletAmount": 0.005499999999999838,
    "walletAddress": "0xABBaBc8154d82CC5395e1859B43d2df694c5a1d8"
  },
  {
    "user": "Ahmed Mohamed Mohamed Abdelaty Hefny",
    "email": "omarahmedmohamed.1982@gmail.com",
    "viabtcUserId": 600021,
    "coin": "XRP",
    "walletAmount": 0.00007999,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Tawhid Al Sharif",
    "email": "tawhid.alsharif@gmail.com",
    "viabtcUserId": 600036,
    "coin": "XRP",
    "walletAmount": 350,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Razvan Baciu",
    "email": "just1razz@gmail.com",
    "viabtcUserId": 600167,
    "coin": "ETH",
    "walletAmount": 0.007000000000000686,
    "walletAddress": "0xe3a0A860a43fd81F3718bB7DB5C5Ee13BF51f4C4"
  },
  {
    "user": "Rahil Alam",
    "email": "rahilalam83@gmail.com",
    "viabtcUserId": 600130,
    "coin": "ETH",
    "walletAmount": 0.00445264,
    "walletAddress": "0x615907E8f0c5a3cB604F390aFB95b469b8195161"
  },
  {
    "user": "Nazimuddin Khwaja",
    "email": "khwaja.nazim220@gmail.com",
    "viabtcUserId": 600427,
    "coin": "XRP",
    "walletAmount": 0.4,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Vimal Nair",
    "email": "vimalsn@gmail.com",
    "viabtcUserId": 600245,
    "coin": "XRP",
    "walletAmount": 0.8,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Nasir Alseeri Alqemzi",
    "email": "nasir.alseeri@gmail.com",
    "viabtcUserId": 600320,
    "coin": "XRP",
    "walletAmount": 0.83728896,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "ＦＵＪＩＫＩ ＨＡＮＡＳＨＩＲＯ",
    "email": "fujiki1967@yahoo.co.jp",
    "viabtcUserId": 600248,
    "coin": "ETH",
    "walletAmount": 1.11022302462516e-16,
    "walletAddress": "0x5A53d6A769031F40a649D82Ec69914db2C54921D"
  },
  {
    "user": "Radhakrishnan Seetharaman Radhakrishnan Seetharaman",
    "email": "sitharam26@gmail.com",
    "viabtcUserId": 600239,
    "coin": "XRP",
    "walletAmount": 295,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Sekhar Yerramneedi",
    "email": "needi447@outlook.com",
    "viabtcUserId": 600477,
    "coin": "ETH",
    "walletAmount": 1.187,
    "walletAddress": "0x80f3895894A4A54aD2fA9B7836A27875aD8F0c31"
  },
  {
    "user": "Sekhar Yerramneedi",
    "email": "needi447@outlook.com",
    "viabtcUserId": 600477,
    "coin": "XRP",
    "walletAmount": 499.75,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Muhammad usman Akhtar",
    "email": "usman_somi1@yahoo.com",
    "viabtcUserId": 600400,
    "coin": "ETH",
    "walletAmount": 0.0003784500000003632,
    "walletAddress": "0xcCfE6Ec76106B5b03C7CD5934aE7299A342FC299"
  },
  {
    "user": "Hakan Balci",
    "email": "h.balci1@gmx.de",
    "viabtcUserId": 600346,
    "coin": "ETH",
    "walletAmount": 1.11022302462516e-16,
    "walletAddress": "0xfDEaD8C5eab61d6C417124116ef6DDB4e50b9e12"
  },
  {
    "user": "Precious Chiwendu Amadi",
    "email": "preciouschiwenduamadi@gmail.com",
    "viabtcUserId": 600426,
    "coin": "XRP",
    "walletAmount": 100,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Aimee  Valdez",
    "email": "iamshawn26@yahoo.com",
    "viabtcUserId": 600612,
    "coin": "XRP",
    "walletAmount": 100,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Yaprak  Guvener",
    "email": "yaprak.rock@gmail.com",
    "viabtcUserId": 600617,
    "coin": "XRP",
    "walletAmount": 0.8,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Suresh Sarikonda",
    "email": "suresh_2307@yahoo.co.in",
    "viabtcUserId": 600657,
    "coin": "ETH",
    "walletAmount": 1e-8,
    "walletAddress": "0xae9ba1f3375d7Eb3E530eC85e3D5EF3EBc97a99B"
  },
  {
    "user": "Andrew Redula",
    "email": "andrew.redula@yahoo.com",
    "viabtcUserId": 600505,
    "coin": "ETH",
    "walletAmount": 0.0005000000000006111,
    "walletAddress": "0xa5ccFe9A417E7671934ecf0D8cBd89254aB6537F"
  },
  {
    "user": "Dean Le Roux",
    "email": "dean@ramyautomotive.com",
    "viabtcUserId": 600578,
    "coin": "XRP",
    "walletAmount": 0.23076923,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Yazid Hamiche",
    "email": "yazid.hamiche@yahoo.fr",
    "viabtcUserId": 600668,
    "coin": "ETH",
    "walletAmount": 0.04243157,
    "walletAddress": "0xA33f4deE2B692BFb2a1C9480A99524F17f7b2158"
  },
  {
    "user": "usman muhammed",
    "email": "usmanmuhammed9@gmail.com",
    "viabtcUserId": 600569,
    "coin": "XRP",
    "walletAmount": 0.21576599,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Christopher  Hanson",
    "email": "christopher.smedley.hanson@gmail.com",
    "viabtcUserId": 600571,
    "coin": "XRP",
    "walletAmount": 5,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Bashar Edelbi",
    "email": "edelbi1977@hotmail.com",
    "viabtcUserId": 600670,
    "coin": "XRP",
    "walletAmount": 143,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Jon Eaves",
    "email": "je@je.com.au",
    "viabtcUserId": 600660,
    "coin": "XRP",
    "walletAmount": 121.3878,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Majdi Saad",
    "email": "majdi.i.saad@gmail.com",
    "viabtcUserId": 601142,
    "coin": "ETH",
    "walletAmount": 0.00020000000000000286,
    "walletAddress": "0x119196d62B53FA7F6d2D1466bb002c3409Cc4fD7"
  },
  {
    "user": "Brijesh Zaveri",
    "email": "zaveribrijesh@gmail.com",
    "viabtcUserId": 601072,
    "coin": "XRP",
    "walletAmount": 60.75,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Muhammad Noormahomed",
    "email": "mnoormahomed@gmail.com",
    "viabtcUserId": 601386,
    "coin": "ETH",
    "walletAmount": 0.0015895,
    "walletAddress": "0xebFe4e03caCCeE803098A96d4ddf72830C0b64b2"
  },
  {
    "user": "Muhammad Noormahomed",
    "email": "mnoormahomed@gmail.com",
    "viabtcUserId": 601386,
    "coin": "XRP",
    "walletAmount": 0.16040538,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Nasreen Moolla",
    "email": "nasy512@gmail.com",
    "viabtcUserId": 601521,
    "coin": "ETH",
    "walletAmount": 0.0009999999999998899,
    "walletAddress": "0xccb0C4fC4C0D8d45C2aDA1bae8b64737415A53E8"
  },
  {
    "user": "Sultan Mohammed saleem",
    "email": "sultansaltooni@gmail.com",
    "viabtcUserId": 603194,
    "coin": "AED",
    "walletAmount": 0.09,
    "walletAddress": "undefined"
  },
  {
    "user": "faizan ali",
    "email": "faizansahel9@gmail.com",
    "viabtcUserId": 601212,
    "coin": "ETH",
    "walletAmount": 0.0085,
    "walletAddress": "0xc21b43BC2c910D094E3ff536620aF0D7a3D59841"
  },
  {
    "user": "Marinus Johannes Adrianus  Hellemons",
    "email": "mja.hellemons@gmail.com",
    "viabtcUserId": 601204,
    "coin": "ETH",
    "walletAmount": 0.00228275,
    "walletAddress": "0xA8228c47207C51498a0A9EE077DE9d7Ada721Fba"
  },
  {
    "user": "Marinus Johannes Adrianus  Hellemons",
    "email": "mja.hellemons@gmail.com",
    "viabtcUserId": 601204,
    "coin": "XRP",
    "walletAmount": 0.1,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Naveed Lodhi",
    "email": "naveed.lodhi@msn.com",
    "viabtcUserId": 601340,
    "coin": "ETH",
    "walletAmount": 0.00005761,
    "walletAddress": "0xea9B791658126166a8D24aA80672E9DfE8B876Fa"
  },
  {
    "user": "Unni menon Vattekkad",
    "email": "unniinbox@protonmail.com",
    "viabtcUserId": 601494,
    "coin": "ETH",
    "walletAmount": 0.04,
    "walletAddress": "0xfD3F7067730657C7645B25d37EE075F19Fc8D8d0"
  },
  {
    "user": "Unni menon Vattekkad",
    "email": "unniinbox@protonmail.com",
    "viabtcUserId": 601494,
    "coin": "XRP",
    "walletAmount": 10,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Rafey Abdul",
    "email": "rafeyabdul@gmail.com",
    "viabtcUserId": 601397,
    "coin": "ETH",
    "walletAmount": 0.00030796,
    "walletAddress": "0xD7059F6322FA2326527CA82ADac9BD28263EC4a8"
  },
  {
    "user": "Dora Czuczor",
    "email": "czuczor.dora@gmail.com",
    "viabtcUserId": 601517,
    "coin": "ETH",
    "walletAmount": 11,
    "walletAddress": "0x72750768bE64a35DdeB36653425Ce01A3111F414"
  },
  {
    "user": "Dora Czuczor",
    "email": "czuczor.dora@gmail.com",
    "viabtcUserId": 601517,
    "coin": "XRP",
    "walletAmount": 25593,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Rangaiah Kurupati",
    "email": "rangachow@gmail.com",
    "viabtcUserId": 601505,
    "coin": "XRP",
    "walletAmount": 24.99799999999999,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Divyanka Aher",
    "email": "divyankaaher@gmail.com",
    "viabtcUserId": 606132,
    "coin": "BTX",
    "walletAmount": 9,
    "walletAddress": "0xcB7162D1CE8582e1A3bDe3eB916AeBc1a2770cB3"
  },
  {
    "user": "Shamzeer Cheekkilodan",
    "email": "shamzeerck@gmail.com",
    "viabtcUserId": 601595,
    "coin": "XRP",
    "walletAmount": 23.100000000000005,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Fida Hussain",
    "email": "fhmining@outlook.com",
    "viabtcUserId": 601700,
    "coin": "ETH",
    "walletAmount": 0.00004443255625741216,
    "walletAddress": "0x898db4469057493C893a0f28B03a5398B8a2A1a3"
  },
  {
    "user": "Saravanan kumarashanmugam",
    "email": "saran945@yahoo.co.in",
    "viabtcUserId": 602249,
    "coin": "ETH",
    "walletAmount": 0.007560879999999104,
    "walletAddress": "0xA610f26D462c9D13a7AC8321bd4342A704A18db0"
  },
  {
    "user": "Fahim Ismail",
    "email": "fahimjava@gmail.com",
    "viabtcUserId": 602447,
    "coin": "XRP",
    "walletAmount": 1.011459,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Tolly  Thomas",
    "email": "tollythomas014@yahoo.com",
    "viabtcUserId": 602428,
    "coin": "XRP",
    "walletAmount": 94.98,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Samyak Veera",
    "email": "scveera+bitex@gmail.com",
    "viabtcUserId": 602548,
    "coin": "AED",
    "walletAmount": 0.005999999999971806,
    "walletAddress": ""
  },
  {
    "user": "Syed faizan Hussain",
    "email": "syedfaizan1123@yahoo.com",
    "viabtcUserId": 602443,
    "coin": "XRP",
    "walletAmount": 0.00001429,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Bibhuti Dash",
    "email": "dabibhuti@gmail.com",
    "viabtcUserId": 602597,
    "coin": "AED",
    "walletAmount": 0.1151,
    "walletAddress": ""
  },
  {
    "user": "Andrea Manzati",
    "email": "nrgskill@gmail.com",
    "viabtcUserId": 602587,
    "coin": "AED",
    "walletAmount": 0.5074,
    "walletAddress": ""
  },
  {
    "user": "AADIL AYOB",
    "email": "aadil@armyco.net",
    "viabtcUserId": 602706,
    "coin": "AED",
    "walletAmount": 36.45,
    "walletAddress": ""
  },
  {
    "user": "Jeswin james",
    "email": "jeswinjames6@gmail.com",
    "viabtcUserId": 602723,
    "coin": "AED",
    "walletAmount": 0.0867,
    "walletAddress": ""
  },
  {
    "user": "Karl Weinmeister",
    "email": "karl@weinmeister.de",
    "viabtcUserId": 602730,
    "coin": "AED",
    "walletAmount": 1.238,
    "walletAddress": ""
  },
  {
    "user": "Karl Weinmeister",
    "email": "karl@weinmeister.de",
    "viabtcUserId": 602730,
    "coin": "XRP",
    "walletAmount": 35,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "ashok kumar mulpuri",
    "email": "ashoks.mulpuri@gmail.com",
    "viabtcUserId": 602746,
    "coin": "AED",
    "walletAmount": 0.53,
    "walletAddress": ""
  },
  {
    "user": "Nebal Hamouda",
    "email": "errorbymistake.404@gmail.com",
    "viabtcUserId": 602919,
    "coin": "BTC",
    "walletAmount": 0.0001,
    "walletAddress": "3FBdb1sSDCKyXnoDXCbqkcGPLmWPeTooCm"
  },
  {
    "user": "Nebal Hamouda",
    "email": "errorbymistake.404@gmail.com",
    "viabtcUserId": 602919,
    "coin": "AED",
    "walletAmount": 0.41,
    "walletAddress": "undefined"
  },
  {
    "user": "Ahmed Mohamed Mohamed Abdelaty Hefny",
    "email": "omarahmedmohamed.1982@gmail.com",
    "viabtcUserId": 600021,
    "coin": "BTC",
    "walletAmount": 0.00000431,
    "walletAddress": "3HZPwT9Qy4fA3VQWJQwFc6FL7sm1E58HtQ"
  },
  {
    "user": "Sameer Khan",
    "email": "sosolid786@gmail.com",
    "viabtcUserId": 600031,
    "coin": "BTC",
    "walletAmount": 0.00054299,
    "walletAddress": "39GwRaC2iL7pR13fu4TS7jMAPZ3GdHeQ7L"
  },
  {
    "user": "Mubarak Saeed",
    "email": "mubarakalmutawa83@gmail.com",
    "viabtcUserId": 600050,
    "coin": "BTC",
    "walletAmount": 0.00009999999999998899,
    "walletAddress": "37C4j1Wbf31Rr32eTLqqFjkhHMK1wasZxz"
  },
  {
    "user": "Furqan Samdani",
    "email": "furqan7@gmail.com",
    "viabtcUserId": 600030,
    "coin": "BTC",
    "walletAmount": 0.00078729,
    "walletAddress": "3GhDZH7mDxFLbZeWNtC34gtSe6CgoK4YwV"
  },
  {
    "user": "Abrar Hussain",
    "email": "abrarhussainalam@protonmail.com",
    "viabtcUserId": 600131,
    "coin": "BTC",
    "walletAmount": 0.009781839999999995,
    "walletAddress": "33i4p3ZK9ED4y7N39s9GEaP3UMaELXqZpy"
  },
  {
    "user": "Floyd Fernandes",
    "email": "12floyd79@gmail.com",
    "viabtcUserId": 600133,
    "coin": "BTC",
    "walletAmount": 0.00195072,
    "walletAddress": "3BvSmzaMbtZRV95Rv2G5nV9pXWe9FomtSG"
  },
  {
    "user": "Demo Account",
    "email": "demoacc@gmail.com",
    "viabtcUserId": 600161,
    "coin": "BTC",
    "walletAmount": 0.011499999999999996,
    "walletAddress": "3QwFpTWMRX2xMDtV19QsgfD365wNUxD48B"
  },
  {
    "user": "AADIL AYOB",
    "email": "aadil@armyco.net",
    "viabtcUserId": 602706,
    "coin": "BTC",
    "walletAmount": 0.00366264,
    "walletAddress": "3Efk33bKoGb43mp56GFKTb6u3XC8PEX2dZ"
  },
  {
    "user": "Rahil Alam",
    "email": "rahilalam83@gmail.com",
    "viabtcUserId": 600130,
    "coin": "LTC",
    "walletAmount": 0.31153222,
    "walletAddress": "MEzLqW5T6Y11CG89gPEb22eLPwsw1iKHLm"
  },
  {
    "user": "Demo Account",
    "email": "demoacc@gmail.com",
    "viabtcUserId": 600161,
    "coin": "BCH",
    "walletAmount": 1,
    "walletAddress": "3Jw4wAC17rxSTW5bccDkMbZeSydq5RtbfY"
  },
  {
    "user": "Demo Account",
    "email": "demoacc@gmail.com",
    "viabtcUserId": 600161,
    "coin": "LTC",
    "walletAmount": 6,
    "walletAddress": "MHxNWEhVX7ZsKDgHahuciuRs2akx4JMNoV"
  },
  {
    "user": "Umar KHALID",
    "email": "umarkhalid2@gmail.com",
    "viabtcUserId": 600200,
    "coin": "BTC",
    "walletAmount": 3.800000000012127e-7,
    "walletAddress": "3JBfpdCfrD1VGZtiEwac2a7cL5VYqk9rTA"
  },
  {
    "user": "Umar KHALID",
    "email": "umarkhalid2@gmail.com",
    "viabtcUserId": 600200,
    "coin": "BCH",
    "walletAmount": 0.00008446,
    "walletAddress": "36BvWqSJM1oEu1r9yxvqDCCmxEfHjV8R94"
  },
  {
    "user": "Massimo Giovannetti",
    "email": "massimo.giovannetti19@gmail.com",
    "viabtcUserId": 601178,
    "coin": "USD",
    "walletAmount": 6998.68949555,
    "walletAddress": "undefined"
  },
  {
    "user": "hyunchul lee",
    "email": "jleefly00@gmail.com",
    "viabtcUserId": 600267,
    "coin": "LTC",
    "walletAmount": 0.02713129,
    "walletAddress": "MNcDrxqYrWg4nCtUY4ejMwXjb5oDcxJBM4"
  },
  {
    "user": "shabbir vajihuddin",
    "email": "svajihuddin@gmail.com",
    "viabtcUserId": 600277,
    "coin": "LTC",
    "walletAmount": 0.03087849,
    "walletAddress": "MN7eNtvWFEQtKGVXH6my4ahVdGnnVqCn75"
  },
  {
    "user": "David El Dib",
    "email": "david.eldib@gmail.com",
    "viabtcUserId": 600287,
    "coin": "BTC",
    "walletAmount": 0.10205495,
    "walletAddress": "377nfptSaNhsaDm4q6KgDaJVF6na4QAWZt"
  },
  {
    "user": "Nasir Alseeri Alqemzi",
    "email": "nasir.alseeri@gmail.com",
    "viabtcUserId": 600320,
    "coin": "BCH",
    "walletAmount": 0.029,
    "walletAddress": "39N9JiUbsFS7gkdEKMMTUiD3hx9wR1Utb4"
  },
  {
    "user": "Nazimuddin Khwaja",
    "email": "khwaja.nazim220@gmail.com",
    "viabtcUserId": 600427,
    "coin": "BTC",
    "walletAmount": 1.6e-7,
    "walletAddress": "348h3jstBHhrDXQgB1jTwb9kUWLSQJf3YP"
  },
  {
    "user": "Wissam Badine",
    "email": "wissambadine@gmail.com",
    "viabtcUserId": 600492,
    "coin": "BTC",
    "walletAmount": 0.00092555,
    "walletAddress": "3HPZ1JXoYpX9Vs6spdYT3DAWLWixxJpr4a"
  },
  {
    "user": "Andrew Redula",
    "email": "andrew.redula@yahoo.com",
    "viabtcUserId": 600505,
    "coin": "BTC",
    "walletAmount": 0.00040000000000001146,
    "walletAddress": "3Kh8r1VE9fKok7mBdtGTvDHU5gevtwiCKA"
  },
  {
    "user": "Billy Dellomas",
    "email": "billyd_08@yahoo.com",
    "viabtcUserId": 600529,
    "coin": "BTC",
    "walletAmount": 0.00061655,
    "walletAddress": "3N3D3C7LiKChr3dYWJm9W9qpj3C7iiQKpR"
  },
  {
    "user": "usman muhammed",
    "email": "usmanmuhammed9@gmail.com",
    "viabtcUserId": 600569,
    "coin": "BTC",
    "walletAmount": 0.00002322,
    "walletAddress": "37ycmN6DhjBtsZt3kCf3L4F3qFx7KXztNJ"
  },
  {
    "user": "usman muhammed",
    "email": "usmanmuhammed9@gmail.com",
    "viabtcUserId": 600569,
    "coin": "LTC",
    "walletAmount": 0.0000291,
    "walletAddress": "MSMvKKqDfHVW5vtWHnk1Q6YqTjpwpjRmTG"
  },
  {
    "user": "Christopher  Hanson",
    "email": "christopher.smedley.hanson@gmail.com",
    "viabtcUserId": 600571,
    "coin": "BTC",
    "walletAmount": 2.7755575615629e-17,
    "walletAddress": "3Eue2pc1tJ8yLwqb4J3nFX9phkhS4YQuQk"
  },
  {
    "user": "Ravi Sharma",
    "email": "raisehell00@gmail.com",
    "viabtcUserId": 605831,
    "coin": "INR",
    "walletAmount": 674.2049163,
    "walletAddress": "undefined"
  },
  {
    "user": "Wilhelmina Reyes",
    "email": "Wilhelminareyes@yahoo.com",
    "viabtcUserId": 600728,
    "coin": "BTC",
    "walletAmount": 0.000638919999999965,
    "walletAddress": "3GKXV161d9Y6k3yWyLuWMGNoyM6qbCrbUc"
  },
  {
    "user": "Butti  Hamad",
    "email": "bmejren@me.com",
    "viabtcUserId": 600821,
    "coin": "BTC",
    "walletAmount": 0.012523489999999995,
    "walletAddress": "3B4oPTtF2vvLbwk1Pv6rdWstx4HcrpZU7j"
  },
  {
    "user": "jooyeob lee",
    "email": "jooyeob0917@gmail.com",
    "viabtcUserId": 600862,
    "coin": "BCH",
    "walletAmount": 0.00001375,
    "walletAddress": "39MJ8SWnBPPrLzpDNiXJsMZbV2ACCJbU1U"
  },
  {
    "user": "ASHA VELAYUDHAN",
    "email": "reachtoasha@gmail.com",
    "viabtcUserId": 600890,
    "coin": "BTC",
    "walletAmount": 0.11312337,
    "walletAddress": "32JCyQiJA6ZNjrM9bKsRzUaz1mF9MLphbk"
  },
  {
    "user": "Mark Rogan Gellamucho Adanza",
    "email": "markrogz0306@gmail.com",
    "viabtcUserId": 600895,
    "coin": "BTC",
    "walletAmount": 0.0016425300000000001,
    "walletAddress": "3BVKSNp8TthjqUtRVwvv2hxuztc9R8h6Pu"
  },
  {
    "user": "Amar Pradeep Kumar Solai",
    "email": "sapradeepkumar@gmail.com",
    "viabtcUserId": 600897,
    "coin": "BTC",
    "walletAmount": 0.0016122500000000008,
    "walletAddress": "3EHoq8nbYHE1yR7QUDBVMkFwd74Jux6Fgk"
  },
  {
    "user": "Michael Lazaro",
    "email": "mike.lazaro42@gmail.com",
    "viabtcUserId": 600921,
    "coin": "BTC",
    "walletAmount": 0.0001992400000000008,
    "walletAddress": "3DhcEiAZvtkh2UBHB2Ydmrq7Pc5vVRwvuL"
  },
  {
    "user": "Timothy Green",
    "email": "timgreen488@gmail.com",
    "viabtcUserId": 600949,
    "coin": "LTC",
    "walletAmount": 0.000138,
    "walletAddress": "MLcCJCY24C3AZjQmX3RVVw7pSZvUz6ygBT"
  },
  {
    "user": "Sumit Kumar Gupta",
    "email": "lorince99@gmail.com",
    "viabtcUserId": 600972,
    "coin": "BTC",
    "walletAmount": 5.5511151231258e-17,
    "walletAddress": "3LRetxMmoSJajfnCcKEyTS27qxVXMb3p3d"
  },
  {
    "user": "Brijesh Zaveri",
    "email": "zaveribrijesh@gmail.com",
    "viabtcUserId": 601072,
    "coin": "LTC",
    "walletAmount": 0.01,
    "walletAddress": "MU5RVxYeLT4NZRP5hQC8EvGggYc9QpFLgM"
  },
  {
    "user": "ABDUL SAMAD ganatra",
    "email": "samadganatra@hotmail.com",
    "viabtcUserId": 601069,
    "coin": "LTC",
    "walletAmount": 0.00810482,
    "walletAddress": "MRZucwSUN2onoCHvEAzicJcWWiYaBkNaSf"
  },
  {
    "user": "Prasanth Babusenan",
    "email": "thegame.6844@gmail.com",
    "viabtcUserId": 601097,
    "coin": "BTC",
    "walletAmount": 0.0004,
    "walletAddress": "3KdvGmv9StbGwK3abwX2uZyUHRZv7Jo2S2"
  },
  {
    "user": "Abdullah Yasin Mohd Nasir",
    "email": "abdullah.yasin.88@gmail.com",
    "viabtcUserId": 601114,
    "coin": "BTC",
    "walletAmount": 4.3e-7,
    "walletAddress": "38TM5PDo1QLVqJyZoJrcEkM5M58zK66Nne"
  },
  {
    "user": "sunil  mansare",
    "email": "drmansaresunil@gmail.com",
    "viabtcUserId": 601143,
    "coin": "BTC",
    "walletAmount": 0.2332,
    "walletAddress": "3HBBNsqGVYkCfdXkPNSqKj3AvcmHafk2XT"
  },
  {
    "user": "Ali Alneyadi",
    "email": "as.neyadi@hotmail.com",
    "viabtcUserId": 601151,
    "coin": "BTC",
    "walletAmount": 0.00117189,
    "walletAddress": "3Bi9QyEqQbsSeQrSjmPiNB2RBCNdeck1Ye"
  },
  {
    "user": "Mohamed Samir",
    "email": "mohamed.samir237@gmail.com",
    "viabtcUserId": 601173,
    "coin": "BTC",
    "walletAmount": 0.00005274,
    "walletAddress": "3AeVtViVjQpH1XACUETFhCRUpZaB5jiGUx"
  },
  {
    "user": "Marinus Johannes Adrianus  Hellemons",
    "email": "mja.hellemons@gmail.com",
    "viabtcUserId": 601204,
    "coin": "BTC",
    "walletAmount": 0.00008351,
    "walletAddress": "36q3GTzbBfeaKNSupeRjz5PUH9eod36nw3"
  },
  {
    "user": "Marinus Johannes Adrianus  Hellemons",
    "email": "mja.hellemons@gmail.com",
    "viabtcUserId": 601204,
    "coin": "BCH",
    "walletAmount": 0.099,
    "walletAddress": "3CgB43KhRH4KnhcYC5V2G1Hmsvv4C82xV3"
  },
  {
    "user": "faizan ali",
    "email": "faizansahel9@gmail.com",
    "viabtcUserId": 601212,
    "coin": "LTC",
    "walletAmount": 0.09899999999999998,
    "walletAddress": "MPFs5dDSuppSqYBQk6dLEgwnDF2CB38cx3"
  },
  {
    "user": "Feleran Azer Falcon",
    "email": "azfalx77@gmail.com",
    "viabtcUserId": 601287,
    "coin": "BTC",
    "walletAmount": 0.00003109,
    "walletAddress": "3N5rEuwm4e4vPdeSvUf3EDHwfN1mUnFnE3"
  },
  {
    "user": "Hossein Ali Amani",
    "email": "hossein@panecs.ae",
    "viabtcUserId": 601295,
    "coin": "LTC",
    "walletAmount": 2.2734449,
    "walletAddress": "MQZJcEJuCBpJ3bqsTtBEHbPP5zERzXjhBZ"
  },
  {
    "user": "tech star",
    "email": "techystar8@gmail.com",
    "viabtcUserId": 601321,
    "coin": "BTC",
    "walletAmount": 0.00059795,
    "walletAddress": "36ijfwMxT29bzBtVL9tWaSjYSdUekavRpR"
  },
  {
    "user": "Muhammad Noormahomed",
    "email": "mnoormahomed@gmail.com",
    "viabtcUserId": 601386,
    "coin": "BTC",
    "walletAmount": 0.00002221,
    "walletAddress": "34WypYsmY4F6XfeQm4U6mSwLCjyBKra9b3"
  },
  {
    "user": "mohammed furqan",
    "email": "mohammedfur@gmail.com",
    "viabtcUserId": 601405,
    "coin": "BTC",
    "walletAmount": 0.00137684,
    "walletAddress": "3NU22fmei4ixCJ7MX4AYzHQrgr7NyVdu2k"
  },
  {
    "user": "Maiik Nasir",
    "email": "nasirmalik91@yahoo.com",
    "viabtcUserId": 601443,
    "coin": "BTC",
    "walletAmount": 0.0009394899999999997,
    "walletAddress": "373f8VqnXD1Lq53ZCcs3nnUH5ACuJvFi9a"
  },
  {
    "user": "Gokulakrishnan Govindarajan",
    "email": "ggk03101988@gmail.com",
    "viabtcUserId": 601447,
    "coin": "BTC",
    "walletAmount": 0.00047354,
    "walletAddress": "3D2oXSdjYuXHJsMajPjTS9Dyxs8AGGqnyW"
  },
  {
    "user": "Unni menon Vattekkad",
    "email": "unniinbox@protonmail.com",
    "viabtcUserId": 601494,
    "coin": "LTC",
    "walletAmount": 0.038,
    "walletAddress": "MQycHRc4qQgwUauo4mGVHA9mdkQkby9UWB"
  },
  {
    "user": "Unni menon Vattekkad",
    "email": "unniinbox@protonmail.com",
    "viabtcUserId": 601494,
    "coin": "BTC",
    "walletAmount": 0.0014,
    "walletAddress": "3EviYVVjVUnV6Tj1pbVb6NSmJE8rfvU2WH"
  },
  {
    "user": "Unni menon Vattekkad",
    "email": "unniinbox@protonmail.com",
    "viabtcUserId": 601494,
    "coin": "BCH",
    "walletAmount": 0.0005,
    "walletAddress": "37oNQer9tWsCjFXjzZyNdM8VYtD6643pkq"
  },
  {
    "user": "shakeel ahmed",
    "email": "Shaks40@hotmail.com",
    "viabtcUserId": 601503,
    "coin": "BTC",
    "walletAmount": 0.0151,
    "walletAddress": "39jkBmGVAhopxERrUiiJ1LSeGhXakcYLpA"
  },
  {
    "user": "Dora Czuczor",
    "email": "czuczor.dora@gmail.com",
    "viabtcUserId": 601517,
    "coin": "BTC",
    "walletAmount": 0.5,
    "walletAddress": "3AzzFPx88jCqXrGUuhbTRKEN9DDutuPwrm"
  },
  {
    "user": "Dora Czuczor",
    "email": "czuczor.dora@gmail.com",
    "viabtcUserId": 601517,
    "coin": "BCH",
    "walletAmount": 5,
    "walletAddress": "3F8QASE6uRwF9Gn6at7FqqpaXhNBEpexca"
  },
  {
    "user": "Sami Ali",
    "email": "sami.kubbar@gmail.com",
    "viabtcUserId": 601519,
    "coin": "BTC",
    "walletAmount": 1e-8,
    "walletAddress": "3AHS34m6hzU9PteUzAysg6jZcQ5qK7hw5V"
  },
  {
    "user": "Nasreen Moolla",
    "email": "nasy512@gmail.com",
    "viabtcUserId": 601521,
    "coin": "BTC",
    "walletAmount": 0.0001732,
    "walletAddress": "34xaUQPrPaR5vL9EFch35fGiZzstWheX6n"
  },
  {
    "user": "Abdul Hameed  Arif",
    "email": "talha123us@hotmail.com",
    "viabtcUserId": 601547,
    "coin": "BTC",
    "walletAmount": 0.2101,
    "walletAddress": "3Age96aGe76pazVdydwdBgoEf5ZyVSmX4M"
  },
  {
    "user": "faizan ali",
    "email": "faizansahel1@gmail.com",
    "viabtcUserId": 601628,
    "coin": "BTC",
    "walletAmount": 4.33680868994e-19,
    "walletAddress": "3Q1gQFFfg1NeDajJx6mGajgkHB8dzu2rdy"
  },
  {
    "user": "Rodrigo Afonso Silva",
    "email": "rodrigoafonso_aviacao@yahoo.com.br",
    "viabtcUserId": 601712,
    "coin": "BCH",
    "walletAmount": 0.00299774,
    "walletAddress": "3NDFAZoTQWbqNmSSefUey2DrHDuUZQSqb4"
  },
  {
    "user": "Umberto Gigante",
    "email": "gigante.umberto@gmail.com",
    "viabtcUserId": 602247,
    "coin": "BTC",
    "walletAmount": 0.0003999999999999976,
    "walletAddress": "37o3dRewfEQoa7Wt5ajhu3MQeekNgn2zxr"
  },
  {
    "user": "Saravanan kumarashanmugam",
    "email": "saran945@yahoo.co.in",
    "viabtcUserId": 602249,
    "coin": "BTC",
    "walletAmount": 0.0010000000000000009,
    "walletAddress": "39acoCg2gBkxUzjqfQ8rV2uiQtJJvzEpLe"
  },
  {
    "user": "Elie Ishac",
    "email": "ishaac.elie@gmail.com",
    "viabtcUserId": 602295,
    "coin": "BTC",
    "walletAmount": 0.00437056,
    "walletAddress": "3Nip1JnUYNSteU7oWCC6eUayRGB7g4R7a6"
  },
  {
    "user": "Vinay Gandhi",
    "email": "vinaygandhi97@gmail.com",
    "viabtcUserId": 602323,
    "coin": "BTC",
    "walletAmount": 0.00325297,
    "walletAddress": "3DZZMaMv9rQSherXTNDDkBahqYpH2Pcfmh"
  },
  {
    "user": "Bibhuti Dash",
    "email": "dabibhuti@gmail.com",
    "viabtcUserId": 602597,
    "coin": "LTC",
    "walletAmount": 0.009000000000000119,
    "walletAddress": "MHZvVa6bqJqwhXeZxzTaTSdn1kXTzQ3Lnv"
  },
  {
    "user": "ashok kumar mulpuri",
    "email": "ashoks.mulpuri@gmail.com",
    "viabtcUserId": 602746,
    "coin": "LTC",
    "walletAmount": 2.22044604925031e-16,
    "walletAddress": "MSMvc69yeVZYLiXbnZL11TSbDPYjJ5sgGi"
  },
  {
    "user": "Amit Thakkar",
    "email": "amitthakkar3@hotmail.com",
    "viabtcUserId": 602926,
    "coin": "BTC",
    "walletAmount": 1.90182236,
    "walletAddress": "3DGCUqSvAu74ALgybihAHy8p6k4GZTcnf5"
  },
  {
    "user": "Amit Thakkar",
    "email": "amitthakkar3@hotmail.com",
    "viabtcUserId": 602926,
    "coin": "LTC",
    "walletAmount": 88.45621266,
    "walletAddress": "MN2xmMpwHrBgBL3X9m1HsPhPqLNe4GmbfR"
  },
  {
    "user": "Amit Thakkar",
    "email": "amitthakkar3@hotmail.com",
    "viabtcUserId": 602926,
    "coin": "AED",
    "walletAmount": 2761219.64,
    "walletAddress": "undefined"
  },
  {
    "user": "Mohd Hasnain",
    "email": "moonhasnain03@gmail.com",
    "viabtcUserId": 602931,
    "coin": "BTC",
    "walletAmount": 0.0009957,
    "walletAddress": "3Pbuwxr7qZDodKDGWqECakZ3HQSm7jMMzr"
  },
  {
    "user": "Mohd Hasnain",
    "email": "moonhasnain03@gmail.com",
    "viabtcUserId": 602931,
    "coin": "XRP",
    "walletAmount": 14,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Dylan Ballantyne",
    "email": "dballantyne12@hotmail.com",
    "viabtcUserId": 602949,
    "coin": "BTC",
    "walletAmount": 0.01073738,
    "walletAddress": "3C6RCWuTFbYRRUDTrQCBVRbgRjjcRAmDeK"
  },
  {
    "user": "Dylan Ballantyne",
    "email": "dballantyne12@hotmail.com",
    "viabtcUserId": 602949,
    "coin": "AED",
    "walletAmount": 0.03487866,
    "walletAddress": "undefined"
  },
  {
    "user": "Bernadette Charlotte Diestro",
    "email": "bitdiestro69@gmail.com",
    "viabtcUserId": 602973,
    "coin": "XRP",
    "walletAmount": 0.15,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Agnes Benitez",
    "email": "agnes_benitez81@hotmail.com",
    "viabtcUserId": 603027,
    "coin": "BTC",
    "walletAmount": 0.003106,
    "walletAddress": "382sS2W4GkU7KxTe6y87ou8Q4TWaYkYNBe"
  },
  {
    "user": "mode mode",
    "email": "steelmode@protonmail.com",
    "viabtcUserId": 603032,
    "coin": "ETH",
    "walletAmount": 0.003,
    "walletAddress": "0x43DB0539F921366101ee7a6FcCEc19cACA43feB0"
  },
  {
    "user": "Paul  Tobenna",
    "email": "toochipaul2@gmail.com",
    "viabtcUserId": 603063,
    "coin": "BTC",
    "walletAmount": 0.00000122,
    "walletAddress": "344JrLkecnrF5wqfqyAVQbNFFdyX26riHt"
  },
  {
    "user": "Paul  Tobenna",
    "email": "toochipaul2@gmail.com",
    "viabtcUserId": 603063,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": "undefined"
  },
  {
    "user": "Rahil Alam",
    "email": "rahilalam83@gmail.com",
    "viabtcUserId": 600130,
    "coin": "XRP",
    "walletAmount": 0.08571429,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Joshua Orpilla",
    "email": "orpillajoshua10@gmail.com",
    "viabtcUserId": 603116,
    "coin": "BTC",
    "walletAmount": 0.00000748,
    "walletAddress": "3J12kRxYy2ntfmpkTGdUXiUSLBrqrHdaNR"
  },
  {
    "user": "Mai Hamed",
    "email": "mai.hamed@gmail.com",
    "viabtcUserId": 603156,
    "coin": "BTC",
    "walletAmount": 0.00071986,
    "walletAddress": "3BxELFkkuUEkKiCuHQHhZydWvyzSByoe2H"
  },
  {
    "user": "Mai Hamed",
    "email": "mai.hamed@gmail.com",
    "viabtcUserId": 603156,
    "coin": "AED",
    "walletAmount": 0.7300000000000182,
    "walletAddress": "undefined"
  },
  {
    "user": "Petra Babo",
    "email": "petrababo@hotmail.com",
    "viabtcUserId": 603179,
    "coin": "BTC",
    "walletAmount": 0.00024902,
    "walletAddress": "33LhfcCtBoypn6SmJeeHzS4oZHQ6zKWhsm"
  },
  {
    "user": "Petra Babo",
    "email": "petrababo@hotmail.com",
    "viabtcUserId": 603179,
    "coin": "AED",
    "walletAmount": 9.73,
    "walletAddress": "undefined"
  },
  {
    "user": "Sultan Mohammed saleem",
    "email": "sultansaltooni@gmail.com",
    "viabtcUserId": 603194,
    "coin": "BTC",
    "walletAmount": 0.0001118,
    "walletAddress": "3KLkKPi23QreWJCmuPniUJwUr6KcYgCMAA"
  },
  {
    "user": "Sultan Mohammed saleem",
    "email": "sultansaltooni@gmail.com",
    "viabtcUserId": 603194,
    "coin": "XRP",
    "walletAmount": 4.00160901,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Amna  Al Haddad",
    "email": "amna.alhaddad@gmail.com",
    "viabtcUserId": 602702,
    "coin": "BTC",
    "walletAmount": 0.00265,
    "walletAddress": "32Dc2BLYbYkuuXwxDTRmL8BzH6bjf7Gizg"
  },
  {
    "user": "Roger daniel martin Solomon",
    "email": "rogerame14@gmail.com",
    "viabtcUserId": 603211,
    "coin": "ETH",
    "walletAmount": 0.00001072,
    "walletAddress": "0x3fbEaf832eA8ee88463e53FDa066441f0C6C3009"
  },
  {
    "user": "Olli Tyrvainen",
    "email": "cryot11@protonmail.com",
    "viabtcUserId": 603239,
    "coin": "BTC",
    "walletAmount": 0.00034518,
    "walletAddress": "3MfG8cqh6qPCskxwPu7WTgjVyy1R34NeQE"
  },
  {
    "user": "Olli Tyrvainen",
    "email": "cryot11@protonmail.com",
    "viabtcUserId": 603239,
    "coin": "LTC",
    "walletAmount": 0.00330831,
    "walletAddress": "MQaxP36vztAPhooD2aDp2ADWr9gs23doqM"
  },
  {
    "user": "Olli Tyrvainen",
    "email": "cryot11@protonmail.com",
    "viabtcUserId": 603239,
    "coin": "ETH",
    "walletAmount": 0.00053304,
    "walletAddress": "0x73FF7E4b94d53764E7c0ae0aBE4D0beCe9fc2619"
  },
  {
    "user": "Olli Tyrvainen",
    "email": "cryot11@protonmail.com",
    "viabtcUserId": 603239,
    "coin": "XRP",
    "walletAmount": 0.08532819,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Olli Tyrvainen",
    "email": "cryot11@protonmail.com",
    "viabtcUserId": 603239,
    "coin": "AED",
    "walletAmount": 54.52,
    "walletAddress": "undefined"
  },
  {
    "user": "Yousef Alshawabkeh",
    "email": "yousefghata@yahoo.com",
    "viabtcUserId": 603276,
    "coin": "BTC",
    "walletAmount": 0.00005623,
    "walletAddress": "3DgMpKZFAaz7ajxbBxrU2NxBLnt5W6hQ9h"
  },
  {
    "user": "Muhammad Ather",
    "email": "m.ather@fphomefinders.com",
    "viabtcUserId": 603286,
    "coin": "BTC",
    "walletAmount": 0.00000864,
    "walletAddress": "3K6hrKwHvTfGQcwj7PCLDRhgKxAce325TJ"
  },
  {
    "user": "John Akinola",
    "email": "johnakin1992@gmail.com",
    "viabtcUserId": 603332,
    "coin": "BTC",
    "walletAmount": 0.0015092,
    "walletAddress": "3KiR3uq6n2gde3W1vT7oNmjHs62XWoUZxc"
  },
  {
    "user": "John Akinola",
    "email": "johnakin1992@gmail.com",
    "viabtcUserId": 603332,
    "coin": "AED",
    "walletAmount": 0.8100000000000023,
    "walletAddress": "undefined"
  },
  {
    "user": "Jayr Motta",
    "email": "jayrmotta@protonmail.com",
    "viabtcUserId": 602338,
    "coin": "BTC",
    "walletAmount": 0.00000412,
    "walletAddress": "3GLyi6HLtqaSZQkEhynKy2ALKKcvqpbUNA"
  },
  {
    "user": "Yosniel Almora",
    "email": "giulybrandi2310@gmail.com",
    "viabtcUserId": 603346,
    "coin": "BTC",
    "walletAmount": 0.00009118,
    "walletAddress": "3G3VeTRWyac3biP83jFfc5x1TYfVnAJzaa"
  },
  {
    "user": "Hengky  Herdianto",
    "email": "hengkyherdianto@gmail.com",
    "viabtcUserId": 603350,
    "coin": "AED",
    "walletAmount": 0.09,
    "walletAddress": "undefined"
  },
  {
    "user": "Pawel Wiktorek",
    "email": "pawelwiktorek@googlemail.com",
    "viabtcUserId": 603369,
    "coin": "BTC",
    "walletAmount": 0.0004283,
    "walletAddress": "3LMdLivA4CYALPWcPrS4YHfFyrfLPeBjn5"
  },
  {
    "user": "Pawel Wiktorek",
    "email": "pawelwiktorek@googlemail.com",
    "viabtcUserId": 603369,
    "coin": "AED",
    "walletAmount": 0.12,
    "walletAddress": "undefined"
  },
  {
    "user": "Ogba Daniel  Oguma",
    "email": "million.oguma@gmail.com",
    "viabtcUserId": 603389,
    "coin": "BTC",
    "walletAmount": 0.0001,
    "walletAddress": "3HCYiv9A5V3vctcRLboHuEEwYrjdSwoU5E"
  },
  {
    "user": "Guenter Gierer",
    "email": "nl1021@lau-net.de",
    "viabtcUserId": 603395,
    "coin": "BTC",
    "walletAmount": 0.00235354,
    "walletAddress": "39H4RUPj4dRVQjxV3inCrSgzpqxgnu99oL"
  },
  {
    "user": "Guenter Gierer",
    "email": "nl1021@lau-net.de",
    "viabtcUserId": 603395,
    "coin": "AED",
    "walletAmount": 57.95999999,
    "walletAddress": "undefined"
  },
  {
    "user": "Samuel  Coran",
    "email": "scoran@gmail.com",
    "viabtcUserId": 603409,
    "coin": "BTC",
    "walletAmount": 0.00022953,
    "walletAddress": "3ET2KVzbsb6BMM5BNQL7JoCdYAxCqgNzhR"
  },
  {
    "user": "Samuel  Coran",
    "email": "scoran@gmail.com",
    "viabtcUserId": 603409,
    "coin": "AED",
    "walletAmount": 0.06,
    "walletAddress": "undefined"
  },
  {
    "user": "Mujib Dave",
    "email": "mujib_dave@yahoo.co.in",
    "viabtcUserId": 603420,
    "coin": "BTC",
    "walletAmount": 0.80035324,
    "walletAddress": "3JMdg2wr5U3suytCnDK9wQnVUbVHwVsALo"
  },
  {
    "user": "Mujib Dave",
    "email": "mujib_dave@yahoo.co.in",
    "viabtcUserId": 603420,
    "coin": "LTC",
    "walletAmount": 22.00012338,
    "walletAddress": "MUvxo88rkmUtcpj2wAV86NTK9XBqJaBZq2"
  },
  {
    "user": "Mujib Dave",
    "email": "mujib_dave@yahoo.co.in",
    "viabtcUserId": 603420,
    "coin": "ETH",
    "walletAmount": 4.00012009,
    "walletAddress": "0x53Ad230c02beCb204E5b5A8Ee04E21308E8D8FFd"
  },
  {
    "user": "Mujib Dave",
    "email": "mujib_dave@yahoo.co.in",
    "viabtcUserId": 603420,
    "coin": "XRP",
    "walletAmount": 395.70021134,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Mujib Dave",
    "email": "mujib_dave@yahoo.co.in",
    "viabtcUserId": 603420,
    "coin": "BCH",
    "walletAmount": 1.50170948,
    "walletAddress": "3Q9x6iCPHPDB4NkazR6by4SwsNH1jixAUF"
  },
  {
    "user": "Mujib Dave",
    "email": "mujib_dave@yahoo.co.in",
    "viabtcUserId": 603420,
    "coin": "AED",
    "walletAmount": 353.42,
    "walletAddress": "undefined"
  },
  {
    "user": "Monark MM",
    "email": "testmail@mailinator.com",
    "viabtcUserId": 603418,
    "coin": "AED",
    "walletAmount": 912.8815074,
    "walletAddress": "undefined"
  },
  {
    "user": "Marcelo Bronk",
    "email": "mlmailbox1444@gmail.com",
    "viabtcUserId": 603444,
    "coin": "BTC",
    "walletAmount": 0.00006252,
    "walletAddress": "3M4MbWzxtkBYu9eGvqRs4gU2NSy2RWECfH"
  },
  {
    "user": "Marcelo Bronk",
    "email": "mlmailbox1444@gmail.com",
    "viabtcUserId": 603444,
    "coin": "ETH",
    "walletAmount": 0.0001,
    "walletAddress": "0x63dc0CF3f60751c485Dd43e7B86a7D87c556356D"
  },
  {
    "user": "Beata Dobrzykowska",
    "email": "beataprzemek@protonmail.com",
    "viabtcUserId": 603449,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": "undefined"
  },
  {
    "user": "Khezer Majeed",
    "email": "khezerdon@gmail.com",
    "viabtcUserId": 603489,
    "coin": "BTC",
    "walletAmount": 6.8e-7,
    "walletAddress": "3MGTdsFnqRpuiibL5z1w7PaRRiqfXHfu7p"
  },
  {
    "user": "Khezer Majeed",
    "email": "khezerdon@gmail.com",
    "viabtcUserId": 603489,
    "coin": "ETH",
    "walletAmount": 0.00002765,
    "walletAddress": "0x7cFc9ABd1B85f762623ea388C2aaFc61C6BBcED8"
  },
  {
    "user": "Khezer Majeed",
    "email": "khezerdon@gmail.com",
    "viabtcUserId": 603489,
    "coin": "XRP",
    "walletAmount": 0.19186916,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Khezer Majeed",
    "email": "khezerdon@gmail.com",
    "viabtcUserId": 603489,
    "coin": "AED",
    "walletAmount": 0.13,
    "walletAddress": "undefined"
  },
  {
    "user": "Wisdom Nmelusum",
    "email": "derickwiz7@gmail.com",
    "viabtcUserId": 603517,
    "coin": "BTC",
    "walletAmount": 0.0001,
    "walletAddress": "35wiUdbETGLCoTt5bTgwoEBqy5SdbHVEUa"
  },
  {
    "user": "Kingsley Lawrence",
    "email": "kingsley872002@yahoo.com",
    "viabtcUserId": 603522,
    "coin": "AED",
    "walletAmount": 0.08,
    "walletAddress": "undefined"
  },
  {
    "user": "Daylin D Souza",
    "email": "daylind4@gmail.com",
    "viabtcUserId": 603575,
    "coin": "BTC",
    "walletAmount": 0.00001831,
    "walletAddress": "3Pn8sAVHsAofwsXjgsujKAsCTwK9uGDw93"
  },
  {
    "user": "Daylin D Souza",
    "email": "daylind4@gmail.com",
    "viabtcUserId": 603575,
    "coin": "AED",
    "walletAmount": 0.04,
    "walletAddress": "undefined"
  },
  {
    "user": "Deepak Pillai",
    "email": "deepak@soecgroup.com",
    "viabtcUserId": 603585,
    "coin": "BTC",
    "walletAmount": 0.00013468,
    "walletAddress": "3As3JxbpvbC4W9vdSaHTEYkZzN9Wowhoxn"
  },
  {
    "user": "Deepak Pillai",
    "email": "deepak@soecgroup.com",
    "viabtcUserId": 603585,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": "undefined"
  },
  {
    "user": "Marissa Piñon",
    "email": "marissapinon48@gmail.com",
    "viabtcUserId": 603600,
    "coin": "BTC",
    "walletAmount": 0.00206135,
    "walletAddress": "3MyqW2FURmMWCKUdqyAuSYAaHNgxCzmbkD"
  },
  {
    "user": "rashed ben salman",
    "email": "soperman662002@gmail.com",
    "viabtcUserId": 603604,
    "coin": "BCH",
    "walletAmount": 0.00247024,
    "walletAddress": "39myUMwt7RN8yxrgUFhZyibzdwAMNggQo4"
  },
  {
    "user": "rashed ben salman",
    "email": "soperman662002@gmail.com",
    "viabtcUserId": 603604,
    "coin": "AED",
    "walletAmount": 0.74,
    "walletAddress": "undefined"
  },
  {
    "user": "Mogamat Khasif Adams",
    "email": "khasif24@gmail.com",
    "viabtcUserId": 603613,
    "coin": "ETH",
    "walletAmount": 0.00096316,
    "walletAddress": "0x58720Cf9af3f2213760D66001aE9FECC47fd4E4D"
  },
  {
    "user": "Mogamat Khasif Adams",
    "email": "khasif24@gmail.com",
    "viabtcUserId": 603613,
    "coin": "XRP",
    "walletAmount": 0.00684211,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Mogamat Khasif Adams",
    "email": "khasif24@gmail.com",
    "viabtcUserId": 603613,
    "coin": "BCH",
    "walletAmount": 0.00005808,
    "walletAddress": "36ZJzC2iUGP7hssHsDgGiHLEsQFo683Nkk"
  },
  {
    "user": "Mogamat Khasif Adams",
    "email": "khasif24@gmail.com",
    "viabtcUserId": 603613,
    "coin": "AED",
    "walletAmount": 0.02,
    "walletAddress": "undefined"
  },
  {
    "user": "Olakunle Omolaye",
    "email": "affablerecruits@yahoo.com",
    "viabtcUserId": 603620,
    "coin": "BTC",
    "walletAmount": 0.00016384,
    "walletAddress": "3ETD4Xz6nfZiMqbKjxRuT9nKjvnbbK54dG"
  },
  {
    "user": "Olakunle Omolaye",
    "email": "affablerecruits@yahoo.com",
    "viabtcUserId": 603620,
    "coin": "ETH",
    "walletAmount": 0.00079965,
    "walletAddress": "0xAaF221869ccd5FE85Efe19448298ef936eaa5fF5"
  },
  {
    "user": "Olakunle Omolaye",
    "email": "affablerecruits@yahoo.com",
    "viabtcUserId": 603620,
    "coin": "XRP",
    "walletAmount": 0.9,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Olakunle Omolaye",
    "email": "affablerecruits@yahoo.com",
    "viabtcUserId": 603620,
    "coin": "AED",
    "walletAmount": 0.94,
    "walletAddress": "undefined"
  },
  {
    "user": "Elio Geara",
    "email": "eliogeara1999@gmail.com",
    "viabtcUserId": 603645,
    "coin": "BTC",
    "walletAmount": 0.00209611,
    "walletAddress": "3Kun2pvp4443zA4C6fZuhJmmzsPRrXhhPi"
  },
  {
    "user": "Gary Vaz",
    "email": "garyrvaz@gmail.com",
    "viabtcUserId": 603652,
    "coin": "BTC",
    "walletAmount": 0.00008055,
    "walletAddress": "3NmRNFpZ4Xw3a7CSryjdnQZJJdYvJWKmpE"
  },
  {
    "user": "Gary Vaz",
    "email": "garyrvaz@gmail.com",
    "viabtcUserId": 603652,
    "coin": "AED",
    "walletAmount": 9.91,
    "walletAddress": "undefined"
  },
  {
    "user": "Giancarmelo Spampinato",
    "email": "giancarmelo@gmail.com",
    "viabtcUserId": 603695,
    "coin": "AED",
    "walletAmount": 0.5599999999999454,
    "walletAddress": "undefined"
  },
  {
    "user": "Indika Samantha Ranasinghe Suduwa Dewage",
    "email": "indikaranasinghe@ymail.com",
    "viabtcUserId": 603713,
    "coin": "BTC",
    "walletAmount": 0.00004947,
    "walletAddress": "3J7ceyZxdcxNZCAbEzGPhFQg6rYFmooMHs"
  },
  {
    "user": "Indika Samantha Ranasinghe Suduwa Dewage",
    "email": "indikaranasinghe@ymail.com",
    "viabtcUserId": 603713,
    "coin": "ETH",
    "walletAmount": 0.00000451,
    "walletAddress": "0xC361d585F09de2Aa996edA503cd3838CBB5De910"
  },
  {
    "user": "Indika Samantha Ranasinghe Suduwa Dewage",
    "email": "indikaranasinghe@ymail.com",
    "viabtcUserId": 603713,
    "coin": "BCH",
    "walletAmount": 0.00000387,
    "walletAddress": "3Bzq475tSdoHho7t8KMHnq5edEiCHCV3RU"
  },
  {
    "user": "Amir Kolahzadeh",
    "email": "a.koll@itsecnow.com",
    "viabtcUserId": 603753,
    "coin": "ETH",
    "walletAmount": 0.39042743,
    "walletAddress": "0x8b5715D61f91e67C02D7479B9A7569c3749db474"
  },
  {
    "user": "Moiz Tayebali Lokhandwala",
    "email": "moiz@speedextools.com",
    "viabtcUserId": 603783,
    "coin": "BTC",
    "walletAmount": 0.0099,
    "walletAddress": "3DXmcZR5qhrDXBii9Bi5mEh8q8pjXnMpQf"
  },
  {
    "user": "Moiz Tayebali Lokhandwala",
    "email": "moiz@speedextools.com",
    "viabtcUserId": 603783,
    "coin": "AED",
    "walletAmount": 0.3800000000046566,
    "walletAddress": "undefined"
  },
  {
    "user": "Murtaza Vardhawala",
    "email": "murtaza.vardhawala@gmail.com",
    "viabtcUserId": 603790,
    "coin": "BTC",
    "walletAmount": 0.00003791,
    "walletAddress": "3J3NEX3JWFv1g6rEN7H6YwxNw4d6fEh8Ck"
  },
  {
    "user": "Ismail Shaikh",
    "email": "shaikhmohdismail@gmail.com",
    "viabtcUserId": 603800,
    "coin": "AED",
    "walletAmount": 0.88,
    "walletAddress": "undefined"
  },
  {
    "user": "Alireza Kiyaei",
    "email": "ali.kiyaei@protonmail.com",
    "viabtcUserId": 603803,
    "coin": "BTC",
    "walletAmount": 0.03218592,
    "walletAddress": "3HXSj8kXDebYdh911QBk8PXHHeukyxko3X"
  },
  {
    "user": "Alireza Kiyaei",
    "email": "ali.kiyaei@protonmail.com",
    "viabtcUserId": 603803,
    "coin": "AED",
    "walletAmount": 133.14,
    "walletAddress": "undefined"
  },
  {
    "user": "Leonard Jacobs",
    "email": "leonardjacobs1@gmail.com",
    "viabtcUserId": 603835,
    "coin": "BTC",
    "walletAmount": 0.5451,
    "walletAddress": "3PJhBJtMGi6TQAK4c3auRiE6LkUnUgN1i1"
  },
  {
    "user": "Leonard Jacobs",
    "email": "leonardjacobs1@gmail.com",
    "viabtcUserId": 603835,
    "coin": "AED",
    "walletAmount": 9.23,
    "walletAddress": "undefined"
  },
  {
    "user": "PRABU PANNEERSELVAM",
    "email": "prabupknr@gmail.com",
    "viabtcUserId": 603868,
    "coin": "AED",
    "walletAmount": 0.32,
    "walletAddress": "undefined"
  },
  {
    "user": "IAN DOMINIC PRINCIPIO",
    "email": "iandominicprincipio@gmail.com",
    "viabtcUserId": 603878,
    "coin": "AED",
    "walletAmount": 2.47,
    "walletAddress": "undefined"
  },
  {
    "user": "Katherine Giselle Tuazon",
    "email": "kgbtuazon@gmail.com",
    "viabtcUserId": 603888,
    "coin": "AED",
    "walletAmount": 34.44,
    "walletAddress": "undefined"
  },
  {
    "user": "Randall Marcelo",
    "email": "rdmarcelo19@gmail.com",
    "viabtcUserId": 603901,
    "coin": "AED",
    "walletAmount": 0.82,
    "walletAddress": "undefined"
  },
  {
    "user": "Nishit Shah",
    "email": "nishit555@yahoo.com",
    "viabtcUserId": 603907,
    "coin": "BTC",
    "walletAmount": 0.00004347,
    "walletAddress": "3HsDPTtQyQogvfRi3ZbrHQ1154YDmUaTKL"
  },
  {
    "user": "Nishit Shah",
    "email": "nishit555@yahoo.com",
    "viabtcUserId": 603907,
    "coin": "LTC",
    "walletAmount": 0.01036287,
    "walletAddress": "MRB4oYZRkuUickgHmMAmXG2sBvkFsLwzwc"
  },
  {
    "user": "Nishit Shah",
    "email": "nishit555@yahoo.com",
    "viabtcUserId": 603907,
    "coin": "ETH",
    "walletAmount": 0.01961278,
    "walletAddress": "0x49035F621Db925cA4b90e49E6c92aF69830FbD88"
  },
  {
    "user": "Nishit Shah",
    "email": "nishit555@yahoo.com",
    "viabtcUserId": 603907,
    "coin": "XRP",
    "walletAmount": 1.1,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Nishit Shah",
    "email": "nishit555@yahoo.com",
    "viabtcUserId": 603907,
    "coin": "BCH",
    "walletAmount": 0.01276912,
    "walletAddress": "33heEBrzvAwYNdNstu3jqriBuC84SMvKTH"
  },
  {
    "user": "Nishit Shah",
    "email": "nishit555@yahoo.com",
    "viabtcUserId": 603907,
    "coin": "AED",
    "walletAmount": 0.02,
    "walletAddress": "undefined"
  },
  {
    "user": "Ahmed Abdelaziz Ahmed Fatouh",
    "email": "ahmedfatouheg@gmail.com",
    "viabtcUserId": 603915,
    "coin": "AED",
    "walletAmount": 0.3299999999999841,
    "walletAddress": "undefined"
  },
  {
    "user": "PRAVEEN KIZHAKEYIL MEETHAL",
    "email": "praveekm@gmail.com",
    "viabtcUserId": 603923,
    "coin": "LTC",
    "walletAmount": 0.00111654,
    "walletAddress": "MQHfbbL87LHMsNLyP6mEQVEFBLaSzsJM5t"
  },
  {
    "user": "A S M  Salahuddin",
    "email": "asm.salahuddin@taskeater.com",
    "viabtcUserId": 603976,
    "coin": "BTC",
    "walletAmount": 0.00012582,
    "walletAddress": "36Zc5JKxHppq8Nt5ZSCLwcmyT2S8tHuNPF"
  },
  {
    "user": "MANOJ SHARMA",
    "email": "SHARMA.MANOJ4477@GMAIL.COM",
    "viabtcUserId": 604003,
    "coin": "BTC",
    "walletAmount": 0.0439753,
    "walletAddress": "3MdcSsuMN7Dx7GvQa27rZqmWCRjv6GTCFm"
  },
  {
    "user": "MANOJ SHARMA",
    "email": "SHARMA.MANOJ4477@GMAIL.COM",
    "viabtcUserId": 604003,
    "coin": "AED",
    "walletAmount": 0.35,
    "walletAddress": "undefined"
  },
  {
    "user": "Jasim Shaikh",
    "email": "jasim.shaikh@gmail.com",
    "viabtcUserId": 604069,
    "coin": "LTC",
    "walletAmount": 0.00069074,
    "walletAddress": "MTn1wmFRBAkSmTa9wjXJsFmWRQkFuNG63Z"
  },
  {
    "user": "Jasim Shaikh",
    "email": "jasim.shaikh@gmail.com",
    "viabtcUserId": 604069,
    "coin": "ETH",
    "walletAmount": 0.00070799,
    "walletAddress": "0xf17E8d20eC2f669144A1B024740c28108c63cA4d"
  },
  {
    "user": "Jasim Shaikh",
    "email": "jasim.shaikh@gmail.com",
    "viabtcUserId": 604069,
    "coin": "XRP",
    "walletAmount": 0.002,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Jasim Shaikh",
    "email": "jasim.shaikh@gmail.com",
    "viabtcUserId": 604069,
    "coin": "AED",
    "walletAmount": 44430.75,
    "walletAddress": "undefined"
  },
  {
    "user": "Anoop sasidharan",
    "email": "anoop905@yahoo.co.in",
    "viabtcUserId": 604077,
    "coin": "BTC",
    "walletAmount": 0.00231881,
    "walletAddress": "3JwGsoG3e8zUmbYH3msfJQtun686uPpTmB"
  },
  {
    "user": "Anoop sasidharan",
    "email": "anoop905@yahoo.co.in",
    "viabtcUserId": 604077,
    "coin": "AED",
    "walletAmount": 4.72,
    "walletAddress": "undefined"
  },
  {
    "user": "Javed Khan",
    "email": "justjaved@live.co.uk",
    "viabtcUserId": 604078,
    "coin": "BTC",
    "walletAmount": 0.00001089,
    "walletAddress": "34PhF3XKkp2gvhjaLGMBmE38fAn6uSMmQv"
  },
  {
    "user": "Aissa Belmahdi",
    "email": "aissadzsetif@gmail.com",
    "viabtcUserId": 604082,
    "coin": "AED",
    "walletAmount": 0.28841389,
    "walletAddress": "undefined"
  },
  {
    "user": "Sridhar Govindarajan",
    "email": "mail_2_sridhar@yahoo.com",
    "viabtcUserId": 604098,
    "coin": "AED",
    "walletAmount": 1.5300000000002,
    "walletAddress": "undefined"
  },
  {
    "user": "GOPALA KRISHNA MAMIDI",
    "email": "gopi.chaitanya@gmail.com",
    "viabtcUserId": 604138,
    "coin": "LTC",
    "walletAmount": 0.001,
    "walletAddress": "MSMbQRjQTvnykf6WSTkmu4Kfppd1efWv3p"
  },
  {
    "user": "GOPALA KRISHNA MAMIDI",
    "email": "gopi.chaitanya@gmail.com",
    "viabtcUserId": 604138,
    "coin": "AED",
    "walletAmount": 0.14,
    "walletAddress": "undefined"
  },
  {
    "user": "Usman Mehdi",
    "email": "parastish007@gmail.com",
    "viabtcUserId": 604143,
    "coin": "BTC",
    "walletAmount": 0.00006433,
    "walletAddress": "3Ku44Wzk46H6vJRJVmqKd5vYXpYPLifABm"
  },
  {
    "user": "Usman Mehdi",
    "email": "parastish007@gmail.com",
    "viabtcUserId": 604143,
    "coin": "AED",
    "walletAmount": 0.5200000000000102,
    "walletAddress": "undefined"
  },
  {
    "user": "Gokul KANTH KG",
    "email": "gokul.transguard@gmail.com",
    "viabtcUserId": 604166,
    "coin": "BTC",
    "walletAmount": 0.00001936,
    "walletAddress": "37FBtxQwzZsUznrsmEWBxFTGhWZnBfNVQA"
  },
  {
    "user": "Nivedan  Patlolla",
    "email": "nivedanreddy@gmail.com",
    "viabtcUserId": 604172,
    "coin": "BTC",
    "walletAmount": 0.3,
    "walletAddress": "3FrWC2YE1pigFHjiix7oEVJeyZXAMQskQL"
  },
  {
    "user": "Nivedan  Patlolla",
    "email": "nivedanreddy@gmail.com",
    "viabtcUserId": 604172,
    "coin": "XRP",
    "walletAmount": 1013.51351351,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Nivedan  Patlolla",
    "email": "nivedanreddy@gmail.com",
    "viabtcUserId": 604172,
    "coin": "AED",
    "walletAmount": 0.84,
    "walletAddress": "undefined"
  },
  {
    "user": "Shameel Thattan kandy",
    "email": "shameeltk800@gmail.com",
    "viabtcUserId": 604185,
    "coin": "LTC",
    "walletAmount": 0.00002974,
    "walletAddress": "MHeS78gtKuD95C3CCakeqUcjEq4y259zYw"
  },
  {
    "user": "Ebenezer  Olawore",
    "email": "ebenez1993@gmail.com",
    "viabtcUserId": 604206,
    "coin": "BTC",
    "walletAmount": 0.00002044,
    "walletAddress": "32iMVfZmk79ajKkkZsSsjumoAzk6aaJkCP"
  },
  {
    "user": "Jamila Kosmanat",
    "email": "jamila_0223@yahoo.com",
    "viabtcUserId": 604218,
    "coin": "BTC",
    "walletAmount": 0.00298592,
    "walletAddress": "37DRNSFc9bkt3WTuaGkDEfNv8sgBpeDFEY"
  },
  {
    "user": "sunit pakhira",
    "email": "tusa.gutta@gmail.com",
    "viabtcUserId": 604233,
    "coin": "AED",
    "walletAmount": 0.2599999999999909,
    "walletAddress": "undefined"
  },
  {
    "user": "shahzad  zafar",
    "email": "alfawolf786@gmail.com",
    "viabtcUserId": 604252,
    "coin": "BTC",
    "walletAmount": 0.00001288,
    "walletAddress": "3NxFuQKtD7sdzGsHmbkQh2jF57dpBKKq6K"
  },
  {
    "user": "shahzad  zafar",
    "email": "alfawolf786@gmail.com",
    "viabtcUserId": 604252,
    "coin": "AED",
    "walletAmount": 0.34,
    "walletAddress": "undefined"
  },
  {
    "user": "Mustafa Athar",
    "email": "mustafaathar@hotmail.com",
    "viabtcUserId": 604259,
    "coin": "AED",
    "walletAmount": 0.5799999999999841,
    "walletAddress": "undefined"
  },
  {
    "user": "Abegail Riza Estioco",
    "email": "abby.novencido@gmail.com",
    "viabtcUserId": 604270,
    "coin": "AED",
    "walletAmount": 0.23,
    "walletAddress": "undefined"
  },
  {
    "user": "Giea Marie Española",
    "email": "egieamarie@gmail.com",
    "viabtcUserId": 604279,
    "coin": "XRP",
    "walletAmount": 0.04998498,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Giea Marie Española",
    "email": "egieamarie@gmail.com",
    "viabtcUserId": 604279,
    "coin": "AED",
    "walletAmount": 0.06999999999999318,
    "walletAddress": "undefined"
  },
  {
    "user": "Lorna Alvarado",
    "email": "lornz31alvarado@gmail.com",
    "viabtcUserId": 604294,
    "coin": "ETH",
    "walletAmount": 0.00281189,
    "walletAddress": "0x34f3d426Fc8e5273826E31DFe6E3a84633B0B520"
  },
  {
    "user": "MOHAMMED AHMED",
    "email": "ahmed.mj1105@gmail.com",
    "viabtcUserId": 604305,
    "coin": "AED",
    "walletAmount": 50,
    "walletAddress": "undefined"
  },
  {
    "user": "Lancy Praveen  Nazareth",
    "email": "lancy.none@gmail.com",
    "viabtcUserId": 604319,
    "coin": "ETH",
    "walletAmount": 9.120789,
    "walletAddress": "0x97C2F3AfE053DCA1CC753b917fBE07EA820503A9"
  },
  {
    "user": "Lancy Praveen  Nazareth",
    "email": "lancy.none@gmail.com",
    "viabtcUserId": 604319,
    "coin": "AED",
    "walletAmount": 2386.119,
    "walletAddress": "undefined"
  },
  {
    "user": "BLESSING M. SITHOLE",
    "email": "blessingmsithole@gmail.com",
    "viabtcUserId": 604358,
    "coin": "BTC",
    "walletAmount": 0.00051126,
    "walletAddress": "3AsZLJz7gvQ6nrGfmyNp85skGnz9zUvEED"
  },
  {
    "user": "Delwin Pinto",
    "email": "manusaldanha92@gmail.com",
    "viabtcUserId": 604390,
    "coin": "ETH",
    "walletAmount": 0.00028896,
    "walletAddress": "0xb9312F692f9b9C6880A7b136e44DE4c0B3fA9c27"
  },
  {
    "user": "Delwin Pinto",
    "email": "manusaldanha92@gmail.com",
    "viabtcUserId": 604390,
    "coin": "AED",
    "walletAmount": 16.9,
    "walletAddress": "undefined"
  },
  {
    "user": "Rajesh Chitti",
    "email": "kichu2020@protonmail.com",
    "viabtcUserId": 604401,
    "coin": "XRP",
    "walletAmount": 320.27037037,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Rajesh Chitti",
    "email": "kichu2020@protonmail.com",
    "viabtcUserId": 604401,
    "coin": "AED",
    "walletAmount": 98.8,
    "walletAddress": "undefined"
  },
  {
    "user": "Azalea  Lazaleta",
    "email": "azalea.laza@gmail.com",
    "viabtcUserId": 604415,
    "coin": "ETH",
    "walletAmount": 0.01209096,
    "walletAddress": "0xaC6442cAefF9C70dd627412598E25D388A224F96"
  },
  {
    "user": "Azalea  Lazaleta",
    "email": "azalea.laza@gmail.com",
    "viabtcUserId": 604415,
    "coin": "AED",
    "walletAmount": 0.029999999999972715,
    "walletAddress": "undefined"
  },
  {
    "user": "Salem Alneyadi",
    "email": "salem18900@hotmail.com",
    "viabtcUserId": 604439,
    "coin": "BTC",
    "walletAmount": 0.00002851,
    "walletAddress": "3CMaE3QxiyRiy9R9hsPCFiN6ExrXKCfKCk"
  },
  {
    "user": "Steph Essongue Moussounda",
    "email": "ems1884@gmail.com",
    "viabtcUserId": 604449,
    "coin": "BTC",
    "walletAmount": 0.0000365,
    "walletAddress": "3MnNoUZ99T2ReEm7Mj7Gspek2h1VNL6MkP"
  },
  {
    "user": "Steph Essongue Moussounda",
    "email": "ems1884@gmail.com",
    "viabtcUserId": 604449,
    "coin": "AED",
    "walletAmount": 0.1,
    "walletAddress": "undefined"
  },
  {
    "user": "SYED AHAMED",
    "email": "nisasyed82@gmail.com",
    "viabtcUserId": 604464,
    "coin": "BTC",
    "walletAmount": 0.0000886,
    "walletAddress": "33hKayZc8SD6FmvXgiJ6spL7kj7f3MNqH2"
  },
  {
    "user": "SYED AHAMED",
    "email": "nisasyed82@gmail.com",
    "viabtcUserId": 604464,
    "coin": "AED",
    "walletAmount": 0.01999999,
    "walletAddress": "undefined"
  },
  {
    "user": "SIDDHARTH VENKATACHALAM",
    "email": "v.siddhaarth@gmail.com",
    "viabtcUserId": 604479,
    "coin": "ETH",
    "walletAmount": 0.018472675,
    "walletAddress": "0xfdeC9256e8104ffb451884422A99313EA873Ec0D"
  },
  {
    "user": "SIDDHARTH VENKATACHALAM",
    "email": "v.siddhaarth@gmail.com",
    "viabtcUserId": 604479,
    "coin": "AED",
    "walletAmount": 4.25,
    "walletAddress": "undefined"
  },
  {
    "user": "Roche Catayas",
    "email": "rocarnel.ctayas@gmail.com",
    "viabtcUserId": 604491,
    "coin": "ETH",
    "walletAmount": 0.00098,
    "walletAddress": "0x45f3fF668B0A495FA882471b1BeF692Af983E0E3"
  },
  {
    "user": "Syed Razvi ahmed",
    "email": "syedrazviahmedrz@gmail.com",
    "viabtcUserId": 604506,
    "coin": "AED",
    "walletAmount": 59,
    "walletAddress": "undefined"
  },
  {
    "user": "Daniel Breytenbach",
    "email": "dwbreytenbach@gmail.com",
    "viabtcUserId": 604527,
    "coin": "BTC",
    "walletAmount": 0.0749,
    "walletAddress": "3GvoS7VqxFUbXwqf38R89b9EpAyAh35uui"
  },
  {
    "user": "Daniel Breytenbach",
    "email": "dwbreytenbach@gmail.com",
    "viabtcUserId": 604527,
    "coin": "ETH",
    "walletAmount": 0.01716129,
    "walletAddress": "0x7759A2b5195CC39e419d34A61da6D37962a837f1"
  },
  {
    "user": "Daniel Breytenbach",
    "email": "dwbreytenbach@gmail.com",
    "viabtcUserId": 604527,
    "coin": "AED",
    "walletAmount": 1425.46,
    "walletAddress": "undefined"
  },
  {
    "user": "Ahmed Hassan",
    "email": "dralex1954@protonmail.com",
    "viabtcUserId": 604557,
    "coin": "ETH",
    "walletAmount": 0.00244038,
    "walletAddress": "0xE7257Cd07c6ca53A7bfA7c338eA7a8326626D03b"
  },
  {
    "user": "Ahmed Hassan",
    "email": "dralex1954@protonmail.com",
    "viabtcUserId": 604557,
    "coin": "AED",
    "walletAmount": 0.69,
    "walletAddress": "undefined"
  },
  {
    "user": "Tony Armstrong",
    "email": "tonyarmstrong@hotmail.com",
    "viabtcUserId": 604596,
    "coin": "ETH",
    "walletAmount": 46.48370964,
    "walletAddress": "0x24496C26Eb47f2D413DaF1D9DC1F79c5c7E06a59"
  },
  {
    "user": "Tony Armstrong",
    "email": "tonyarmstrong@hotmail.com",
    "viabtcUserId": 604596,
    "coin": "AED",
    "walletAmount": 186.18675087,
    "walletAddress": "undefined"
  },
  {
    "user": "Rajashekharreddy Buccha",
    "email": "rubiksdxb@outlook.com",
    "viabtcUserId": 604617,
    "coin": "BTC",
    "walletAmount": 0.00081684,
    "walletAddress": "35EUAAPXceHw3X1g7LXrnGYGjxon4jXxCR"
  },
  {
    "user": "Zaheer Abbas",
    "email": "zaheer.zam@gmail.com",
    "viabtcUserId": 604618,
    "coin": "XRP",
    "walletAmount": 12.22222222,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Zaheer Abbas",
    "email": "zaheer.zam@gmail.com",
    "viabtcUserId": 604618,
    "coin": "AED",
    "walletAmount": 0.47,
    "walletAddress": "undefined"
  },
  {
    "user": "Asif Zaman Syed",
    "email": "nufuae@gmail.com",
    "viabtcUserId": 604652,
    "coin": "BTC",
    "walletAmount": 0.0006,
    "walletAddress": "3Qg7eFDXpwS85FfJm2uWgwck2SEm15SGiZ"
  },
  {
    "user": "Asif Zaman Syed",
    "email": "nufuae@gmail.com",
    "viabtcUserId": 604652,
    "coin": "AED",
    "walletAmount": 0.20999999999912689,
    "walletAddress": "undefined"
  },
  {
    "user": "Sreenivasan Saji",
    "email": "sajivasan@yahoo.com",
    "viabtcUserId": 604695,
    "coin": "BTC",
    "walletAmount": 0.00382026,
    "walletAddress": "399aCeYrLVdMPuXEi2V7VgkykCCE99rA2v"
  },
  {
    "user": "Sreenivasan Saji",
    "email": "sajivasan@yahoo.com",
    "viabtcUserId": 604695,
    "coin": "ETH",
    "walletAmount": 0.00084656,
    "walletAddress": "0x87e90810add22647B55776A680438360a8EE87EB"
  },
  {
    "user": "Sreenivasan Saji",
    "email": "sajivasan@yahoo.com",
    "viabtcUserId": 604695,
    "coin": "AED",
    "walletAmount": 41.15,
    "walletAddress": "undefined"
  },
  {
    "user": "Abdul Hai Ahmad",
    "email": "abdul.hai27@gmail.com",
    "viabtcUserId": 604706,
    "coin": "BTC",
    "walletAmount": 0.00003435,
    "walletAddress": "3MwMMNXNu7h73F4Fkmr3z59Wdpr3ubwbHp"
  },
  {
    "user": "Abdul Hai Ahmad",
    "email": "abdul.hai27@gmail.com",
    "viabtcUserId": 604706,
    "coin": "AED",
    "walletAmount": 88.34,
    "walletAddress": "undefined"
  },
  {
    "user": "Jethro Cangas",
    "email": "jethrorandall.cruz@gmail.com",
    "viabtcUserId": 604740,
    "coin": "BTC",
    "walletAmount": 1.7e-7,
    "walletAddress": "3DrH62fDwCQZkKgUAFj2EV4LppybNyrzU4"
  },
  {
    "user": "Jethro Cangas",
    "email": "jethrorandall.cruz@gmail.com",
    "viabtcUserId": 604740,
    "coin": "ETH",
    "walletAmount": 0.01072623,
    "walletAddress": "0x7d7ff4Fc0Dd9E8d02207D3ea5bB5862fdd974e5a"
  },
  {
    "user": "Jethro Cangas",
    "email": "jethrorandall.cruz@gmail.com",
    "viabtcUserId": 604740,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": "undefined"
  },
  {
    "user": "Igor Maria Di Paolo",
    "email": "igor.di.paolo@gmail.com",
    "viabtcUserId": 604881,
    "coin": "AED",
    "walletAmount": 0.14,
    "walletAddress": "undefined"
  },
  {
    "user": "Ghanem Almazrouei",
    "email": "ghanem9222@gmail.com",
    "viabtcUserId": 604803,
    "coin": "XRP",
    "walletAmount": 0.8,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Ghanem Almazrouei",
    "email": "ghanem9222@gmail.com",
    "viabtcUserId": 604803,
    "coin": "AED",
    "walletAmount": 5.07,
    "walletAddress": "undefined"
  },
  {
    "user": "Vinod  Patil",
    "email": "vinodpatil2074@gmail.com",
    "viabtcUserId": 602232,
    "coin": "BTC",
    "walletAmount": 0.00005287,
    "walletAddress": "3CR8FxnuX9MRzL7YpeUGZUUphvut2QGwxy"
  },
  {
    "user": "KI JIN KWON",
    "email": "nosabest@naver.com",
    "viabtcUserId": 604807,
    "coin": "XRP",
    "walletAmount": 0.1,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Mehdi Chraibi",
    "email": "chraibi.mehdi@protonmail.ch",
    "viabtcUserId": 604809,
    "coin": "XRP",
    "walletAmount": 0.31,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Adnan Abdur Razzaque",
    "email": "adnan.razzaque@taskeater.com",
    "viabtcUserId": 604816,
    "coin": "BTC",
    "walletAmount": 0.00002089,
    "walletAddress": "31iAVtWuf6ou8dRqQD8b5fN3avgFQMuqY2"
  },
  {
    "user": "Dalal Saadeddine",
    "email": "fadl@binmajid.com",
    "viabtcUserId": 604823,
    "coin": "ETH",
    "walletAmount": 0.0028462,
    "walletAddress": "0x7546B37BAdeD8d5ea206568e532A80C0727f769b"
  },
  {
    "user": "Dalal Saadeddine",
    "email": "fadl@binmajid.com",
    "viabtcUserId": 604823,
    "coin": "AED",
    "walletAmount": 0.03,
    "walletAddress": "undefined"
  },
  {
    "user": "Jean-Pierre Blignaut",
    "email": "jeanpierreblignautsa@gmail.com",
    "viabtcUserId": 604842,
    "coin": "BTC",
    "walletAmount": 0.00006196,
    "walletAddress": "36EjhyWYLyP2243kh9gRpnrNyQyvme51iW"
  },
  {
    "user": "Jean-Pierre Blignaut",
    "email": "jeanpierreblignautsa@gmail.com",
    "viabtcUserId": 604842,
    "coin": "AED",
    "walletAmount": 0.7,
    "walletAddress": "undefined"
  },
  {
    "user": "SYED HUSSAIN",
    "email": "syed.greenminddubai@yahoo.com",
    "viabtcUserId": 604849,
    "coin": "XRP",
    "walletAmount": 0.28275872,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "SYED HUSSAIN",
    "email": "syed.greenminddubai@yahoo.com",
    "viabtcUserId": 604849,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": "undefined"
  },
  {
    "user": "Olivera VELKOVA",
    "email": "velkova.worldwide@gmail.com",
    "viabtcUserId": 604872,
    "coin": "AED",
    "walletAmount": 3.67,
    "walletAddress": "undefined"
  },
  {
    "user": "Igor Maria Di Paolo",
    "email": "igor.di.paolo@gmail.com",
    "viabtcUserId": 604881,
    "coin": "BTC",
    "walletAmount": 0.00008291,
    "walletAddress": "3823aLmihmreEYKRpA3Rfy2CGR4MG5WodN"
  },
  {
    "user": "Igor Maria Di Paolo",
    "email": "igor.di.paolo@gmail.com",
    "viabtcUserId": 604881,
    "coin": "ETH",
    "walletAmount": 0.01636008,
    "walletAddress": "0xF4cC62d4931DB5b25343F6e0961e390e3347686f"
  },
  {
    "user": "Nayan Shah",
    "email": "nayanshah207@gmail.com",
    "viabtcUserId": 604752,
    "coin": "LTC",
    "walletAmount": 0.8395079,
    "walletAddress": "MCAaSXTFfCTZGU1UMY6hknMZySAsf1VSkt"
  },
  {
    "user": "Nayan Shah",
    "email": "nayanshah207@gmail.com",
    "viabtcUserId": 604752,
    "coin": "ETH",
    "walletAmount": 0.00826167,
    "walletAddress": "0x8609a89B3fAE81FaD209cA140CC81E8BE4C02f52"
  },
  {
    "user": "Nayan Shah",
    "email": "nayanshah207@gmail.com",
    "viabtcUserId": 604752,
    "coin": "XRP",
    "walletAmount": 3.44278935,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Mohd wasif",
    "email": "mohdwasif766@yahoo.com",
    "viabtcUserId": 604933,
    "coin": "AED",
    "walletAmount": 3039.43002598,
    "walletAddress": "undefined"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "USD",
    "walletAmount": 0.14430494,
    "walletAddress": "undefined"
  },
  {
    "user": "Ankit Pathak",
    "email": "ankit@bitex.com",
    "viabtcUserId": 604979,
    "coin": "BTC",
    "walletAmount": 2.00038813,
    "walletAddress": "37drepk8k54pGU8BtqMbTgQfaTJ2ZhHRmJ"
  },
  {
    "user": "Ankit Pathak",
    "email": "ankit@bitex.com",
    "viabtcUserId": 604979,
    "coin": "LTC",
    "walletAmount": 1.98693831,
    "walletAddress": "MNabSh6viv91ykGNKmSS6LN37RCyLTtj3P"
  },
  {
    "user": "Ankit Pathak",
    "email": "ankit@bitex.com",
    "viabtcUserId": 604979,
    "coin": "XRP",
    "walletAmount": 1291.49575761,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Ankit Pathak",
    "email": "ankit@bitex.com",
    "viabtcUserId": 604979,
    "coin": "INR",
    "walletAmount": 113000,
    "walletAddress": "undefined"
  },
  {
    "user": "-",
    "email": "-",
    "viabtcUserId": "-",
    "coin": "INR",
    "walletAmount": 1000.00496722,
    "walletAddress": "undefined"
  },
  {
    "user": "yusuf kasozi",
    "email": "almahmoolcomputer@gmail.com",
    "viabtcUserId": 604985,
    "coin": "ETH",
    "walletAmount": 1.04592798,
    "walletAddress": "0x7C2431b707c3ec69Fd270175233DC3292DDaaE43"
  },
  {
    "user": "yusuf kasozi",
    "email": "almahmoolcomputer@gmail.com",
    "viabtcUserId": 604985,
    "coin": "AED",
    "walletAmount": 3.62572593,
    "walletAddress": "undefined"
  },
  {
    "user": "Jasar Ayaz",
    "email": "jasar15@gmail.com",
    "viabtcUserId": 601393,
    "coin": "USD",
    "walletAmount": 0.13953219999984867,
    "walletAddress": "undefined"
  },
  {
    "user": "Prasanth Babusenan",
    "email": "thegame.6844@gmail.com",
    "viabtcUserId": 601097,
    "coin": "USD",
    "walletAmount": 0.00003184,
    "walletAddress": "undefined"
  },
  {
    "user": "Maksim Efremov",
    "email": "ethlol@ya.ru",
    "viabtcUserId": 605015,
    "coin": "ETH",
    "walletAmount": 0.004,
    "walletAddress": "0x1b8a2C88E032489409De379F783270Aa1D732F86"
  },
  {
    "user": "Vimek Patel",
    "email": "patelvimek@gmail.com",
    "viabtcUserId": 605260,
    "coin": "INR",
    "walletAmount": 100223.08394056,
    "walletAddress": "undefined"
  },
  {
    "user": "Olugbenga Ojetunde",
    "email": "olusamzy@yahoo.com",
    "viabtcUserId": 605340,
    "coin": "BTC",
    "walletAmount": 0.00005,
    "walletAddress": "34zd84DktUNdAujofGs5GbT4P9HLPMDTBz"
  },
  {
    "user": "Olugbenga Ojetunde",
    "email": "olusamzy@yahoo.com",
    "viabtcUserId": 605340,
    "coin": "AED",
    "walletAmount": 133.63293757,
    "walletAddress": "undefined"
  },
  {
    "user": "Tari Khan",
    "email": "tareqjkhan@gmail.com",
    "viabtcUserId": 605380,
    "coin": "BTC",
    "walletAmount": 0.00012871,
    "walletAddress": "37WuF2brcaCQY7cEuoXj8axjZqy3ue5yy6"
  },
  {
    "user": "Vimek Patel",
    "email": "vimekpatelcoc@gmail.com",
    "viabtcUserId": 605390,
    "coin": "INR",
    "walletAmount": 1000,
    "walletAddress": "undefined"
  },
  {
    "user": "Vinay Gandhi",
    "email": "vinaygandhi97@gmail.com",
    "viabtcUserId": 602323,
    "coin": "USD",
    "walletAmount": 0.00924172,
    "walletAddress": "undefined"
  },
  {
    "user": "Christine  Again",
    "email": "tinpin4@gmail.com",
    "viabtcUserId": 605418,
    "coin": "LTC",
    "walletAmount": 0.00247194,
    "walletAddress": "M8rm266e3RQmJqBgMZt7VniJp3RToyC4cw"
  },
  {
    "user": "Christine  Again",
    "email": "tinpin4@gmail.com",
    "viabtcUserId": 605418,
    "coin": "XRP",
    "walletAmount": 0.000028,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Christine  Again",
    "email": "tinpin4@gmail.com",
    "viabtcUserId": 605418,
    "coin": "AED",
    "walletAmount": 4.50165233,
    "walletAddress": "undefined"
  },
  {
    "user": "nikul patel",
    "email": "nikul@bitex.com",
    "viabtcUserId": 605435,
    "coin": "INR",
    "walletAmount": 80045.84008547,
    "walletAddress": "undefined"
  },
  {
    "user": "bernardo llorente",
    "email": "bernardo.llorente@llorentehnos.com",
    "viabtcUserId": 605442,
    "coin": "BTC",
    "walletAmount": 0.06364581,
    "walletAddress": "3KehvL5voW6jR8qNw3nosawVyCJWVA7H1V"
  },
  {
    "user": "bernardo llorente",
    "email": "bernardo.llorente@llorentehnos.com",
    "viabtcUserId": 605442,
    "coin": "USD",
    "walletAmount": 3660.26,
    "walletAddress": "undefined"
  },
  {
    "user": "Rafi khan",
    "email": "mail2mdrafikhan@gmail.com",
    "viabtcUserId": 605493,
    "coin": "BTC",
    "walletAmount": 0.00001191,
    "walletAddress": "3GghiNnTZ2xHFTbk42qRvB3r4bMn33sdSZ"
  },
  {
    "user": "Rafi khan",
    "email": "mail2mdrafikhan@gmail.com",
    "viabtcUserId": 605493,
    "coin": "ETH",
    "walletAmount": 0.000051,
    "walletAddress": "0x6dAD3D224FAbb1cd313CC78a5DDBdA2E8AE06CFe"
  },
  {
    "user": "Rafi khan",
    "email": "mail2mdrafikhan@gmail.com",
    "viabtcUserId": 605493,
    "coin": "INR",
    "walletAmount": 5.72,
    "walletAddress": "undefined"
  },
  {
    "user": "William Coulter",
    "email": "williamkennethcoulter3@gmail.com",
    "viabtcUserId": 605561,
    "coin": "BTC",
    "walletAmount": 0.0001075,
    "walletAddress": "3NFEDgizxPGWuRd8ZPUmtDbhgKAC15Jg3q"
  },
  {
    "user": "Vinod  Patil",
    "email": "vinodpatil2074@gmail.com",
    "viabtcUserId": 602232,
    "coin": "USD",
    "walletAmount": 2.14,
    "walletAddress": "undefined"
  },
  {
    "user": "YUSUF KASOZI",
    "email": "yusufuksz@gmail.com",
    "viabtcUserId": 605592,
    "coin": "AED",
    "walletAmount": 0.51,
    "walletAddress": "undefined"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "BTC",
    "walletAmount": 0.00002975,
    "walletAddress": "37zgfvrfbxcF6YNBHMdD8XGYMfQYCw48rq"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "LTC",
    "walletAmount": 0.00008911,
    "walletAddress": "MUnmfCqnYxWec6J3nedX8TRcKEDSAm1wwU"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "ETH",
    "walletAmount": 0.00001142,
    "walletAddress": "0x28133820FaE4512102d58926FCBA03B8EC030a3a"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "XRP",
    "walletAmount": 0.67432596,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "BCH",
    "walletAmount": 0.00010704,
    "walletAddress": "3KUeZz2DNxk5j8Ue4YYtQcsU8QqBuadEnz"
  },
  {
    "user": "Mariana Ibañez",
    "email": "imariana@live.com.ar",
    "viabtcUserId": 605735,
    "coin": "BTC",
    "walletAmount": 0.00001481,
    "walletAddress": "38y93quMnEvLyN9hSbMDL1kCiMSAMDBvQt"
  },
  {
    "user": "-",
    "email": "-",
    "viabtcUserId": "-",
    "coin": "INR",
    "walletAmount": 9001,
    "walletAddress": "undefined"
  },
  {
    "user": "Ravi Sharma",
    "email": "raisehell00@gmail.com",
    "viabtcUserId": 605831,
    "coin": "BTC",
    "walletAmount": 0.0005,
    "walletAddress": "3KXLWJi9XywEK3NXD4b2jPCGJMCfEvTmLr"
  },
  {
    "user": "Ravi Sharma",
    "email": "raisehell00@gmail.com",
    "viabtcUserId": 605831,
    "coin": "LTC",
    "walletAmount": 0.13406184,
    "walletAddress": "MVBBPTNmMMyffUyjT7qkDEpPnoNdjLN7oN"
  },
  {
    "user": "Ravi Sharma",
    "email": "raisehell00@gmail.com",
    "viabtcUserId": 605831,
    "coin": "ETH",
    "walletAmount": 0.00031273,
    "walletAddress": "0x51B2a7D56d4a6f63edEC6030e2022270d3DDB406"
  },
  {
    "user": "Ravi Sharma",
    "email": "raisehell00@gmail.com",
    "viabtcUserId": 605831,
    "coin": "XRP",
    "walletAmount": 0.41,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Nayan Shah",
    "email": "nayanshah207@gmail.com",
    "viabtcUserId": 604752,
    "coin": "INR",
    "walletAmount": 551.53,
    "walletAddress": "undefined"
  },
  {
    "user": "Fathima  Kadamthodi",
    "email": "shamil70756@gmail.com",
    "viabtcUserId": 605993,
    "coin": "BTC",
    "walletAmount": 0.00006458,
    "walletAddress": "39QLCG55Y6RHksforToZe4rDQBRLugQnU3"
  },
  {
    "user": "Fathima  Kadamthodi",
    "email": "shamil70756@gmail.com",
    "viabtcUserId": 605993,
    "coin": "AED",
    "walletAmount": 0.79520776,
    "walletAddress": "undefined"
  },
  {
    "user": "Jemish bhatt",
    "email": "jemsbhatt@gmail.com",
    "viabtcUserId": 606026,
    "coin": "ETH",
    "walletAmount": 0.00009291,
    "walletAddress": "0x4B6fbb2C3aF0Bb94b7EfcBD5DCE1a84F0A414868"
  },
  {
    "user": "Monark Modi",
    "email": "nklptl49@gmail.com",
    "viabtcUserId": 606038,
    "coin": "BTC",
    "walletAmount": 0.00108,
    "walletAddress": "3Ay5t2LQUCC27cg9GBueMa6B39WWmf4HfF"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "LTC",
    "walletAmount": 0.71621591,
    "walletAddress": "MQyQxG9xaHY2z9ak3pLMYMi4rXgKYWyBhS"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "XRP",
    "walletAmount": 17.9104315,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "ETH",
    "walletAmount": 0.20898937,
    "walletAddress": "0x235a4613A17f44655f230b5A0D66817E9BCBC0e9"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "BTX",
    "walletAmount": 5051.36972018,
    "walletAddress": "0x27B6f07119E928f9B071A2a01a9AC0bC74749503"
  },
  {
    "user": "Monark Modi",
    "email": "nklptl49@gmail.com",
    "viabtcUserId": 606038,
    "coin": "INR",
    "walletAmount": 89.34098468,
    "walletAddress": "undefined"
  },
  {
    "user": "PRAMODRAO SHINDE",
    "email": "pksmee@yahoo.co.in",
    "viabtcUserId": 606041,
    "coin": "INR",
    "walletAmount": 2000,
    "walletAddress": "undefined"
  },
  {
    "user": "Humesh Sahu",
    "email": "humeshsahu3110@gmail.com",
    "viabtcUserId": 606043,
    "coin": "INR",
    "walletAmount": 2000,
    "walletAddress": "undefined"
  },
  {
    "user": "Gabriel Olorunsola",
    "email": "olorunsola33@gmail.com",
    "viabtcUserId": 606049,
    "coin": "AED",
    "walletAmount": 100,
    "walletAddress": "undefined"
  },
  {
    "user": "Jijit mohanan",
    "email": "jijitmohanan@gmail.com",
    "viabtcUserId": 606048,
    "coin": "AED",
    "walletAmount": 100,
    "walletAddress": "undefined"
  },
  {
    "user": "Sunday  Opayooye",
    "email": "opayooyesunday11@gmail.com",
    "viabtcUserId": 606051,
    "coin": "AED",
    "walletAmount": 100,
    "walletAddress": "undefined"
  },
  {
    "user": "Shivam  Anand",
    "email": "shivamanand7@gmail.com",
    "viabtcUserId": 606052,
    "coin": "INR",
    "walletAmount": 1997.49,
    "walletAddress": "undefined"
  },
  {
    "user": "Nimita Sanadhya",
    "email": "nimita94@gmail.com",
    "viabtcUserId": 606056,
    "coin": "BTC",
    "walletAmount": 0.00782879,
    "walletAddress": "3Mw6g5DPMeXTwdALTr3Nw4gPnuYj392igy"
  },
  {
    "user": "Nimita Sanadhya",
    "email": "nimita94@gmail.com",
    "viabtcUserId": 606056,
    "coin": "LTC",
    "walletAmount": 0.00003672,
    "walletAddress": "MDhsHEFyVENtdnA3ddn9FnxUBz6w7pfGb7"
  },
  {
    "user": "Nimita Sanadhya",
    "email": "nimita94@gmail.com",
    "viabtcUserId": 606056,
    "coin": "ETH",
    "walletAmount": 0.00727629,
    "walletAddress": "0x5F1fB37Aa6D4d551BF235533d9dDf5E30d0C8A44"
  },
  {
    "user": "Nimita Sanadhya",
    "email": "nimita94@gmail.com",
    "viabtcUserId": 606056,
    "coin": "INR",
    "walletAmount": 1.70722596,
    "walletAddress": "undefined"
  },
  {
    "user": "Hassan Hammed",
    "email": "hassanhammedccna@gmail.com",
    "viabtcUserId": 606058,
    "coin": "AED",
    "walletAmount": 100,
    "walletAddress": "undefined"
  },
  {
    "user": "Shahid  Zaman",
    "email": "shahidzaman83@gmail.com",
    "viabtcUserId": 606060,
    "coin": "AED",
    "walletAmount": 100,
    "walletAddress": "undefined"
  },
  {
    "user": "Ariel Dominguez",
    "email": "arieldominguezmp@gmail.com",
    "viabtcUserId": 606062,
    "coin": "AED",
    "walletAmount": 100,
    "walletAddress": "undefined"
  },
  {
    "user": "Mit Shah",
    "email": "shahmit5314@yahoo.com",
    "viabtcUserId": 606063,
    "coin": "INR",
    "walletAmount": 2000,
    "walletAddress": "undefined"
  },
  {
    "user": "Chris john  Besinal",
    "email": "zerofour0433@gmail.com",
    "viabtcUserId": 606065,
    "coin": "XRP",
    "walletAmount": 0.00448107,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Chris john  Besinal",
    "email": "zerofour0433@gmail.com",
    "viabtcUserId": 606065,
    "coin": "AED",
    "walletAmount": 0.02,
    "walletAddress": "undefined"
  },
  {
    "user": "Ceejhay Laktos",
    "email": "kowatel280@ailiking.com",
    "viabtcUserId": 606066,
    "coin": "XRP",
    "walletAmount": 0.72626068,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Ceejhay Laktos",
    "email": "kowatel280@ailiking.com",
    "viabtcUserId": 606066,
    "coin": "BCH",
    "walletAmount": 0.00045836,
    "walletAddress": "3CE77jYnzwtiLmfVJmHqe6pEeX5xXZCqy4"
  },
  {
    "user": "Ceejhay Laktos",
    "email": "kowatel280@ailiking.com",
    "viabtcUserId": 606066,
    "coin": "AED",
    "walletAmount": 0.09261759,
    "walletAddress": "undefined"
  },
  {
    "user": "Joseph Aloja",
    "email": "pejiw76963@aranelab.com",
    "viabtcUserId": 606067,
    "coin": "LTC",
    "walletAmount": 0.00440507,
    "walletAddress": "MNSfnFKqzKi71zXsG9PQuUgbnadnVrJjmY"
  },
  {
    "user": "Joseph Aloja",
    "email": "pejiw76963@aranelab.com",
    "viabtcUserId": 606067,
    "coin": "AED",
    "walletAmount": 1.00000169,
    "walletAddress": "undefined"
  },
  {
    "user": "Lance Yuma",
    "email": "divepob814@j24blog.com",
    "viabtcUserId": 606068,
    "coin": "LTC",
    "walletAmount": 0.00034332,
    "walletAddress": "MWETJe8VPjn57m8cPEvV3c4pt7zR4YQxiS"
  },
  {
    "user": "Lance Yuma",
    "email": "divepob814@j24blog.com",
    "viabtcUserId": 606068,
    "coin": "AED",
    "walletAmount": 0.00000335,
    "walletAddress": "undefined"
  },
  {
    "user": "Akihiko Kirito",
    "email": "pocaril943@ailiking.com",
    "viabtcUserId": 606069,
    "coin": "ETH",
    "walletAmount": 0.00025635,
    "walletAddress": "0xB7255CF462243F3068bB5bf377483BC1D9FE1D79"
  },
  {
    "user": "Akihiko Kirito",
    "email": "pocaril943@ailiking.com",
    "viabtcUserId": 606069,
    "coin": "AED",
    "walletAmount": 1.00000998,
    "walletAddress": "undefined"
  },
  {
    "user": "Jiji Galbi",
    "email": "hemiga7913@j24blog.com",
    "viabtcUserId": 606070,
    "coin": "ETH",
    "walletAmount": 0.00021805,
    "walletAddress": "0x5eBCce0338bb0Dd98A3A201434D91391e018eCD6"
  },
  {
    "user": "Jiji Galbi",
    "email": "hemiga7913@j24blog.com",
    "viabtcUserId": 606070,
    "coin": "AED",
    "walletAmount": 1.00000118,
    "walletAddress": "undefined"
  },
  {
    "user": "Hunger  Gill",
    "email": "xiwegi6847@j24blog.com",
    "viabtcUserId": 606071,
    "coin": "ETH",
    "walletAmount": 0.00025217,
    "walletAddress": "0xf12bcCf6574337aB3B16C280a2c5E379eBf8Eb76"
  },
  {
    "user": "Hunger  Gill",
    "email": "xiwegi6847@j24blog.com",
    "viabtcUserId": 606071,
    "coin": "AED",
    "walletAmount": 1.00000853,
    "walletAddress": "undefined"
  },
  {
    "user": "Crust Logan",
    "email": "comogab391@ailiking.com",
    "viabtcUserId": 606072,
    "coin": "ETH",
    "walletAmount": 0.00021702,
    "walletAddress": "0xc2f3B33371af2695a7084F1de79ccac709dde6FB"
  },
  {
    "user": "Crust Logan",
    "email": "comogab391@ailiking.com",
    "viabtcUserId": 606072,
    "coin": "AED",
    "walletAmount": 1.0000225,
    "walletAddress": "undefined"
  },
  {
    "user": "Ceejhay Albanes",
    "email": "lanocos464@chatdays.com",
    "viabtcUserId": 606073,
    "coin": "ETH",
    "walletAmount": 0.00020676,
    "walletAddress": "0xdf3593bdcFc256c101ceB47c2bfb06d2249Ae1Ed"
  },
  {
    "user": "Ceejhay Albanes",
    "email": "lanocos464@chatdays.com",
    "viabtcUserId": 606073,
    "coin": "AED",
    "walletAmount": 1.00001736,
    "walletAddress": "undefined"
  },
  {
    "user": "Yuji Aki",
    "email": "wapopo2268@j24blog.com",
    "viabtcUserId": 606074,
    "coin": "ETH",
    "walletAmount": 0.00019439,
    "walletAddress": "0x3a1464394b6Df8d5d9F9Be559235AAD71B7ce472"
  },
  {
    "user": "Yuji Aki",
    "email": "wapopo2268@j24blog.com",
    "viabtcUserId": 606074,
    "coin": "AED",
    "walletAmount": 1.00001442,
    "walletAddress": "undefined"
  },
  {
    "user": "Doggie Sins",
    "email": "xegexo5156@ailiking.com",
    "viabtcUserId": 606076,
    "coin": "ETH",
    "walletAmount": 0.00090235,
    "walletAddress": "0x90aFd2C903D873488497921364EAc1FbAafaE82f"
  },
  {
    "user": "Doggie Sins",
    "email": "xegexo5156@ailiking.com",
    "viabtcUserId": 606076,
    "coin": "AED",
    "walletAmount": 1.00001311,
    "walletAddress": "undefined"
  },
  {
    "user": "Cris  Bernal",
    "email": "feviwa3426@ailiking.com",
    "viabtcUserId": 606077,
    "coin": "ETH",
    "walletAmount": 0.00085029,
    "walletAddress": "0xBEb7181d761eEaAD42411Eeeb6FCa2835e21De38"
  },
  {
    "user": "Cris  Bernal",
    "email": "feviwa3426@ailiking.com",
    "viabtcUserId": 606077,
    "coin": "AED",
    "walletAmount": 1.00001816,
    "walletAddress": "undefined"
  },
  {
    "user": "Jester Humper",
    "email": "riniwa2628@j24blog.com",
    "viabtcUserId": 606078,
    "coin": "ETH",
    "walletAmount": 0.00014838,
    "walletAddress": "0x747bDe111E882f3A7D85Bf88676B89aB00C547A3"
  },
  {
    "user": "Jester Humper",
    "email": "riniwa2628@j24blog.com",
    "viabtcUserId": 606078,
    "coin": "AED",
    "walletAmount": 0.20000343,
    "walletAddress": "undefined"
  },
  {
    "user": "Gila Mesh",
    "email": "bitipe5494@ailiking.com",
    "viabtcUserId": 606080,
    "coin": "ETH",
    "walletAmount": 0.00014776,
    "walletAddress": "0x444Ec855e8FBFEEd81aa2Ac84D78d8d831727d38"
  },
  {
    "user": "Gila Mesh",
    "email": "bitipe5494@ailiking.com",
    "viabtcUserId": 606080,
    "coin": "AED",
    "walletAmount": 0.20000207,
    "walletAddress": "undefined"
  },
  {
    "user": "Ikki Kuru",
    "email": "deyofaw467@aranelab.com",
    "viabtcUserId": 606081,
    "coin": "ETH",
    "walletAmount": 0.00012439,
    "walletAddress": "0x4C827424D7cE576D4db7177Ae8ba6B60C5eD31d6"
  },
  {
    "user": "Ikki Kuru",
    "email": "deyofaw467@aranelab.com",
    "viabtcUserId": 606081,
    "coin": "AED",
    "walletAmount": 1.00000502,
    "walletAddress": "undefined"
  },
  {
    "user": "Mazibar  Rahman",
    "email": "mazibarr99@gmail.com",
    "viabtcUserId": 606083,
    "coin": "INR",
    "walletAmount": 2000,
    "walletAddress": "undefined"
  },
  {
    "user": "Hiroto Kono",
    "email": "kohno_hiroto@yahoo.co.jp",
    "viabtcUserId": 606102,
    "coin": "LTC",
    "walletAmount": 0.049,
    "walletAddress": "M8BwyRTpvn8gAmTXkKAymBf63QHMuqhS7F"
  },
  {
    "user": "Divyanka Aher",
    "email": "divyankaaher@gmail.com",
    "viabtcUserId": 606132,
    "coin": "XRP",
    "walletAmount": 0.95341278,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Divyanka Aher",
    "email": "divyankaaher@gmail.com",
    "viabtcUserId": 606132,
    "coin": "INR",
    "walletAmount": 7.47999999,
    "walletAddress": "undefined"
  },
  {
    "user": "Tusar Makwana",
    "email": "bittm2021@gmail.com",
    "viabtcUserId": 606167,
    "coin": "LTC",
    "walletAmount": 0.0038799,
    "walletAddress": "MAMPuieaxGCgbD4vrhshEx8zUT8Rn6YQec"
  },
  {
    "user": "Tusar Makwana",
    "email": "bittm2021@gmail.com",
    "viabtcUserId": 606167,
    "coin": "ETH",
    "walletAmount": 0.00187925,
    "walletAddress": "0x7901Cee06235E020cA3fc99B4FAd72Ebf0D561AC"
  },
  {
    "user": "Tusar Makwana",
    "email": "bittm2021@gmail.com",
    "viabtcUserId": 606167,
    "coin": "INR",
    "walletAmount": 45379.00023278,
    "walletAddress": "undefined"
  },
  {
    "user": "Hiroto Kono",
    "email": "byopezoge@moimoi.re",
    "viabtcUserId": 606235,
    "coin": "INR",
    "walletAmount": 1019.93,
    "walletAddress": "undefined"
  },
  {
    "user": "Manu Jacob",
    "email": "manujac1976@gmail.com",
    "viabtcUserId": 606255,
    "coin": "BTC",
    "walletAmount": 0.00007172,
    "walletAddress": "3LscBnfBdYv46ndbuVGBFg9yRoYfCEnMxd"
  },
  {
    "user": "Ahmed Bakr",
    "email": "ahmedbakr.egy@gmail.com",
    "viabtcUserId": 606271,
    "coin": "XRP",
    "walletAmount": 4.9249042,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Ahmed Bakr",
    "email": "ahmedbakr.egy@gmail.com",
    "viabtcUserId": 606271,
    "coin": "AED",
    "walletAmount": 0.05,
    "walletAddress": "undefined"
  },
  {
    "user": "Marino Brace",
    "email": "bracemarino@gmail.com",
    "viabtcUserId": 606288,
    "coin": "BTC",
    "walletAmount": 0.0014468,
    "walletAddress": "3MXLG9derfoh2qV7rsVZHbMuUZvy4arDYx"
  },
  {
    "user": "Marino Brace",
    "email": "bracemarino@gmail.com",
    "viabtcUserId": 606288,
    "coin": "AED",
    "walletAmount": 7.94,
    "walletAddress": "undefined"
  },
  {
    "user": "Preity Choudhary",
    "email": "preity279@gmail.com",
    "viabtcUserId": 606401,
    "coin": "ETH",
    "walletAmount": 0.02090113,
    "walletAddress": "0x263c0f696aAD1F5cbdB7Fd6398d70DC27DC19c54"
  },
  {
    "user": "Preity Choudhary",
    "email": "preity279@gmail.com",
    "viabtcUserId": 606401,
    "coin": "INR",
    "walletAmount": 4.889079370001127,
    "walletAddress": "undefined"
  },
  {
    "user": "Rohit Boraniya",
    "email": "rirobo@icloud.com",
    "viabtcUserId": 606456,
    "coin": "INR",
    "walletAmount": 0.21,
    "walletAddress": "undefined"
  },
  {
    "user": "Rohit Boraniya",
    "email": "rirobo@icloud.com",
    "viabtcUserId": 606456,
    "coin": "BTC",
    "walletAmount": 0.00004706,
    "walletAddress": "3QW2unyEyU6YhYbBusmUkZsNuxH9VMA9LZ"
  },
  {
    "user": "Clark Ryland",
    "email": "healthmalback@gmail.com",
    "viabtcUserId": 606459,
    "coin": "XRP",
    "walletAmount": 49.8,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Yash Sharma",
    "email": "yash011@hotmail.com",
    "viabtcUserId": 606510,
    "coin": "LTC",
    "walletAmount": 0.00077561,
    "walletAddress": "MSCKj55SRD7GvUY4HTdYRdGBU3vLNG1owX"
  },
  {
    "user": "Yash Sharma",
    "email": "yash011@hotmail.com",
    "viabtcUserId": 606510,
    "coin": "BCH",
    "walletAmount": 2,
    "walletAddress": "3CepSrpchyuorGUqwQSB9xVWjhTmGmYVnH"
  },
  {
    "user": "Ravi Sharma`",
    "email": "rko_prime@hotmail.com",
    "viabtcUserId": 606756,
    "coin": "BTC",
    "walletAmount": 0.00009886,
    "walletAddress": "34SC8D4ifYKKXXniyZvvbokBPCKfHjEf4U"
  },
  {
    "user": "Ravi Sharma`",
    "email": "rko_prime@hotmail.com",
    "viabtcUserId": 606756,
    "coin": "LTC",
    "walletAmount": 0.00564645,
    "walletAddress": "MVgAT5EgAC4Bh1RPjP1wXzi6ax4s1R9R7L"
  },
  {
    "user": "Ravi Sharma`",
    "email": "rko_prime@hotmail.com",
    "viabtcUserId": 606756,
    "coin": "ETH",
    "walletAmount": 0.00001809,
    "walletAddress": "0xdEffEB9712ea5C5A7be8382cB2F727d48931Ed4c"
  },
  {
    "user": "Ravi Sharma`",
    "email": "rko_prime@hotmail.com",
    "viabtcUserId": 606756,
    "coin": "INR",
    "walletAmount": 3.81,
    "walletAddress": "undefined"
  },
  {
    "user": "Novamall Tuki",
    "email": "hineh29799@dashseat.com",
    "viabtcUserId": 606837,
    "coin": "XRP",
    "walletAmount": 0.016,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Ronny Muller",
    "email": "ronny81979@hotmail.com",
    "viabtcUserId": 606843,
    "coin": "BTC",
    "walletAmount": 0.00020808,
    "walletAddress": "32XsPt5Vt2Ep9CdVSgnA95hytdtMEiqpy1"
  },
  {
    "user": "Gustavo Retamar",
    "email": "gustavoarielretamar@gmail.com",
    "viabtcUserId": 606854,
    "coin": "ETH",
    "walletAmount": 0.0002,
    "walletAddress": "0xd7F9888d51f1e951EF70715B832091c88E7CF538"
  },
  {
    "user": "Shane Clark",
    "email": "shaneandliv@gmail.com",
    "viabtcUserId": 606808,
    "coin": "AED",
    "walletAmount": 0.8199999999999363,
    "walletAddress": "undefined"
  },
  {
    "user": "stat craf",
    "email": "statecraft1@protonmail.com",
    "viabtcUserId": 606909,
    "coin": "BTC",
    "walletAmount": 0.00023126,
    "walletAddress": "32xg6JMz7X1zSbZYcxS8r2P6MckcEKghCs"
  },
  {
    "user": "stat craf",
    "email": "statecraft1@protonmail.com",
    "viabtcUserId": 606909,
    "coin": "LTC",
    "walletAmount": 0.00936172,
    "walletAddress": "MDGRAF2NW5awxmxb9GEDpogAsWM9PtGmyF"
  },
  {
    "user": "stat craf",
    "email": "statecraft1@protonmail.com",
    "viabtcUserId": 606909,
    "coin": "ETH",
    "walletAmount": 0.09675978,
    "walletAddress": "0x3fF396efD67893F6f23334993A4141DB45D2a409"
  },
  {
    "user": "stat craf",
    "email": "statecraft1@protonmail.com",
    "viabtcUserId": 606909,
    "coin": "XRP",
    "walletAmount": 55.16877413,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "stat craf",
    "email": "statecraft1@protonmail.com",
    "viabtcUserId": 606909,
    "coin": "BCH",
    "walletAmount": 0.00000637,
    "walletAddress": "34kxhhmcGAXTg7PKYiBu8wVh9vMhQGcMYs"
  },
  {
    "user": "stat craf",
    "email": "statecraft1@protonmail.com",
    "viabtcUserId": 606909,
    "coin": "USD",
    "walletAmount": 469.81,
    "walletAddress": "undefined"
  },
  {
    "user": "Farhad Pothukattil",
    "email": "farhadpmna@gmail.com",
    "viabtcUserId": 606979,
    "coin": "LTC",
    "walletAmount": 0.00735951,
    "walletAddress": "ME8RnGyemS7PcjveMBS8hJLmiPXnN5kbHk"
  },
  {
    "user": "Abraar  Saheb",
    "email": "abraarfsaheb@yahoo.com",
    "viabtcUserId": 606981,
    "coin": "AED",
    "walletAmount": 169.28,
    "walletAddress": "undefined"
  },
  {
    "user": "JALAL ALRAEE",
    "email": "j_raee@hotmail.com",
    "viabtcUserId": 607026,
    "coin": "XRP",
    "walletAmount": 2.64838742,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "JALAL ALRAEE",
    "email": "j_raee@hotmail.com",
    "viabtcUserId": 607026,
    "coin": "AED",
    "walletAmount": 0.08,
    "walletAddress": "undefined"
  },
  {
    "user": "ARAJANBHAI KANGAD",
    "email": "kangad.1969@gmail.com",
    "viabtcUserId": 607025,
    "coin": "ETH",
    "walletAmount": 0.12216085,
    "walletAddress": "0x274d70257Fd0183f6B81492cD921DF43F363c0E7"
  },
  {
    "user": "Palle Prajunnareddy",
    "email": "palleprajunnareddy@gmail.com",
    "viabtcUserId": 607041,
    "coin": "LTC",
    "walletAmount": 20.89,
    "walletAddress": "M9UhEmEHa3DHUxpD1CPzAXSMXTJeWbdwLy"
  },
  {
    "user": "stat craf",
    "email": "s.tatecraft1@protonmail.com",
    "viabtcUserId": 607064,
    "coin": "ETH",
    "walletAmount": 0.0001,
    "walletAddress": "0xA58cC811CEE41C46DD940C6F325ecef28588a113"
  },
  {
    "user": "Muhammad Raza",
    "email": "zeyrafc@gmail.com",
    "viabtcUserId": 607103,
    "coin": "ETH",
    "walletAmount": 0.00016636,
    "walletAddress": "0x04d2F531Db3E8159dc105ADa722076DC2BeBCCf5"
  },
  {
    "user": "Muhammad Raza",
    "email": "zeyrafc@gmail.com",
    "viabtcUserId": 607103,
    "coin": "AED",
    "walletAmount": 1.1399999999999864,
    "walletAddress": "undefined"
  },
  {
    "user": "Amank Rawat",
    "email": "kannusingh278@gmail.com",
    "viabtcUserId": 607114,
    "coin": "BTC",
    "walletAmount": 0.00000564,
    "walletAddress": "3NELZPVM5aRNjDuRsShE2PwXMgWDoevUKm"
  },
  {
    "user": "Amank Rawat",
    "email": "kannusingh278@gmail.com",
    "viabtcUserId": 607114,
    "coin": "ETH",
    "walletAmount": 0.00004054,
    "walletAddress": "0xD20b036e4CE3EC684cbf2E795CA8AC865F5c498D"
  },
  {
    "user": "Amank Rawat",
    "email": "kannusingh278@gmail.com",
    "viabtcUserId": 607114,
    "coin": "AED",
    "walletAmount": 6.060000000000002,
    "walletAddress": "undefined"
  },
  {
    "user": "Mohammed Nawaz",
    "email": "reachmnawaz@yahoo.com",
    "viabtcUserId": 607175,
    "coin": "XRP",
    "walletAmount": 0.64309004,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Mohammed Nawaz",
    "email": "reachmnawaz@yahoo.com",
    "viabtcUserId": 607175,
    "coin": "AED",
    "walletAmount": 8.36,
    "walletAddress": "undefined"
  },
  {
    "user": "Allen DG",
    "email": "allendeguzmanpacheng@gmail.com",
    "viabtcUserId": 607212,
    "coin": "AED",
    "walletAmount": 1.06,
    "walletAddress": "undefined"
  },
  {
    "user": "Sarie Khalid",
    "email": "sariemkhalid@gmail.com",
    "viabtcUserId": 607233,
    "coin": "BTC",
    "walletAmount": 0.0000054,
    "walletAddress": "3LfnuE787mDxW7C4cs3HNpjpee8jhLk2bu"
  },
  {
    "user": "Nawwaf Husain",
    "email": "nnawwafhusain@gmail.com",
    "viabtcUserId": 607262,
    "coin": "BTC",
    "walletAmount": 0.00014091,
    "walletAddress": "357qfDdRXRGGt9sGsPvR3A5FpMb23yfZ7T"
  },
  {
    "user": "Nawwaf Husain",
    "email": "nnawwafhusain@gmail.com",
    "viabtcUserId": 607262,
    "coin": "AED",
    "walletAmount": 4.66,
    "walletAddress": "undefined"
  },
  {
    "user": "Ahmed Abdelmahmoud  Abusara",
    "email": "a_elsanosi@hotmail.com",
    "viabtcUserId": 607278,
    "coin": "BTC",
    "walletAmount": 1e-7,
    "walletAddress": "33tjdgXydspPmwGp2Za9F5BRcTFeBgLrpU"
  },
  {
    "user": "Radhika Joshi",
    "email": "radhikajoshi.rj@gmail.com",
    "viabtcUserId": 607283,
    "coin": "BTX",
    "walletAmount": 0.00000716,
    "walletAddress": "0x89E85E0809b5aD901A2dbd36B53334282e774B6A"
  },
  {
    "user": "Radhika Joshi",
    "email": "radhikajoshi.rj@gmail.com",
    "viabtcUserId": 607283,
    "coin": "INR",
    "walletAmount": 0.9812041400000453,
    "walletAddress": "undefined"
  },
  {
    "user": "pradip  patel",
    "email": "pradippatel7123@gmail.com",
    "viabtcUserId": 606136,
    "coin": "BCH",
    "walletAmount": 0.00005451,
    "walletAddress": "31oGMeYZWSeL98gGutiLeR44dNNb5ZRd1v"
  },
  {
    "user": "pradip  patel",
    "email": "pradippatel7123@gmail.com",
    "viabtcUserId": 606136,
    "coin": "INR",
    "walletAmount": 2317.24,
    "walletAddress": "undefined"
  },
  {
    "user": "nikul patel",
    "email": "nikul.a.patel49@gmail.com",
    "viabtcUserId": 607312,
    "coin": "AED",
    "walletAmount": 498.91,
    "walletAddress": "undefined"
  },
  {
    "user": "arvind vaghari",
    "email": "yonokia40@gmail.com",
    "viabtcUserId": 607315,
    "coin": "INR",
    "walletAmount": 82.59999999997672,
    "walletAddress": "undefined"
  },
  {
    "user": "Vinay Gandhi",
    "email": "vinaygandhi18@gmail.com",
    "viabtcUserId": 607329,
    "coin": "XRP",
    "walletAmount": 1.09975026,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Vinay Gandhi",
    "email": "vinaygandhi18@gmail.com",
    "viabtcUserId": 607329,
    "coin": "AED",
    "walletAmount": 0.76,
    "walletAddress": "undefined"
  },
  {
    "user": "Mohammad Faizan Shaikh",
    "email": "mfaizans2002@gmail.com",
    "viabtcUserId": 607340,
    "coin": "AED",
    "walletAmount": 0.01,
    "walletAddress": "undefined"
  },
  {
    "user": "Sergei Shutko",
    "email": "michaellogan2115@gmail.com",
    "viabtcUserId": 607401,
    "coin": "XRP",
    "walletAmount": 0.6,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Kalpit Thakkar",
    "email": "tkthakkar9@gmail.com",
    "viabtcUserId": 607584,
    "coin": "LTC",
    "walletAmount": 132.36637346,
    "walletAddress": "MSVwHvWX2FWsvSr7AyrUPJ6MKy4EBBD1df"
  },
  {
    "user": "Kalpit Thakkar",
    "email": "tkthakkar9@gmail.com",
    "viabtcUserId": 607584,
    "coin": "ETH",
    "walletAmount": 90.11100931,
    "walletAddress": "0xD781f3E5b81e78e144d2f2aB557957360Eaf0d6A"
  },
  {
    "user": "Kalpit Thakkar",
    "email": "tkthakkar9@gmail.com",
    "viabtcUserId": 607584,
    "coin": "XRP",
    "walletAmount": 62990.67002283,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Kalpit Thakkar",
    "email": "tkthakkar9@gmail.com",
    "viabtcUserId": 607584,
    "coin": "INR",
    "walletAmount": 22.62,
    "walletAddress": "undefined"
  },
  {
    "user": "peter parker",
    "email": "parkerparker0650@gmail.com",
    "viabtcUserId": 607615,
    "coin": "LTC",
    "walletAmount": 6.74871783,
    "walletAddress": "MRqHThL6ykyUvdfDEt7sMJm2W3z4LVAV5b"
  },
  {
    "user": "peter parker",
    "email": "parkerparker0650@gmail.com",
    "viabtcUserId": 607615,
    "coin": "ETH",
    "walletAmount": 0.73843726,
    "walletAddress": "0xC28244d1C8678da19Eebf6Fe474f1085B9374F8a"
  },
  {
    "user": "peter parker",
    "email": "parkerparker0650@gmail.com",
    "viabtcUserId": 607615,
    "coin": "XRP",
    "walletAmount": 2807.68248542,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "peter parker",
    "email": "parkerparker0650@gmail.com",
    "viabtcUserId": 607615,
    "coin": "INR",
    "walletAmount": 25.5,
    "walletAddress": "undefined"
  },
  {
    "user": "Ratheesh Radhakrishnan",
    "email": "ratheshradha@gmail.com",
    "viabtcUserId": 607619,
    "coin": "ETH",
    "walletAmount": 3.5e-7,
    "walletAddress": "0xf1a325F08982343014a2419d5E6ad62e6E64094E"
  },
  {
    "user": "Ratheesh Radhakrishnan",
    "email": "ratheshradha@gmail.com",
    "viabtcUserId": 607619,
    "coin": "AED",
    "walletAmount": 0.5099999999999909,
    "walletAddress": "undefined"
  },
  {
    "user": "Taqdees Iram",
    "email": "taqdeesiram@gmail.com",
    "viabtcUserId": 607622,
    "coin": "BTC",
    "walletAmount": 0.00017737,
    "walletAddress": "3GYqNw2N3UxTtdkToXrsBB7bGmZ3r74qp9"
  },
  {
    "user": "Taqdees Iram",
    "email": "taqdeesiram@gmail.com",
    "viabtcUserId": 607622,
    "coin": "AED",
    "walletAmount": 198.19,
    "walletAddress": "undefined"
  },
  {
    "user": "Pankaj Tripathi",
    "email": "pankaj_tr@yahoo.com",
    "viabtcUserId": 607616,
    "coin": "BTX",
    "walletAmount": 15,
    "walletAddress": "0x130A06913374212c7a59652b7c0EB2685C9fe4d0"
  },
  {
    "user": "Samuel Akuoko",
    "email": "akuoko.samuel.79@gmail.com",
    "viabtcUserId": 607669,
    "coin": "BTC",
    "walletAmount": 6e-8,
    "walletAddress": "3Azxvntq1jbQ81gv3NuMpNpWYWFneKZLFW"
  },
  {
    "user": "Samuel Akuoko",
    "email": "akuoko.samuel.79@gmail.com",
    "viabtcUserId": 607669,
    "coin": "XRP",
    "walletAmount": 0.0000449,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Samuel Akuoko",
    "email": "akuoko.samuel.79@gmail.com",
    "viabtcUserId": 607669,
    "coin": "AED",
    "walletAmount": 1.06,
    "walletAddress": "undefined"
  },
  {
    "user": "FERNANDO LOZANO PRIETO",
    "email": "ferlopri@gmail.com",
    "viabtcUserId": 607720,
    "coin": "BTC",
    "walletAmount": 0.000133,
    "walletAddress": "3KTCmT3eXkwm8Xt2kfZRAjnAUHd8MqttHv"
  },
  {
    "user": "Jigar Trivedi",
    "email": "trivedijig@gmail.com",
    "viabtcUserId": 607779,
    "coin": "LTC",
    "walletAmount": 0.00804077,
    "walletAddress": "MXBM79UmJbyHX2Cvq7nZ4U8STb5zDMfVNe"
  },
  {
    "user": "Jigar Trivedi",
    "email": "trivedijig@gmail.com",
    "viabtcUserId": 607779,
    "coin": "XRP",
    "walletAmount": 500.36388671,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Jigar Trivedi",
    "email": "trivedijig@gmail.com",
    "viabtcUserId": 607779,
    "coin": "INR",
    "walletAmount": 446164.77529392,
    "walletAddress": "undefined"
  },
  {
    "user": "Nicolas Toro",
    "email": "nikolove63@gmail.com",
    "viabtcUserId": 607800,
    "coin": "USDT",
    "walletAmount": 70.64,
    "walletAddress": "0x26915fE36Cd4f04d267fC328147AAB6a70548cB0"
  },
  {
    "user": "Kamran Iftikhar",
    "email": "kamranki@gmail.com",
    "viabtcUserId": 607827,
    "coin": "BTC",
    "walletAmount": 0.00139841,
    "walletAddress": "3JY4j4nMUNJSxAjfdgDAXpawwT9hoAJdJK"
  },
  {
    "user": "Kamran Iftikhar",
    "email": "kamranki@gmail.com",
    "viabtcUserId": 607827,
    "coin": "AED",
    "walletAmount": 0.58,
    "walletAddress": "undefined"
  },
  {
    "user": "Subhash Tosawar",
    "email": "subhashtosawar@gmail.com",
    "viabtcUserId": 606029,
    "coin": "USDT",
    "walletAmount": 5.10436007,
    "walletAddress": "0x36B1bCfa4aAe0c3DE08DCE0BD7ef46D8a7259fc6"
  },
  {
    "user": "Jorge Etcubañas",
    "email": "jorgeetcubanas@gmail.com",
    "viabtcUserId": 607883,
    "coin": "BTC",
    "walletAmount": 0.00025,
    "walletAddress": "3Lnhzhsa3kHrttAW9cZYoKkyhHRWn2Ngjg"
  },
  {
    "user": "Annette Reyes",
    "email": "pua.annette@gmail.com",
    "viabtcUserId": 607887,
    "coin": "BTC",
    "walletAmount": 0.00031519,
    "walletAddress": "38oMfURGtFgGZydhEmqbz9366rYew1RkAS"
  },
  {
    "user": "Ansh Sanadhya",
    "email": "anshvinayaksanadhya@gmail.com",
    "viabtcUserId": 608001,
    "coin": "XRP",
    "walletAmount": 0.00165781,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Ansh Sanadhya",
    "email": "anshvinayaksanadhya@gmail.com",
    "viabtcUserId": 608001,
    "coin": "BCH",
    "walletAmount": 0.00297898,
    "walletAddress": "3JHsPGs9Dajr5RY2hTryXjeqH9LLs3XbYY"
  },
  {
    "user": "Ansh Sanadhya",
    "email": "anshvinayaksanadhya@gmail.com",
    "viabtcUserId": 608001,
    "coin": "INR",
    "walletAmount": 98.2,
    "walletAddress": "undefined"
  },
  {
    "user": "Owiss Refaat",
    "email": "it@sfm.com",
    "viabtcUserId": 608051,
    "coin": "BTC",
    "walletAmount": 0.00008733,
    "walletAddress": "3Kutm66GGQci8jope43FKZdTkXLEHfX615"
  },
  {
    "user": "Owiss Refaat",
    "email": "it@sfm.com",
    "viabtcUserId": 608051,
    "coin": "AED",
    "walletAmount": 3.5,
    "walletAddress": "undefined"
  },
  {
    "user": "Dimuthu  Nilushanka",
    "email": "dimubiz@gmail.com",
    "viabtcUserId": 608113,
    "coin": "AED",
    "walletAmount": 63.93,
    "walletAddress": "undefined"
  },
  {
    "user": "Mohamed Al nuaimi",
    "email": "mohammmed1998@gmail.com",
    "viabtcUserId": 608120,
    "coin": "XRP",
    "walletAmount": 0.323104,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Ajit Sawant",
    "email": "ajsawant@gmail.com",
    "viabtcUserId": 608122,
    "coin": "ETH",
    "walletAmount": 0.001,
    "walletAddress": "0x8F8EC7eF333fC535A58eab3F89feA03B3604B7aa"
  },
  {
    "user": "Ajit Sawant",
    "email": "ajsawant@gmail.com",
    "viabtcUserId": 608122,
    "coin": "INR",
    "walletAmount": 0.04,
    "walletAddress": "undefined"
  },
  {
    "user": "Mohammed Abbas",
    "email": "mamirabbas1212@gmail.com",
    "viabtcUserId": 608190,
    "coin": "XRP",
    "walletAmount": 0.01773,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Skyla Davis",
    "email": "barkerbarrie90@gmail.com",
    "viabtcUserId": 608270,
    "coin": "XRP",
    "walletAmount": 39.8,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Lisa Morton",
    "email": "michaelblack9505@gmail.com",
    "viabtcUserId": 608271,
    "coin": "BTC",
    "walletAmount": 0.00036833,
    "walletAddress": "36nECtvHukhbxrRkmtYgj27TLi2JzXyAYB"
  },
  {
    "user": "Lisa Morton",
    "email": "michaelblack9505@gmail.com",
    "viabtcUserId": 608271,
    "coin": "XRP",
    "walletAmount": 16,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Lisa Morton",
    "email": "michaelblack9505@gmail.com",
    "viabtcUserId": 608271,
    "coin": "USDT",
    "walletAmount": 4.97,
    "walletAddress": "0xf1014Ca8b9b1b72aDf3DFd5599C93A5405903f00"
  },
  {
    "user": "Viplv  Jain",
    "email": "viplvjain207@gmail.com",
    "viabtcUserId": 608288,
    "coin": "USDT",
    "walletAmount": 17.9,
    "walletAddress": "0xBfaB540521babAEe3030Beb2B221Ef07A5a4fa4A"
  },
  {
    "user": "Marwan Alneaimi",
    "email": "marwan.alneaimi@gmail.com",
    "viabtcUserId": 608337,
    "coin": "AED",
    "walletAmount": 0.47999999999956344,
    "walletAddress": "undefined"
  },
  {
    "user": "MALANGUSHA ABDUL KADER",
    "email": "malangusha@icloud.com",
    "viabtcUserId": 608322,
    "coin": "BTC",
    "walletAmount": 5e-8,
    "walletAddress": "3JwBcfdj4qJrtmyh1ZVN9g2kMadiBKK3C5"
  },
  {
    "user": "MALANGUSHA ABDUL KADER",
    "email": "malangusha@icloud.com",
    "viabtcUserId": 608322,
    "coin": "XRP",
    "walletAmount": 0.01463327,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "MALANGUSHA ABDUL KADER",
    "email": "malangusha@icloud.com",
    "viabtcUserId": 608322,
    "coin": "AED",
    "walletAmount": 0.44,
    "walletAddress": "undefined"
  },
  {
    "user": "nabeel khan",
    "email": "nabeeldk619@gmail.com",
    "viabtcUserId": 608403,
    "coin": "AED",
    "walletAmount": 0.13,
    "walletAddress": "undefined"
  },
  {
    "user": "Hamda Almansoori",
    "email": "hamda64@live.com",
    "viabtcUserId": 608405,
    "coin": "ETH",
    "walletAmount": 0.00000528,
    "walletAddress": "0xe6C629104c0d92871B13dEC05a307D31A1De2f5D"
  },
  {
    "user": "Hamda Almansoori",
    "email": "hamda64@live.com",
    "viabtcUserId": 608405,
    "coin": "AED",
    "walletAmount": 134.802943,
    "walletAddress": "undefined"
  },
  {
    "user": "nikul patel",
    "email": "nikulpatel.a49@gmail.com",
    "viabtcUserId": 608417,
    "coin": "XRP",
    "walletAmount": 79.04419337,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "nikul patel",
    "email": "nikulpatel.a49@gmail.com",
    "viabtcUserId": 608417,
    "coin": "BTX",
    "walletAmount": 418,
    "walletAddress": "0xd4f621505D706eAc1Bf0FEBb2cb21A549Ba098d8"
  },
  {
    "user": "nikul patel",
    "email": "nikulpatel.a49@gmail.com",
    "viabtcUserId": 608417,
    "coin": "INR",
    "walletAmount": 810,
    "walletAddress": "undefined"
  },
  {
    "user": "Mrunal Mehta",
    "email": "mrunal.1710@gmail.com",
    "viabtcUserId": 608795,
    "coin": "BTX",
    "walletAmount": 100,
    "walletAddress": "0xbADBfB4376F8a8EDE7Cb5AbE814Cd69941E6beaa"
  },
  {
    "user": "Hazem Fathy",
    "email": "o.miskeen@gmail.com",
    "viabtcUserId": 608479,
    "coin": "AED",
    "walletAmount": 0.22,
    "walletAddress": "undefined"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "TRX",
    "walletAmount": 0.21336503,
    "walletAddress": "TDjPt9uKcGgqyPHqn2cEgxvyN33R2tfs5T"
  },
  {
    "user": "Ravikumar Ponnusamy",
    "email": "ravikumar.ponnusamy@yahoo.com",
    "viabtcUserId": 608563,
    "coin": "BTX",
    "walletAmount": 85537.60945814,
    "walletAddress": "0x6D5C412545f0760E6F743e8fD6dd0dC0aFdea0cb"
  },
  {
    "user": "Vaibhav Prabhuajgaonkar",
    "email": "vaibhavprabhuajgaonkar@gmail.com",
    "viabtcUserId": 608574,
    "coin": "BTX",
    "walletAmount": 100,
    "walletAddress": "0xD26bB65673B7474B410e6F7Ff9B58DC5d19a5467"
  },
  {
    "user": "Deepak Tiwari",
    "email": "deeepaktiwarii@gmail.com",
    "viabtcUserId": 608588,
    "coin": "BTX",
    "walletAmount": 250,
    "walletAddress": "0xDeb1d54d02e2A96b87ab9e626940e9b98b58dBbE"
  },
  {
    "user": "Anmol Gupta",
    "email": "anmol89@gmail.com",
    "viabtcUserId": 608650,
    "coin": "BTC",
    "walletAmount": 0.00110668,
    "walletAddress": "381f42QkzZLD1ffGq9xzM4dkc2w6qZQRxb"
  },
  {
    "user": "Emma Galvez",
    "email": "emmagalvez30@gmail.com",
    "viabtcUserId": 608655,
    "coin": "BTC",
    "walletAmount": 0.00029601,
    "walletAddress": "3NZTq4RPALibeUvVxnDAW2WsUfrEwFZc8R"
  },
  {
    "user": "Priyam Patel",
    "email": "priyam95706@gmail.com",
    "viabtcUserId": 608674,
    "coin": "BTX",
    "walletAmount": 10084.48957553,
    "walletAddress": "0x8559264108dCD16cCa4cE466b5385A4D87379b1e"
  },
  {
    "user": "Narendrakumar Jangra",
    "email": "narennkumarjangra@gmail.com",
    "viabtcUserId": 608713,
    "coin": "INR",
    "walletAmount": 0.00012525,
    "walletAddress": "undefined"
  },
  {
    "user": "tushar gogia",
    "email": "riseup.awakening@gmail.com",
    "viabtcUserId": 608756,
    "coin": "BTX",
    "walletAmount": 500,
    "walletAddress": "0x8a0a90c7a6bD03e47722b6368B4C50F1eb109F10"
  },
  {
    "user": "Douglas Coyne",
    "email": "doug.coyne@protonmail.com",
    "viabtcUserId": 608762,
    "coin": "BTC",
    "walletAmount": 0.00011601,
    "walletAddress": "38MBE26q4UX6nXEirHfPDbQJGk4DPiGpXY"
  },
  {
    "user": "Kalliat Vikram Nambiar",
    "email": "vikramnambiar@hotmail.com",
    "viabtcUserId": 608788,
    "coin": "BTC",
    "walletAmount": 0.03266398,
    "walletAddress": "3LE5M2PnE91aCGfeHT7Yge9L5np4bB2Se3"
  },
  {
    "user": "Kalliat Vikram Nambiar",
    "email": "vikramnambiar@hotmail.com",
    "viabtcUserId": 608788,
    "coin": "ETH",
    "walletAmount": 0.72098313,
    "walletAddress": "0x42f75cbb7427EB7d10B7106D0Ff3642195a629Aa"
  },
  {
    "user": "Kalliat Vikram Nambiar",
    "email": "vikramnambiar@hotmail.com",
    "viabtcUserId": 608788,
    "coin": "INR",
    "walletAmount": 54955.67,
    "walletAddress": "undefined"
  },
  {
    "user": "Rohan Ranade",
    "email": "ranaderohan@gmail.com",
    "viabtcUserId": 608794,
    "coin": "BTX",
    "walletAmount": 105,
    "walletAddress": "0xf4Ff1200c1E6D482E9C7BE80cD9B3f78d55793Aa"
  },
  {
    "user": "Vishal Surana",
    "email": "vishal06srn@gmail.com",
    "viabtcUserId": 608800,
    "coin": "XRP",
    "walletAmount": 0.62564432,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Vishal Surana",
    "email": "vishal06srn@gmail.com",
    "viabtcUserId": 608800,
    "coin": "INR",
    "walletAmount": 23.78,
    "walletAddress": "undefined"
  },
  {
    "user": "Narendra Mali",
    "email": "invest.naren@gmail.com",
    "viabtcUserId": 608824,
    "coin": "BTC",
    "walletAmount": 0.00000986,
    "walletAddress": "3N2ej8F3jnikf7tKjj6Hz4KyNKFtuEys5t"
  },
  {
    "user": "Narendra Mali",
    "email": "invest.naren@gmail.com",
    "viabtcUserId": 608824,
    "coin": "INR",
    "walletAmount": 1893.24,
    "walletAddress": "undefined"
  },
  {
    "user": "Narendra Mali",
    "email": "invest.naren@gmail.com",
    "viabtcUserId": 608824,
    "coin": "TRX",
    "walletAmount": 1295.54499093,
    "walletAddress": "TXgWWkybwy7hFyj4d5Q7tL18L6YVZ8ZWwV"
  },
  {
    "user": "Narendra Mali",
    "email": "invest.naren@gmail.com",
    "viabtcUserId": 608824,
    "coin": "BTX",
    "walletAmount": 4.85,
    "walletAddress": "0x00Cd22BB8cD7f1f9AFd5277F97c1c0777E2B4d47"
  },
  {
    "user": "Tronium Official",
    "email": "troniumofficial@protonmail.com",
    "viabtcUserId": 608858,
    "coin": "INR",
    "walletAmount": 1.32,
    "walletAddress": "undefined"
  },
  {
    "user": "Tronium Official",
    "email": "troniumofficial@protonmail.com",
    "viabtcUserId": 608858,
    "coin": "TRX",
    "walletAmount": 0.83474257,
    "walletAddress": "TYujjH28FoZuf35N1rqEAAAx8ophnTWnbN"
  },
  {
    "user": "Hitesh Raut",
    "email": "hiteshnraut@hotmail.com",
    "viabtcUserId": 608871,
    "coin": "XRP",
    "walletAmount": 0.00499549,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Hitesh Raut",
    "email": "hiteshnraut@hotmail.com",
    "viabtcUserId": 608871,
    "coin": "INR",
    "walletAmount": 29.02,
    "walletAddress": "undefined"
  },
  {
    "user": "Damián Granata",
    "email": "dgranata77@yahoo.com.ar",
    "viabtcUserId": 608876,
    "coin": "BTC",
    "walletAmount": 0.00002724,
    "walletAddress": "3NWAhMjgbWRa3JSJTv7XWmzxw8GNNuSVtq"
  },
  {
    "user": "vincent rockwell",
    "email": "jayycaantu@gmail.com",
    "viabtcUserId": 608895,
    "coin": "BTC",
    "walletAmount": 0.01958638,
    "walletAddress": "3BJnkfEzb5XmC12vkDin3T3FeBbUfo1DfW"
  },
  {
    "user": "vincent rockwell",
    "email": "jayycaantu@gmail.com",
    "viabtcUserId": 608895,
    "coin": "ETH",
    "walletAmount": 0.11155424,
    "walletAddress": "0x01F29460B247291EdE6D673C689f11e74cb0bE4D"
  },
  {
    "user": "vincent rockwell",
    "email": "jayycaantu@gmail.com",
    "viabtcUserId": 608895,
    "coin": "XRP",
    "walletAmount": 462.8,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "vincent rockwell",
    "email": "jayycaantu@gmail.com",
    "viabtcUserId": 608895,
    "coin": "BCH",
    "walletAmount": 0.12202211,
    "walletAddress": "3P9DAERTNfVFbMMEqHUrhafk1aC2txCwC8"
  },
  {
    "user": "vincent rockwell",
    "email": "jayycaantu@gmail.com",
    "viabtcUserId": 608895,
    "coin": "USDT",
    "walletAmount": 15.73,
    "walletAddress": "0x67479fe2a2cEb1bE97Be2Ab63A2891aD056aE49a"
  },
  {
    "user": "Vishesh Jain",
    "email": "visheshjain18@gmail.com",
    "viabtcUserId": 608960,
    "coin": "BTX",
    "walletAmount": 200,
    "walletAddress": "0x35cf47feDf87F4dA614ea6cF7950Fd8F2b8c89D6"
  },
  {
    "user": "ANANDAKUMAR D",
    "email": "kowsik66@gmail.com",
    "viabtcUserId": 608976,
    "coin": "INR",
    "walletAmount": 0.26,
    "walletAddress": "undefined"
  },
  {
    "user": "ANANDAKUMAR D",
    "email": "kowsik66@gmail.com",
    "viabtcUserId": 608976,
    "coin": "TRX",
    "walletAmount": 0.00870397,
    "walletAddress": "TLubpjXrZah2xApvWBogZzYPZ7bYLtaazg"
  },
  {
    "user": "SEONGOK KO",
    "email": "ksomars@naver.com",
    "viabtcUserId": 608977,
    "coin": "ETH",
    "walletAmount": 0.00000247,
    "walletAddress": "0x108B15Adf53Dcc33481a0107F4CAbC1Fc3A2A036"
  },
  {
    "user": "SEONGOK KO",
    "email": "ksomars@naver.com",
    "viabtcUserId": 608977,
    "coin": "BTX",
    "walletAmount": 816.32943778,
    "walletAddress": "0x4Fd88bCC200f414E71D1E9D028B82Ef4C83A7C25"
  },
  {
    "user": "gopal kumar",
    "email": "gopal.planning@gmail.com",
    "viabtcUserId": 608985,
    "coin": "XRP",
    "walletAmount": 0.26597197,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "gopal kumar",
    "email": "gopal.planning@gmail.com",
    "viabtcUserId": 608985,
    "coin": "INR",
    "walletAmount": 3.91,
    "walletAddress": "undefined"
  },
  {
    "user": "Gopi Krishna",
    "email": "krishna.krishna1987@gmail.com",
    "viabtcUserId": 608997,
    "coin": "TRX",
    "walletAmount": 1,
    "walletAddress": "TTiPwBtJtLKC2ebkiR32CV8RgTwBBmLQxy"
  },
  {
    "user": "Anubhav Chauhan",
    "email": "anubhav.chauhan86@gmail.com",
    "viabtcUserId": 609029,
    "coin": "XRP",
    "walletAmount": 0.41721079,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Anubhav Chauhan",
    "email": "anubhav.chauhan86@gmail.com",
    "viabtcUserId": 609029,
    "coin": "INR",
    "walletAmount": 18.04,
    "walletAddress": "undefined"
  },
  {
    "user": "Tejas Shah",
    "email": "tejas_75@yahoo.com",
    "viabtcUserId": 609040,
    "coin": "INR",
    "walletAmount": 0.4,
    "walletAddress": "undefined"
  },
  {
    "user": "Tejas Shah",
    "email": "tejas_75@yahoo.com",
    "viabtcUserId": 609040,
    "coin": "TRX",
    "walletAmount": 16981.36143858,
    "walletAddress": "TDnQ7MmbNcVT3Fz2R8upqX5EdxNzhQS3W8"
  },
  {
    "user": "mostafa sheikh ghomi",
    "email": "peytafa@gmail.com",
    "viabtcUserId": 609043,
    "coin": "LTC",
    "walletAmount": 0.00072907,
    "walletAddress": "MREicV9fnwg5EejPw3miiWn3H2Ah6kfHc4"
  },
  {
    "user": "mostafa sheikh ghomi",
    "email": "peytafa@gmail.com",
    "viabtcUserId": 609043,
    "coin": "USDT",
    "walletAmount": 0.09,
    "walletAddress": "0xDDe32344AD0290655e094154DBa1f946d133f53C"
  },
  {
    "user": "mostafa sheikh ghomi",
    "email": "peytafa@gmail.com",
    "viabtcUserId": 609043,
    "coin": "TRX",
    "walletAmount": 53685.35661,
    "walletAddress": "TUCDbHLaTgbjgcXKy1SU6KeZT9pWjSDXNY"
  },
  {
    "user": "abdulrahman bajerei",
    "email": "a.bajerei@gmail.com",
    "viabtcUserId": 609070,
    "coin": "AED",
    "walletAmount": 0.21,
    "walletAddress": "undefined"
  },
  {
    "user": "abdulrahman bajerei",
    "email": "a.bajerei@gmail.com",
    "viabtcUserId": 609070,
    "coin": "INR",
    "walletAmount": 0.27,
    "walletAddress": "undefined"
  },
  {
    "user": "abdulrahman bajerei",
    "email": "a.bajerei@gmail.com",
    "viabtcUserId": 609070,
    "coin": "BTX",
    "walletAmount": 4651.41797445,
    "walletAddress": "0xE37Ff178925925dB9FA1015e31cb555D1a779f45"
  },
  {
    "user": "Azmath Mohammed",
    "email": "azmathshah@gmail.com",
    "viabtcUserId": 609134,
    "coin": "INR",
    "walletAmount": 500,
    "walletAddress": "undefined"
  },
  {
    "user": "Azmath Mohammed",
    "email": "azmathshah@gmail.com",
    "viabtcUserId": 609134,
    "coin": "BTX",
    "walletAmount": 100,
    "walletAddress": "0xB0e0c9004062C5a4faf2131fA3148a1c23AD3810"
  },
  {
    "user": "Burcu Topas",
    "email": "letgodasattim@gmail.com",
    "viabtcUserId": 609141,
    "coin": "BTC",
    "walletAmount": 0.00014221,
    "walletAddress": "3964RJ4XhMNioPVYbiY3mnC2eQV3a18DsV"
  },
  {
    "user": "Priyanka Patel",
    "email": "priyankaa.niranjan2011@gmail.com",
    "viabtcUserId": 609164,
    "coin": "XRP",
    "walletAmount": 0.00073025,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "shivkumar amrutiya",
    "email": "allstuffhacks3@gmail.com",
    "viabtcUserId": 609178,
    "coin": "LTC",
    "walletAmount": 0.00880212,
    "walletAddress": "MVmtAUCVTwLNjAfYuCaCouZHaVKnkDBbyx"
  },
  {
    "user": "shivkumar amrutiya",
    "email": "allstuffhacks3@gmail.com",
    "viabtcUserId": 609178,
    "coin": "XRP",
    "walletAmount": 0.16087383,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "shivkumar amrutiya",
    "email": "allstuffhacks3@gmail.com",
    "viabtcUserId": 609178,
    "coin": "INR",
    "walletAmount": 532.29,
    "walletAddress": "undefined"
  },
  {
    "user": "shivkumar amrutiya",
    "email": "allstuffhacks3@gmail.com",
    "viabtcUserId": 609178,
    "coin": "TRX",
    "walletAmount": 222.2628309,
    "walletAddress": "TM9JxVoVUagCG6tEcTMCuD1mX6GC5R2ygz"
  },
  {
    "user": "shivkumar amrutiya",
    "email": "allstuffhacks3@gmail.com",
    "viabtcUserId": 609178,
    "coin": "BTX",
    "walletAmount": 500.84515,
    "walletAddress": "0xD3dE5DE1059bf382F1633510506a641B41AfC1f4"
  },
  {
    "user": "Ranveer Singh",
    "email": "newmailforworkishere@gmail.com",
    "viabtcUserId": 609179,
    "coin": "INR",
    "walletAmount": 1313.72,
    "walletAddress": "undefined"
  },
  {
    "user": "Karan Arora",
    "email": "suniilarora@gmail.com",
    "viabtcUserId": 609180,
    "coin": "XRP",
    "walletAmount": 0.00134016,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Karan Arora",
    "email": "suniilarora@gmail.com",
    "viabtcUserId": 609180,
    "coin": "INR",
    "walletAmount": 1.03,
    "walletAddress": "undefined"
  },
  {
    "user": "Karan Arora",
    "email": "suniilarora@gmail.com",
    "viabtcUserId": 609180,
    "coin": "TRX",
    "walletAmount": 2.51401426,
    "walletAddress": "TLB3BrqzrtsEPvhs8vsDmQfNLqf44NFnzS"
  },
  {
    "user": "Karan Arora",
    "email": "suniilarora@gmail.com",
    "viabtcUserId": 609180,
    "coin": "BTX",
    "walletAmount": 0.004,
    "walletAddress": "0xDCBD1A4DBAb0111CfcA98A38ae6aa093801ca0Eb"
  },
  {
    "user": "Pankaj Sankhala",
    "email": "pankajsankhala1@gmail.com",
    "viabtcUserId": 609181,
    "coin": "INR",
    "walletAmount": 9.6,
    "walletAddress": "undefined"
  },
  {
    "user": "Pankaj Sankhala",
    "email": "pankajsankhala1@gmail.com",
    "viabtcUserId": 609181,
    "coin": "TRX",
    "walletAmount": 1.683484,
    "walletAddress": "TNEexoLX5BFmw9xHs54Q82W3PtQHLysuDt"
  },
  {
    "user": "Pankaj Sankhala",
    "email": "pankajsankhala1@gmail.com",
    "viabtcUserId": 609181,
    "coin": "BTX",
    "walletAmount": 97,
    "walletAddress": "0x5532116F19Fb8acA3b7f3d522120f798b749D883"
  },
  {
    "user": "Jesse Martin",
    "email": "jetskionthemoon@protonmail.com",
    "viabtcUserId": 100005469,
    "coin": "ETH",
    "walletAmount": 0.0022154,
    "walletAddress": "0x55A31b796c6EF09b9882AB901C97FB691f4220fE"
  },
  {
    "user": "Raimundo Ledesma Chazarreta",
    "email": "rayledesmachazarreta@gmail.com",
    "viabtcUserId": 100005491,
    "coin": "BTC",
    "walletAmount": 0.00005639,
    "walletAddress": "3829nbjeBQtjYB1EWK5ExoTiEn2AEoDr7j"
  },
  {
    "user": "Raimundo Ledesma Chazarreta",
    "email": "rayledesmachazarreta@gmail.com",
    "viabtcUserId": 100005491,
    "coin": "USDT",
    "walletAmount": 1.51,
    "walletAddress": "0xcf86F1377bFb5CbF4Ba8d159e8406D325edD060a"
  },
  {
    "user": "ARAJANBHAI KANGAD",
    "email": "kangad.1969@gmail.com",
    "viabtcUserId": 607025,
    "coin": "TRX",
    "walletAmount": 958.59502062,
    "walletAddress": "TWgudTxLzR6FGpvbBwH75DPeUS4xofN1aA"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "BTX",
    "walletAmount": 44.23527242,
    "walletAddress": "0xa7E65e7E3AE383e27b060164D3A368b95a1db8cD"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "AED",
    "walletAmount": 1403.6161,
    "walletAddress": "undefined"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "USDT",
    "walletAmount": 205787.09994485,
    "walletAddress": "0x355E1c2171456F37E9fB1b52fcb9868bB86A649F"
  },
  {
    "user": "Vimek Patel",
    "email": "patelvimek@gmail.com",
    "viabtcUserId": 605260,
    "coin": "BTX",
    "walletAmount": 50,
    "walletAddress": "0xe94E65f5512B6C7F60f36bfe7594e8ddED9cf719"
  },
  {
    "user": "Hardik Joshi",
    "email": "hardikjoshi.work@gmail.com",
    "viabtcUserId": 601513,
    "coin": "ETH",
    "walletAmount": 0.1,
    "walletAddress": "0x3912DbE60FA647F2F5011777472d5d1CD5a924a8"
  },
  {
    "user": "Himmat Menariya",
    "email": "himmatmenariya77@gmail.com",
    "viabtcUserId": 601943,
    "coin": "BTC",
    "walletAmount": 0.01533013,
    "walletAddress": "3Cow4soSPiuD5qx64hRCyedXwWhYyquLVd"
  },
  {
    "user": "Siddhartha Jain",
    "email": "jain.siddhartha3@gmail.com",
    "viabtcUserId": 608593,
    "coin": "BTX",
    "walletAmount": 200,
    "walletAddress": "0x61871e3d62E65FA85e4CCA928A08F5f1603fea07"
  },
  {
    "user": "Rutul Narania",
    "email": "rutulnarania81@gmail.com",
    "viabtcUserId": 605688,
    "coin": "INR",
    "walletAmount": 6e-8,
    "walletAddress": "undefined"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "BTX",
    "walletAmount": 55,
    "walletAddress": "0x456c35A35506E6908fBb42BD145cf502683a28D1"
  },
  {
    "user": "Nasir Alseeri Alqemzi",
    "email": "nasir.alseeri@gmail.com",
    "viabtcUserId": 600320,
    "coin": "LTC",
    "walletAmount": 0.029,
    "walletAddress": "MTSggAkwqShMPTWgDVMAbpswXcTPRwJTzi"
  },
  {
    "user": "Nasir Alseeri Alqemzi",
    "email": "nasir.alseeri@gmail.com",
    "viabtcUserId": 600320,
    "coin": "ETH",
    "walletAmount": 0.097,
    "walletAddress": "0x26e7212A0936cE40f6040b9cFB00C081957C3142"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "INR",
    "walletAmount": 376571.31151853,
    "walletAddress": "undefined"
  },
  {
    "user": "Hardik Joshi",
    "email": "hardikjoshi.work@gmail.com",
    "viabtcUserId": 601513,
    "coin": "BTC",
    "walletAmount": 0.00584329,
    "walletAddress": "3LcQg7PzjQ6wSGrj4fPuGZQPRA631uXyam"
  },
  {
    "user": "Hardik Joshi",
    "email": "hardikjoshi.work@gmail.com",
    "viabtcUserId": 601513,
    "coin": "INR",
    "walletAmount": 15150.88605105,
    "walletAddress": "undefined"
  },
  {
    "user": "Himmat Menariya",
    "email": "himmatmenariya77@gmail.com",
    "viabtcUserId": 601943,
    "coin": "AED",
    "walletAmount": 13774.07486709,
    "walletAddress": ""
  },
  {
    "user": "Mubashir Patel",
    "email": "mubashir.p@gmail.com",
    "viabtcUserId": 604808,
    "coin": "TRX",
    "walletAmount": 0.6143379,
    "walletAddress": "TESTbHW8vSEN1wYauGmnKGptSwvuA69Sq7"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "BTC",
    "walletAmount": 0.0000777,
    "walletAddress": "37VmjsXw7KN7JEvn6UV336pHrFyRPNfdNG"
  },
  {
    "user": "Hardik Joshi",
    "email": "hardikjoshi.work@gmail.com",
    "viabtcUserId": 601513,
    "coin": "USDT",
    "walletAmount": 469.51522435,
    "walletAddress": "0x262d52268AF67126619F573aC4479F9a84eC2bd2"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "USDT",
    "walletAmount": 826.15631801,
    "walletAddress": "0xd2590B2a0913bf49bCecDC967Bf8420a34678999"
  },
  {
    "user": "nikul patel",
    "email": "nikul.projects49@gmail.com",
    "viabtcUserId": 606037,
    "coin": "TRX",
    "walletAmount": 0.88069535,
    "walletAddress": "TEqbaVCNRW9Ps3d51HXM8aLun3GK1i2JbY"
  },
  {
    "user": "Jaswinder Singh Narula",
    "email": "jaswinder.singh.narula@gmail.com",
    "viabtcUserId": 600794,
    "coin": "AED",
    "walletAmount": 0.1351,
    "walletAddress": ""
  },
  {
    "user": "Jaswinder Singh Narula",
    "email": "jaswinder.singh.narula@gmail.com",
    "viabtcUserId": 600794,
    "coin": "BTC",
    "walletAmount": 0.00507662,
    "walletAddress": "3MdP9rpobj5XtaLecr3KbiMSeFLwzPn97G"
  },
  {
    "user": "Yousef Alshawabkeh",
    "email": "yousefghata@yahoo.com",
    "viabtcUserId": 603276,
    "coin": "AED",
    "walletAmount": 36.1,
    "walletAddress": "undefined"
  },
  {
    "user": "Ansar Tharammal",
    "email": "cryptbcmoney@gmail.com",
    "viabtcUserId": 607458,
    "coin": "AED",
    "walletAmount": 0.18871636,
    "walletAddress": "undefined"
  },
  {
    "user": "Shabana Musammil",
    "email": "mms.sense@gmail.com",
    "viabtcUserId": 608759,
    "coin": "BTC",
    "walletAmount": 2.8e-7,
    "walletAddress": "3DfRHRw1LfKTZjq9mNZ9Y85oXT3k9ijPK2"
  },
  {
    "user": "ABDUL SAMAD ganatra",
    "email": "samadganatra@hotmail.com",
    "viabtcUserId": 601069,
    "coin": "XRP",
    "walletAmount": 0.81041338,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Priyanka Patel",
    "email": "priyankaa.niranjan2011@gmail.com",
    "viabtcUserId": 609164,
    "coin": "INR",
    "walletAmount": 0.8,
    "walletAddress": "undefined"
  },
  {
    "user": "gopal kumar",
    "email": "gopal.planning@gmail.com",
    "viabtcUserId": 608985,
    "coin": "TRX",
    "walletAmount": 0.000781,
    "walletAddress": "TC3rkiZymmYAF4M2S3rm1TVKuv8ahijWvB"
  },
  {
    "user": "Omkar Neupaney",
    "email": "omkarneupaney@gmail.com",
    "viabtcUserId": 601898,
    "coin": "TRX",
    "walletAmount": 0.0000032,
    "walletAddress": "TWJBekrnRW5t9X3mGc3NsoqejhrN4hzMsA"
  },
  {
    "user": "Shoaib Ahmad",
    "email": "shoaibcheema@yahoo.com",
    "viabtcUserId": 602172,
    "coin": "ETH",
    "walletAmount": 0.02674003,
    "walletAddress": "0x8aa336b37445b0C42B95EB4D0801710BAee6f23d"
  },
  {
    "user": "Shoaib Ahmad",
    "email": "shoaibcheema@yahoo.com",
    "viabtcUserId": 602172,
    "coin": "AED",
    "walletAmount": 0.59601912,
    "walletAddress": ""
  },
  {
    "user": "Hossein Ali Amani",
    "email": "hossein@panecs.ae",
    "viabtcUserId": 601295,
    "coin": "BTC",
    "walletAmount": 1e-8,
    "walletAddress": "3Hs1DZWjL17ohXgd1t1qQKsxwuQEyJHdHx"
  },
  {
    "user": "Hossein Ali Amani",
    "email": "hossein@panecs.ae",
    "viabtcUserId": 601295,
    "coin": "AED",
    "walletAmount": 3,
    "walletAddress": ""
  },
  {
    "user": "Narendrakumar Jangra",
    "email": "narennkumarjangra@gmail.com",
    "viabtcUserId": 608713,
    "coin": "XRP",
    "walletAmount": 0.00090673,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Hamda Almansoori",
    "email": "hamda64@live.com",
    "viabtcUserId": 608405,
    "coin": "XRP",
    "walletAmount": 0.2104457,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Jaswinder Singh Narula",
    "email": "jaswinder.singh.narula@gmail.com",
    "viabtcUserId": 600794,
    "coin": "XRP",
    "walletAmount": 407.02,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "XRP",
    "walletAmount": 349.69417759,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "william jones",
    "email": "orionequiti@gmail.com",
    "viabtcUserId": 606473,
    "coin": "BTC",
    "walletAmount": 0.0199,
    "walletAddress": "3K6AtEFwAJiiJB3RWfbwPP95tzS9xw6Fyu"
  },
  {
    "user": "TARUN Jain",
    "email": "sanjaychemicals1987@gmail.com",
    "viabtcUserId": 608970,
    "coin": "INR",
    "walletAmount": 0.0823,
    "walletAddress": "undefined"
  },
  {
    "user": "Gustavo Retamar",
    "email": "gustavoarielretamar@gmail.com",
    "viabtcUserId": 606854,
    "coin": "BTC",
    "walletAmount": 0.0615,
    "walletAddress": "343gSvyCi896M57S8oDeu1f29XE2JrA3rd"
  },
  {
    "user": "geronimo gil",
    "email": "gilgeronimo96@gmail.com",
    "viabtcUserId": 100005668,
    "coin": "BTC",
    "walletAmount": 0.00006763,
    "walletAddress": "36ihwzFA44bXr8sQiSrhCR1vn1Gpwx7TiN"
  },
  {
    "user": "geronimo gil",
    "email": "gilgeronimo96@gmail.com",
    "viabtcUserId": 100005668,
    "coin": "BTC",
    "walletAmount": 0.00006763,
    "walletAddress": "3BLFerwyNuDDSuHm9ecck4ddzF7UpzETWF"
  },
  {
    "user": "geronimo gil",
    "email": "gilgeronimo96@gmail.com",
    "viabtcUserId": 100005668,
    "coin": "BTC",
    "walletAmount": 0.00006763,
    "walletAddress": "3QPUuxtvHMsxUjj8EyheGLaRxwBst5Ngjh"
  },
  {
    "user": "geronimo gil",
    "email": "gilgeronimo96@gmail.com",
    "viabtcUserId": 100005668,
    "coin": "BTC",
    "walletAmount": 0.00006763,
    "walletAddress": "3Dd5X2yNnPY9NUkMQhVosUGu5XoN7sdaXu"
  },
  {
    "user": "ARAJANBHAI KANGAD",
    "email": "kangad.1969@gmail.com",
    "viabtcUserId": 607025,
    "coin": "XRP",
    "walletAmount": 200.40907657,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "ARAJANBHAI KANGAD",
    "email": "kangad.1969@gmail.com",
    "viabtcUserId": 607025,
    "coin": "INR",
    "walletAmount": 176.69600059,
    "walletAddress": "undefined"
  },
  {
    "user": "nabeel khan",
    "email": "nabeeldk619@gmail.com",
    "viabtcUserId": 608403,
    "coin": "BTC",
    "walletAmount": 0.0005,
    "walletAddress": "343vXZw5ksFyaBMmYAWxEbneKp3XMkcRg7"
  },
  {
    "user": "Andrew Urey",
    "email": "andrew.urey@gmail.com",
    "viabtcUserId": 601698,
    "coin": "AED",
    "walletAmount": 2.07861702,
    "walletAddress": ""
  },
  {
    "user": "PRABU PANNEERSELVAM",
    "email": "prabupknr@gmail.com",
    "viabtcUserId": 603868,
    "coin": "BTC",
    "walletAmount": 0.0002,
    "walletAddress": "32jBEFnuZg2jEofLM6iXynr4FX7cHvbupB"
  },
  {
    "user": "Mohammad Parvez",
    "email": "parvez.hyd43@gmail.com",
    "viabtcUserId": 600321,
    "coin": "ETH",
    "walletAmount": 0.00029999,
    "walletAddress": "0x760B46D7483FC4158f32C3a2683b74a910362D80"
  },
  {
    "user": "Rafi khan",
    "email": "mail2mdrafikhan@gmail.com",
    "viabtcUserId": 605493,
    "coin": "XRP",
    "walletAmount": 0.00697188,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Hardik Joshi",
    "email": "hardikjoshi.work@gmail.com",
    "viabtcUserId": 601513,
    "coin": "XRP",
    "walletAmount": 1.45282851,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Pruthviraj Nalam",
    "email": "pruthvi4smile@gmail.com",
    "viabtcUserId": 609001,
    "coin": "INR",
    "walletAmount": 0.8844,
    "walletAddress": "undefined"
  },
  {
    "user": "Omkar Neupaney",
    "email": "omkarneupaney@gmail.com",
    "viabtcUserId": 601898,
    "coin": "AED",
    "walletAmount": 1.3578,
    "walletAddress": ""
  },
  {
    "user": "Zevi Lacey",
    "email": "zevi.lacey@gmail.com",
    "viabtcUserId": 608810,
    "coin": "ETH",
    "walletAmount": 0.0019581,
    "walletAddress": "0xb9F6659931c7FCa7A13FFb601A2FeA9FcaB71ac0"
  },
  {
    "user": "Omkar Neupaney",
    "email": "omkarneupaney@gmail.com",
    "viabtcUserId": 601898,
    "coin": "BTX",
    "walletAmount": 0.64809702,
    "walletAddress": "0xa5bFdf1A3517d0F7ac4C0F8654818AB36E8f2F5E"
  },
  {
    "user": "ABDUL SAMAD ganatra",
    "email": "samadganatra@hotmail.com",
    "viabtcUserId": 601069,
    "coin": "AED",
    "walletAmount": 0.33077012,
    "walletAddress": ""
  },
  {
    "user": "Aissa Belmahdi",
    "email": "aissadzsetif@gmail.com",
    "viabtcUserId": 604082,
    "coin": "USDT",
    "walletAmount": 0.06569326,
    "walletAddress": "0x8D1Fc62D9C6f0372eCd00e37d7feA502c0a2A447"
  },
  {
    "user": "Omkar Neupaney",
    "email": "omkarneupaney@gmail.com",
    "viabtcUserId": 601898,
    "coin": "XRP",
    "walletAmount": 0.01325537,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "ABDUL SAMAD ganatra",
    "email": "samadganatra@hotmail.com",
    "viabtcUserId": 601069,
    "coin": "USDT",
    "walletAmount": 3.2e-7,
    "walletAddress": "0xE04fAc0Ff6F5f9c2f34AFb7d23C18B08da13217F"
  },
  {
    "user": "Moises Rivas",
    "email": "moises.rivas@outlook.com",
    "viabtcUserId": 100005758,
    "coin": "USDT",
    "walletAmount": 0.99625041,
    "walletAddress": "0x4bC170B42a0d08f39b8E5a46a487812DCeFFA150"
  },
  {
    "user": "Moises Rivas",
    "email": "moises.rivas@outlook.com",
    "viabtcUserId": 100005758,
    "coin": "LTC",
    "walletAmount": 0.00200002,
    "walletAddress": "MDRGcWym62YoUuhjoE2KRm9uyFhpKLUm8r"
  },
  {
    "user": "Diego Sikorski",
    "email": "diesiko@gmail.com",
    "viabtcUserId": 100005736,
    "coin": "USDT",
    "walletAmount": 5.30970117,
    "walletAddress": "0xd392B9F7054518aE06ffA97ebf69F0dFF374a2EC"
  },
  {
    "user": "Monark MM",
    "email": "testmail@mailinator.com",
    "viabtcUserId": 603418,
    "coin": "BTC",
    "walletAmount": 0.04936864,
    "walletAddress": "36aGQWDSJSazLtUJnFRGDtZHTUHkHGZR2P"
  },
  {
    "user": "Jigar Trivedi",
    "email": "trivedijig@gmail.com",
    "viabtcUserId": 607779,
    "coin": "ETH",
    "walletAmount": 1.00815951,
    "walletAddress": "0x8Cb5ca0CECE933ddbA86e5Ff57Ba285B5A7296eb"
  },
  {
    "user": "Pankaj Tripathi",
    "email": "pankaj_tr@yahoo.com",
    "viabtcUserId": 607616,
    "coin": "USDT",
    "walletAmount": 178327,
    "walletAddress": "0x7Ce1b17d12031E562af3e44A2aB086211Ab890c7"
  },
  {
    "user": "nahuel romano",
    "email": "nnahu.-@hotmail.com",
    "viabtcUserId": 100005717,
    "coin": "ETH",
    "walletAmount": 0.00005001,
    "walletAddress": "0x5A5D6878CCf09310Afa8F620a2684D4950b3756d"
  },
  {
    "user": "nahuel romano",
    "email": "nnahu.-@hotmail.com",
    "viabtcUserId": 100005717,
    "coin": "USDT",
    "walletAmount": 0.78529669,
    "walletAddress": "0x42AC4A9CAc5055cdB0193dB362C66e2dDC777780"
  },
  {
    "user": "Anmol Gupta",
    "email": "anmol89@gmail.com",
    "viabtcUserId": 608650,
    "coin": "INR",
    "walletAmount": 23.94309812,
    "walletAddress": "undefined"
  },
  {
    "user": "venkata krishna chaitanya nalam",
    "email": "krishnachaitanyaforall@gmail.com",
    "viabtcUserId": 608656,
    "coin": "INR",
    "walletAmount": 0.065,
    "walletAddress": "undefined"
  },
  {
    "user": "anish makhani",
    "email": "armantata@gmail.com",
    "viabtcUserId": 100005881,
    "coin": "INR",
    "walletAmount": 0.80254788,
    "walletAddress": "undefined"
  },
  {
    "user": "anish makhani",
    "email": "armantata@gmail.com",
    "viabtcUserId": 100005881,
    "coin": "INR",
    "walletAmount": 0.80254788,
    "walletAddress": "undefined"
  },
  {
    "user": "Dewald Jacobus Smith",
    "email": "dewaldsmith6@gmail.com",
    "viabtcUserId": 603558,
    "coin": "BTC",
    "walletAmount": 0.02043691,
    "walletAddress": "3ECJ4nKZYLn73BoRHbffBYidouvNe6e47d"
  },
  {
    "user": "Arunkumar Rajakkannu",
    "email": "vaandayaar@gmail.com",
    "viabtcUserId": 601018,
    "coin": "XRP",
    "walletAmount": 959.75,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Jemish bhatt",
    "email": "jemsbhatt@gmail.com",
    "viabtcUserId": 606026,
    "coin": "INR",
    "walletAmount": 0.14363183,
    "walletAddress": "undefined"
  },
  {
    "user": "Subhash Tosawar",
    "email": "subhashtosawar@gmail.com",
    "viabtcUserId": 606029,
    "coin": "AED",
    "walletAmount": 97.50944,
    "walletAddress": "undefined"
  },
  {
    "user": "Jigar Trivedi",
    "email": "trivedijig@gmail.com",
    "viabtcUserId": 607779,
    "coin": "USDT",
    "walletAmount": 14403.77352685,
    "walletAddress": "0x97B226663cdd9AcBDcF0f12Bb189a518370518Fd"
  },
  {
    "user": "abdulrahman bajerei",
    "email": "a.bajerei@gmail.com",
    "viabtcUserId": 609070,
    "coin": "XRP",
    "walletAmount": 0.007831,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Priyam Patel",
    "email": "priyam95706@gmail.com",
    "viabtcUserId": 608674,
    "coin": "ETH",
    "walletAmount": 0.00146348,
    "walletAddress": "0x1a8dd09aBB1050366644A49fBAB2E5898E545d5B"
  },
  {
    "user": "Priyam Patel",
    "email": "priyam95706@gmail.com",
    "viabtcUserId": 608674,
    "coin": "USDT",
    "walletAmount": 0.27845355,
    "walletAddress": "0xafF3Ca79f13b42CD3a28d5484a1DCaBc7da41703"
  },
  {
    "user": "Vimek Patel",
    "email": "patelvimek@gmail.com",
    "viabtcUserId": 605260,
    "coin": "XRP",
    "walletAmount": 133.51528143,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Vimek Patel",
    "email": "patelvimek@gmail.com",
    "viabtcUserId": 605260,
    "coin": "TRX",
    "walletAmount": 1360.9552137,
    "walletAddress": "TLAZB6gCa7uSpbiBS4sRLhb34s6VTmr6nE"
  },
  {
    "user": "Vimek Patel",
    "email": "patelvimek@gmail.com",
    "viabtcUserId": 605260,
    "coin": "USDT",
    "walletAmount": 69.90748443,
    "walletAddress": "0xe23a642BEc2468Da1a2bac80837925BcF9FBb63f"
  },
  {
    "user": "Indika Samantha Ranasinghe Suduwa Dewage",
    "email": "indikaranasinghe@ymail.com",
    "viabtcUserId": 603713,
    "coin": "AED",
    "walletAmount": 2.73,
    "walletAddress": "undefined"
  },
  {
    "user": "Indika Samantha Ranasinghe Suduwa Dewage",
    "email": "indikaranasinghe@ymail.com",
    "viabtcUserId": 603713,
    "coin": "XRP",
    "walletAmount": 9708.01395072,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Prateek Akbari",
    "email": "prateek.akbari1@gmail.com",
    "viabtcUserId": 609184,
    "coin": "INR",
    "walletAmount": 5.81576952,
    "walletAddress": "undefined"
  },
  {
    "user": "bernardo llorente",
    "email": "bernardo.llorente@llorentehnos.com",
    "viabtcUserId": 605442,
    "coin": "USDT",
    "walletAmount": 89.99490412,
    "walletAddress": "0xB596748A7b72A9288A289B8bc60cC9584a0813cA"
  },
  {
    "user": "Fatima Alameri",
    "email": "f.alameri@live.com",
    "viabtcUserId": 600020,
    "coin": "LTC",
    "walletAmount": 1,
    "walletAddress": "MUrZxmBb4kUz1anErBXieBLjk4Prp6Q2Xd"
  },
  {
    "user": "Fatima Alameri",
    "email": "f.alameri@live.com",
    "viabtcUserId": 600020,
    "coin": "XRP",
    "walletAmount": 255,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Fatima Alameri",
    "email": "f.alameri@live.com",
    "viabtcUserId": 600020,
    "coin": "BCH",
    "walletAmount": 1,
    "walletAddress": "3Pve9zo5dw3nAoNQAcVvrZbAERo6rniQFL"
  },
  {
    "user": "Fatima Alameri",
    "email": "f.alameri@live.com",
    "viabtcUserId": 600020,
    "coin": "AED",
    "walletAmount": 1.7379,
    "walletAddress": ""
  },
  {
    "user": "nikul patel",
    "email": "nikul@bitex.com",
    "viabtcUserId": 605435,
    "coin": "USDT",
    "walletAmount": 24.06034997,
    "walletAddress": "0x58A8f4E85d884d3C7e7127034ba8EbFbf75D9C43"
  },
  {
    "user": "NITHIN ADIYODI",
    "email": "nitin.adiyodi@gmail.com",
    "viabtcUserId": 608618,
    "coin": "BTX",
    "walletAmount": 1000,
    "walletAddress": "0x0175355Effb03fb32B317102202F537e058E1c8F"
  },
  {
    "user": "Priyam Patel",
    "email": "priyam95706@gmail.com",
    "viabtcUserId": 608674,
    "coin": "INR",
    "walletAmount": 103894.686929,
    "walletAddress": "undefined"
  },
  {
    "user": "nikul patel",
    "email": "nikul.a.patel49@gmail.com",
    "viabtcUserId": 607312,
    "coin": "USDT",
    "walletAmount": 122.11,
    "walletAddress": "0x38778CdB901cfb39E8ADB3B70C92F48550e356B2"
  },
  {
    "user": "nikul patel",
    "email": "nikul.a.patel49@gmail.com",
    "viabtcUserId": 607312,
    "coin": "BTX",
    "walletAmount": 70,
    "walletAddress": "0xF839Ea2005e0f2b3918737F838522a3EA3a77c8a"
  },
  {
    "user": "Hitesh Raut",
    "email": "hiteshnraut@hotmail.com",
    "viabtcUserId": 608871,
    "coin": "TRX",
    "walletAmount": 0.00470328,
    "walletAddress": "TAFqCmhTWrb5en4gERoPvjBQkEhY9knTsd"
  },
  {
    "user": "nikul patel",
    "email": "nikul@bitex.com",
    "viabtcUserId": 605435,
    "coin": "XRP",
    "walletAmount": 0.21549039,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "ETH",
    "walletAmount": 369.37329432,
    "walletAddress": "0x7558ae65339d954c40CE4008b81b98541c490C9E"
  },
  {
    "user": "nikul patel",
    "email": "nikul@bitex.com",
    "viabtcUserId": 605435,
    "coin": "BTX",
    "walletAmount": 1.60276735,
    "walletAddress": "0xd63BC00ffc5cb37d6Cb7035d7cf92Ec38D9252ac"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "BTX",
    "walletAmount": 8009.17906792,
    "walletAddress": "0x80e6430d4723cdF4F39857DA1afFa49361CeE4ac"
  },
  {
    "user": "Jemish bhatt",
    "email": "jemsbhatt@gmail.com",
    "viabtcUserId": 606026,
    "coin": "TRX",
    "walletAmount": 0.00000774,
    "walletAddress": "TSLrZbZNUCg3N8eAtLKMhhnBfaj1XkuupF"
  },
  {
    "user": "ALTHAF CA",
    "email": "althukasaragod54@gmail.com",
    "viabtcUserId": 609190,
    "coin": "INR",
    "walletAmount": 0.06687,
    "walletAddress": "undefined"
  },
  {
    "user": "Jaimini Tandel",
    "email": "jaiminitandel@gmail.com",
    "viabtcUserId": 602941,
    "coin": "TRX",
    "walletAmount": 607.37799954,
    "walletAddress": "TQGaCpBfQggk6sedhcdhXiEAMv1f13CCPH"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "XRP",
    "walletAmount": 24399.9,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "ismene andrade",
    "email": "ismene@yopmail.com",
    "viabtcUserId": 100006217,
    "coin": "BTC",
    "walletAmount": 0.00003688,
    "walletAddress": "32yASAe1vkyNLA6Ztbmyt96R7fQcAcDioQ"
  },
  {
    "user": "Vanita Rana",
    "email": "beborana2810@gmail.com",
    "viabtcUserId": 100006035,
    "coin": "INR",
    "walletAmount": 0.00186831,
    "walletAddress": "undefined"
  },
  {
    "user": "nikul patel",
    "email": "nikul@bitex.com",
    "viabtcUserId": 605435,
    "coin": "BTC",
    "walletAmount": 0.36833582,
    "walletAddress": "3AZQN71fqifir2SvEfu7dUAMRXF8ff1fSQ"
  },
  {
    "user": "Shehzad Kazi",
    "email": "shehzadkazi@gmail.com",
    "viabtcUserId": 608589,
    "coin": "INR",
    "walletAmount": 13.29000602,
    "walletAddress": "undefined"
  },
  {
    "user": "Shehzad Kazi",
    "email": "shehzadkazi@gmail.com",
    "viabtcUserId": 608589,
    "coin": "XRP",
    "walletAmount": 4.07911276,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Jaimini Tandel",
    "email": "jaiminitandel@gmail.com",
    "viabtcUserId": 602941,
    "coin": "INR",
    "walletAmount": 2117583.64818718,
    "walletAddress": "undefined"
  },
  {
    "user": "nikul patel",
    "email": "nikul@bitex.com",
    "viabtcUserId": 605435,
    "coin": "LTC",
    "walletAmount": 0.72109714,
    "walletAddress": "MMfxNkL3MuNzDrCCnLf3RHzDZWUktP8tZj"
  },
  {
    "user": "Andrew Urey",
    "email": "andrew.urey@gmail.com",
    "viabtcUserId": 601698,
    "coin": "ETH",
    "walletAmount": 0.00712623,
    "walletAddress": "0xA88a7F0DD7727088D8295Fe3D067d581B92D5e51"
  },
  {
    "user": "Andrew Urey",
    "email": "andrew.urey@gmail.com",
    "viabtcUserId": 601698,
    "coin": "BTC",
    "walletAmount": 1.1e-7,
    "walletAddress": "39YUwjxiqRt5FsUXMxibvtNADRWaQwTvR4"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "LTC",
    "walletAmount": 2.62511507,
    "walletAddress": "MDzyP9kjpL24Sdxwhf8gXxZSs4Fqaxfe6E"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "BTC",
    "walletAmount": 487.07739196,
    "walletAddress": "33eGLAVRka5NpMVbjrtDKhgdeQcFvneuu4"
  },
  {
    "user": "Ch Sh",
    "email": "alington1111@gmail.com",
    "viabtcUserId": 608207,
    "coin": "USDT",
    "walletAmount": 70,
    "walletAddress": "0x3698669Ba7b48E6763945710725412208A60e850"
  },
  {
    "user": "Monark Modi",
    "email": "monarkmodi1@gmail.com",
    "viabtcUserId": 500006,
    "coin": "USDT",
    "walletAmount": 5579.00723624,
    "walletAddress": "0x53982D77C32198b1E1A366a35fa78B1Ff1ed869c"
  },
  {
    "user": "Andrew Urey",
    "email": "andrew.urey@gmail.com",
    "viabtcUserId": 601698,
    "coin": "USDT",
    "walletAmount": 0.5302944,
    "walletAddress": "0xcf8f7090107Cd7cA15c6fFD44bB2472914C27168"
  },
  {
    "user": "Hussein Hassan",
    "email": "husseinbourai@gmail.com",
    "viabtcUserId": 601587,
    "coin": "XRP",
    "walletAmount": 1.769,
    "walletAddress": "rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"
  },
  {
    "user": "Hussein Hassan",
    "email": "husseinbourai@gmail.com",
    "viabtcUserId": 601587,
    "coin": "AED",
    "walletAmount": 0.0008,
    "walletAddress": ""
  },
  {
    "user": "Mubashir Patel",
    "email": "mubashir.p@gmail.com",
    "viabtcUserId": 604808,
    "coin": "USDT",
    "walletAmount": 0.04,
    "walletAddress": "0x04BcbD390F103673D28E0806dFC0A45a7bf3bc04"
  },
  {
    "user": "Mubashir Patel",
    "email": "mubashir.p@gmail.com",
    "viabtcUserId": 604808,
    "coin": "INR",
    "walletAmount": 35.56999999,
    "walletAddress": "undefined"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "BTC",
    "walletAmount": 16.26384147,
    "walletAddress": "35b44svMawLnXVcv3wo2CEoWqwRAve3r8f"
  },
  {
    "user": "Tuomas Ahola",
    "email": "crypto2me@pm.me",
    "viabtcUserId": 607763,
    "coin": "BTC",
    "walletAmount": 0.0003,
    "walletAddress": "35fmdMkaL4vseNKAL44Fqwxe2H2qXYsdu1"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "BCH",
    "walletAmount": 11.20102111,
    "walletAddress": "37MkhSnsEN8xwksFrZLYftRFEnadPojidE"
  },
  {
    "user": "Aneep Tandel",
    "email": "aneepct@live.com",
    "viabtcUserId": 500002,
    "coin": "INR",
    "walletAmount": 111996716.01825006,
    "walletAddress": "undefined"
  },
  {
    "user": "Tushar Patil",
    "email": "patiltushar947@gmail.com",
    "viabtcUserId": 607815,
    "coin": "INR",
    "walletAmount": 481.08826702,
    "walletAddress": "undefined"
  }
];

// const db = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";


// const certFileBuf = fs.readFileSync("/var/www/rds-combined-ca-bundle.pem");

mongoose
	.connect(db, { useUnifiedTopology: true })
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

const User = require("./models/User");
const UserWallet = require("./models/UserWallet");

exportUserWallet = async () => {
	const userwallets = await UserWallet.find();

	var walletList = [];

	for (let userwallet of userwallets) {
		if(userwallet.userId) {
			if (userwallet.userId.match(/^[0-9a-fA-F]{24}$/)) {
				if(parseFloat(userwallet.walletAmount) > 0) {
					let user = await User.findById(userwallet.userId);
					let data = {
						user: user ? `${user.firstname} ${user.lastname}` : "-",
						email: user ? `${user.email}` : "-",
						viabtcUserId: user ? `${user.viabtcUserId}` : "-",
						coin: userwallet.coin,
						walletAmount: userwallet.walletAmount,
						walletAddress: userwallet.walletAddress,
					};
					walletList.push(data);
				}
			}
		}
	}

	const options = {
		fieldSeparator: ",",
		quoteStrings: '"',
		decimalSeparator: ".",
		showLabels: true,
		showTitle: true,
		title: "userCrypto",
		useTextFile: false,
		useBom: true,
		useKeysAsHeaders: true,
	};

	const csvExporter = new exportToCsv.ExportToCsv(options);
	const csvData = csvExporter.generateCsv(walletList, true);
	fs.writeFileSync("UserWallet.csv", csvData);
	console.log("Exported");
};


const viabtcUpdateId = async () => {
	for (let walletToUpdate of userWalletToUpdate) {
		const params = [
				walletToUpdate.viabtcUserId,
				walletToUpdate.coin,
				'deposit',
				new Date().getTime(),
				`${walletToUpdate.walletAmount}`,
				{}
		];

		const postParamas = {
				method: 'balance.update',
				params: params,
				id: 1
		}

		const balanceUpdate = await axios.post('http://172.105.51.39:8085/', JSON.stringify(postParamas));
		console.log(balanceUpdate);
	}
	console.log('Updated successfully');
}

viabtcUpdateId();
