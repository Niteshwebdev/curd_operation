require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const connectDB = require("./database/db");
const { Signupapi } = require("./Api/signupapi");
const { profilepicupload, addproductupload, updateproductupload } = require("./multer/multerUpload");
const { Addproductapi } = require("./Api/addproductapi");
const { Showproductapi } = require("./Api/showproductapi");
const { Updateproduct } = require("./Api/updateproduct");
const { Deleteproduct } = require("./Api/deleteproduct");
const { Loginapi } = require("./Api/loginapi");
// const { Session } = require("./Api/session");
// const { Logoutapi } = require("./Api/logoutapi");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(
  cors({
    origin: "https://curd-operation-wine.vercel.app", // Adjust this to your frontend's URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "frontend", "build")));
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

app.use('/images/product', express.static(path.join(__dirname, 'images/product')));

app.post("/signupapi", profilepicupload.single('profilePic'), Signupapi);
app.post("/addproductapi", addproductupload.single('pimage'), Addproductapi);
app.get("/showproductapi", Showproductapi);
app.post("/updateproduct", updateproductupload.single("pimage"), Updateproduct);
app.post("/deleteproduct", Deleteproduct);
app.post("/loginapi", Loginapi);
// app.post("/logoutapi", Logoutapi);
// app.post("/session", Session);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
