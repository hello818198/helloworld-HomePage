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
  res.render("contact", {
    title: "お問い合わせ",
    message: null,
    error: null,
  });
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.render("contact", {
      title: "お問い合わせ",
      error: "すべての項目を入力してください。",
      message: null,
    });
  }

  try {
    const recipient =
      process.env.CONTACT_EMAIL || process.env.SMTP_USER || null;
    if (!recipient) {
      return res.render("contact", {
        title: "お問い合わせ",
        error:
          "受信先メールアドレスが設定されていません。.env に CONTACT_EMAIL を追加してください。",
        message: null,
      });
    }

    const transporter = await createMailTransporter();
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: recipient,
      subject: `お問い合わせ: ${name}`,
      text: `名前: ${name}\nメール: ${email}\n\n${message}`,
      html: `<p><strong>名前:</strong> ${name}</p><p><strong>メール:</strong> ${email}</p><p><strong>内容:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    const successMessage = `お問い合わせを送信しました。送信先: ${recipient}`;
    const previewUrl = nodemailer.getTestMessageUrl(info);
    const usingTestAccount =
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS;

    return res.render("contact", {
      title: "お問い合わせ",
      message: previewUrl
        ? `${successMessage} ${usingTestAccount ? "現在はSMTP未設定のためテストモードです。実際の受信には .env に SMTP 設定を追加してください。" : ""} プレビュー: ${previewUrl}`
        : successMessage,
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.render("contact", {
      title: "お問い合わせ",
      error: "送信中に問題が発生しました。時間をおいて再度お試しください。",
      message: null,
    });
  }
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
