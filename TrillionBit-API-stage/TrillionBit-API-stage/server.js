require("dotenv").config();
// require("newrelic");
const compression = require("compression");
const express = require("express");
var fs = require("fs");

// const csurf = require('csurf');
// const cookieParser = require('cookie-parser');

var cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const swaggerCoincapDocument = require("./swagger_coincap.json");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
var multer = require("multer");
var upload = multer();

// Getting authentication routes
const auth = require("./routes/api/auth");
// Getting guest routes
const guest = require("./routes/api/guest");
// Getting user routes
const users = require("./routes/api/users");
// Getting wallet routes
const wallet = require("./routes/api/wallet");
// Getting trading routes
const trading = require("./routes/api/trading");
// Getting xpr routes
const xrp = require("./routes/api/xrp/routes");
// Getting bitgo setting routes
const bitgoSetting = require("./routes/api/bitgo");
// Websocket
const websocket_api = require("./routes/api/websocket_api");
// Bank API
const bankApi = require("./routes/api/bankApi");
// coinmarketcap API
const coinmarketcap = require("./routes/api/coinmarketcap");
// Getting eth routes
// const etherium = require('./routes/api/etherium/routes');
// Spot Market
const spot = require("./routes/api/spot");
const bitexSavingWallet = require("./routes/api/bitexSavingWallet");
const sumSubWebHook = require("./routes/api/sumsub");

//Getting admin routes
const admin = require("./routes/api/admin/auth");
const adminUers = require("./routes/api/admin/users");
const adminTrading = require("./routes/api/admin/trading");
const xrpSetting = require("./routes/api/admin/xrpSettingRoute");
const ethSetting = require("./routes/api/admin/ethSettingRoute");
const trxSetting = require("./routes/api/admin/trxSettingRoute");
const walletBonus = require("./routes/api/admin/walletBonus");
const article = require("./routes/api/admin/article");
const articleTags = require("./routes/api/admin/articleTags");
const articleCategories = require("./routes/api/admin/articleCategories");
const bitexSaving = require("./routes/api/admin/bitexSaving");
const rolePermission = require("./routes/api/admin/rolePermissions");
const adminUser = require("./routes/api/admin/admin");
const role = require("./routes/api/admin/role");
const adminAssets = require("./routes/api/admin/assets");
const adminMarket = require("./routes/api/admin/market");
const adminTradingMaintenance = require("./routes/api/admin/tradingMaintenance");
const adminWalletMaintenance = require("./routes/api/admin/walletMaintenance");
const adminMaintenance = require("./routes/api/admin/maintenance");
const adminDashboardUser = require("./routes/api/admin/dashboard/user");
const adminDashboardNotification = require("./routes/api/admin/dashboard/notification");
const adminDashboard = require("./routes/api/admin/dashboard/dashboard");

// Whitelist the following IPs
const whitelist = process.env.WHITELIST_SERVER;

const app = express();

var options = {
  //
};

app.use(compression({ level: 6 }));
app.use(cors({ origin: "*" }));
// @TODO
// app.use(function(req, res, next) {
//   if(whitelist.indexOf(req.get('origin')) !== -1){
//     next();
//   } else {
//     res.status(403).send('Unauthorized Access');
//   }
// });

// Middleware to skip for specific routes
const skipIfWebhook = (middleware) => {
  return (req, res, next) => {
    // Skip middleware for webhook route
    if (req.url.includes("/sumsub/webhook")) {
      return next();
    }
    middleware(req, res, next);
  };
};

// Body Parser middleware

app.use(skipIfWebhook(bodyParser.urlencoded({ extended: false })));
app.use(skipIfWebhook(bodyParser.json()));
app.use(skipIfWebhook(upload.any()));

// app.use('/', express.static(path.join(__dirname, '/build')));

// DB Config
// const db = require("./config/key").mongoURI;
const db = 'mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex'

// Connect to mongoDB
if (process.env.NODE_ENV === "production") {
  // const certFileBuf = path.resolve("/var/www/rds-combined-ca-bundle.pem");

  mongoose
    .connect(db, { useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

  // mongoose
  // 	.connect(db, { sslCA: certFileBuf })
  // 	.then(() => console.log("MongoDB connected"))
  // 	.catch((err) => console.log(err));
} else {
  mongoose
    .connect(db, { useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// app.use(cors());
// Front end routes
app.use("/api/auth", auth);
app.use("/spot", spot);
// app.use('/api/user', passport.authenticate('jwt', {session: false}), users);
app.use("/api/guest", guest);
app.use("/api/sumsub", sumSubWebHook);
app.use("/v1", coinmarketcap);
app.use("/api/user", passport.authenticate("jwt", { session: false }), users);
app.use(
  "/api/wallet",
  passport.authenticate("jwt", { session: false }),
  wallet
);
app.use(
  "/api/trading",
  passport.authenticate("jwt", { session: false }),
  trading
);
app.use(
  "/api/bitgo-setting",
  passport.authenticate("jwt", { session: false }),
  bitgoSetting
);

app.use(
  "/api/bitex-saving",
  passport.authenticate("jwt", { session: false }),
  bitexSavingWallet
);
app.use("/api/websocket", websocket_api);
// app.use('/api/xrp-setting', xrpSetting);

// Admin route
app.use("/api/admin/auth", admin);
app.use("/api/admin/users", adminUers);
app.use("/api/admin/trading", adminTrading);
app.use("/api/admin/xrp-setting", xrpSetting);
app.use("/api/admin/eth-setting", ethSetting);
app.use("/api/admin/trx-setting", trxSetting);
app.use("/api/admin/wallet-bonus", walletBonus);
app.use("/api/admin/article", article);
app.use("/api/admin/article-tags", articleTags);
app.use("/api/admin/article-categories", articleCategories);
app.use("/api/admin/bitex-saving", bitexSaving);
app.use(
  "/api/admin/role-permission",
  passport.authenticate("jwt", { session: false }),
  rolePermission
);
app.use(
  "/api/admin/admin-user",
  passport.authenticate("jwt", { session: false }),
  adminUser
);
app.use(
  "/api/admin/role",
  passport.authenticate("jwt", { session: false }),
  role
);
app.use("/api/admin/assets", adminAssets);
app.use("/api/admin/market", adminMarket);
app.use("/api/admin/dashboard", adminDashboard);
app.use("/api/admin/dashboard/user", adminDashboardUser);
app.use("/api/admin/dashboard/notification", adminDashboardNotification);
app.use("/api/admin/trading-maintenance", adminTradingMaintenance);
app.use("/api/admin/wallet-maintenance", adminWalletMaintenance);
app.use("/api/admin/maintenance", adminMaintenance);

// app.use('/api/etherium', etherium);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);
app.use(
  "/api_docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerCoincapDocument, options)
);

app.use("/", bankApi);

app.get("/test", (req, res) =>
  res.status(200).send({ message: "API RUINING" })
);

app.use("*", (req, res) =>
  res.status(404).send({ message: "API DON'T EXISTS" })
);

// // 404 Error handle
// app.use(function(req, res, next){
//   res.status(404);
//   res.type('text/html').send('<h1>Not Found</h1>');
// });

const User = require("./models/User");

if (process.env.NODE_ENV === "production") {
  // console.log('Connecting secure io...');
  var https = require("https").createServer(
    {
      key: fs.readFileSync("/etc/letsencrypt/live/api.bitex.com/privkey.pem"),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/api.bitex.com/fullchain.pem"
      ),
      requestCert: true,
    },
    app
  );
  var io = require("./node_modules/socket.io/dist")(https);
} else {
  // console.log('Connecting insecure io...');
  var https = require("https").createServer(app);
  var io = require("./node_modules/socket.io/dist")(https);
}

let port = process.env.PORT || 5000;

let clients = [];

// this runs whenever a client establishes a WS connection with the server
io.on("connection", (client) => {
  // console.log(`${client.id} a user connected`);
  clients.push(client.id);

  // this runs whenever the client sends something on the chat channel
  client.on("live", (email) => {
    // console.log(`${client.id} = User Live -->`, email);
    const index = clients.indexOf(client.id);
    if (index > -1) {
      clients.splice(index, 1);
    }
    client.id = email;
    const indexnew = clients.indexOf(client.id);
    if (indexnew === -1) {
      clients.push(client.id);
    }
    // console.log(client.id,  'new');
  });

  client.on("offline", (data) => {
    // console.log(`${client.id} = User Offline -->`, data)
    const index = clients.indexOf(client.id);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

  client.on("online_list", (data) => {
    io.emit("online_list", clients);
  });

  client.on("disconnect", function () {
    // console.log(`${client.id} a user disconnected`);
    const index = clients.indexOf(client.id);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

// https.listen(port, () => {
//   console.log(`Listening socket ... 🚀 ${port}`)
// });
// io.listen(port, () => {
//   console.log('Listening socket ... 🚀 ')
// })

app.listen(port, () => console.log(`Server running on port ${port}`));
