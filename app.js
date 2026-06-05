require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const createMailTransporter = async () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const secureEnv = (process.env.SMTP_SECURE || "").toLowerCase();
  const useSecure =
    secureEnv === "true" || secureEnv === "yes" || secureEnv === "1";
  const useStartTls = secureEnv === "starttls" || secureEnv === "tls";

  if (host && user && pass) {
    const transporterOptions = {
      host,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user, pass },
    };

    if (useStartTls) {
      transporterOptions.secure = false;
      transporterOptions.requireTLS = true;
    } else {
      transporterOptions.secure = useSecure;
    }

    return nodemailer.createTransport(transporterOptions);
  }

  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

app.get("/", (req, res) => {
  res.render("index", { title: "Hello World HomePage" });
});

app.get("/klee-one", (req, res) => {
  res.render("klee-one", { title: "Klee One フォント紹介" });
});

app.get("/memo", (req, res) => {
  res.render("memo", { title: "メモ帳" });
});

app.get("/memo-window", (req, res) => {
  res.render("memo-window", { title: "メモウィンドウ" });
});

app.get("/contact", (req, res) => {
  res.redirect("/");
});

app.use((req, res) => {
  res.status(404).render("index", {
    title: "404 - ページが見つかりません",
    message: "お探しのページは見つかりませんでした。",
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
