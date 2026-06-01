const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Hello World HomePage" });
});

app.get("/klee-one", (req, res) => {
  res.render("klee-one", { title: "Klee One フォント紹介" });
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
